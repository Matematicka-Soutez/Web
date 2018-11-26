'use strict'

const repository = require('../repository')
const gameConfig = require('../../../config.json')
const AbstractService = require('./../../../../../core/services/AbstractService')

const GRID_WIDTH = gameConfig.game.grid.width
const GRID_HEIGHT = gameConfig.game.grid.height

module.exports = class GetCurrentGridService extends AbstractService {
  async run() {
    const fields = await repository.getGrid(this.competition.id)
    return {
      fields,
      size: {
        width: GRID_WIDTH,
        height: GRID_HEIGHT,
      },
    }
  }
}
