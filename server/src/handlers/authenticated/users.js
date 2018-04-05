const UpdatePasswordAuthenticatedService = require('./../../services/user/UpdatePasswordAuthenticated')
// const UpdatePersonalInfoService = require('./../../services/user/UpdatePersonalInfo')
const ResendConfirmEmailService = require('./../../services/user/ResendConfirmEmail')
// const GetUsersPersonalInfo = require('./../../services/user/GetUsersPersonalInfo')
const appErrors = require('./../../utils/errors/application')
const responseErrors = require('./../../utils/errors/response')

module.exports = {
  // updatePersonalInfo,
  // getPersonalInfo,
  updatePasswordAuthenticated,
  resendConfirmEmail,
}

// async function updatePersonalInfo(ctx) {
//   try {
//     ctx.body = await new UpdatePersonalInfoService()
//       .execute({
//         userId: ctx.state.user.id,
//         firstName: ctx.request.body.firstName,
//         lastName: ctx.request.body.lastName,
//         dob: ctx.request.body.dob,
//         address: ctx.request.body.address,
//       })
//   } catch (err) {
//     if (err instanceof appErrors.NotFoundError) {
//       throw new responseErrors.NotFoundError()
//     }
//     if (err instanceof appErrors.InvalidDataError) {
//       throw new responseErrors.BadRequestError()
//     }
//     if (err instanceof appErrors.InvalidAddress) {
//       throw new responseErrors.BadRequestError(err.message)
//     }
//     throw err
//   }
// }

// async function getPersonalInfo(ctx) {
//   try {
//     ctx.body = await new GetUsersPersonalInfo()
//       .execute({
//         userId: ctx.state.user.id,
//       })
//   } catch (err) {
//     if (err instanceof appErrors.NotFoundError) {
//       throw new responseErrors.NotFoundError()
//     }
//     throw err
//   }
// }

async function updatePasswordAuthenticated(ctx) {
  try {
    ctx.body = await new UpdatePasswordAuthenticatedService()
      .execute({
        userId: ctx.state.user.id,
        oldPassword: ctx.request.body.oldPassword,
        newPassword: ctx.request.body.newPassword,
      })
  } catch (err) {
    if (err instanceof appErrors.NotFoundError) {
      throw new responseErrors.NotFoundError()
    }
    if (err instanceof appErrors.PasswordWrongFormat) {
      throw new responseErrors.WrongPasswordFormat()
    }
    if (err instanceof appErrors.PasswordDoesntMatchError) {
      throw new responseErrors.BadRequestError('Old password is incorrect.')
    }
    throw err
  }
}

async function resendConfirmEmail(ctx) {
  try {
    ctx.body = await new ResendConfirmEmailService()
      .execute({
        id: ctx.state.user.id,
        publicToken: ctx.state.user.publicToken,
        email: ctx.state.user.email,
        firstName: ctx.state.user.firstName,
        lastName: ctx.state.user.lastName,
        confirmed: ctx.state.user.confirmed,
      })
  } catch (err) {
    if (err instanceof appErrors.NotFoundError) {
      throw new responseErrors.NotFoundError()
    }
    throw err
  }
}
