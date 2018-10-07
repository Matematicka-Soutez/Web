'use strict'

const config = require('../../../config')
const appErrors = require('../../../core/errors/application')
const responseErrors = require('../../../core/errors/response')
const errorLogger = require('../../../core/logger').errorLogger

module.exports = {
  handleNotFound,
  handleErrors,
}

function handleNotFound() {
  throw new responseErrors.NotFoundError()
}

async function handleErrors(ctx, next) {
  try {
    return await next()
  } catch (err) {
    let responseError = err

    if (err instanceof appErrors.ValidationError) {
      // Handle ValidationErrors here, so we don't have to in every handler
      responseError = new responseErrors.BadRequestError(err.message)
    } else if (!(err instanceof responseErrors.ResponseError)) {
      // This should never happen, log appropriately
      errorLogger.error(err)
      responseError = new responseErrors.InternalServerError()
    }
    // Prepare error response
    ctx.status = responseError.status
    ctx.body = {
      type: responseError.type,
      message: responseError.message,
      stack: config.env === 'development' && responseError.stack ? responseError.stack : undefined, // eslint-disable-line no-undefined, max-len
    }
    return true
  }
}
