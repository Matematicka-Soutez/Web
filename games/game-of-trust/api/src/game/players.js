/* eslint-disable max-classes-per-file */
'use strict'

const { MOVES, STRATEGIES } = require('../../../core/enums')

function getPlayer(strategy) {
  switch (strategy) {
    case STRATEGIES.FRIEND.id:
      return new FriendPlayer()
    case STRATEGIES.CHEATER.id:
      return new CheaterPlayer()
    case STRATEGIES.TFT.id:
      return new TftPlayer()
    case STRATEGIES.TF2T.id:
      return new Tf2tPlayer()
    case STRATEGIES.HESITANT.id:
      return new HesitantPlayer()
    case STRATEGIES.GAMBLER.id:
      return new GamblerPlayer()
    case STRATEGIES.AVENGER.id:
      return new AvengerPlayer()
    case STRATEGIES.CHESS_PLAYER.id:
      return new ChessPlayer()
    default:
      throw new Error('Unknown strategy!')
  }
}

class FriendPlayer {
  play() {
    return MOVES.COOPERATE.id
  }

  remember() {}
}

class CheaterPlayer {
  play() {
    return MOVES.CHEAT.id
  }

  remember() {}
}

class TftPlayer {
  constructor() {
    this.lastOpponentsMove = MOVES.COOPERATE.id
  }

  play() {
    return this.lastOpponentsMove
  }

  remember(ownMove, opponentsMove) {
    this.lastOpponentsMove = opponentsMove
  }
}

class Tf2tPlayer {
  constructor() {
    this.howManyTimesCheated = 0
  }

  play() {
    // retaliate ONLY after two betrayals
    if (this.howManyTimesCheated >= 2) {
      return MOVES.CHEAT.id
    }
    return MOVES.COOPERATE.id
  }

  remember(ownMove, opponentsMove) {
    if (opponentsMove === MOVES.CHEAT.id) {
      this.howManyTimesCheated++
    } else {
      this.howManyTimesCheated = 0
    }
  }
}

class HesitantPlayer {
  constructor() {
    this.nextMove = MOVES.COOPERATE.id
  }

  play() {
    return this.nextMove
  }

  remember(ownMove, opponentsMove) {
    if (opponentsMove === MOVES.CHEAT.id) {
      this.nextMove = ownMove === MOVES.COOPERATE.id
        ? MOVES.CHEAT.id
        : MOVES.COOPERATE.id
    }
  }
}

class GamblerPlayer {
  play() {
    return Math.random() > 0.5
      ? MOVES.COOPERATE.id
      : MOVES.CHEAT.id
  }

  remember() {}
}

class AvengerPlayer {
  constructor() {
    this.opponentEverCheated = false
  }

  play() {
    return this.opponentEverCheated
      ? MOVES.CHEAT.id
      : MOVES.COOPERATE.id
  }

  remember(ownMove, opponentsMove) {
    if (opponentsMove === MOVES.CHEAT.id) {
      this.opponentEverCheated = true
    }
  }
}

class ChessPlayer {
  constructor() {
    this.lastMove = MOVES.COOPERATE.id
  }

  play() {
    // Switch move every round
    return this.lastMove === MOVES.COOPERATE.id
      ? MOVES.CHEAT.id
      : MOVES.COOPERATE.id
  }

  remember(ownMove) {
    this.lastMove = ownMove
  }
}

module.exports = {
  getPlayer,
}
