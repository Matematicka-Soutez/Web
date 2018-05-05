const config = require('../config')
const ScoreTeamsService = require('../games/water-bottling/server/services/ScoreTeams')
const db = require('./../server/database')

async function scoreTeams() {
  try {
    if (config.env === 'production' || config.env === 'staging') {
      throw new Error('!!! dbsync can\'t be run in production or staging !!!')
    }
    await new ScoreTeamsService().execute({})
    await db.sequelize.close()
    console.log('Teams scored.')
  } catch (err) {
    console.error(err)
    throw new Error('Scoring failed')
  }
  return true
}

scoreTeams()
