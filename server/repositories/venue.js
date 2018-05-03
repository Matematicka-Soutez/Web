const db = require('./../database')
const parsers = require('./repositoryParsers')

async function findCompetitionVenues(competitionId, dbTransaction) {
  if (!competitionId) {
    throw new Error('competitionId is required')
  }
  const venues = await db.CompetitionVenue.findAll({
    where: { competitionId },
    include: [{
      model: db.Venue,
      as: 'venue',
      required: true,
    }, {
      model: db.Team,
      as: 'teams',
    }],
    order: db.sequelize.literal('"CompetitionVenues->Venues"."name" ASC'),
    transaction: dbTransaction,
  })
  return parsers.parseCompetitionVenues(venues)
}

module.exports = {
  findCompetitionVenues,
}
