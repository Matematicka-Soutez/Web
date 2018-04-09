const AbstractService = require('./../AbstractService')
const userRepository = require('./../../repositories/user')
const appErrors = require('./../../utils/errors/application')
const validator = require('./../../utils/validators')
const crypto = require('./../../utils/crypto')

module.exports = class LoginService extends AbstractService {
  schema() {
    return {
      type: 'Object',
      properties: {
        username: validator.emailValidator({ required: true }),
        password: { type: 'string', minLength: 1, maxLength: 255 },
      },
    }
  }

  async run() {
    const user = await userRepository.findByEmail(this.requestData.username.toLowerCase())
    if (!user) {
      throw new appErrors.UnauthorizedError()
    }
    if (!user.confirmed) {
      throw new appErrors.NotConfirmedError()
    }
    const verified = await crypto.comparePasswords(this.requestData.password, user.password)
    if (!verified) {
      throw new appErrors.UnauthorizedError()
    }
    user.accessToken = await crypto.generateUserAccessToken(user.id)
    await userRepository.update(user.id, { lastLoginAt: new Date().toISOString() })
    return user
  }
}

