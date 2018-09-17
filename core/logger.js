/* eslint-disable no-console */
'use strict'

const cluster = require('cluster')
const bunyan = require('bunyan')
const config = require('../config')

const suffix = cluster.isMaster ? 'master' : 'worker'

const logger = bunyan.createLogger({
  name: `General.${suffix}`,
  streams: getStreamsByEnvironment(),
})

const serviceLogger = bunyan.createLogger({
  name: `Services.${suffix}`,
  streams: getStreamsByEnvironment(),
})

const workerLogger = bunyan.createLogger({
  name: `Workers.${suffix}`,
  streams: getStreamsByEnvironment(),
})

const errorLogger = bunyan.createLogger({
  name: `Errors.${suffix}`,
  streams: getStreamsByEnvironment(),
})

function CustomStream() {}
CustomStream.prototype.write = function write(rec) {
  if (rec.err && rec.err.stack) {
    // Unexpected errors
    console.error(`${rec.name} Logger:`)
    console.error(rec.err.stack)
  } else if (rec.msg) {
    // Service errors, logs
    console.log(`${rec.name} Logger: ${rec.msg}`)
  } else if (rec.error) {
    // Response errors
    console.log(`${rec.name} Logger: ${JSON.stringify(rec.error)}`)
  }
}

function getStreamsByEnvironment() {
  const streams = []
  if (config.logger.stdout) {
    streams.push({
      name: 'console',
      stream: new CustomStream(),
      type: 'raw',
      level: config.logger.minLevel,
    })
  }
  return streams
}

module.exports = {
  logger,
  serviceLogger,
  workerLogger,
  errorLogger,
}
