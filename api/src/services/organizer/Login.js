'use strict'

const AbstractService = require('../../../../core/services/AbstractService')
const appErrors = require('../../../../core/errors/application')
const crypto = require('../../utils/crypto')
const organizerRepository = require('./../../repositories/organizer')

module.exports = class LoginService extends AbstractService {
  schema() {
    return {
      type: 'Object',
      properties: {
        email: { type: 'string', required: true, minimum: 1 },
        password: { type: 'string', required: true, minimum: 1 },
      },
    }
  }

  async run() {
    const organizer = await organizerRepository.findByEmail(this.data.email.toLowerCase())
    if (!organizer) {
      throw new appErrors.UnauthorizedError()
    }
    if (!organizer.confirmed) {
      throw new appErrors.NotConfirmedError()
    }
    const verified = await crypto.comparePasswords(this.data.password, organizer.password)

    if (!verified || organizer.disabled) {
      throw new appErrors.UnauthorizedError()
    }

    const accessToken = await crypto.generateOrganizerAccessToken(organizer.id)
    return {
      id: organizer.id,
      email: organizer.email,
      accessToken,
    }
  }
}
