/* eslint-disable max-classes-per-file */
'use strict'

const logger = require('../logger').errorLogger

class AppError extends Error {
  constructor(type, isOperational = false) {
    super()
    Error.captureStackTrace(this, this.constructor)
    this.name = this.constructor.name
    this.type = type
    this.isOperational = isOperational
    const stack = this.stack ? this.stack.split('\n') : this.stack
    logger.error({
      error: {
        name: this.name,
        isOperational,
        type,
        stack: stack && stack.length > 2 ? `${stack[0]}  ${stack[1]}` : stack,
      },
    })
  }
}

class ValidationError extends AppError {
  constructor(message, errors) {
    super('E_VALIDATION', true)
    this.message = message
    this.errors = errors
  }
}

class CannotBeDoneError extends AppError {
  constructor(message) {
    super('E_CANNOT_BE_DONE')
    this.message = message
  }
}

class AlreadyExistsError extends AppError {
  constructor() {
    super('E_EXISTS', true)
  }
}

class UserPotentiallyExistsError extends AppError {
  constructor(duplicateResetPasswordToken, emailExists) {
    super('E_POTENTIALLY_EXISTS')
    this.duplicateResetPasswordToken = duplicateResetPasswordToken
    this.emailExists = emailExists
  }
}

class InvalidTokenError extends AppError {
  constructor() {
    super('E_INVALID_TOKEN', true)
  }
}

class NotConfirmedError extends AppError {
  constructor() {
    super('E_NOT_CONFIRMED', true)
  }
}

class UnauthorizedError extends AppError {
  constructor() {
    super('E_UNAUTH', true)
  }
}

class TokenRevokedError extends AppError {
  constructor() {
    super('E_TOKEN_REVOKED', true)
  }
}

class TokenIdleTimoutError extends AppError {
  constructor() {
    super('E_TOKEN_IDLE_TIMEOUT', true)
  }
}

class NotFoundError extends AppError {
  constructor() {
    super('E_NOTFOUND', true)
  }
}

class PasswordDoesntMatchError extends AppError {
  constructor() {
    super('E_INVALID_PASSWORD', true)
  }
}

class PasswordWrongFormat extends AppError {
  constructor() {
    super('E_PASSWORD_FORMAT', true)
  }
}

class InvalidUserData extends AppError {
  constructor() {
    super('E_INVALID_USER_DATA', true)
  }
}

class InvalidAddress extends AppError {
  constructor(message) {
    super('E_INVALID_ADDRESS', true)
    if (message) {
      this.message = message
    } else {
      this.message = 'Invalid address.'
    }
  }
}

module.exports = {
  AppError,
  ValidationError,
  CannotBeDoneError,
  AlreadyExistsError,
  UserPotentiallyExistsError,
  InvalidTokenError,
  InvalidAddress,
  UnauthorizedError,
  TokenRevokedError,
  TokenIdleTimoutError,
  NotFoundError,
  NotConfirmedError,
  PasswordDoesntMatchError,
  PasswordWrongFormat,
  InvalidUserData,
}
