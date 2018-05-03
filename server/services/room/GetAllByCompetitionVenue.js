const AbstractService = require('./../AbstractService')
const roomRepository = require('./../../repositories/room')

module.exports = class GetAllByCompetitionVenueService extends AbstractService {
  schema() {
    return {
      type: 'Object',
      properties: {
        venueId: { type: 'integer', required: true, minimum: 1 },
      },
    }
  }

  async run() {
    const cvrooms = await roomRepository.findCompetitionVenueRooms(
      this.competitionId,
      this.data.venueId,
    )
    return cvrooms.map(cvroom => ({
      id: cvroom.room.id,
      name: cvroom.room.name,
      teams: cvroom.teams,
    }))
  }
}
