'use strict'

const appErrors = require('../../../../core/errors/application')
const TransactionalService = require('../../../../core/services/TransactionalService')
const schoolRepository = require('./../../repositories/school')
const teamRepository = require('./../../repositories/team')

module.exports = class RegisterSchoolTeamService extends TransactionalService {
  schema() {
    return {
      type: 'Object',
      properties: {
        schoolToken: { type: 'string', required: true, length: 6 },
        competitionVenueId: { type: 'number', required: true, minimum: 1 },
        teamName: { type: 'string', required: true, minLength: 1, maxLength: 40 },
        members: {
          type: 'array',
          minItems: 3,
          maxItems: 4,
          items: {
            type: 'Object',
            properties: {
              firstName: { type: 'string', required: true, minLength: 1, maxLength: 80 },
              lastName: { type: 'string', required: true, minLength: 1, maxLength: 80 },
              grade: { type: 'number', required: true, enum: [5, 6, 7, 8, 9] },
            },
          },
        },
      },
    }
  }

  // TODO: Check if registration is open and competitionVenue is under current competition
  // TODO: Implement registration rounds
  async run() {
    const dbTransaction = await this.createOrGetTransaction()
    const school = await schoolRepository.findByAccessCode(this.data.schoolToken, dbTransaction)
    if (school.teams && school.teams.length > 0) {
      throw new appErrors.CannotBeDoneError('V tuto chvíli nemůžete registrovat více než jeden tým na školu.') // eslint-disable-line max-len
    }
    const team = await teamRepository.create({
      name: this.data.teamName.trim(),
      schoolId: school.id,
      competitionVenueId: this.data.competitionVenueId,
    }, this.data.members, dbTransaction)
    return {
      success: true,
      team,
    }
  }
}
