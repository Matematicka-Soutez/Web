const fs = require('fs')
const path = require('path')
const log = require('../core/logger').workerLogger
const competitionRepository = require('../api/src/repositories/competition')
const appErrors = require('../core/errors/application')


function initApplicationWide() {
  log.info('There are no application wide workers yet.')
  return true
}


async function initGameSpecific() {
  try {
    const competition = await competitionRepository.findCurrentCompetition()
    const gameWorkerPath = path.normalize(`${__dirname}/../games/${competition.game.folder}/worker/index.js`) // eslint-disable-line max-len
    if (fs.existsSync(gameWorkerPath)) { // eslint-disable-line no-sync
      const gameWorker = require(gameWorkerPath) // eslint-disable-line global-require

      gameWorker.init(competition)
      log.info('Game workers were initiated.')
    } else {
      log.info('Competition doesn\'t have specified any workers.')
    }
  } catch (err) {
    if (err instanceof appErrors.NotFoundError) {
      log.error('There is currently no upcomming competition to run workers for.')
    }
  }
}

async function init() {
  initApplicationWide()
  await initGameSpecific()
}

init()
