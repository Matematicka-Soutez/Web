'use strict'

const appErrors = require('../../../core/errors/application')
const db = require('./../database')
const parsers = require('./repositoryParsers')

async function findByAccessCode(accessCode, dbTransaction) {
  if (!accessCode) {
    throw new Error('accessCode is required')
  }
  const school = await db.School.findOne({
    where: { accessCode },
    include: [{
      model: db.Team,
      as: 'teams',
      order: [['createdAt', 'DESC']],
      include: [{
        model: db.TeamMember,
        as: 'members',
      }, {
        model: db.CompetitionVenue,
        as: 'competitionVenue',
        attributes: ['id'],
        include: [{
          model: db.Venue,
          as: 'venue',
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
