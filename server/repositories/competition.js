const moment = require('moment')
const db = require('./../database')
const appErrors = require('./../utils/errors/application')
const parsers = require('./repositoryParsers')

async function findById(id, dbTransaction) {
  const competition = await db.Competition.findById(id, { transaction: dbTransaction })
  if (!competition) {
    throw new appErrors.NotFoundError()
  }
  return parsers.parseCompetition(competition)
}

async function findCurrentCompetition(dbTransaction) {
  const competitions = await db.Competition.findAll({
    where: {
      date: {
        [db.sequelize.Op.gte]: moment().subtract(1, 'day').toDate(),
      },
    },
    include: [{
      model: db.Game,
      as: 'game',
      required: true,
    }],
    limit: 1,
    order: [['date', 'DESC']],
    transaction: dbTransaction,
  })
  if (!competitions || competitions.length < 1) {
    throw new appErrors.NotFoundError()
  }
  return parsers.parseCompetition(competitions[0])
}

module.exports = {
  findById,
  findCurrentCompetition,
}
