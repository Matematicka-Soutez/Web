const GetAllHobbiesService = require('./../../services/hobbies/GetAll')
const appErrors = require('./../../utils/errors/application')
const responseErrors = require('./../../utils/errors/response')

module.exports = {
  getAll,
}

async function getAll(ctx) {
  try {
    ctx.body = await new GetAllHobbiesService()
      .execute({
        limit: ctx.request.body.limit,
        prefix: ctx.request.body.prefix,
        typeId: ctx.request.body.typeId,
      })
  } catch (err) {
    if (err instanceof appErrors.UnauthorizedError || err instanceof appErrors.NotFoundError) {
      throw new responseErrors.UnauthorizedError('Invalid credentials.')
    }
    throw err
  }
}
