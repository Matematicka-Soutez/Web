'use strict'

const enumize = require('../../../core/enumize')

const STRATEGIES = enumize({
  FRIEND: { id: 1, name: 'Kamarád', color: '#FF75FF' },
  CHEATER: { id: 2, name: 'Podvodník', color: '#52537F' },
  TFT: { id: 3, name: 'Opičák', color: '#4089DD' },
  TF2T: { id: 4, name: 'Sluníčkář', color: '#A8D0FF' },
  HESITANT: { id: 5, name: 'Váhavec', color: '#9FE856' },
  GAMBLER: { id: 6, name: 'Gambler', color: '#FF5E5E' },
  AVENGER: { id: 7, name: 'Mstitel', color: '#FFD600' },
  CHESS_PLAYER: { id: 8, name: 'Šachista', color: '#FFBF5F' },
})

const PAYOFFS = enumize({
  PUNISHMENT: { id: 1, name: 'nikdo nic nezíská', value: 0 },
  SUCKER: { id: 2, name: 'ty vhodíš minci, oponent ne', value: -1 },
  REWARD: { id: 3, name: 'oba vhodíte minci, oba dostanete 4 zpět', value: 3 },
  TEMPTATION: { id: 4, name: 'nevhodíš minci, i tak 4 dostaneš', value: 4 },
})

const MOVES = enumize({
  COOPERATE: { id: 1, name: 'spolupracuj' },
  CHEAT: { id: 2, name: 'podveď' },
})

module.exports = {
  STRATEGIES,
  PAYOFFS,
  MOVES,
}
