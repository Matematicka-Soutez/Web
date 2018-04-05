const responseErrors = require('./../utils/errors/response')
const { authorizeToken } = require('./../utils/authorize')
const log = require('../utils/logger').logger

module.exports = {
  authenticateUser,
  authenticateAdmin,
  parseAuthHeader,
}

function authenticateTokenJWT(ctx, next) {
  if (!ctx) {
    throw new Error('Context is missing in authenticateToken function!')
  }
  const parsedAuthHeader = parseAuthHeader(ctx.header('Authorization'))
  if (!parsedAuthHeader || !parsedAuthHeader.value
    || !parsedAuthHeader.scheme || parsedAuthHeader.scheme.toLowerCase() !== 'jwt') {
    return next()
  }
  return authorizeToken(parsedAuthHeader.value, ctx, next)
}

function authenticateUser(ctx, next) {
  authenticateTokenJWT(ctx, (err, data) => {
    if (err) {
      return next(err)
    } else if (!data || !data.user || !data.user.id) {
      throw new responseErrors.UnauthorizedError()
    }
    ctx.state.user = data.user
    return next()
  })
}

function authenticateAdmin(ctx, next) {
  authenticateTokenJWT(ctx, (err, data) => {
    if (err) {
      return next(err)
    } else if (!data || !data.admin || !data.admin.id || data.admin.disabled) {
      throw new responseErrors.UnauthorizedError()
    }
    log.info(`Admin id: ${data.admin.id}`)
    log.info(`Admin userName: ${data.admin.userName}`)
    ctx.state.admin = data.admin
    return next()
  })
}

function parseAuthHeader(hdrValue) {
  const re = /(\S+)\s+(\S+)/
  if (!hdrValue || typeof hdrValue !== 'string') {
    return null
  }
  const matches = hdrValue.match(re)
  return matches && { scheme: matches[1], value: matches[2] }
}
