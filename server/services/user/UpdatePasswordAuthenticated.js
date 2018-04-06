const AbstractService = require('./../AbstractService')
const userRepository = require('./../../repositories/user')
const appErrors = require('./../../utils/errors/application')
const crypto = require('./../../utils/crypto')
const validators = require('./../../utils/validators')
const mailer = require('./../../utils/email/mailer')

module.exports = class UpdatePasswordService extends AbstractService {
  schema() {
    return {
      type: 'Object',
      properties: {
        userId: { type: 'integer', required: true, minimum: 1 },
        oldPassword: validators.passwordValidator({ required: true }),
        newPassword: validators.passwordValidator({ required: true }),
      },
    }
  }

  async run() {
    validators.advancePasswordValidation(this.requestData.newPassword)
    const user = await userRepository.findById(this.requestData.userId)
    if (!user || !user.password) {
      throw new appErrors.NotFoundError()
    }
    const verified = await crypto.comparePasswords(this.requestData.oldPassword, user.password)
    if (!verified) {
      throw new appErrors.PasswordDoesntMatchError()
    }
    await userRepository.update(this.requestData.userId, {
      password: await crypto.hashPassword(this.requestData.newPassword),
      publicToken: null,
      passwordLastUpdatedAt: new Date().toISOString(),
    })
    await mailer.sendChangePasswordEmail({
      fullName: `${user.firstName} ${user.lastName}`,
      toAddress: user.email,
    })
    const accessToken = await crypto.generateUserAccessToken(user.id)
    return { accessToken }
  }
}
