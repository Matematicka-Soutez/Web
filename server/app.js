const Koa = require('koa')
const koaBody = require('koa-body')
const koaCompress = require('koa-compress')
const koaStatic = require('koa-static2')
const cluster = require('cluster')
const path = require('path')
const config = require('../config')
const log = require('./utils/logger').logger
const routes = require('./routes')
const db = require('./database')

const app = new Koa()

// Setup middleware
app.use(koaCompress())
app.use(koaBody(config.server.bodyParser))

// Serve static files from the React app
app.use(koaStatic(path.join(__dirname, '../../client/build')))

// Setup routes
app.use(routes)

// Start method
app.start = () => {
  log.info('Starting server ...')
  app.server = app.listen(config.server.port, () => {
    log.info(`==> 🌎  Server listening on port ${config.server.port}.`)
  })
}

// Stop method
app.stop = () => {
  if (!app.server) {
    log.warn('Server not initialized yet.')
    return
  }

  log.info('Closing database connections.')
  db.sequelize.close()

  log.info('Stopping server ...')
  app.server.close(() => {
    log.info('Server stopped.')
  })
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
