'use strict'

const AbstractService = require('../../../../core/services/AbstractService')
const crypto = require('../../utils/crypto')
const validators = require('../../utils/validators')
const appErrors = require('../../../../core/errors/application')
const mailer = require('../../utils/email/mailer')
const teacherRepository = require('./../../repositories/teacher')

module.exports = class UpdatePasswordService extends AbstractService {
  schema() {
    return {
      type: 'Object',
      properties: {
        password: validators.passwordValidator({ required: true }),
        token: { type: 'string', required: true, maxLength: 256 },
      },
    }
  }

  async run() {
    await validators.advancePasswordValidation(this.data.password)
    const teacher = await teacherRepository.findByToken(
      this.data.token,
      { passwordToken: true },
    )
    if (!teacher.confirmed) {
      throw new appErrors.NotConfirmedError()
    }
    if (!teacher.id || !teacher.firstName || !teacher.lastName || !teacher.email) {
      throw new Error('Expecting parameters \'id\', \'firstName\', \'lastName\', \'email\'.')
    }
    await teacherRepository.update(teacher.id, {
      password: await crypto.hashPassword(this.data.password),
      passwordPublicToken: null,
      passwordLastUpdatedAt: new Date().toISOString(),
    })
    await mailer.sendChangePasswordEmail({
      fullName: `${teacher.firstName} ${teacher.lastName}`,
      toAddress: teacher.email,
    })
    return true
  }
}
