const { map, each } = require('async')
const Bottleneck = require('bottleneck')
const fetch = require('node-fetch')
const fs = require('fs')
const { parse } = require('node-html-parser')
const { XMLParser } = require('fast-xml-parser')
const { MongoClient } = require('mongodb')

const URL_8K = 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&CIK=&type=8-K&company=&dateb=&owner=include&count=40&output=atom'

// Earliest date we want to parse 8Ks for
const CUTOFF_DATE = new Date('2023-03-08T17:00:00Z')

// Setup Mongo
const client = new MongoClient(process.env.MONGO_URI)

// Setup the XML parser
const parser = new XMLParser()

// Setup the rate limiter
const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 250
})

// Default headers and other options to pass with every request
const DEFAULT_OPTIONS = {
  headers: {
    // Modify with your information as per the terms of service
    'User-Agent': 'Project Description - Project URL <contact-email>@<company-domain>.com'
  }
}

const LAST_RUN_PATH = path.resolve(__dirname, '../last_run.json')

const shouldLoadPage = (lastRun, parsed8Ks) => {
  const lastReport = parsed8Ks[parsed8Ks.length - 1]
  let loadNextPage = true

  // Check if have already processed these reports
  if (lastRun && new Date(lastRun.updated) > new Date(lastReport.updated)) {
    loadNextPage = false
  }

  // Check if we have passed our cutoff date
  if (new Date(CUTOFF_DATE) > new Date(lastReport.updated)) {
    console.log('Encountered the cutoff date - the script will no longer load pages.')
    loadNextPage = false
  }

  return loadNextPage
}

const getReports = async (lastRun, start = 0, reports = []) => {
  console.log('getReports-start:', start)
  // The API won't return results over this count
  if (start === 760) {
    return reports
  }
  const response = await limiter.schedule(() => fetch(`${URL_8K}&start=${start}`, DEFAULT_OPTIONS))
  const body = await response.text()
  const parsed8Ks = parser.parse(body).feed.entry
  reports = reports.concat(parsed8Ks)

  // Recursively load our reports if needed
  if (shouldLoadPage(lastRun, parsed8Ks)) {
    return getReports(lastRun, start + 40, reports)
  }
  return reports
}

const setupAttributes = (report) => {
  // Parse the accession number and generate the report URL
  report.accessionNumber = report.id.split(':')[3].split('=')[1]
  report.shortId = parseInt(report.title.match(/\d{10}/)[0], 10)
  report.filingReportUrl = `https://www.sec.gov/Archives/edgar/data/${report.shortId}/${report.accessionNumber.replace(/-/g, '')}/${report.accessionNumber}-index.htm`
  report.objectID = report.accessionNumber

  // Parse out the report type and company name
  const titleParse = report.title.match(/(8-K|8-K\/A)( - )(.+) \(\d{10}\)/)
  report.company = titleParse[3]
  report.type = titleParse[1]

  return report
}

const main = async () => {
  console.log('Connecting to DB')
  await client.connect()

  // Load the last run results if possible
  let lastRun
  if (fs.existsSync(LAST_RUN_PATH)) {
    lastRun = JSON.parse(fs.readFileSync(LAST_RUN_PATH, 'utf-8'))
  }

  // Load and parse the recent results
  console.log('Loading reports')
  let reports = await getReports(lastRun)

  // Save the first report as our latest progress for next time
  fs.writeFileSync(LAST_RUN_PATH, JSON.stringify({ updated: reports[0].updated }))

  // For each new report, parse the filing detail page to get the 8-K report URL
  console.log('Getting 8-K report URLs')
  await each(reports, async (report) => {
    report = setupAttributes(report)

    // Grab the report page's raw text and parse into HTML
    const response = await limiter.schedule(() => fetch(report.filingReportUrl, DEFAULT_OPTIONS))
    const body = await response.text()
    const html = parse(body)

    // Get just the rows of the table containing the report
    const rows = html.querySelector('table[summary="Document Format Files"]').childNodes
      .filter(node => node.rawTagName === 'tr')

    // Grab the report name for the 8-K
    rows.forEach(row => {
      const nodes = row.childNodes.filter(node => node.rawTagName === 'td')
      if (!nodes.length) return
      if (['8-K', '8-K/A'].includes(nodes[3].rawText)) {
        const link = nodes[2].childNodes.find(node => node.rawTagName === 'a')
        report.reportFileName = link.rawText
        report.reportUrl = `https://www.sec.gov/Archives/edgar/data/${report.shortId}/${report.accessionNumber.replace(/-/g, '')}/${report.reportFileName}`
      }
    })
  })

  // Remove any 8-Ks which don't mention SVB
  console.log('Removing 8-Ks which don\'t mention SVB')
  reports = await map(reports, async (report) => {
    // Grab the report's raw text
    let response
    try {
      response = await limiter.schedule(() => fetch(report.reportUrl, DEFAULT_OPTIONS))
    } catch (e) {
      console.error('reportUrl:', report.reportUrl, 'encountered an error:')
      console.error(e)
      return
    }
    const body = await response.text()

    // Check for any terms of interest
    for (const term of ['Silicon Valley Bank', 'SVB', 'Signature Bank']) {
      if (body.includes(term)) {
        return report
      }
    }

    // Else, this report did not mention it and we'll filter it out below
    return null
  })

  // Remove any null values (8-Ks that did not mention SVB)
  reports = reports.filter(v => !!v)

  const db = client.db(process.env.MONGO_DB)
  const collection = db.collection('ingress')

  // For each record, perform an upsert for the record so we don't duplicate records that have been already processed
  console.log('Syncing records to DB')
  await each(reports, async (report) => {
    try {
      await collection.updateOne({ objectID: report.objectID }, { $set: report }, { upsert: true })
    } catch (e) {
      console.error(e)
    }
  })

  // Close the DB connection now that we have finished
  await client.close()

  console.log('All done!')
}
main()
