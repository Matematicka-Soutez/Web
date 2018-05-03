const db = require('./../database')
const appErrors = require('./../utils/errors/application')
const parsers = require('./repositoryParsers')

async function findById(id, dbTransaction) {
  const organizer = await db.Organizer.findById(id, { transaction: dbTransaction })
  if (!organizer) {
    throw new appErrors.NotFoundError()
  }
  return parsers.parseOrganizer(organizer)
}

async function findByEmail(email, dbTransaction) {
  const organizer = await db.Organizer.findOne({
    where: { email },
    transaction: dbTransaction,
  })
  if (!organizer) {
    throw new appErrors.NotFoundError()
  }
  return parsers.parseOrganizer(organizer)
}

module.exports = {
  findById,
  findByEmail,
}
