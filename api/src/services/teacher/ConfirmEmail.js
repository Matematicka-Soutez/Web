'use strict'

const TransactionalService = require('../../../../core/services/TransactionalService')
const crypto = require('../../utils/crypto')
const teacherRepository = require('./../../repositories/teacher')

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
    const teacher = await teacherRepository.findByToken(
      this.data.confirmToken,
      null,
      transaction,
    )
    const updateValues = {
      publicToken: null,
      confirmed: true,
      lastLoginAt: new Date().toISOString(),
    }
    await teacherRepository.update(teacher.id, updateValues, transaction)
    const token = await crypto.generateTeacherAccessToken(teacher.id)
    teacher.accessToken = token
    return teacher
  }
}
