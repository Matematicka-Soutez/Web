const LoginService = require('./../../services/user/Login')
const SignUpService = require('./../../services/user/SignUp')
const ConfirmEmailService = require('./../../services/user/ConfirmEmail')
const ResetPasswordService = require('./../../services/user/ResetPassword')
const UpdatePasswordService = require('./../../services/user/UpdatePassword')
const AdminLoginService = require('./../../services/admin/Login')
const appErrors = require('./../../utils/errors/application')
const responseErrors = require('./../../utils/errors/response')
const responseParsers = require('../responseParsers')

module.exports = {
  login,
  adminLogin,
  signUp,
  confirmEmail,
  resetPassword,
  updatePassword,
}

async function adminLogin(ctx) {
  try {
    ctx.body = await new AdminLoginService()
      .execute({
        username: ctx.request.body.username,
        password: ctx.request.body.password,
      })
  } catch (err) {
    if (err instanceof appErrors.UnauthorizedError || err instanceof appErrors.NotFoundError) {
      throw new responseErrors.UnauthorizedError('Invalid credentials.')
    }
    throw err
  }
}

async function updatePassword(ctx) {
  try {
    ctx.body = await new UpdatePasswordService()
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
    ctx.body = await new ResetPasswordService()
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
    ctx.body = await new ConfirmEmailService()
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
    ctx.body = await new LoginService()
      .execute({
        username: ctx.request.body.username,
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
    const user = await new SignUpService()
      .execute({
        email: ctx.request.body.email,
        // firstName: ctx.request.body.firstName,
        // lastName: ctx.request.body.lastName,
        // dob: ctx.request.body.dob,
      })
    ctx.status = 201
    ctx.body = responseParsers.parseUser(user)
  } catch (err) {
    // if (err instanceof appErrors.PasswordWrongFormat) {
    //   throw new responseErrors.WrongPasswordFormat()
    // }
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
