/* eslint-disable no-process-env */
'use strict'

const pkg = require('../package')

module.exports = env => ({
  env,
  appName: 'maso',
  version: pkg.version,
  server: {
    concurrency: process.env.WEB_CONCURRENCY || 1,
    port: process.env.PORT || 3001,
    isTravis: process.env.IS_TRAVIS || false,
    maxMemory: process.env.WEB_MEMORY || 512,
    killTimeout: 3000,
    bodyParser: {
      patchKoa: true,
      urlencoded: true,
      text: false,
      json: true,
      multipart: false,
      strict: false,
    },
    cors: {
      origin: '*',
      exposeHeaders: [
        'Authorization',
        'Content-Language',
        'Content-Length',
        'Content-Type',
        'Date',
        'ETag',
      ],
      maxAge: 3600,
    },
  },
  auth: {
    secret: process.env.AUTH_SECRET
      || 'wPlwdiDMLthMSQUcEgRQDSM2gBbW0chWv/gE8YVP1L6iWYaRKolm7UoXClFjPAQb',
    saltRounds: 10,
    resetPasswordTokenLength: 20,
    createOptions: {
      // expires in 5h - extended for competition workaround
      expiresIn: 5 * 60 * 60,
      algorithm: 'HS256',
      issuer: `cz.cuni.mff.maso.${env}`,
    },
    verifyOptions: {
      algorithm: 'HS256',
      issuer: `cz.cuni.mff.maso.${env}`,
    },
    jwt: {
      expiration: 5 * 60 * 60,
      idleTimeoutSec: 5 * 60 * 60,
    },
  },
  database: {
    options: {
      operatorsAliases: false,
      dialectOptions: {
        ssl: true,
      },
      logging: false,
    },
    connectionString: process.env.DATABASE_URL
      || 'postgres://postgres@database:5432/maso-local',
  },
  redis: {
    connectionString: process.env.REDISCLOUD_URL
      || 'redis://redis:6379',
  },
  logger: {
    stdout: true,
    minLevel: 'debug',
  },
  logentries: {
    minLevel: 3,
  },
  newRelic: {
    licenseKey: process.env.NEW_RELIC_LICENSE_KEY || false,
    log: process.env.NEW_RELIC_LOG || 'stdout',
  },
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY || false,
    fromAddress: 'info@maso.mff.cuni.cz',
  },
  aesop: {
    schoolSourceUrl: 'https://ovvp.mff.cuni.cz/out/skoly.csv',
  },
})
