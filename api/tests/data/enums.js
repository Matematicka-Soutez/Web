'use strict'

const db = require('../../src/database')
const enums = require('../../../core/enums')

module.exports = initEnums

async function initEnums() {
  await db.Permission.bulkCreate([{
    id: 1,
    organizerCreate: true,
    gamePlay: true,
    competitionCreate: true,
  }, {
    id: 2,
    gamePlay: true,
  }])
  await db.Role.bulkCreate([
    { permissionId: 1, ...enums.ROLES.ADMIN },
    { permissionId: 2, ...enums.ROLES.DRAFTSMAN },
  ])
  await db.Country.bulkCreate([
    enums.COUNTRIES.CZECH_REPUBLIC,
    enums.COUNTRIES.SLOVAKIA,
  ])
}
