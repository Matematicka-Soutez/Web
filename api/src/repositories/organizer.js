'use strict'

const appErrors = require('../../../core/errors/application')
const db = require('./../database')
const parsers = require('./repositoryParsers')

async function create(user, dbTransaction) {
  const createdUser = await db.Organizer.create(user, { transaction: dbTransaction })
  return parsers.parseOrganizer(createdUser)
}

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
  return parsers.parseOrganizer(organizer)
}

async function findByProblemScanningToken(token, dbTransaction) {
  const organizer = await db.Organizer.findOne({
    where: { problemScanningToken: token },
    transaction: dbTransaction,
  })
  return parsers.parseOrganizer(organizer)
}

module.exports = {
  create,
  findById,
  findByEmail,
  findByProblemScanningToken,
}
