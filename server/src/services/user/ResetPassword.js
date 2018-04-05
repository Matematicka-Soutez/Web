const AbstractService = require('./../AbstractService')
const userRepository = require('./../../repositories/user')
const appErrors = require('./../../utils/errors/application')
const crypto = require('./../../utils/crypto')
const mailer = require('./../../utils/email/mailer')
const validators = require('./../../utils/validators')

module.exports = class ResetPasswordService extends AbstractService {
  schema() {
    return {
      type: 'Object',
      properties: {
        email: validators.emailValidator({ required: false }),
        duplicateResetPasswordToken: { type: 'string', required: false, maxLength: 256 },
      },
      oneOf: [
        { required: ['email'] },
        { required: ['duplicateResetPasswordToken'] },
      ],
    }
  }

  async run() {
    const user = await this.findUser(this.requestData)
    if (!user.confirmed) {
      throw new appErrors.NotConfirmedError()
    }
    const passwordPublicToken = crypto.generateRandomToken()
    const updatePayload = { passwordPublicToken }
    if (this.requestData.duplicateResetPasswordToken) {
      updatePayload.duplicateResetPasswordToken = null
    }
    await userRepository.update(user.id, updatePayload)
    await mailer.sendResetPasswordEmail({
      toAddress: user.email,
      resetPasswordToken: passwordPublicToken,
      fullName: `${user.firstName} ${user.lastName}`,
    })
    return true
  }

  async findUser(data) {
    if (data.email) {
      const user = await userRepository.findByEmail(data.email.toLowerCase())
      if (!user) {
        throw new appErrors.NotFoundError()
      }
      return user
    }
    const payload = { duplicateResetPasswordToken: true }
    return userRepository.findByToken(data.duplicateResetPasswordToken, payload)
  }
}
