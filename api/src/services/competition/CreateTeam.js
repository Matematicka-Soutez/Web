'use strict'

const TransactionalService = require('../../../../core/services/TransactionalService')
const registrationUtils = require('../../utils/registration')
const schoolRepository = require('./../../repositories/school')
const teamRepository = require('./../../repositories/team')
const venueRepository = require('./../../repositories/venue')

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

  async run() {
    const dbTransaction = await this.createOrGetTransaction()
    const school = await schoolRepository.findByAccessCode(this.data.schoolToken, this.competition.id, dbTransaction)
    registrationUtils.checkRegistrationRoundRequirements(this.competition, school)
    const competitionVenue = await venueRepository.findCompetitionVenueById(
      this.data.competitionVenueId,
      dbTransaction,
    )
    registrationUtils.checkCompetitionVenueRequirements(this.competition, competitionVenue)
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
