'use strict'

const competitionRepository = require('../repositories/competition')

/**
 * Competition middleware
 *
 * Most of the application relies on knowledge of current competition.
 * To ease up on the database and speed responses, we cache the current
 * competition and make it available to services directly from the process memory.
 *
 * We can do this, because switching between competitions isn't in any way
 * time sensitive and competitions can always be loaded from database when needed.
 *
 * I would love to hear if you see a problem with this.
 */

let CURRENT_COMPETITION = null

async function setCurrentCompetition(ctx, next) {
  if (!CURRENT_COMPETITION) {
    await updateCurrentCompetition()
  }
  ctx.state.competition = CURRENT_COMPETITION
  return next()
}

async function updateCurrentCompetition() {
  CURRENT_COMPETITION = await competitionRepository.findCurrentCompetition()
}

module.exports = {
  setCurrentCompetition,
  updateCurrentCompetition,
}
