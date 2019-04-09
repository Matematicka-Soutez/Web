'use strict'

const cluster = require('cluster')
const path = require('path')
const http = require('http')
const Koa = require('koa')
const koaBody = require('koa-body')
const koaCompress = require('koa-compress')
const koaCors = require('@koa/cors')
const config = require('../../config/index')
const log = require('../../core/logger').logger
const routes = require('./routes/index')
const db = require('./database/index')
// const { socketInit } = require('./sockets/socketServer')
// const { initPublish } = require('./sockets/publish')

const app = new Koa()
app.server = http.createServer(app.callback())

// Setup middleware
app.use(koaCors())
app.use(koaCompress())
app.use(koaBody(config.server.bodyParser))

// Setup routes
app.use(routes)

// Start method
app.start = async () => {
  //  app.socketApp = socketInit(app.server)
  //  initPublish(app.socketApp)

  log.info('Preparing database ...')
  await db.sequelize.sync()

  log.info('Starting server ...')
  await new Promise((resolve, reject) => {
    const listen = app.server.listen(config.server.port, err => err ? reject(err) : resolve(listen))
  })
  log.info(`==> 🌎  Server listening on port ${config.server.port}.`)
}

// Stop method
app.stop = async () => {
  if (!app.server) {
    log.warn('Server not initialized yet.')
    return
  }

  log.info('Closing database connections.')
  await db.sequelize.close()

  // await app.socketApp.close()

  log.info('Stopping server ...')
  await app.server.close()
  log.info('Server stopped.')

  process.exit(0) // eslint-disable-line no-process-exit
}

// Something can happen outside the error handling middleware, keep track of that
app.on('error', err => log.error(err, 'Unhandled application error.'))

// Something can go terribly wrong, keep track of that
process.once('uncaughtException', fatal)
process.once('unhandledRejection', fatal)

function fatal(err) {
  log.fatal(err, 'Fatal error occurred. Exiting the app.')

  // If the server does not terminate itself in a specific time, just kill it
  setTimeout(() => {
    throw err
  }, 5000).unref()
}

// If app was executed directly through node command or in a worker process
if (require.main === module || cluster.isWorker) {
  app.start()

  process.once('SIGINT', () => app.stop())
  process.once('SIGTERM', () => app.stop())
}

module.exports = app
