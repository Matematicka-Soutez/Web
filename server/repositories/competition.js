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

module.exports = {
  findById,
}
