'use strict'

require('dotenv').config()

const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const winston = require('winston')

const PropertiesReader = require('properties-reader')

const errorHandler = require('./src/utils/error-util')

const properties = PropertiesReader('./src/bin/common.properties')

// Import controllers which hold the CRUD methods for each model
const countriesRouter = require('./src/routes/countriesRouter')
const organizationsRouter = require('./src/routes/organizationsRouter')
const groupsRouter = require('./src/routes/groupsRouter')
const assignmentRouter = require('./src/routes/assignmentRouter')
const agreementRouter = require('./src/routes/agreementRouter')
const userRouter = require('./src/routes/userRouter')
const indexRouter = require('./src/routes/indexRouter')
const originRouter = require('./src/routes/originRouter')
const domainsRouter = require('./src/routes/domainRouter')
const invitationRouter = require('./src/routes/invitationRouter')
const meetingRouter = require('./src/routes/meetingRouter')
const notesRouter = require('./src/routes/noteRouter')
// Setting up loggers.
const root = properties.get('routes.api.index')
const version = properties.get('routes.api.version')

// - Write to all logs with level `info` and below to `combined.log`
// - Write all logs error (and below) to `error.log`.
// TODO: move this to its own source file.
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: {service: 'user-service'},
  transports: [
    new winston.transports.File({filename: 'error.log', level: 'error'}),
    new winston.transports.File({filename: 'combined.log'})
  ]
})

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (process.env.NODE_ENV !== 'development') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
}

// Setting up express app.
const app = express()

// Express middleware
app.use(bodyParser.json({limit: '10mb'}))
app.use(cors())
app.use(express.json({limit: '10mb'}))
app.use(express.urlencoded({extended: false, limit: '10mb'}))
// Expresse routes
app.use(root, indexRouter)
app.use(version, countriesRouter)
app.use(version, organizationsRouter)
app.use(version, groupsRouter)
app.use(version, assignmentRouter)
app.use(version, agreementRouter)
app.use(version, userRouter)
app.use(version, originRouter)
app.use(version, domainsRouter)
app.use(version, invitationRouter)
app.use(version, meetingRouter)
app.use(version, notesRouter)
// Express error Handling.
app.use(errorHandler)

// Tell node to listen for the App on port 3000:
// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express app listening on port 3000')
})
