const bodyParser = require('body-parser')
const compression = require('compression')
const cors = require('cors')
const express = require('express')
const fs = require('fs')
const mongoSanitize = require('express-mongo-sanitize')
const morgan = require('morgan')
const helmet = require('helmet')
const { MongoClient } = require('mongodb')
const path = require('path')

const validateEmail = require('./util/validate-email')

// Setup express app and middlewares
const app = express()
app.use(bodyParser.json({ limit: '1mb' }))
app.use(compression())
app.use(cors())
app.use(helmet())
app.use(mongoSanitize({ replaceWith: '_' }))
app.use(morgan(':date[iso] :req[x-forwarded-for] :method :url :status [:response-time ms] [:res[content-length] bytes]'))

// Allow access to Algolia's API
app.use((_req, res, next) => {
  res.setHeader("Content-Security-Policy", "script-src 'self' https://*.algolianet.com");
  next()
})

// Setup Mongo Client
const mongoClient = new MongoClient(process.env.MONGO_URI)
const db = mongoClient.db(process.env.MONGO_DB)

// Contact request submission
app.post('/api/contact', async (req, res, _next) => {
  // Ensure no keys are missing
  const missingKeys = []
  for (const key of ['name', 'email', 'message']) {
    if (!Object.keys(req.body).includes(key)) {
      missingKeys.push(key)
    }
  }
  if (missingKeys.length) {
    return res.json({
      success: false,
      message: `You are missing the following required field(s): ${missingKeys.join(', ')}`
    })
  }

  // Ensure they passed a valid value for each
  const errors = []
  if (req.body.name.length < 3) {
    errors.push('Your name must be at minimum 3 characters.')
  }
  if (!validateEmail(req.body.email)) {
    errors.push('You must use a valid email address.')
  }
  if (req.body.message.length < 20) {
    errors.push('Your message must be at minimum 20 characters.')
  }
  if (errors.length) {
    return res.json({
      success: false,
      message: errors.join(' ')
    })
  }

  // Finally, continue with the save logic
  let record
  try {
    record = await db.collection('contact').insertOne({
      name: req.body.name,
      email: req.body.email,
      message: req.body.message
    })
  } catch (e) {
    console.error(e)
    return res.json({
      success: false,
      message: e.toString()
    })
  }

  return res.json({
    success: true,
    message: 'Your message has been sent successfully. Thanks!',
    messageId: record.insertedId
  })
})

// Catch-all route for any invalid routes
app.use('/api/**', (_req, res, _next) => {
  res.status(400).json({ error: 'Unknown endpoint' })
})

// Serve the Angular frontend as needed
let uiPath = path.join(__dirname, "../angular");
if (!fs.existsSync(uiPath)) {
  console.error('Unable to locate UI distribution!')
}
app.use("/", express.static(uiPath));
app.use((_req, res, _next) => {
  res.sendFile(path.join(uiPath, "index.html"));
});

// Setup listener
app.listen(process.env.PORT, async () => {
  console.log('Server running on port', process.env.PORT)

  // Connect to the database
  await mongoClient.connect()
    .then(() => console.log('Connected to DB!'))
    .catch(err => {
      console.error(err)
      process.exit(1)
    })
})
