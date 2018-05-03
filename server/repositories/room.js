const db = require('./../database')
const parsers = require('./repositoryParsers')

async function findCompetitionVenueRooms(competitionId, venueId, dbTransaction) {
  if (!competitionId || !venueId) {
    throw new Error('competitionId and venueId are required')
  }
  const rooms = await db.CompetitionVenueRoom.findAll({
    where: { competitionId, venueId },
    include: [{
      model: db.Room,
      as: 'room',
      required: true,
    }, {
      model: db.Team,
      as: 'teams',
    }],
    order: db.sequelize.literal('"CompetitionVenueRooms->Rooms"."name" ASC'),
    transaction: dbTransaction,
  })
  return parsers.parseCompetitionVenueRooms(rooms)
}

module.exports = {
  findCompetitionVenueRooms,
}
