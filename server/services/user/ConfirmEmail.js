const TransactionalService = require('./../TransactionalService')
const userRepository = require('./../../repositories/user')
const crypto = require('./../../utils/crypto')

module.exports = class ConfirmEmailService extends TransactionalService {
  schema() {
    return {
      type: 'Object',
      properties: {
        confirmToken: { type: 'string', required: true, maxLength: 256 },
      },
    }
  }

  async run() {
    const transaction = await this.createOrGetTransaction()
    const user = await userRepository.findByToken(this.requestData.confirmToken, null, transaction)
    const updateValues = {
      publicToken: null,
      confirmed: true,
      lastLoginAt: new Date().toISOString(),
    }
    await userRepository.update(user.id, updateValues, transaction)
    const token = await crypto.generateUserAccessToken(user.id)
    user.accessToken = token
    return user
  }
}
