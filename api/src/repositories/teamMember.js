'use strict'

Promise = require('bluebird')
const db = require('./../database')
const parsers = require('./repositoryParsers')

async function create(teamMember, dbTransaction) {
  const createdMember = await db.TeamMember.create(teamMember, { transaction: dbTransaction })
  return parsers.parseTeamMember(createdMember)
}

async function update(id, data, dbTransaction) {
  const member = await db.TeamMember.update(data, {
    where: { id },
    transaction: dbTransaction,
  })
  return parsers.parseTeamMember(member)
}

async function remove(id, dbTransaction) {
  const member = await db.TeamMember.destroy({
    where: { id },
    transaction: dbTransaction,
  })
  return parsers.parseTeamMember(member)
}

module.exports = {
  create,
  update,
  remove,
}
