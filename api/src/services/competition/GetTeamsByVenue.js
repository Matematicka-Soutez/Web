'use strict'

const AbstractService = require('../../../../core/services/AbstractService')
const teamRepository = require('../../repositories/team')

module.exports = class GetTeamsByVenueService extends AbstractService {
  schema() {
    return {
      type: 'Object',
      properties: {},
    }
  }

  async run() {
    const teamsByVenue = await teamRepository.findAllByVenue(this.competition.id)
    return teamsByVenue.map(venue => ({
      id: venue.id,
      capacity: venue.capacity,
      remainingCapacity: venue.capacity - venue.teams.length,
      name: venue.venue.name,
      teams: venue.teams,
    }))
  }
}
