import eventEmitter from './utils/events'
import app from './server/server'
/* eslint-disable no-unused-vars */
import db from './database/db'
/* eslint-enable no-unused-vars */

eventEmitter.emit('START_SERVER')

module.exports = app
/*
 *
 *  TODO: Kafka
 *  TODO: JWT security
 *  TODO: Caching - Redis
 *
 */

/*
  * App Infrastructure
  * 1. mongodb
  * 2. consul
  * 3. Prometheous
  * 4. Kafka
  * 5. Redis
  *
  */
