const AbstractService = require('./../../../../server/services/AbstractService')
const repository = require('./../repository')
const gameConfig = require('./../../config.json')

const GRID_WIDTH = gameConfig.game.grid.width
const GRID_HEIGHT = gameConfig.game.grid.height

module.exports = class GetCurrentGridService extends AbstractService {
  schema() {
    return {
      type: 'Object',
      properties: {},
    }
  }

  async run() {
    const fields = await repository.getGrid(this.competitionId)
    return {
      fields,
      size: {
        width: GRID_WIDTH,
        height: GRID_HEIGHT,
      },
    }
  }
}
