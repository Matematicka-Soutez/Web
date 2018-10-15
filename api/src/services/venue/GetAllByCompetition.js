'use strict'

const AbstractService = require('../../../../core/services/AbstractService')
const venueRepository = require('./../../repositories/venue')

module.exports = class GetAllByCompetitionService extends AbstractService {
  async run() {
    const compVenues = await venueRepository.findCompetitionVenues(this.competition.id)
    return compVenues.map(compVenue => ({
      id: compVenue.venue.id,
      name: compVenue.venue.name,
      capacity: compVenue.capacity,
      rooms: compVenue.cvrooms.map(cvroom => ({
        ...cvroom.room,
        capacity: cvroom.capacity,
        teams: cvroom.teams,
      })),
    }))
  }
}
