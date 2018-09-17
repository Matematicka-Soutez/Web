'use strict'

const db = require('../../src/database')

// Reset database into initial state
// see: http://cmme.org/tdumitrescu/blog/2014/02/node-sql-testing/
exports.resetDb = function resetDb() {
  return db.sequelize.sync({ force: true })
}
