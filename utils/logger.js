const path = require('path')
const config = require('../config')
const winston = require('winston')
winston.transports.DailyRotateFile = require('winston-daily-rotate-file')

const logFolder = path.join(__dirname, `../${config.logger.logFolder}`)
const fileRotator = new (winston.transports.DailyRotateFile)({
  filename: config.logger.logFileExtension,
  dirname: logFolder,
  datePattern: config.logger.datePattern,
  prepend: true,
  level: config.logger.logLevel,
  zippedArchive: true,
  maxDays: config.logger.maxDays
})

const logger = new (winston.Logger)({
  transports: [
    fileRotator,
    // new (winston.transports.File)({ level: config.logger.logLevel, filename: path.join(logFolder, config.logger.fileName) }),
    new winston.transports.Console({ level: config.logger.logLevel, colorize: true })
  ]
})

if (config.logger.logUnhandledExceptions) {
  logger.handleExceptions(new winston.transports.File({ filename: path.join(logFolder, config.logger.logUnhandledExceptionsFileName) }))
}

module.exports = logger
