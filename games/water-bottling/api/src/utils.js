'use strict'

const appErrors = require('../../../../core/errors/application')
const gameEnums = require('../../core/enums')
const gameConfig = require('../../config.json')

const GRID_WIDTH = gameConfig.game.grid.width
const GRID_HEIGHT = gameConfig.game.grid.height
const MAX_POWER = gameConfig.game.grid.maxPower

function getPossibleMoves(position) {
  const moves = []
  if (position.horizontal > 1) {
    moves.push(gameEnums.DIRECTIONS.LEFT.id)
  }
  if (position.horizontal < GRID_WIDTH) {
    moves.push(gameEnums.DIRECTIONS.RIGHT.id)
  }
  if (position.vertical > 1) {
    moves.push(gameEnums.DIRECTIONS.DOWN.id)
  }
  if (position.vertical < GRID_HEIGHT) {
    moves.push(gameEnums.DIRECTIONS.UP.id)
  }
  if (position.power < MAX_POWER) {
    moves.push(gameEnums.DIRECTIONS.ABOVE.id)
  }
  return moves
}

function validatePosition(position) {
  if (position.horizontal < 1 || position.horizontal > GRID_WIDTH) {
    throw new appErrors.CannotBeDoneError('Team can\'t move outside of the grid.')
  }
  if (position.vertical < 1 || position.vertical > GRID_HEIGHT) {
    throw new appErrors.CannotBeDoneError('Team can\'t move outside of the grid.')
  }
  if (position.power > MAX_POWER) {
    throw new appErrors.CannotBeDoneError('Team reached power limit.')
  }
}

module.exports = {
  getPossibleMoves,
  validatePosition,
}
