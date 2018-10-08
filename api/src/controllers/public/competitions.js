'use strict'

const GetTimerService = require('../../services/competition/GetTimer')
const GetTeamsByVenueService = require('../../services/competition/GetTeamsByVenue')
const GetSchoolRegistrationsService = require('../../services/competition/GetSchoolRegistrations')
const RegisterSchoolTeamService = require('../../services/competition/RegisterSchoolTeam')
const appErrors = require('../../../../core/errors/application')
const responseErrors = require('../../../../core/errors/response')

async function getTimer(ctx) {
  try {
    ctx.body = await new GetTimerService(ctx.state).execute({})
  } catch (err) {
    if (err instanceof appErrors.NotFoundError) {
      throw new responseErrors.BadRequestError('Soutěž nebyla nalezena.')
    }
    throw err
  }
}

async function getTeams(ctx) {
  try {
    ctx.body = await new GetTeamsByVenueService(ctx.state).execute({})
  } catch (err) {
    if (err instanceof appErrors.NotFoundError) {
      throw new responseErrors.BadRequestError('Soutěž nebyla nalezena.')
    }
    throw err
  }
}

async function getSchoolRegistrations(ctx) {
  try {
    ctx.body = await new GetSchoolRegistrationsService(ctx.state).execute({
      schoolToken: ctx.params.schoolToken,
    })
  } catch (err) {
    if (err instanceof appErrors.NotFoundError) {
      throw new responseErrors.BadRequestError('Škola nebyla nalezena.')
    }
    throw err
  }
}

async function registerSchoolTeam(ctx) {
  try {
    ctx.body = await new RegisterSchoolTeamService(ctx.state).execute({
      schoolToken: ctx.params.schoolToken,
      teamName: ctx.request.body.teamName,
      competitionVenueId: parseInt(ctx.request.body.competitionVenueId),
      members: ctx.request.body.members.map(member => ({
        firstName: member.firstName,
        lastName: member.lastName,
        grade: parseInt(member.grade),
      })),
    })
  } catch (err) {
    if (err instanceof appErrors.NotFoundError) {
      throw new responseErrors.BadRequestError('Škola nebyla nalezena.')
    }
    if (err instanceof appErrors.CannotBeDoneError) {
      throw new responseErrors.ConflictError(err.message)
    }
    throw err
  }
}

module.exports = {
  getTimer,
  getTeams,
  getSchoolRegistrations,
  registerSchoolTeam,
}
