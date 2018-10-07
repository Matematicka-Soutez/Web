'use strict'

Promise = require('bluebird')
const AbstractService = require('../../../../core/services/AbstractService')
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

  // TODO: Make this competition agnostic
  run() {
    return Promise.all([
      schoolRepository.findByAccessCode(this.data.schoolToken),
      venueRepository.findCompetitionVenues(this.competition.id),
    ]).spread((school, venues) => ({
      school,
      venues: venues.map(venue => ({
        id: venue.id,
        remainingCapacity: venue.capacity - venue.teams.length,
        name: venue.venue.name,
      })),
    }))
  }
}
