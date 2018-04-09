const GetCurrentGridService = require('./services/GetCurrentGrid')
const GetAllRoomsService = require('./services/GetAllRooms')
const GetRoomService = require('./services/GetRoom')
const GetTeamService = require('./services/GetTeam')
const appErrors = require('../../../server/utils/errors/application')
const responseErrors = require('../../../server/utils/errors/response')

module.exports = {
  getCurrentGrid,
  getAllRooms,
  getRoom,
  getTeam,
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

async function getAllRooms(ctx) {
  try {
    ctx.body = await new GetAllRoomsService().execute({})
  } catch (err) {
    if (err instanceof appErrors.NotFoundError) {
      throw new responseErrors.UnauthorizedError('Invalid credentials.')
    }
    throw err
  }
}

async function getRoom(ctx) {
  try {
    ctx.body = await new GetRoomService().execute({
      roomId: parseInt(ctx.request.query.roomId, 10),
    })
  } catch (err) {
    if (err instanceof appErrors.NotFoundError) {
      throw new responseErrors.UnauthorizedError('Invalid credentials.')
    }
    throw err
  }
}

async function getTeam(ctx) {
  try {
    ctx.body = await new GetTeamService().execute({
      roomId: parseInt(ctx.request.query.teamId, 10),
    })
  } catch (err) {
    if (err instanceof appErrors.NotFoundError) {
      throw new responseErrors.UnauthorizedError('Invalid credentials.')
    }
    throw err
  }
}
