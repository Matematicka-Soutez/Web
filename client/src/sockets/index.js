import openSocket from 'socket.io-client'

const socket = openSocket(process.env.REACT_APP_SERVER_ADDRESS)

function subscribeToDisplayChange(cb) {
  socket.on('displayChange', displayChangeData => cb(null, displayChangeData))
  socket.emit('subscribeToDisplayChange', 1000)
}

export { subscribeToDisplayChange }
