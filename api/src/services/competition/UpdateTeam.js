'use strict'

Promise = require('bluebird')
const TransactionalService = require('../../../../core/services/TransactionalService')
const appErrors = require('../../../../core/errors/application')
const registrationUtils = require('../../utils/registration')
const schoolRepository = require('./../../repositories/school')
const teamRepository = require('./../../repositories/team')
const teamMemberRepository = require('./../../repositories/teamMember')
const venueRepository = require('./../../repositories/venue')

module.exports = class UpdateTeamService extends TransactionalService {
  schema() {
    return {
      type: 'Object',
      properties: {
        id: { type: 'integer', required: true, minimum: 1 },
        schoolToken: { type: 'string', required: true, length: 6 },
        competitionVenueId: { type: 'integer', required: true, minimum: 1 },
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
              grade: { type: 'integer', required: true, enum: [5, 6, 7, 8, 9] },
            },
          },
        },
      },
    }
  }

  async run() {
    const dbTransaction = await this.createOrGetTransaction()
    // Checks
    const school = await schoolRepository.findByAccessCode(this.data.schoolToken, this.competition.id, dbTransaction)
    const competitionVenue = await venueRepository.findCompetitionVenueById(
      this.data.competitionVenueId,
      dbTransaction,
    )
    registrationUtils.checkCompetitionVenueRequirements(
      this.competition,
      competitionVenue,
      { isUpdate: true },
    )
    const team = await teamRepository.findById(this.data.id, {
      includeSchool: true,
      includeTeamMembers: true,
    }, dbTransaction)
    if (team.school.id !== school.id) {
      throw new appErrors.UnauthorizedError()
    }

    // Team updates
    const newTeam = await teamRepository.update(team.id, {
      name: this.data.teamName.trim(),
      competitionVenueId: this.data.competitionVenueId,
    }, dbTransaction)

    // Team member updates
    await Promise.map(team.members, member => teamMemberRepository.remove(member.id, dbTransaction))
    newTeam.members = await Promise.map(this.data.members, member => {
      delete member.id
      member.teamId = team.id
      return teamMemberRepository.create(member, dbTransaction)
    })

    return {
      success: true,
      team: newTeam,
    }
  }
}
