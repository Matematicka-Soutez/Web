'use strict'

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
      model: db.CompetitionVenueRoom,
      as: 'cvrooms',
      required: false,
      include: [{
        model: db.Team,
        as: 'teams',
        required: false,
      }, {
        model: db.Room,
        as: 'room',
        required: true,
      }],
    }, {
      model: db.Team,
      as: 'teams',
      required: false,
    }],
    order: [
      db.sequelize.literal('"venue"."name" DESC'),
      db.sequelize.literal('"cvrooms->teams"."number" ASC'),
    ],
    transaction: dbTransaction,
  })
  return parsers.parseCompetitionVenues(venues)
}

async function findCompetitionVenueById(id, dbTransaction) {
  const venue = await db.CompetitionVenue.findById(id, {
    include: [{
      model: db.Team,
      as: 'teams',
      required: false,
    }],
    transaction: dbTransaction,
  })
  return parsers.parseCompetitionVenue(venue)
}

module.exports = {
  findCompetitionVenues,
  findCompetitionVenueById,
}
