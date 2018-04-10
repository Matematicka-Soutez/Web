import openSocket from 'socket.io-client'

const socket = openSocket('http://localhost:3000/') // openSocket('https://maso-staging.herokuapp.com/')

function subscribeToGridChange(cb) {
  socket.on('exchangeRateChange', exchangeRates => cb(null, exchangeRates))
  socket.emit('subscribeToExchangeRateChange', 1000)
}

export { subscribeToGridChange }
