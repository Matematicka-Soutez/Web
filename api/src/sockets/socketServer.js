'use strict'

const io = require('socket.io')
const { createClient } = require('redis')
const adapter = require('socket.io-redis')
const config = require('../../../config')
const log = require('../../../core/logger').logger
const { initPublish } = require('./publish')
const { parseRedisConnectionString } = require('./utils')

const redisConfig = parseRedisConnectionString(config.redis.connectionString)

const socketInit = server => {
  log.info('Initializing socket connection...')
  const socketServer = io.listen(server)
  const pub = createClient(redisConfig.port, redisConfig.host, { auth_pass: redisConfig.password }) // eslint-disable-line camelcase, max-len
  const sub = createClient(redisConfig.port, redisConfig.host, { auth_pass: redisConfig.password }) // eslint-disable-line camelcase, max-len
  socketServer.adapter(adapter({ pubClient: pub, subClient: sub }))
  initPublish(socketServer)
  return socketServer
}

module.exports = { socketInit }
