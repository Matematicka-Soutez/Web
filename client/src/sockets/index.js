import openSocket from 'socket.io-client'

// TODO: proper configuration
const socket = openSocket(process.env.REACT_APP_SERVER_ADDRESS) // eslint-disable-line no-process-env, max-len

function subscribeToDisplayChange(cb) {
  socket.on('displayChange', displayChangeData => cb(null, displayChangeData))
  socket.emit('subscribeToDisplayChange', 1000)
}

export { subscribeToDisplayChange }
