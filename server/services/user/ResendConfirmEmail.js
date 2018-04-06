const TransactionalService = require('./../TransactionalService')
const userRepository = require('./../../repositories/user')
const crypto = require('./../../utils/crypto')
const validators = require('../../utils/validators')
const mailer = require('./../../utils/email/mailer')

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
    let user = this.requestData
    const transaction = await this.createOrGetTransaction()
    if (this.requestData.adminAccess) {
      user = await userRepository.getPersonalInfo(user.id, transaction)
      return this.sendConfirmationEmail(user, transaction)
    }
    return this.sendConfirmationEmail(user, transaction)
  }

  async sendConfirmationEmail(user, transaction) {
    if (user.confirmed) {
      return user
    }
    if (!user.publicToken) {
      user.publicToken = await crypto.generateRandomToken()
      await userRepository.update(user.id, { publicToken: user.publicToken }, transaction)
    }
    await mailer.sendInviteEmail({
      toAddress: user.email,
      confirmToken: user.publicToken,
      fullName: `${user.firstName} ${user.lastName}`,
    })
    return user
  }
}
