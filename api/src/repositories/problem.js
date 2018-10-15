'use strict'

const db = require('./../database')
const parsers = require('./repositoryParsers')

async function upsertSolvedProblem(solvedProblem, dbTransaction) {
  const addedSolvedProblem = await db.SolvedProblem.upsert(
    solvedProblem,
    {
      returning: true,
      transaction: dbTransaction,
    },
  )
  return parsers.parseSolvedProblem(addedSolvedProblem[0])
}

module.exports = {
  upsertSolvedProblem,
}
