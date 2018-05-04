const jwt = require('jsonwebtoken')
const responseErrors = require('./../utils/errors/response')
const VerifyTokenPayloadService = require('./../services/VerifyTokenPayload')
const appErrors = require('./../utils/errors/application')

exports.authorizeToken = async (token, ctx) => {
  const jwtPayload = jwt.decode(token)
  if (!jwtPayload || !jwtPayload.exp || (Date.now() / 1000) >= jwtPayload.exp) {
    return null
  }
  try {
    const data = await new VerifyTokenPayloadService()
      .execute({
        token,
        teacherId: jwtPayload.teacherId ? jwtPayload.teacherId : undefined,
        organizerId: jwtPayload.organizerId ? jwtPayload.organizerId : undefined,
        tokenIssuedAt: jwtPayload.iat,
      })
    if (ctx.response && data.loginTimeout && data.loginIdleTimeout) {
      ctx.setHeader('Login-timeout', data.loginTimeout)
      ctx.setHeader('Login-idle-timeout', data.loginIdleTimeout)
    }
    return data
  } catch (err) {
    if (err instanceof appErrors.UnauthorizedError) {
      throw new responseErrors.UnauthorizedError()
    }
    if (err instanceof appErrors.TokenIdleTimoutError) {
      throw new responseErrors.IdleTimeoutError()
    }
    if (err instanceof appErrors.ValidationError) {
      throw new responseErrors.ConflictError({
        clientRefreshRequired: true,
        clientRefreshReasons: err.message,
      })
    }
    if (err instanceof appErrors.TokenRevokedError) {
      throw new responseErrors.IdleTimeoutError()
    }
  }
}
