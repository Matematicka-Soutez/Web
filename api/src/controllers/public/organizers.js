'use strict'

const responseParsers = require('../responseParsers')
const OrganizerLoginService = require('../../services/organizer/Login')
const OrganizerSignUpService = require('../../services/organizer/SignUp')
const appErrors = require('../../../../core/errors/application')
const responseErrors = require('../../../../core/errors/response')

async function login(ctx) {
  try {
    ctx.body = await new OrganizerLoginService(ctx.state)
      .execute({
        email: ctx.request.body.username,
        password: ctx.request.body.password,
      })
  } catch (err) {
    if (err instanceof appErrors.NotConfirmedError) {
      throw new responseErrors.UnauthorizedError('Email address is not verified.')
    }
    if (err instanceof appErrors.UnauthorizedError || err instanceof appErrors.NotFoundError) {
      throw new responseErrors.UnauthorizedError('Invalid credentials.')
    }
    throw err
  }
}

async function signUp(ctx) {
  try {
    const organizer = await new OrganizerSignUpService(ctx.state)
      .execute({
        firstName: ctx.request.body.firstName,
        lastName: ctx.request.body.lastName,
        email: ctx.request.body.email,
        password: ctx.request.body.password,
        problemScanningToken: ctx.request.body.problemScanningToken,
      })
    ctx.status = 201
    ctx.body = responseParsers.parseOrganizer(organizer)
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
}
