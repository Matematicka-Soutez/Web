const db = require('./../database')
const parsers = require('./repositoryParsers')
const appErrors = require('./../utils/errors/application')

module.exports = {
  count,
  findAll,
  findById,
  create,
  update,
  deleteHobby,
}

function count() {
  return db.Hobby.count()
}

async function findAll(options = {}) {
  const where = {}
  if (options.recordImportanceTypeId) {
    where.recordImportanceTypeId = options.recordImportanceTypeId
  }
  if (options.prefix) {
    where.name = { $ilike: `${options.prefix}%` }
  }
  const hobbies = await db.Hobby.findAll({
    where,
    limit: options.limit,
    order: [['name', 'ASC']],
  })
  return parsers.parseHobbies(hobbies)
}

async function findById(id) {
  const hobby = await db.Hobby.findById(id)
  if (!hobby) {
    throw new appErrors.NotFoundError()
  }
  return parsers.parseHobby(hobby)
}

/**
 * Creates hobby
 * @param {object} data - Hobby data
 * @param {object} dbTransaction - Database transaction
 * @returns {object}
 */
async function create(data, dbTransaction) {
  const hobby = await db.Hobby.create(data, {
    returning: true,
    transaction: dbTransaction,
  })
  return parsers.parseHobby(hobby)
}

/**
 * Updates hobby
 * @param {integer} id - Hobby id
 * @param {object} data - Update data for hobby
 * @param {object} dbTransaction - Database transaction
 * @returns {Promise.<object>}
 */
async function update(id, data, dbTransaction) {
  if (!id) {
    throw new Error('Hobby ID is required for update.')
  }
  const result = await db.Hobby.update(data, {
    where: { id },
    transaction: dbTransaction,
    returning: true,
  })
  if (result[0] === 0) {
    throw new appErrors.NotFoundError()
  }
  return parsers.parseHobby(result[1][0].dataValues)
}

/**
 * Deletes hobbies
 * @param {integer} id - Hobby id
 * @param {object} dbTransaction - Database transaction
 * @returns {Promise.<object>}
 */
async function deleteHobby(id, dbTransaction) {
  if (!id) {
    throw new Error('Hobby ID is required for deletion.')
  }
  const destroyed = await db.Properties.destroy({
    where: { id },
    transaction: dbTransaction,
  })
  if (destroyed === 0) {
    throw new appErrors.NotFoundError()
  }
  return destroyed
}
