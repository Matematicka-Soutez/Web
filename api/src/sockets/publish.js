'use strict'

const ioEmitter = require('socket.io-emitter')
const redis = require('redis')
const config = require('../../../config')
const authorizeToken = require('../utils/authorize')
const events = require('./events')
const { parseRedisConnectionString } = require('./utils')

const redisConfig = parseRedisConnectionString(config.redis.connectionString)
const redisClient = redis.createClient({
  port: redisConfig.port,
  host: redisConfig.host,
  auth_pass: redisConfig.password, // eslint-disable-line camelcase
})
const Emitter = ioEmitter(redisClient)

const getDisplayRoom = () => 'display'
const getResultsRoom = () => 'results'
const getOrganizerRoomId = organizerId => `org${organizerId}`
const getTeamRoomId = teamId => `team${teamId}`

const publishToClient = (client, type, message) => {
  if (!client || !type) {
    throw new Error('client and type is required when publishing new message')
  }
  client.emit(type, message)
}


let socketServer = null

const initPublish = server => {
  socketServer = server
  socketServer.on('connection', client => {
    client.on('authentication', data => {
      authorizeToken(data.accessToken, null, (err, tokenData) => {
        if (err || !tokenData || (tokenData && (!tokenData.organizer || !tokenData.organizer.id))) {
          return publishToClient(
            client,
            events.SOCKET_NOTIFICATION_MESSAGE_TYPE.AUTHENTICATED_ERROR.type,
            err,
          )
        }
        publishToClient(client, events.SOCKET_NOTIFICATION_MESSAGE_TYPE.AUTHENTICATED.type)
        const roomId = getOrganizerRoomId(tokenData.organizer.id)
        return client.join(roomId)
      })
    })
    client.on('subscribeToDisplayChange', () => {
      publishToClient(client, 'displayChange')
      const roomId = getDisplayRoom()
      return client.join(roomId)
    })
    client.on('subscribeToResultsChange', () => {
      publishToClient(client, 'resultsChange')
      const roomId = getResultsRoom()
      return client.join(roomId)
    })
  })
}

const publishToTeam = (teamId, type, message) => {
  if (!teamId || !type) {
    throw new Error('teamId and type is required when publishing team change')
  }
  return socketServer.to(getTeamRoomId(teamId))
    .emit(type, message)
}

const publishDisplayChange = displayChange => {
  if (!displayChange) {
    throw new Error('displayChange is required when publishing display change')
  }
  return socketServer.to(getDisplayRoom())
    .emit('displayChange', displayChange)
}

const publishDisplayChangeFromWorker = displayChange => {
  if (!displayChange) {
    throw new Error('displayChange is required when publishing display change')
  }
  return Emitter.to(getDisplayRoom())
    .emit('displayChange', displayChange)
}

const publishResultsChange = results => {
  if (!results) {
    throw new Error('results are required when publishing results change')
  }
  return socketServer.to(getResultsRoom())
    .emit('resultsChange', results)
}

const publishResultsChangeFromWorker = results => {
  if (!results) {
    throw new Error('results are required when publishing results change')
  }
  return Emitter.to(getResultsRoom())
    .emit('resultsChange', results)
}

module.exports = {
  publishToTeam,
  initPublish,
  publishDisplayChange,
  publishDisplayChangeFromWorker,
  publishResultsChange,
  publishResultsChangeFromWorker,
}
