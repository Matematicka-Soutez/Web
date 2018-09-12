const db = require('../../api/database')
const initUsers = require('./users')
const initEnums = require('./enums')
const initCommon = require('./common')
const initStatic = require('./static')

module.exports = init

async function init() {
  await db.sequelize.sync({ force: true })
  await initEnums()
  await initStatic()
  await initCommon()
  await initUsers()
  return true
}
