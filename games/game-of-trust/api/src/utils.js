'use strict'

const moment = require('moment')
const appErrors = require('../../../../core/errors/application')
const gameConfig = require('../../config')
const gameEnums = require('../../core/enums')

function getPossibleChanges(strategy) {
  return gameEnums.STRATEGIES.idsAsEnum.filter(id => id !== strategy.strategy)
}

function validateStrategy(strategy) {
  if (!gameEnums.STRATEGIES.idsAsEnum.includes(strategy.strategy)) {
    throw new appErrors.CannotBeDoneError('Unknown strategy.')
  }
}

function median(values) {
  const sorted = values.sort((a, b) => a - b) // eslint-disable-line id-length, max-len
  if (sorted.length % 2 === 1) {
    return values[values.length >> 1]
  }
  // In case of even number of elements return the lover middle one
  return values[(values.length - 1) >> 1]
}

function addRemainingTime(tournament) {
  tournament.remainingTime = tournament.number >= gameConfig.game.lastTournamentNumber
    ? -42000
    : moment().endOf('minute').diff(moment())
  return tournament
}

module.exports = {
  getPossibleChanges,
  validateStrategy,
  median,
  addRemainingTime,
}
