'use strict'

const enumize = require('../../../core/enumize')

const DIRECTIONS = enumize({
  UP: { id: 1, name: 'Nahoru', horizontalChange: 0, verticalChange: 1, powerChange: 0 },
  DOWN: { id: 2, name: 'Dolů', horizontalChange: 0, verticalChange: -1, powerChange: 0 },
  RIGHT: { id: 3, name: 'Doprava', horizontalChange: 1, verticalChange: 0, powerChange: 0 },
  LEFT: { id: 4, name: 'Doleva', horizontalChange: -1, verticalChange: 0, powerChange: 0 },
  ABOVE: { id: 5, name: 'Vylepšit', horizontalChange: 0, verticalChange: 0, powerChange: 1 },
})

module.exports = {
  DIRECTIONS,
}
