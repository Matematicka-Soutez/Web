'use strict'

const SOCKET_NOTIFICATION_MESSAGE_TYPE = {
  AUTHENTICATED: {
    type: 'authenticated',
    action: 'authentication',
    name: 'Authenticated',
  },
  AUTHENTICATED_ERROR: {
    type: 'authenticatedError',
    action: 'authentication',
    name: 'Authenticated error',
  },
  EXCHANGE_RATE_CHANGE: {
    type: 'exchangeRateChange',
    action: null,
    name: 'Exchange Rate Change',
  },
}

module.exports = SOCKET_NOTIFICATION_MESSAGE_TYPE
