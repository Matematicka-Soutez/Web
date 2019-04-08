'use strict'

const fs = require('fs')

module.exports = {
  hostname: 'https://maso23.herokuapp.com',
  database: {
    options: {
      operatorsAliases: false,
      dialectOptions: {
        ssl: {
          key: fs.readFileSync('/root/.postgresql/postgresql.key'),
          cert: fs.readFileSync('/root/.postgresql/postgresql.crt'),
          ca: fs.readFileSync('/root/.postgresql/root.crt'),
        },
      },
      logging: true,
    },
    connectionString: process.env.DATABASE_URL
      || 'postgresql://maso-web@10.10.11.11/maso?sslmode=verify-full',
  },
}
