'use strict'

const db = require('../../src/database')
const initUsers = require('./users')
const initEnums = require('./enums')
const initCommon = require('./common')
const initStatic = require('./static')

async function init() {
  await db.sequelize.sync({ force: true })
  await initEnums()
  await initStatic()
  await initCommon()
  return initUsers()
}

module.exports = init
