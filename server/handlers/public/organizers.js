const OrganizerLoginService = require('./../../services/organizer/Login')
const appErrors = require('./../../utils/errors/application')
const responseErrors = require('./../../utils/errors/response')

async function login(ctx) {
  try {
    ctx.body = await new OrganizerLoginService()
      .execute({
        email: ctx.request.body.username,
        password: ctx.request.body.password,
      })
  } catch (err) {
    if (err instanceof appErrors.UnauthorizedError || err instanceof appErrors.NotFoundError) {
      throw new responseErrors.UnauthorizedError('Invalid credentials.')
    }
    throw err
  }
}

module.exports = {
  login,
}
