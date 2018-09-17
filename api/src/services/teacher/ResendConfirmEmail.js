'use strict'

const validators = require('../../utils/validators')
const TransactionalService = require('../../../../core/services/TransactionalService')
const crypto = require('../../utils/crypto')
const mailer = require('../../utils/email/mailer')
const teacherRepository = require('./../../repositories/teacher')

module.exports = class ResendConfirmEmailService extends TransactionalService {
  schema() {
    return {
      type: 'Object',
      properties: {
        id: { type: 'integer', required: false, minimum: 1 },
        publicToken: { type: ['string', 'null'], required: false },
        email: validators.emailValidator({ required: false }),
        firstName: validators.validateName({ required: false, maxLength: 40 }),
        lastName: validators.validateName({ required: false, maxLength: 80 }),
        confirmed: { type: 'boolean', required: false },
        adminAccess: { type: 'boolean', required: false, enum: [true] },
      },
      oneOf: [
        { required: ['id', 'email', 'firstName', 'lastName'] },
        { required: ['adminAccess'] },
      ],
    }
  }

  async run() {
    let teacher = this.data
    const transaction = await this.createOrGetTransaction()
    if (this.data.adminAccess) {
      teacher = await teacherRepository.getPersonalInfo(teacher.id, transaction)
      return this.sendConfirmationEmail(teacher, transaction)
    }
    return this.sendConfirmationEmail(teacher, transaction)
  }

  async sendConfirmationEmail(teacher, transaction) {
    if (teacher.confirmed) {
      return teacher
    }
    if (!teacher.publicToken) {
      teacher.publicToken = await crypto.generateRandomToken()
      await teacherRepository.update(teacher.id, { publicToken: teacher.publicToken }, transaction)
    }
    await mailer.sendInviteEmail({
      toAddress: teacher.email,
      confirmToken: teacher.publicToken,
      fullName: `${teacher.firstName} ${teacher.lastName}`,
    })
    return teacher
  }
}
