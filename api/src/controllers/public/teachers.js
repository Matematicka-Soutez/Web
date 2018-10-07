'use strict'

const responseParsers = require('../responseParsers')
const LoginService = require('../../services/teacher/Login')
const SignUpService = require('../../services/teacher/SignUp')
const ConfirmEmailService = require('../../services/teacher/ConfirmEmail')
const ResetPasswordService = require('../../services/teacher/ResetPassword')
const UpdatePasswordService = require('../../services/teacher/UpdatePassword')
const appErrors = require('../../../../core/errors/application')
const responseErrors = require('../../../../core/errors/response')

async function updatePassword(ctx) {
  try {
    ctx.body = await new UpdatePasswordService(ctx.state)
      .execute({
        token: ctx.request.body.token,
        password: ctx.request.body.password,
      })
  } catch (err) {
    if (err instanceof appErrors.InvalidTokenError) {
      throw new responseErrors.ForbiddenError('Token is no longer valid.')
    }
    if (err instanceof appErrors.PasswordWrongFormat) {
      throw new responseErrors.WrongPasswordFormat()
    }
    if (err instanceof appErrors.NotConfirmedError) {
      throw new responseErrors.UnauthorizedError('Email address is not verified.')
    }
    throw err
  }
}

async function resetPassword(ctx) {
  try {
    ctx.body = await new ResetPasswordService(ctx.state)
      .execute({
        email: ctx.request.body.email,
        duplicateResetPasswordToken: ctx.request.body.duplicateResetPasswordToken,
      })
  } catch (err) {
    if (err instanceof appErrors.NotFoundError) {
      throw new responseErrors.NotFoundError('Email address is not associated to any user account.')
    }
    if (err instanceof appErrors.NotConfirmedError) {
      throw new responseErrors.UnauthorizedError('Email address is not verified.')
    }
    if (err instanceof appErrors.InvalidTokenError) {
      throw new responseErrors.ForbiddenError('This action is invalid.')
    }
    throw err
  }
}

async function confirmEmail(ctx) {
  try {
    ctx.body = await new ConfirmEmailService(ctx.state)
      .execute({
        confirmToken: ctx.request.body.token,
      })
  } catch (err) {
    if (err instanceof appErrors.InvalidTokenError) {
      throw new responseErrors.ForbiddenError('Your account confirmation link is expired.')
    }
    throw err
  }
}

async function login(ctx) {
  try {
    ctx.body = await new LoginService(ctx.state)
      .execute({
        email: ctx.request.body.username,
        password: ctx.request.body.password,
      })
  } catch (err) {
    if (err instanceof appErrors.NotConfirmedError) {
      throw new responseErrors.UnauthorizedError('Email address is not verified.')
    }
    if (err instanceof appErrors.UnauthorizedError || err instanceof appErrors.ValidationError) {
      throw new responseErrors.UnauthorizedError('Invalid credentials.')
    }
    throw err
  }
}

async function signUp(ctx) {
  try {
    const teacher = await new SignUpService(ctx.state)
      .execute({
        title: ctx.request.body.title,
        firstName: ctx.request.body.firstName,
        lastName: ctx.request.body.lastName,
        email: ctx.request.body.email,
        phone: ctx.request.body.phone,
        password: ctx.request.body.password,
      })
    ctx.status = 201
    ctx.body = responseParsers.parseTeacher(teacher)
  } catch (err) {
    if (err instanceof appErrors.PasswordWrongFormat) {
      throw new responseErrors.WrongPasswordFormat()
    }
    if (err instanceof appErrors.UserPotentiallyExistsError) {
      throw new responseErrors.ConflictError({
        duplicate: true,
        emailExists: err.emailExists,
        duplicateResetPasswordToken: err.duplicateResetPasswordToken,
      })
    }
    throw err
  }
}

module.exports = {
  login,
  signUp,
  confirmEmail,
  resetPassword,
  updatePassword,
}
