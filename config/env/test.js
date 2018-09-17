/* eslint-disable no-process-env */
'use strict'

module.exports = {
  hostname: 'http://localhost:3000',
  logger: {
    stdout: true,
    minLevel: 'debug',
  },
  database: {
    options: {
      dialectOptions: {
        ssl: false,
      },
      logging: false,
    },
    connectionString: process.env.DATABASE_URL_TEST
      || 'postgres://postgres@localhost:5432/maso-test',
  },
}
