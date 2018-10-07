'use strict'

const GetAllByCompetitionService = require('../../services/venue/GetAllByCompetition')
const appErrors = require('../../../../core/errors/application')
const responseErrors = require('../../../../core/errors/response')

module.exports = {
  getAllByCompetition,
}

async function getAllByCompetition(ctx) {
  try {
    ctx.body = await new GetAllByCompetitionService(ctx.state).execute({})
  } catch (err) {
    if (err instanceof appErrors.UnauthorizedError || err instanceof appErrors.NotFoundError) {
      throw new responseErrors.UnauthorizedError('Invalid credentials.')
    }
    throw err
  }
}
