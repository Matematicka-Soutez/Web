const Promise = require('bluebird')
const AbstractService = require('./AbstractService')
const userRepository = require('./../repositories/user')
const adminRepository = require('./../repositories/admin')
const appErrors = require('./../utils/errors/application')
const configIdleTimeoutSec = require('../../config').auth.jwt.idleTimeoutSec

const configIdleTimeoutMs = configIdleTimeoutSec * 1000

module.exports = class VerifyTokenPayload extends AbstractService {
  schema() {
    return {
      type: 'Object',
      properties: {
        token: { type: 'string', required: true },
        userId: { type: ['number'], required: false, minimum: 1 },
        adminId: { type: ['number'], required: false, minimum: 1 },
        tokenIssuedAt: { type: 'number', required: true, minimum: 1 },
      },
      anyOf: [
        { required: ['userId'] },
        { required: ['adminId'] },
      ],
    }
  }

  run() {
    return Promise
      .all([this.getAdmin, this.getAndCheckUser])
      .spread((admin, userData) => parseResponse(admin, userData))
  }

  getAdmin() {
    return this.requestData.adminId
      ? adminRepository.findById(this.requestData.adminId)
      : null
  }

  async getAndCheckUser() {
    if (this.requestData.userId) {
      // If admin is logged as user he is not using stored token in DB
      const requiredToken = !this.requestData.adminId
      const user = await userRepository.findByIdAndAccessToken(this.requestData.userId, this.requestData.token, requiredToken)

      // Important 5 second tolerance to iat (token issued at)
      if (this.requestData.tokenIssuedAt + 5 < Math.floor(user.passwordLastUpdatedAt.getTime() / 1000)) {
        throw new appErrors.TokenRevokedError()
      }
      if (user && user.lastActivityAt && ((user.lastActivityAt.getTime() + configIdleTimeoutMs) < Date.now())) {
        throw new appErrors.TokenIdleTimoutError()
      }

      if (user && user.accessToken && user.accessToken.id) {
        userRepository.update(user.id, { lastActivityAt: new Date().toISOString() })
      }
      return user
    }
    return null
  }
}

function parseResponse(admin, userData) {
  let user
  let loginTimeout
  let loginIdleTimeout

  if (userData) {
    loginTimeout = userData.accessToken ? userData.accessToken.expiresAt.getTime() : null
    loginIdleTimeout = userData.accessToken ? userData.accessToken.lastActivityAt.getTime() + configIdleTimeoutMs : null
    delete userData.accessToken
    user = userData
  }
  return {
    admin: admin || null,
    user: user || null,
    loginTimeout,
    loginIdleTimeout,
  }
}
