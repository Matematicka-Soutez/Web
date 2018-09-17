'use strict'

const AbstractService = require('../../../../core/services/AbstractService')
const appErrors = require('../../../../core/errors/application')
const crypto = require('../../utils/crypto')
const mailer = require('../../utils/email/mailer')
const validators = require('../../utils/validators')
const teacherRepository = require('./../../repositories/teacher')

module.exports = class ResetPasswordService extends AbstractService {
  schema() {
    return {
      type: 'Object',
      properties: {
        email: validators.emailValidator({ required: false }),
        duplicateResetPasswordToken: { type: 'string', required: false, maxLength: 256 },
      },
      oneOf: [
        { required: ['email'] },
        { required: ['duplicateResetPasswordToken'] },
      ],
    }
  }

  async run() {
    const teacher = await this.findUser(this.data)
    if (!teacher.confirmed) {
      throw new appErrors.NotConfirmedError()
    }
    const passwordPublicToken = crypto.generateRandomToken()
    const updatePayload = { passwordPublicToken }
    if (this.data.duplicateResetPasswordToken) {
      updatePayload.duplicateResetPasswordToken = null
    }
    await teacherRepository.update(teacher.id, updatePayload)
    await mailer.sendResetPasswordEmail({
      toAddress: teacher.email,
      resetPasswordToken: passwordPublicToken,
      fullName: `${teacher.firstName} ${teacher.lastName}`,
    })
    return true
  }

  async findUser(data) {
    if (data.email) {
      const teacher = await teacherRepository.findByEmail(data.email.toLowerCase())
      if (!teacher) {
        throw new appErrors.NotFoundError()
      }
      return teacher
    }
    const payload = { duplicateResetPasswordToken: true }
    return teacherRepository.findByToken(data.duplicateResetPasswordToken, payload)
  }
}
