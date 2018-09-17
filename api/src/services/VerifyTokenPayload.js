'use strict'

Promise = require('bluebird')
const configIdleTimeoutSec = require('../../../config').auth.jwt.idleTimeoutSec
const AbstractService = require('../../../core/services/AbstractService')
const appErrors = require('../../../core/errors/application')
const teacherRepository = require('./../repositories/teacher')
const organizerRepository = require('./../repositories/organizer')

const configIdleTimeoutMs = configIdleTimeoutSec * 1000

module.exports = class VerifyTokenPayload extends AbstractService {
  schema() {
    return {
      type: 'Object',
      properties: {
        token: { type: 'string', required: true },
        teacherId: { type: ['number'], required: false, minimum: 1 },
        organizerId: { type: ['number'], required: false, minimum: 1 },
        tokenIssuedAt: { type: 'number', required: true, minimum: 1 },
      },
      anyOf: [
        { required: ['teacherId'] },
        { required: ['organizerId'] },
      ],
    }
  }

  run() {
    return Promise
      .all([this.getAndCheckOrganizer(), this.getAndCheckTeacher()])
      .spread((organizer, teacherData) => parseResponse(organizer, teacherData))
  }

  getAndCheckOrganizer() {
    if (!this.data.organizerId) {
      return null
    }
    const organizer = organizerRepository.findById(this.data.organizerId)
    if (organizer.disabled) {
      throw new appErrors.UnauthorizedError('Organizer account was disabled.')
    }
    return organizer
  }

  async getAndCheckTeacher() {
    if (this.data.teacherId) {
      // If admin is logged as user he is not using stored token in DB
      const requiredToken = !this.data.organizerId
      const teacher = await teacherRepository.findByIdAndAccessToken(
        this.data.teacherId,
        this.data.token,
        requiredToken,
      )

      // Important 5 second tolerance to iat (token issued at)
      const lastUpdate = Math.floor(teacher.passwordLastUpdatedAt.getTime() / 1000)
      if (this.data.tokenIssuedAt + 5 < lastUpdate) {
        throw new appErrors.TokenRevokedError()
      }
      if (
        teacher && teacher.lastActivityAt
        && ((teacher.lastActivityAt.getTime() + configIdleTimeoutMs) < Date.now())
      ) {
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
