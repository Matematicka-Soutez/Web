'use strict'

const appErrors = require('../../../../core/errors/application')
const responseErrors = require('../../../../core/errors/response')
const GetResultsService = require('./services/GetResults')
const GetTournamentResultsService = require('./services/GetTournamentResults')
const GetTeamStrategyService = require('./services/GetTeamStrategy')
const ChangeTeamStrategyService = require('./services/ChangeTeamStrategy')
const RevertChangeService = require('./services/RevertChange')
const InitGameService = require('./services/InitGame')

module.exports = {
  getResults,
  getTournamentResults,
  getTeamStrategy,
  changeTeamStrategy,
  revertChange,
  initGame,
}

async function getResults(ctx) {
  try {
    ctx.body = await new GetResultsService(ctx.state).execute({})
  } catch (err) {
    if (err instanceof appErrors.NotFoundError) {
      throw new responseErrors.UnauthorizedError('Invalid credentials.')
    }
    throw err
  }
}

async function getTournamentResults(ctx) {
  try {
    ctx.body = await new GetTournamentResultsService(ctx.state).execute({})
  } catch (err) {
    if (err instanceof appErrors.NotFoundError) {
      throw new responseErrors.UnauthorizedError('Invalid credentials.')
    }
    throw err
  }
}

async function getTeamStrategy(ctx) {
  try {
    ctx.body = await new GetTeamStrategyService(ctx.state).execute({
      teamId: parseInt(ctx.params.teamId, 10),
    })
  } catch (err) {
    if (err instanceof appErrors.NotFoundError) {
      throw new responseErrors.UnauthorizedError('Invalid credentials.')
    }
    throw err
  }
}

async function changeTeamStrategy(ctx) {
  try {
    const teamId = parseInt(ctx.request.body.teamId, 10)
    await new ChangeTeamStrategyService(ctx.state).execute({
      teamId,
      strategyId: parseInt(ctx.request.body.strategyId, 10),
      organizerId: ctx.state.organizer.id,
    })
    ctx.body = await new GetTeamStrategyService(ctx.state).execute({
      teamId,
    })
  } catch (err) {
    if (err instanceof appErrors.CannotBeDoneError) {
      throw new responseErrors.BadRequestError(err.message)
    }
    if (err instanceof appErrors.NotFoundError) {
      throw new responseErrors.UnauthorizedError('Invalid credentials.')
    }
    throw err
  }
}

async function revertChange(ctx) {
  try {
    const teamId = parseInt(ctx.request.body.teamId, 10)
    await new RevertChangeService(ctx.state).execute({
      teamId,
      organizerId: ctx.state.organizer.id,
    })
    ctx.body = await new GetTeamStrategyService(ctx.state).execute({
      teamId,
    })
  } catch (err) {
    if (err instanceof appErrors.CannotBeDoneError) {
      throw new responseErrors.BadRequestError(err.message)
    }
    if (err instanceof appErrors.NotFoundError) {
      throw new responseErrors.UnauthorizedError('Invalid credentials.')
    }
    throw err
  }
}

async function initGame(ctx) {
  try {
    ctx.body = await new InitGameService(ctx.state).execute({
      organizerId: ctx.state.organizer.id,
    })
  } catch (err) {
    if (err instanceof appErrors.ValidationError) {
      throw new responseErrors.BadRequestError(err.message)
    }
    if (err instanceof appErrors.NotFoundError) {
      throw new responseErrors.UnauthorizedError('Invalid credentials.')
    }
    throw err
  }
}
