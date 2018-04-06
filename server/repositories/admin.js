const db = require('./../database')
const appErrors = require('./../utils/errors/application')
const parsers = require('./repositoryParsers')

module.exports = {
  findById,
  findByUserName,
}

async function findById(id, dbTransaction) {
  const admin = await db.Admin.findById(id, { transaction: dbTransaction })
  if (!admin) {
    throw new appErrors.NotFoundError()
  }
  return parsers.parseAdmin(admin)
}

async function findByUserName(username, dbTransaction) {
  const admin = await db.Admin.findOne({
    where: { username },
    transaction: dbTransaction,
  })
  if (!admin) {
    throw new appErrors.NotFoundError()
  }
  return parsers.parseAdmin(admin)
}
