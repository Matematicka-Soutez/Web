const GetAllHobbiesSGetCurrentGridServiceervice = require('./services/GetCurrentGrid')
const appErrors = require('../../../server/utils/errors/application')
const responseErrors = require('../../../server/utils/errors/response')

module.exports = {
  getCurrentGrid,
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
