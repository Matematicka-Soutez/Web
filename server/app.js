const cluster = require('cluster')
const path = require('path')
const http = require('http')
const Koa = require('koa')
const koaBody = require('koa-body')
const koaCompress = require('koa-compress')
const koaStatic = require('koa-static')
const config = require('../config')
const log = require('./utils/logger').logger
const routes = require('./routes')
const db = require('./database')
const { socketInit } = require('./sockets/socketServer')
const { initPublish } = require('./sockets/publish')

const app = new Koa()
app.server = http.createServer(app.callback())

// Setup middleware
app.use(koaCompress())
app.use(koaBody(config.server.bodyParser))

// Serve static files from the React app
app.use(koaStatic(path.join(__dirname, '../client/build')))

// Setup routes
app.use(routes)

// Start method
app.start = () => {
  app.socketApp = socketInit(app.server)
  initPublish(app.socketApp)

  log.info('Starting server ...')
  app.server.listen(config.server.port, () => {
    log.info(`==> 🌎  Server listening on port ${config.server.port}.`)
  })
}

// Stop method
app.stop = async () => {
  if (!app.server) {
    log.warn('Server not initialized yet.')
    return
  }

  log.info('Closing database connections.')
  await db.sequelize.close()

  await app.socketApp.close()

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
