import { STRATEGIES } from '../../../core/enums'
import friend from '../characters/friend.png'
import cheater from '../characters/cheater.png'
import tft from '../characters/tft.png'
import tf2t from '../characters/tf2t.png'
import hesitant from '../characters/hesitant.png'
import gambler from '../characters/gambler.png'
import avenger from '../characters/avenger.png'
import chessPlayer from '../characters/chessPlayer.png'

export function strategyToImage(strategyId) {
  switch (strategyId) {
    case STRATEGIES.FRIEND.id:
      return friend
    case STRATEGIES.CHEATER.id:
      return cheater
    case STRATEGIES.TFT.id:
      return tft
    case STRATEGIES.TF2T.id:
      return tf2t
    case STRATEGIES.HESITANT.id:
      return hesitant
    case STRATEGIES.GAMBLER.id:
      return gambler
    case STRATEGIES.AVENGER.id:
      return avenger
    case STRATEGIES.CHESS_PLAYER.id:
      return chessPlayer
    default:
      throw new Error('Unknown strategy!')
  }
}
