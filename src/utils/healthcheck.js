import dbConnection from '../database/db'
import healthCheckMiddlewareGenerator from '@coates/express-healthcheck-middleware'

const testDBFunction = function () {
  return new Promise((resolve, reject) => {
    if (dbConnection.readyState === 1) {
      resolve({ databaseConnection: true })
    } else {
      let error = new Error('Database is not connected')
      error.statusCode = 501
      error.status = 'warning'
      reject(error)
    }
  })
}

const healthCheckMiddleware = healthCheckMiddlewareGenerator({ testFunction: testDBFunction })
export default healthCheckMiddleware
