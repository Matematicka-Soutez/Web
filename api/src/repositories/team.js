'use strict'

Promise = require('bluebird')
const appErrors = require('../../../core/errors/application')
const db = require('./../database')
const parsers = require('./repositoryParsers')

async function findById(id, dbTransaction) {
  const team = await db.Team.findById(id, { transaction: dbTransaction })
  if (!team) {
    throw new appErrors.NotFoundError()
  }
  return parsers.parseTeam(team)
}

async function findByName(name, dbTransaction) {
  const team = await db.Team.findOne({
    where: { name },
    transaction: dbTransaction,
  })
  if (!team) {
    throw new appErrors.NotFoundError()
  }
  return parsers.parseTeam(team)
}

async function findByNumberAndCompetition(number, competitionId, dbTransaction) {
  // TODO: Actually search by competition
  const team = await db.Team.findOne({
    where: { number },
    transaction: dbTransaction,
  })
  if (!team) {
    throw new appErrors.NotFoundError()
  }
  return parsers.parseTeam(team)
}

async function findAllByVenue(competitionId, dbTransaction) {
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
      attributes: ['id', 'name'],
      required: false,
      include: [{
        model: db.School,
        as: 'school',
        attributes: ['id', 'fullName'],
        required: false,
      }],
    }],
    order: [
      db.sequelize.literal('"venue"."name" DESC'),
      db.sequelize.literal('"teams"."createdAt" ASC'),
    ],
    transaction: dbTransaction,
  })
  return parsers.parseCompetitionVenues(venues)
}

async function create(team, members, dbTransaction) {
  const createdTeam = await db.Team.create(team, { transaction: dbTransaction })
  if (members && members.length > 0) {
    createdTeam.members = await db.TeamMember.bulkCreate(members.map(member => ({
      ...member,
      teamId: createdTeam.id,
    })), { transaction: dbTransaction })
  }
  return parsers.parseTeam(createdTeam)
}

function bulkUpdate(updates, dbTrannsaction) {
  const requests = updates.map(update => db.Team.update(
    update,
    {
      where: { id: update.id },
      transaction: dbTrannsaction,
    },
  ))
  return Promise.all(requests)
}

module.exports = {
  findById,
  findByName,
  findByNumberAndCompetition,
  findAllByVenue,
  create,
  bulkUpdate,
}
