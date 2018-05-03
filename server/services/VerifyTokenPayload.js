const Promise = require('bluebird')
const AbstractService = require('./AbstractService')
const teacherRepository = require('./../repositories/teacher')
const organizerRepository = require('./../repositories/organizer')
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
      .all([this.getOrganizer, this.getAndCheckTeacher])
      .spread((admin, userData) => parseResponse(admin, userData))
  }

  getOrganizer() {
    return this.data.adminId
      ? organizerRepository.findById(this.data.adminId)
      : null
  }

  async getAndCheckTeacher() {
    if (this.data.userId) {
      // If admin is logged as user he is not using stored token in DB
      const requiredToken = !this.data.adminId
      const teacher = await teacherRepository.findByIdAndAccessToken(
        this.data.userId,
        this.data.token,
        requiredToken,
      )

      // Important 5 second tolerance to iat (token issued at)
      if (this.data.tokenIssuedAt + 5 < Math.floor(teacher.passwordLastUpdatedAt.getTime() / 1000)) {
        throw new appErrors.TokenRevokedError()
      }
      if (teacher && teacher.lastActivityAt && ((teacher.lastActivityAt.getTime() + configIdleTimeoutMs) < Date.now())) {
        throw new appErrors.TokenIdleTimoutError()
      }

      if (teacher && teacher.accessToken && teacher.accessToken.id) {
        teacherRepository.update(teacher.id, { lastActivityAt: new Date().toISOString() })
      }
      return teacher
    }
    return null
  }
}

function parseResponse(organizer, teacherData) {
  let teacher
  let loginTimeout
  let loginIdleTimeout
  if (teacherData) {
    loginTimeout = teacherData.accessToken
      ? teacherData.accessToken.expiresAt.getTime()
      : null
    loginIdleTimeout = teacherData.accessToken
      ? teacherData.accessToken.lastActivityAt.getTime() + configIdleTimeoutMs
      : null
    delete teacherData.accessToken
    teacher = teacherData
  }
  return {
    organizer: organizer || null,
    teacher: teacher || null,
    loginTimeout,
    loginIdleTimeout,
  }
}
