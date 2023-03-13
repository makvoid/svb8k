const algoliasearch = require('algoliasearch')
const bodyParser = require('body-parser')
const compression = require('compression')
const cors = require('cors')
const express = require('express')
const mongoSanitize = require('express-mongo-sanitize')
const morgan = require('morgan')
const helmet = require('helmet')
const { MongoClient } = require('mongodb')

const algoliaClient = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY)
const index = algoliaClient.initIndex('public')

// Setup Express App and middlewares
const app = express()
app.use(bodyParser.json({ limit: '1mb' }))
app.use(compression())
app.use(cors())
app.use(helmet())
app.use(mongoSanitize({ replaceWith: '_' }))
app.use(morgan(':date[iso] :req[x-forwarded-for] :method :url :status [:response-time ms] [:res[content-length] bytes]'))

const mongoClient = new MongoClient(process.env.MONGO_URI)
const db = mongoClient.db(process.env.MONGO_DB)
const ingressCollection = db.collection('ingress')

// Get all records yet to be processed
app.get('/ingress', async (_req, res, _next) => {
  const cursor = ingressCollection.find({ processed: { $ne: true } })
  return res.json(await cursor.toArray())
})

// Get a singular record by it's objectID (for debugging)
app.get('/ingress/:objectID', async (req, res, _next) => {
  return res.json(await ingressCollection.findOne({ objectID: req.params.objectID }))
})

// Mark a report as processed and sync the record into the Algolia Index
app.post('/ingress/:objectID/processed', async (req, res, _next) => {
  // Update the local record with the changes
  const result = await ingressCollection.updateOne({ objectID: req.params.objectID }, {
    $set: {
      affected: req.body.affected,
      description: req.body.description,
      processed: true
    }
  })

  // Create the Algolia record
  const record = await ingressCollection.findOne({ objectID: req.params.objectID })
  const indexResult = await index.saveObject({
    objectID: req.params.objectID,
    title: record.title,
    accessionNumber: record.accessionNumber,
    filingReportUrl: record.filingReportUrl,
    reportUrl: record.reportUrl,
    description: req.body.description,
    affected: req.body.affected,
    updated: record.updated
  })

  return res.json({ algolia: indexResult, mongo: result })
})

// Delete a report (not applicable)
app.delete('/ingress/:objectID', async (req, res, _next) => {
  return res.json(await ingressCollection.deleteOne({ objectID: req.params.objectID }))
})

// Listener
app.listen(3000, async () => {
  console.log('Server running on port 3000')

  // Connect to the DB
  await mongoClient.connect()
    .then(() => console.log('Connected to DB!'))
    .catch(err => console.error(err))
})
