const GetTimerService = require('../../services/competition/GetTimer')
const appErrors = require('../../../../core/errors/application')
const responseErrors = require('../../../../core/errors/response')

async function getTimer(ctx) {
  try {
    ctx.body = await new GetTimerService().execute({})
  } catch (err) {
    if (err instanceof appErrors.NotFoundError) {
      throw new responseErrors.BadRequestError('Competition not found.')
    }
    throw err
  }
}

module.exports = {
  getTimer,
}
