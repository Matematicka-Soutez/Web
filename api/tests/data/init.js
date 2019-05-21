'use strict'

const db = require('../../src/database')
const initUsers = require('./users')
const initEnums = require('./enums')
const initCommon = require('./common')
const initStatic = require('./static')

async function init() {
  await db.sequelize.sync({ force: true })
  return {
    enums: await initEnums(),
    static: await initStatic(),
    common: await initCommon(),
    ...await initUsers(),
  }
}

module.exports = init
