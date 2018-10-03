'use strict'

module.exports = {
  hostname: 'http://localhost:3000',
  database: {
    options: {
      dialectOptions: {
        ssl: false,
      },
      logging: true,
    },
  },
}
