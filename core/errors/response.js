/* eslint-disable max-classes-per-file, max-len */
'use strict'

const logger = require('../logger').errorLogger

class ResponseError extends Error {
  constructor(message, type, status) {
    super()
    Error.captureStackTrace(this, this.constructor)
    this.name = this.constructor.name
    this.message = message
    this.type = type
    this.status = status
    logger.error({
      error: {
        name: this.name,
        message,
        type,
        status,
      },
    })
  }
}

/**
 * @apiDefine BadRequestError
 * @apiError BadRequest The input request data are invalid.
 * @apiErrorExample {json} BadRequest
 *    HTTP/1.1 400 BadRequest
 *    {
 *      "type": "BAD_REQUEST",
 *      "message": "Požadavek postrádá nebo obsahuje neplatná data."
 *    }
 */
class BadRequestError extends ResponseError {
  constructor(message) {
    super(message || 'Požadavek postrádá nebo obsahuje neplatná data.', 'BAD_REQUEST', 400)
  }
}

/**
 * @apiDefine UnauthorizedError
 * @apiError Unauthorized Server denied access to requested resource.
 * @apiErrorExample {json} Unauthorized
 *    HTTP/1.1 401 Unauthorized
 *    {
 *      "type": "UNAUTHORIZED",
 *      "message": "Site access denied."
 *    }
 */
class UnauthorizedError extends ResponseError {
  constructor(message) {
    super(message || 'Site access denied.', 'UNAUTHORIZED', 401)
  }
}

class IdleTimeoutError extends ResponseError {
  constructor(message) {
    super(message || 'Site access denied.', 'IDLE_TIMEOUT', 401)
  }
}

/**
 * @apiDefine ForbiddenError
 * @apiError Forbidden The server understood the request, but is refusing to fulfill it.
 * @apiErrorExample {json} Forbidden
 *    HTTP/1.1 403 Forbidden
 *    {
 *      "type": "FORBIDDEN",
 *      "message": "The server understood the request, but is refusing to fulfill it."
 *    }
 */
class ForbiddenError extends ResponseError {
  constructor(message) {
    super(message || 'The server understood the request, but is refusing to fulfill it.', 'FORBIDDEN', 403)
  }
}

/**
 * @apiDefine NotFoundError
 * @apiError NotFound Requested resource not found.
 * @apiErrorExample {json} NotFound
 *    HTTP/1.1 404 NotFound
 *    {
 *      "type": "NOT_FOUND",
 *      "message": "Resource not found."
 *    }
 */
class NotFoundError extends ResponseError {
  constructor(message) {
    super(message || 'Resource not found.', 'NOT_FOUND', 404)
  }
}

/**
 * @apiDefine ConflictError
 * @apiError Conflict The request could not be completed due to a conflict with the current state of the resource.
 * @apiErrorExample {json} Conflict
 *    HTTP/1.1 409 Conflict
 *    {
 *      "type": "CONFLICT",
 *      "message": "The request could not be completed due to a conflict with the current state of the resource."
 *    }
 */
class ConflictError extends ResponseError {
  constructor(message) {
    super(message || 'The request could not be completed due to a conflict with the current state of the resource.', 'CONFLICT', 409)
  }
}

/**
 * @apiDefine InternalServerError
 * @apiError (Error 5xx) InternalServerError Something went wrong.
 * @apiErrorExample {json} InternalServerError
 *    HTTP/1.1 500 InternalServerError
 *    {
 *      "type": "INTERNAL_SERVER",
 *      "message": "Něco se pokazilo. Zkuste to prosím později nebo nám napište email."
 *    }
 */
class InternalServerError extends ResponseError {
  constructor(message) {
    super(message || 'Něco se pokazilo. Zkuste to prosím později nebo nám napište email.', 'INTERNAL_SERVER', 500)
  }
}

/**
 * @apiDefine WrongPasswordFormat
 * @apiError (Error 4xx) WrongPasswordFormat Password have wrong format
 * @apiErrorExample {json} WrongPasswordFormat
 *    HTTP/1.1 400 WrongPasswordFormat
 *    {
 *      "type": "WRONG_PASSWORD_FORMAT",
 *      "message": "Password must include both lower and upper case characters, include at least one number or symbol and be at least 8 characters long."
 *    }
 */
class WrongPasswordFormat extends ResponseError {
  constructor(message) {
    super(message || 'Password must include both lower and upper case characters, include at least one number or symbol and be at least 8 characters long.', 'WRONG_PASSWORD_FORMAT', 400)
  }
}

module.exports = {
  ResponseError,
  BadRequestError,
  UnauthorizedError,
  IdleTimeoutError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
  WrongPasswordFormat,
}
