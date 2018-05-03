const appErrors = require('../../../server/utils/errors/application')
const responseErrors = require('../../../server/utils/errors/response')
const GetCurrentGridService = require('./services/GetCurrentGrid')
const GetTeamPositionService = require('./services/GetTeamPosition')
const MoveTeamService = require('./services/MoveTeam')

module.exports = {
  getCurrentGrid,
  getTeamPosition,
  moveTeam,
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
      teamId: parseInt(ctx.request.query.teamId, 10),
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
    ctx.body = await new MoveTeamService().execute({
      teamId: parseInt(ctx.request.body.teamId, 10),
      directionId: parseInt(ctx.request.body.directionId, 10),
      organizerId: ctx.state.organizer.id,
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
