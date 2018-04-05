const fs = require('fs')
const path = require('path')
const pg = require('pg')
require('pg-parse-float')(pg)
const Sequelize = require('sequelize')
const config = require('../../config/index')

pg.defaults.parseInt8 = true

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
