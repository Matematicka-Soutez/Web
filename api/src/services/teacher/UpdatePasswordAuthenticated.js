'use strict'

const AbstractService = require('../../../../core/services/AbstractService')
const appErrors = require('../../../../core/errors/application')
const crypto = require('../../utils/crypto')
const validators = require('../../utils/validators')
const mailer = require('../../utils/email/mailer')
const teacherRepository = require('./../../repositories/teacher')

module.exports = class UpdatePasswordService extends AbstractService {
  schema() {
    return {
      type: 'Object',
      properties: {
        teacherId: { type: 'integer', required: true, minimum: 1 },
        oldPassword: validators.passwordValidator({ required: true }),
        newPassword: validators.passwordValidator({ required: true }),
      },
    }
  }

  async run() {
    validators.advancePasswordValidation(this.data.newPassword)
    const teacher = await teacherRepository.findById(this.data.teacherId)
    if (!teacher || !teacher.password) {
      throw new appErrors.NotFoundError()
    }
    const verified = await crypto.comparePasswords(this.data.oldPassword, teacher.password)
    if (!verified) {
      throw new appErrors.PasswordDoesntMatchError()
    }
    await teacherRepository.update(this.data.teacherId, {
      password: await crypto.hashPassword(this.data.newPassword),
      publicToken: null,
      passwordLastUpdatedAt: new Date().toISOString(),
    })
    await mailer.sendChangePasswordEmail({
      fullName: `${teacher.firstName} ${teacher.lastName}`,
      toAddress: teacher.email,
    })
    const accessToken = await crypto.generateTeacherAccessToken(teacher.id)
    return { accessToken }
  }
}
