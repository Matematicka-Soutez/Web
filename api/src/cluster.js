'use strict'

const cluster = require('cluster')
const config = require('../../config/index')
const log = require('../../core/logger').logger

/**
 * Starts the master process (it will be called only once).
 * @returns {void}
 */
function startMaster() {

  log.info('Cluster master process started.')

  // Log when worker starts
  cluster.on('fork', worker => log.info({ worker: worker.process.pid }, 'Worker is starting ...'))

  // Revive worker when it dies
  cluster.on('exit', (worker, code, signal) => {

    // Unexpected worker exit (kill signal will set exitedAfterDisconnect property to true)
    if (!worker.exitedAfterDisconnect) {
      log.error({ worker: worker.process.pid, code, signal }, 'Worker terminated. Reviving worker')
      return void cluster.fork()
    }

    // Expected worker exit
    log.info({ worker: worker.process.pid, code, signal }, 'Worker terminated.')
  })

  // Worker sends a message to master when it starts
  cluster.on('online', worker => {
    log.info({ worker: worker.process.pid }, 'Worker successfully forked.')
  })

  // Terminate gracefully all workers when we receive a terminating signal
  // Ctrl+C
  process.once('SIGINT', shutdown)
  // Kill [pid]
  process.once('SIGTERM', shutdown)

  // Start all workers
  for (let i = 0; i < config.server.concurrency; i++) {
    log.info(`Forking worker ${i}.`)
    cluster.fork()
  }
}

/**
 * Starts app worker process. This method will be called multiple times
 * according to WEB_CONCURRENCY setting.
 * @returns {void}
 */
function startWorker() {
  // eslint-disable-next-line global-require
  require('./app')
}

/**
 * Shutdowns the cluster.
 * @returns {void}
 */
function shutdown() {

  log.info('Cluster is shutting down.')

  // Kill the workers. As long as there are no active listeners left in the master process, it will
  // terminate itself
  Object.values(cluster.workers).forEach(worker => {
    log.info({ worker: worker.process.pid }, 'Killing worker.')
    worker.kill()
  })
}

// Start app
if (cluster.isMaster) {
  startMaster()
} else {
  startWorker()
}
