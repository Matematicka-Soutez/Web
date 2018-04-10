const AbstractService = require('./../../../../server/services/AbstractService')
const repository = require('./../repository')
const gameConfig = require('../../config')

module.exports = class GetCurrentGridService extends AbstractService {
  schema() {
    return {
      type: 'Object',
      properties: {},
    }
  }

  async run() {
    const positions = await repository.findTeamPositions()
    const teams = await repository.findTeams()
    const grid = {
      fields: getFields(teams, positions),
      size: {
        height: gameConfig.height,
        width: gameConfig.width,
      },
    }
    return grid
  }
}

function getFields(teams, positions) {
  console.log(positions)
  return []
}
