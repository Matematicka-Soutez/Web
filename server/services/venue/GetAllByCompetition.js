const AbstractService = require('./../AbstractService')
const venueRepository = require('./../../repositories/venue')

module.exports = class GetAllByCompetitionService extends AbstractService {
  schema() {
    return {
      type: 'Object',
      properties: {
        venueId: { type: 'integer', required: true, minimum: 1 },
      },
    }
  }

  async run() {
    const compVenues = await venueRepository.findCompetitionVenues(this.competitionId)
    return compVenues.map(compVenue => ({
      id: compVenue.venue.id,
      name: compVenue.venue.name,
      capacity: compVenue.capacity,
      teams: compVenue.teams,
    }))
  }
}
