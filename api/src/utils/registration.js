'use strict'

const moment = require('moment')
const appErrors = require('../../../core/errors/application')

function checkCompetitionVenueRequirements(competition, competitionVenue, options = {}) {
  if (!competitionVenue || competitionVenue.competitionId !== competition.id) {
    throw new appErrors.CannotBeDoneError('Do tohoto soutěžního místa tým nelze přihlásit.')
  }
  if (!options.isUpdate && competitionVenue.capacity <= (competitionVenue.teams || []).length) {
    const message = 'Omlouváme se, kapacita soutěžního místa již byla zaplněna.'
    throw new appErrors.CannotBeDoneError(message)
  }
}

function checkRegistrationRoundRequirements(competition, school) {
  const round = getCurrentRegistrationRound(competition)
  if (round.teamLimit === 0) {
    throw new appErrors.CannotBeDoneError('Registrace je momentálně uzavřena.')
  }
  if (school.teams && school.teams.length >= round.teamLimit) {
    const amount = teamAmount(round.teamLimit)
    const message = `V tuto chvíli nemůžete registrovat více než ${amount} z jedné školy.`
    throw new appErrors.CannotBeDoneError(message)
  }
}

function getCurrentRegistrationRound(competition) {
  const now = moment()
  if (now.isBefore(competition.registrationRound1)) {
    return { number: 0, teamLimit: 0 }
  }
  if (now.isBefore(competition.registrationRound2)) {
    return { number: 1, teamLimit: 1 }
  }
  if (now.isBefore(competition.registrationRound3)) {
    return { number: 2, teamLimit: 2 }
  }
  if (now.isBefore(competition.registrationEnd)) {
    return { number: 3, teamLimit: 3 }
  }
  return { number: 4, teamLimit: 0 }
}

function getRegistrationRounds(competition) {
  const now = moment()
  return [
    { number: 0, teamLimit: 0, remainingTime: -now.diff(competition.registrationRound1) },
    { number: 1, teamLimit: 1, remainingTime: -now.diff(competition.registrationRound2) },
    { number: 2, teamLimit: 2, remainingTime: -now.diff(competition.registrationRound3) },
    { number: 3, teamLimit: 3, remainingTime: -now.diff(competition.registrationEnd) },
    { number: 4, teamLimit: 0, remainingTime: 4242424242 },
  ]
}

function teamAmount(amount) {
  switch (amount) {
    case 1:
      return 'jeden tým'
    case 2:
      return 'dva týmy'
    case 3:
      return 'tři týmy'
    case 4:
      return 'čtyři týmy'
    default:
      return `${amount} týmů`
  }
}

module.exports = {
  checkCompetitionVenueRequirements,
  checkRegistrationRoundRequirements,
  getCurrentRegistrationRound,
  getRegistrationRounds,
}
