const responseErrors = require('./../utils/errors/response')
const VerifyTokenPayloadService = require('./../services/VerifyTokenPayload')
const appErrors = require('./../utils/errors/application')
const jwt = require('jsonwebtoken')

exports.authorizeToken = async (token, ctx, next) => {
  const jwtPayload = jwt.decode(token)
  if (!jwtPayload || !jwtPayload.exp || (Date.now() / 1000) >= jwtPayload.exp) {
    return next()
  }
  try {
    const data = await new VerifyTokenPayloadService()
      .execute({
        token,
        userId: jwtPayload.userId ? jwtPayload.userId : undefined,
        adminId: jwtPayload.adminId ? jwtPayload.adminId : undefined,
        tokenIssuedAt: jwtPayload.iat,
      })
    if (ctx.response && data.loginTimeout && data.loginIdleTimeout) {
      ctx.setHeader('Login-timeout', data.loginTimeout)
      ctx.setHeader('Login-idle-timeout', data.loginIdleTimeout)
    }
    return next(null, data)
  } catch (err) {
    if (err instanceof appErrors.TokenIdleTimoutError) {
      throw new responseErrors.IdleTimeoutError()
    }
    if (err instanceof appErrors.InvalidDataError) {
      throw new responseErrors.ConflictError({
        clientRefreshRequired: true,
        clientRefreshReasons: err.message,
      })
    }
    if (err instanceof appErrors.TokenRevokedError) {
      throw new responseErrors.IdleTimeoutError()
    }
    return next()
  }
}
