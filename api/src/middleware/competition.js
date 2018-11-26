'use strict'

const competitionRepository = require('../repositories/competition')

/**
 * Competition middleware
 *
 * Most of the application relies on knowledge of current competition.
 * This makes current competition available to all services.
 */

async function setCurrentCompetition(ctx, next) {
  ctx.state.competition = await competitionRepository.findCurrentCompetition()
  return next()
}

module.exports = setCurrentCompetition
