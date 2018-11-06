'use strict'

const enums = require('../../../../core/enums')
const TransactionalService = require('../../../../core/services/TransactionalService')
const appErrors = require('../../../../core/errors/application')
const crypto = require('../../utils/crypto')
const mailer = require('../../utils/email/mailer')
const validators = require('../../utils/validators')
const organizerRepository = require('./../../repositories/organizer')

module.exports = class SignUpService extends TransactionalService {
  schema() {
    return {
      type: 'Object',
      properties: {
        firstName: validators.validateName({ required: true, maxLength: 40 }),
        lastName: validators.validateName({ required: true, maxLength: 80 }),
        email: validators.emailValidator({ required: true }),
        password: validators.passwordValidator({ required: true }),
        // TODO: validate duplicity
        problemScanningToken: { type: 'string', required: true, minLength: 8, maxLength: 40 },
      },
    }
  }

  async run() {
    validators.advancePasswordValidation(this.data.password)
    const newUser = await parseOrganizerFromRequest(this.data)
    const transaction = await this.createOrGetTransaction()
    const alreadyExists = await organizerRepository.findByEmail(newUser.email, transaction)
    if (alreadyExists) {
      throw new appErrors.UserPotentiallyExistsError('token', true)
    }
    newUser.publicToken = await crypto.generateRandomToken()
    newUser.lastLoginAt = new Date().toISOString()
    const createdOrganizer = await organizerRepository.create(newUser, transaction)
    await mailer.sendInviteEmail({
      toAddress: createdOrganizer.email,
      confirmToken: createdOrganizer.publicToken,
      fullName: `${createdOrganizer.firstName} ${createdOrganizer.lastName}`,
    })
    createdOrganizer.accessToken = await crypto.generateOrganizerAccessToken(createdOrganizer.id)
    return createdOrganizer
  }
}

async function parseOrganizerFromRequest(data) {
  return {
    firstName: validators.formatName(data.firstName),
    lastName: validators.formatName(data.lastName),
    email: data.email.toLowerCase(),
    password: await crypto.hashPassword(data.password),
    roleId: enums.ROLES.DRAFTSMAN.id,
    problemScanningToken: data.problemScanningToken,
  }
}
