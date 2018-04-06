const AbstractService = require('./../AbstractService')
const adminRepository = require('./../../repositories/admin')
const appErrors = require('./../../utils/errors/application')
const crypto = require('./../../utils/crypto')

module.exports = class LoginService extends AbstractService {
  schema() {
    return {
      type: 'Object',
      properties: {
        userName: { type: 'string', required: true, minimum: 1 },
        password: { type: 'string', required: true, minimum: 1 },
      },
    }
  }

  async run() {
    const admin = await adminRepository.findByUserName(this.requestData.userName)
    const verified = await crypto.comparePasswords(this.requestData.password, admin.password)

    if (!verified || admin.disabled) {
      throw new appErrors.UnauthorizedError()
    }

    const accessToken = await crypto.generateAdminAccessToken(admin.id)
    return {
      id: admin.id,
      userName: admin.userName,
      accessToken,
    }
  }
}
