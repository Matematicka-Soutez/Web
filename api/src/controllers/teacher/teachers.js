'use strict'

const appErrors = require('../../../../core/errors/application')
const responseErrors = require('../../../../core/errors/response')
const UpdatePasswordAuthenticatedService = require('./../../services/teacher/UpdatePasswordAuthenticated') // eslint-disable-line max-len
// const UpdatePersonalInfoService = require('./../../services/teacher/UpdatePersonalInfo')
const ResendConfirmEmailService = require('./../../services/teacher/ResendConfirmEmail')
// const GetUsersPersonalInfo = require('./../../services/teacher/GetUsersPersonalInfo')


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
    ctx.body = await new UpdatePasswordAuthenticatedService(ctx.state)
      .execute({
        teacherId: ctx.state.teacher.id,
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
    ctx.body = await new ResendConfirmEmailService(ctx.state)
      .execute({
        id: ctx.state.teacher.id,
        publicToken: ctx.state.teacher.publicToken,
        email: ctx.state.teacher.email,
        firstName: ctx.state.teacher.firstName,
        lastName: ctx.state.teacher.lastName,
        confirmed: ctx.state.teacher.confirmed,
      })
  } catch (err) {
    if (err instanceof appErrors.NotFoundError) {
      throw new responseErrors.NotFoundError()
    }
    throw err
  }
}
