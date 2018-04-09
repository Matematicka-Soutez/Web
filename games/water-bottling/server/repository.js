const db = require('../../../server/database')
const appErrors = require('../../../server/utils/errors/application')

module.exports = {
  findTeamPositions,
  addTeamPosition,
}

async function findTeamPositions(dbTransaction) {
  const result = await db.TeamPosition.findAll({
    group: ['teamId'],
    attributes: [
      'teamId',
      'fieldIndex',
      [db.sequelize.fn('MAX', 'createdAt'), 'createdAt'],
    ],
    transaction: dbTransaction,
  })
  return parseTeamPositions(result)
}

/**
 * Adds new team position
 * @param {object} position - Team position
 * @param {object} dbTransaction - Database transaction
 * @returns {object}
 */
async function addTeamPosition(position, dbTransaction) {
  const result = await db.TeamPosition.create(position, {
    returning: true,
    transaction: dbTransaction,
  })
  return parseTeamPosition(result)
}


/* PRIVATE PARSING METHODS */
function parseTeamPositions(result) {
  console.log(result)
  // TODO
  return result
}

function parseTeamPosition(result) {
  console.log(result)
  // TODO
  return result
}
