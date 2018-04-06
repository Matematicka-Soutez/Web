const db = require('../../src/database')
const initUsers = require('./users')
// const initAdmin = require('./admin')
const initEnums = require('./enums')

module.exports = init

async function init() {
  await db.sequelize.sync({ force: true })
  await initEnums()
  return {
    users: await initUsers(),
    admin: null,
  }
}
