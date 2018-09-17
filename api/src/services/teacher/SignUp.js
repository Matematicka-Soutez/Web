'use strict'

const TransactionalService = require('../../../../core/services/TransactionalService')
const appErrors = require('../../../../core/errors/application')
const crypto = require('../../utils/crypto')
const mailer = require('../../utils/email/mailer')
const validators = require('../../utils/validators')
const teacherRepository = require('./../../repositories/teacher')

module.exports = class SignUpService extends TransactionalService {
  schema() {
    return {
      type: 'Object',
      properties: {
        title: { type: 'string', required: false, minLength: 1, maxLength: 15 },
        firstName: validators.validateName({ required: true, maxLength: 40 }),
        lastName: validators.validateName({ required: true, maxLength: 80 }),
        email: validators.emailValidator({ required: true }),
        phone: { type: 'string', required: false, minLength: 1, maxLength: 40, isValidPhone: true, format: 'latinString' }, // eslint-disable-line max-len
        password: validators.passwordValidator({ required: true }),
      },
    }
  }

  async run() {
    validators.advancePasswordValidation(this.data.password)
    const newUser = await parseTeacherFromRequest(this.data)
    const transaction = await this.createOrGetTransaction()
    const alreadyExists = await teacherRepository.findByEmail(newUser.email, transaction)
    if (alreadyExists) {
      throw new appErrors.UserPotentiallyExistsError('token', true)
    }
    newUser.publicToken = await crypto.generateRandomToken()
    newUser.lastLoginAt = new Date().toISOString()
    const createdTeacher = await teacherRepository.create(newUser, transaction)
    await mailer.sendInviteEmail({
      toAddress: createdTeacher.email,
      confirmToken: createdTeacher.publicToken,
      fullName: `${createdTeacher.firstName} ${createdTeacher.lastName}`,
    })
    createdTeacher.accessToken = await crypto.generateTeacherAccessToken(createdTeacher.id)
    return createdTeacher
  }
}

async function parseTeacherFromRequest(data) {
  return {
    title: data.title ? data.title.trim() : null,
    firstName: validators.formatName(data.firstName),
    lastName: validators.formatName(data.lastName),
    email: data.email.toLowerCase(),
    phone: validators.formatPhoneNumber(data.phone),
    password: await crypto.hashPassword(data.password),
  }
}
