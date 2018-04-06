const fs = require('fs')
const path = require('path')
const util = require('util')
const Sequelize = require('sequelize')
const config = require('../../config/index')
const { pgSetTypeParsers } = require('pg-safe-numbers')

// Setup parsers for unsafe numbers.
pgSetTypeParsers({

  // Handle unsafe integers, ie. >= Math.pow(2, 53)
  unsafeInt(parsed, text) {
    console.error(`Unsafe int ${util.inspect(text)}) parse to ${util.inspect(parsed)}.\n${new Error().stack}`)
    return parsed
  },

  // Handle unsafe floats.
  unsafeFloat(parsed, text) {
    console.error(`Unsafe float ${util.inspect(text)}) parse to ${util.inspect(parsed)}.\n${new Error().stack}`)
    return parsed
  },

})

const sequelize = new Sequelize(config.database.connectionString, config.database.options)

// Import all models
const db = {}
fs
  .readdirSync(path.join(`${__dirname}/models`))
  .filter(file => file.indexOf('.') !== 0)
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, '/models', file))
    db[model.name] = model
  })
fs
  .readdirSync(path.join(`${__dirname}/../../../games/mining/server/database/models`))
  .filter(file => file.indexOf('.') !== 0)
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, '../../../games/mining/server/database/models', file))
    db[model.name] = model
  })

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
