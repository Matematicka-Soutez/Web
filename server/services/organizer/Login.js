const AbstractService = require('./../AbstractService')
const organizerRepository = require('./../../repositories/organizer')
const appErrors = require('./../../utils/errors/application')
const crypto = require('./../../utils/crypto')

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
    const organizer = await organizerRepository.findByEmail(this.data.email)
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
