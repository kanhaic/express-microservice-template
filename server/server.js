import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import logger from '../utils/logger'
import expressWinston from 'express-winston'
import eventEmitter from '../utils/events'
import healthCheckMiddleware from '../utils/healthcheck'
import promBundle from 'express-prom-bundle'
/* eslint-disable no-unused-vars */
import consul from '../utils/consul'
/* eslint-enable no-unused-vars */

// set env varibale to dev if no env variable is provided
process.env.NODE_ENV = (process.env.NODE_ENV || 'dev')
// Setup serverlication
let server = express()
let router = express.Router()

// Setup logging
// Place the express-winston logger before the router.
server.use(expressWinston.logger({
  winstonInstance: logger
}))

// Setup Metrics
const metricsMiddleware = promBundle({
  includeMethod: true,
  includePath: true,
  customLabels: {
    serviceName: process.env.npm_package_name
  },
  promClient: {
    collectDefaultMetrics: {
      prefix: process.env.npm_package_name + '_',
      timeout: 1000
    }
  }
})
server.use(metricsMiddleware)

// Healthcheck
server.use('/health', healthCheckMiddleware)

// Setup cors and body parser
server.use(cors())
server.use(bodyParser.urlencoded({ limit: '500mb', extended: true }))
server.use(bodyParser.text())
server.use(bodyParser.json({ limit: '500mb', type: 'serverlication/json' }))

// Routes
server.options('*', cors())
server.use(router)

// Place the express-winston errorLogger after the router.
server.use(expressWinston.errorLogger({
  winstonInstance: logger
}))

eventEmitter.once('DATABASE_CONNECTED', () => {
  let listener = server.listen(process.env.PORT || 3000, () => {
    eventEmitter.emit('SERVER_STARTED')
    logger.info('Jhaakas ' + process.env.npm_package_name + ' API has started on Port ' + listener.address().port)
  })
})

process.on('SIGINT', function () {
  logger.info('Closing database connection')
  eventEmitter.emit('SERVER_STOPPING')
  setTimeout(() => {
    process.exit(0)
  }, 1000)
})

export default server
