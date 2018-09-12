const config = require('../../config/index')
const DivideIntoRoomsService = require('../src/services/team/DivideIntoRooms')
const db = require('../src/database/index')

async function divideTeams() {
  try {
    if (config.env === 'production' || config.env === 'staging') {
      throw new Error('!!! dbsync can\'t be run in production or staging !!!')
    }
    await new DivideIntoRoomsService().execute({})
    await db.sequelize.close()
    console.log('Teams divided.')
  } catch (err) {
    console.error(err)
    throw new Error('Team shuffling failed')
  }
  return true
}

divideTeams()