'use strict'

const gameConfig = require('../../../config')
const { MOVES, PAYOFFS } = require('../../../core/enums')
const { getPlayer } = require('./players')

function simulateRepeatedGame(teamA, teamB, repetitions, mistakeRate) {
  const playerA = getPlayer(teamA.strategy)
  const playerB = getPlayer(teamB.strategy)
  return playRepeatedGame(playerA, playerB, repetitions, mistakeRate)
}

function playRepeatedGame(playerA, playerB, repetitions, mistakeRate) {
  const scores = {
    teamAScore: 0,
    teamBScore: 0,
    payoffs: [],
  }
  for (let i = 0; i < repetitions; i++) {
    const payoff = playOneGame(playerA, playerB, mistakeRate)
    scores.payoffs.push(payoff)
    scores.teamAScore += payoff[0]
    scores.teamBScore += payoff[1]
  }
  return scores
}

function playOneGame(playerA, playerB, mistakeRate) {
  // Make your moves!
  let moveA = playerA.play()
  let moveB = playerB.play()
  // Noise: random mistakes, flip around!
  if (Math.random() < mistakeRate) {
    moveA = moveA === MOVES.COOPERATE.id ? MOVES.CHEAT.id : MOVES.COOPERATE.id
  }
  if (Math.random() < mistakeRate) {
    moveB = moveB === MOVES.COOPERATE.id ? MOVES.CHEAT.id : MOVES.COOPERATE.id
  }
  // Get payoffs
  const payoffs = getPayoffs(moveA, moveB)
  // Remember own & other's moves (or mistakes)
  playerA.remember(moveA, moveB)
  playerB.remember(moveB, moveA)
  // Return the payoffs...
  return payoffs
}

function getPayoffs(moveA, moveB) {
  if (moveA === MOVES.CHEAT.id && moveB === MOVES.CHEAT.id) {
    // Both players cheat, both are punished
    return [PAYOFFS.PUNISHMENT.value, PAYOFFS.PUNISHMENT.value]
  }
  if (moveA === MOVES.COOPERATE.id && moveB === MOVES.CHEAT.id) {
    // First cooperates, second cheats
    return [PAYOFFS.SUCKER.value, PAYOFFS.TEMPTATION.value]
  }
  if (moveA === MOVES.CHEAT.id && moveB === MOVES.COOPERATE.id) {
    // First cheats, second cooperates
    return [PAYOFFS.TEMPTATION.value, PAYOFFS.SUCKER.value]
  }
  if (moveA === MOVES.COOPERATE.id && moveB === MOVES.COOPERATE.id) {
    // Both cooperate, both get rewarded
    return [PAYOFFS.REWARD.value, PAYOFFS.REWARD.value]
  }
  throw new Error('Universe broke, wish something.')
}

function getMistakeRate(tournamentNumber) {
  const mistakeRate = Math.floor(tournamentNumber / 10) / 100
  return gameConfig.game.initialMistakeRate + mistakeRate
}

module.exports = {
  simulateRepeatedGame,
  getMistakeRate,
}
