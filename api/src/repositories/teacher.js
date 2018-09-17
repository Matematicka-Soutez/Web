'use strict'

const appErrors = require('../../../core/errors/application')
const db = require('./../database')
const parsers = require('./repositoryParsers')

async function create(user, dbTransaction) {
  const createdUser = await db.User.create(user, { transaction: dbTransaction })
  return parsers.parseUser(createdUser)
}

function count() {
  return db.User.count()
}

async function findByEmail(email, dbTransaction) {
  const user = await db.User.findOne({
    include: [{
      model: db.Address,
      as: 'address',
      required: false,
    }],
    where: db.sequelize.where(
      db.sequelize.fn('lower', db.sequelize.col('email')),
      db.sequelize.fn('lower', email),
    ),
    transaction: dbTransaction,
  })
  return parsers.parseUser(user)
}

async function findById(id, transaction, options = {}) {
  const findOptions = { transaction }
  if (options.includeAddress) {
    findOptions.include = [{
      model: db.Address,
      as: 'address',
      attributes: ['id', 'countryId'],
    }]
  }
  const user = await db.User.findById(id, findOptions)
  if (!user) {
    throw new appErrors.NotFoundError()
  }
  return parsers.parseUser(user)
}

async function findByIdAndAccessToken(id, token, requiredToken, transaction) {
  if (!id || !token || typeof requiredToken !== 'boolean') {
    throw new Error('Missing userId or token in findByIdAndToken')
  }
  const user = await db.User.findById(id, {
    include: [{
      model: db.AccessToken,
      as: 'accessTokens',
      required: requiredToken,
      where: {
        token,
      },
    }],
    transaction,
  })
  if (!user) {
    throw new appErrors.NotFoundError()
  }
  return parsers.parseUser(user)
}

async function getPersonalInfo(id, dbTransaction) {
  const user = await db.User.findById(id, {
    attributes: {
      exclude: ['password', 'publicToken', 'passwordPublicToken', 'passwordLastUpdatedAt'],
    },
    include: [
      { model: db.Address, as: 'address' },
    ],
    transaction: dbTransaction,
  })
  if (!user) {
    throw new appErrors.NotFoundError()
  }
  return parsers.parseUser(user)
}

async function findByToken(token, options, transaction) {
  const findOptions = {
    transaction,
  }

  if (options && options.passwordToken) {
    findOptions.where = { passwordPublicToken: token }
  } else if (options && options.duplicateResetPasswordToken) {
    findOptions.where = { duplicateResetPasswordToken: token }
  } else {
    findOptions.where = { publicToken: token }
  }
  const user = await db.User.findOne(findOptions)
  if (!user) {
    throw new appErrors.InvalidTokenError()
  }
  return parsers.parseUser(user)
}

async function update(id, values, transaction) {
  if (!id || isNaN(id)) {
    throw new Error('Parameter \'id\' is mandatory and required number type.')
  }
  const results = await db.User.update(values, {
    where: { id },
    returning: true,
    transaction,
  })
  if (results[0] === 0) {
    throw new appErrors.NotFoundError()
  }
  const updatedUser = results[1][0].dataValues
  return parsers.parseUser(updatedUser)
}

async function findAllWithFilter(filter, offset, limit) {
  const query = {
    offset,
    limit,
    attributes: { exclude: ['password', 'passwordPublicToken', 'publicToken'] },
    order: [['createdAt', 'DESC']],
  }
  const userWhere = {}
  if (filter.user.firstName) {
    userWhere.firstName = { [db.sequelize.Op.iLike]: `%${filter.user.firstName}%` }
  }
  if (filter.user.lastName) {
    userWhere.lastName = { [db.sequelize.Op.iLike]: `%${filter.user.lastName}%` }
  }
  if (filter.user.email) {
    userWhere.email = { [db.sequelize.Op.iLike]: `%${filter.user.email}%` }
  }
  if (filter.user.id) {
    userWhere.id = filter.user.id
  }
  query.where = userWhere

  const users = await db.User.findAll(query)
  return parsers.parseUsers(users)
}

async function changeEmail(userId, email, dbTransaction) {
  const user = await db.User.update({ email }, {
    where: { id: userId },
    transaction: dbTransaction,
    returning: true,
  })
  return parsers.parseUser(user)
}

module.exports = {
  create,
  count,
  findByEmail,
  findById,
  findByIdAndAccessToken,
  getPersonalInfo,
  findByToken,
  update,
  findAllWithFilter,
  changeEmail,
}
