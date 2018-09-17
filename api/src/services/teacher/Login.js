'use strict'

const AbstractService = require('../../../../core/services/AbstractService')
const appErrors = require('../../../../core/errors/application')
const validator = require('../../utils/validators')
const crypto = require('../../utils/crypto')
const teacherRepository = require('./../../repositories/teacher')

module.exports = class LoginService extends AbstractService {
  schema() {
    return {
      type: 'Object',
      properties: {
        email: validator.emailValidator({ required: true }),
        password: { type: 'string', minLength: 1, maxLength: 255 },
      },
    }
  }

  async run() {
    const teacher = await teacherRepository.findByEmail(this.data.email.toLowerCase())
    if (!teacher) {
      throw new appErrors.UnauthorizedError()
    }
    if (!teacher.confirmed) {
      throw new appErrors.NotConfirmedError()
    }
    const verified = await crypto.comparePasswords(this.data.password, teacher.password)
    if (!verified) {
      throw new appErrors.UnauthorizedError()
    }
    teacher.accessToken = await crypto.generateTeacherAccessToken(teacher.id)
    await teacherRepository.update(teacher.id, { lastLoginAt: new Date().toISOString() })
    return teacher
  }
}

