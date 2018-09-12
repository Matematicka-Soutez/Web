const io = require('socket.io')
const { createClient } = require('redis')
const adapter = require('socket.io-redis')
const config = require('../../../config')
const log = require('../../../core/logger').logger
const { initPublish } = require('./publish')

const parseRedisConnectionString = connectionString => {
  const colonSplitted = connectionString.split(':')
  const withoutPassword = colonSplitted.length === 3
  if (withoutPassword) {
    return {
      host: colonSplitted[1].slice(2),
      port: Number.parseInt(colonSplitted[3]),
    }
  }
  const passwordHostname = colonSplitted[2].split('@')
  return {
    host: passwordHostname[1],
    port: Number.parseInt(colonSplitted[3]),
    password: passwordHostname[0],
  }
}

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
