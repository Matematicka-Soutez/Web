'use strict'

const appErrors = require('../../../../core/errors/application')
const TransactionalService = require('../../../../core/services/TransactionalService')
const organizerRepository = require('./../../repositories/organizer')
const teamSolutionRepository = require('./../../repositories/teamSolution')
const teamRepository = require('./../../repositories/team')

module.exports = class UpdateTeamSolutionService extends TransactionalService {
  schema() {
    return {
      type: 'Object',
      properties: {
        teamNumber: { type: 'integer', required: true, minimum: 1 },
        problemNumber: { type: 'integer', required: true, minimum: 1, maximum: 100 },
        password: { type: 'string', required: true, minLength: 1, maxLength: 40 },
        action: { type: 'string', required: true, enum: ['add', 'cancel'] },
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
    const teamSolution = await teamSolutionRepository.createTeamSolutionChange({
      competitionId: this.competition.id,
      teamId: team.id,
      problemNumber: this.data.problemNumber,
      createdBy: organizer.id,
      solved: this.data.action === 'add',
    }, dbTransaction)

    teamSolution.teamNumber = team.number
    return teamSolution
  }
}
