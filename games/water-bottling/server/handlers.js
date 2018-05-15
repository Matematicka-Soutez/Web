const appErrors = require('../../../server/utils/errors/application')
const responseErrors = require('../../../server/utils/errors/response')
const GetCurrentGridService = require('./services/GetCurrentGrid')
const GetTeamPositionService = require('./services/GetTeamPosition')
const MoveTeamService = require('./services/MoveTeam')
const RevertMoveService = require('./services/RevertMove')
const InitGameService = require('./services/InitGame')

module.exports = {
  getCurrentGrid,
  getTeamPosition,
  moveTeam,
  revertMove,
  initGame,
}

async function getCurrentGrid(ctx) {
  try {
    ctx.body = await new GetCurrentGridService().execute({})
  } catch (err) {
    if (err instanceof appErrors.NotFoundError) {
      throw new responseErrors.UnauthorizedError('Invalid credentials.')
    }
    throw err
  }
}

async function getTeamPosition(ctx) {
  try {
    ctx.body = await new GetTeamPositionService().execute({
      teamId: parseInt(ctx.params.teamId, 10),
    })
  } catch (err) {
    if (err instanceof appErrors.NotFoundError) {
      throw new responseErrors.UnauthorizedError('Invalid credentials.')
    }
    throw err
  }
}

async function moveTeam(ctx) {
  try {
    const teamId = parseInt(ctx.request.body.teamId, 10)
    await new MoveTeamService().execute({
      teamId,
      directionId: parseInt(ctx.request.body.directionId, 10),
      organizerId: ctx.state.organizer.id,
    })
    ctx.body = await new GetTeamPositionService().execute({
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

async function revertMove(ctx) {
  try {
    const teamId = parseInt(ctx.request.body.teamId, 10)
    await new RevertMoveService().execute({
      teamId,
      organizerId: ctx.state.organizer.id,
    })
    ctx.body = await new GetTeamPositionService().execute({
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
    ctx.body = await new InitGameService().execute({
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
