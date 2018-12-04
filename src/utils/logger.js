import winston from 'winston'
//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//

let consoleTransportError = {
  level: 'error',
  colorize: true,
  transports: [new winston.transports.Console()]
}

let consoleTransportInfo = {
  level: 'info',
  colorize: true,
  format: winston.format.simple(),
  transports: [new winston.transports.Console()]
}

let logger = winston.createLogger((process.env.NODE_ENV === undefined ? consoleTransportInfo : consoleTransportError))

export default logger
