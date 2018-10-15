'use strict'

const appErrors = require('../../../../core/errors/application')
const TransactionalService = require('../../../../core/services/TransactionalService')
const organizerRepository = require('./../../repositories/organizer')
const problemRepository = require('./../../repositories/problem')
const teamRepository = require('./../../repositories/team')

module.exports = class UpdateSolvedProblemService extends TransactionalService {
  schema() {
    return {
      type: 'Object',
      properties: {
        teamNumber: { type: 'integer', required: true, minimum: 1 },
        problemNumber: { type: 'integer', required: true, minimum: 1, maximum: 100 },
        password: { type: 'string', required: true, minLength: 1, maxLength: 40 },
        cancelled: { type: 'boolean', required: true, enum: [true, false] },
      },
    }
  }

  async run() {
    const dbTransaction = await this.createOrGetTransaction()
    const organizer = await organizerRepository.findByProblemScanningToken(
      this.data.password,
      dbTransaction,
    )
    if (!organizer) {
      throw new appErrors.UnauthorizedError()
    }
    const team = await teamRepository.findByNumberAndCompetition(
      this.data.teamNumber,
      this.competition.id,
      dbTransaction,
    )
    return problemRepository.upsertSolvedProblem({
      competitionId: this.competition.id,
      teamId: team.id,
      problemNumber: this.data.problemNumber,
      lastUpdatedBy: organizer.id,
      cancelled: this.data.cancelled,
    }, dbTransaction)
  }
}
