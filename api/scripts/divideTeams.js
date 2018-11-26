'use strict'

const config = require('../../config/index')
const DivideIntoRoomsService = require('../src/services/team/DivideIntoRooms')
const db = require('../src/database/index')

async function divideTeams() {
  if (config.env === 'production' || config.env === 'staging') {
    throw new Error('!!! dbsync can\'t be run in production or staging !!!')
  }
  try {
    await db.sequelize.sync()
    await new DivideIntoRoomsService({ competition: { id: 2 } }).execute({})
    await db.sequelize.close()
    console.log('Teams divided.') // eslint-disable-line no-console
  } catch (err) {
    console.error(err) // eslint-disable-line no-console
    throw new Error('Team shuffling failed')
  }
  return true
}

divideTeams()
