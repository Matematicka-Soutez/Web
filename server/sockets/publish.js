const authorizeToken = require('../utils/authorize')
const events = require('./events')

const getDisplayRoom = () => 'display'
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
          return publishToClient(client, events.SOCKET_NOTIFICATION_MESSAGE_TYPE.AUTHENTICATED_ERROR.type, err)
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

module.exports = {
  publishToTeam,
  initPublish,
  publishDisplayChange,
}
