'use strict'

Promise = require('bluebird')
const AbstractService = require('../../../../core/services/AbstractService')
const registrationUtils = require('../../utils/registration')
const schoolRepository = require('./../../repositories/school')
const venueRepository = require('./../../repositories/venue')

module.exports = class GetSchoolRegistrationsService extends AbstractService {
  schema() {
    return {
      type: 'Object',
      properties: {
        schoolToken: { type: 'string', required: true, length: 6 },
      },
    }
  }

  run() {
    return Promise.all([
      // TODO: Make this competition agnostic
      schoolRepository.findByAccessCode(this.data.schoolToken, this.competition.id),
      venueRepository.findCompetitionVenues(this.competition.id),
    ]).spread((school, venues) => ({
      school,
      currentRound: registrationUtils.getCurrentRegistrationRound(this.competition).number,
      registrationRounds: registrationUtils.getRegistrationRounds(this.competition),
      venues: venues.map(venue => ({
        id: venue.id,
        remainingCapacity: venue.capacity - venue.teams.length,
        name: venue.venue.name,
      })),
    }))
  }
}
