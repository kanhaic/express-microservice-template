import mongoose from 'mongoose'
import eventEmitter from '../utils/events'
import logger from '../utils/logger'

/*
 * Checking to see if all the environment variables are present
 * throw an error if environment variables are not present
 */

mongoose.Promise = global.Promise
let dbConnection = mongoose.connection
let mongoConn = ''
let mongoOpt = {}

if (process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'stage') {
  if (!process.env.MONGO_DATABASE) {
    throw new Error('MONGO_DATABASE Environment variable not set')
  }

  if ((process.env.MONGO_AUTHENTICATION) && (process.env.MONGO_AUTHENTICATION === 'Yes')) {
    if (!process.env.MONGO_USER) {
      throw new Error('MONGO_USER Environment variable not set')
    }

    if (!process.env.MONGO_PASS) {
      throw new Error('MONGO_PASS Environment variable not set')
    }
  }

  if (process.env.MONGO_REPLICASET) {
    if (!process.env.MONGO_REPLICASET_NAME) {
      throw new Error('MONGO_REPLICASET_NAME Environment variable not set')
    }
  }

  if ((process.env.MONGO_AUTHENTICATION) && (process.env.MONGO_AUTHENTICATION === 'Yes')) {
    mongoConn = 'mongodb://' + process.env.MONGO_USER + ':' + process.env.MONGO_PASS + '@' +
        process.env.MONGO_HOST + ':' + process.env.MONGO_PORT + '/' + process.env.MONGO_DATABASE + '?replicaSet=' + process.env.MONGO_REPLICASET_NAME
  } else {
    mongoConn = 'mongodb://' + process.env.MONGO_HOST + ':' + process.env.MONGO_PORT + '/' + process.env.MONGO_DATABASE
  }

  mongoOpt = {
    useNewUrlParser: true
  }
} else if (process.env.NODE_ENV === 'test') {
  mongoConn = 'mongodb://' + (process.env.MONGO_HOST || 'localhost') + ':' +
  (process.env.MONGO_PORT || parseFloat('27017')) + '/' +
  (process.env.MONGO_DATABASE || 'test')
  mongoOpt = {
    useNewUrlParser: true
  }
} else {
  mongoConn = 'mongodb://' + (process.env.MONGO_HOST || 'localhost') + ':' +
        (process.env.MONGO_PORT || parseFloat('27017')) + '/' +
        (process.env.MONGO_DATABASE || 'dev')
  mongoOpt = {
    useNewUrlParser: true
  }
}

eventEmitter.on('START_SERVER', () => {
  mongoose.connect(mongoConn, mongoOpt)
})

// If Error then show error message.
mongoose.connection.on('disconnected', () => { logger.info('Database Connection Closed.') })
mongoose.connection.on('reconnect', () => { logger.info('Database Connection Reconnected.') })
mongoose.connection.on('connected', () => {
  logger.info('Database Connected')
  eventEmitter.emit('DATABASE_CONNECTED')
})

eventEmitter.once('SERVER_STOPPING', () => {
  mongoose.connection.close()
})

export default dbConnection
