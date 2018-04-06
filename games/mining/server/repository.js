const db = require('../../../server/database')
const appErrors = require('../../../server/utils/errors/application')

module.exports = {
  getGrid,
  addPosition,
}

async function getGrid(dbTransaction) {
  const result = await db.TeamPosition.findAll({
    group: ['teamId'],
    attributes: [
      'teamId',
      'fieldIndex',
      [db.sequelize.fn('MAX', 'createdAt'), 'createdAt'],
    ],
    transaction: dbTransaction,
  })
  return parseGrid(result)
}

/**
 * Adds new team position
 * @param {object} position - Team position
 * @param {object} dbTransaction - Database transaction
 * @returns {object}
 */
async function addPosition(position, dbTransaction) {
  const result = await db.TeamPosition.create(position, {
    returning: true,
    transaction: dbTransaction,
  })
  return parsePosition(result)
}


/* PRIVATE PARSING METHODS */
function parseGrid(result) {
  console.log(result)
  // TODO
  return result
}

function parsePosition(result) {
  console.log(result)
  // TODO
  return result
}
