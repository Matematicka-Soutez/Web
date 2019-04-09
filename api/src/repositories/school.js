'use strict'

const appErrors = require('../../../core/errors/application')
const db = require('./../database')
const parsers = require('./repositoryParsers')

async function findByAccessCode(accessCode, competitionId, dbTransaction) {
  if (!accessCode) {
    throw new Error('accessCode is required')
  }
  const school = await db.School.findOne({
    where: { accessCode },
    include: [{
      model: db.Team,
      as: 'teams',
      required: false,
      where: { active: true },
      order: [['createdAt', 'DESC']],
      include: [{
        model: db.TeamMember,
        as: 'members',
        required: false,
      }, {
        model: db.CompetitionVenue,
        as: 'competitionVenue',
        required: false,
        attributes: ['id', 'competitionId'],
        include: [{
          model: db.Venue,
          as: 'venue',
          required: false,
          attributes: ['id', 'name'],
        }],
      }],
    }],
    transaction: dbTransaction,
  })
  if (!school) {
    throw new appErrors.NotFoundError()
  }
  return parsers.parseSchool(school)
}

module.exports = {
  findByAccessCode,
}
