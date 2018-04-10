/* eslint-disable no-console */
const config = require('../config')
const db = require('./../server/database')
const initData = require('./../tests/data/init')

async function syncDb() {
  try {
    const force = config.env === 'local' || config.env === 'test'
    if (config.env === 'production' || config.env === 'staging') {
      throw new Error('!!! dbsync can\'t be run in production or staging !!!')
    }
    await db.sequelize.sync({ force })
    if (force === true) {
      await initData()
    }
    console.log('DB is synced.')
  } catch (err) {
    console.error(err)
    throw new Error('Dbsync failed')
  }
}

return syncDb()

