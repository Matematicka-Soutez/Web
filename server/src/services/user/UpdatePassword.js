const AbstractService = require('./../AbstractService')
const userRepository = require('./../../repositories/user')
const crypto = require('./../../utils/crypto')
const validators = require('./../../utils/validators')
const appErrors = require('./../../utils/errors/application')
const mailer = require('./../../utils/email/mailer')

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
    await validators.advancePasswordValidation(this.requestData.password)
    const user = await userRepository.findByToken(this.requestData.token, { passwordToken: true })
    if (!user.confirmed) {
      throw new appErrors.NotConfirmedError()
    }
    if (!user.id || !user.firstName || !user.lastName || !user.email) {
      throw new Error('Expecting parameters \'id\', \'firstName\', \'lastName\', \'email\'.')
    }
    await userRepository.update(user.id, {
      password: await crypto.hashPassword(this.requestData.password),
      passwordPublicToken: null,
      passwordLastUpdatedAt: new Date().toISOString(),
    })
    await mailer.sendChangePasswordEmail({
      fullName: `${user.firstName} ${user.lastName}`,
      toAddress: user.email,
    })
    return true
  }
}
