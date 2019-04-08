'use strict'

const fs = require('fs')
const path = require('path')
const util = require('util')
const Sequelize = require('sequelize')
const { pgSetTypeParsers } = require('pg-safe-numbers')
const log = require('../../../core/logger').logger
const config = require('../../../config')

// Setup parsers for unsafe numbers.
pgSetTypeParsers({
  // Handle unsafe integers, ie. >= Math.pow(2, 53)
  unsafeInt(parsed, text) {
    log.error(`Unsafe int ${util.inspect(text)}) parse to ${util.inspect(parsed)}.\n${new Error().stack}`) // eslint-disable-line max-len
    return parsed
  },
  // Handle unsafe floats.
  unsafeFloat(parsed, text) {
    log.error(`Unsafe float ${util.inspect(text)}) parse to ${util.inspect(parsed)}.\n${new Error().stack}`) // eslint-disable-line max-len
    return parsed
  },
})

const sequelize = new Sequelize(config.database.connectionString, config.database.options)
const db = {}

function importModels(modelsPath) {
  fs.readdirSync(modelsPath) // eslint-disable-line no-sync, max-len
    .filter(file => file.indexOf('.') !== 0)
    .forEach(file => {
      const model = sequelize.import(path.join(modelsPath, file))
      db[model.name] = model
    })
}

// Import common models
importModels(`${__dirname}/models`)

// Load relations between models
Object.keys(db).forEach(modelName => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize
db.Op = Sequelize.Op

module.exports = db
