const gameConfig = require('../../config')
const AbstractService = require('./../../../../server/services/AbstractService')
const teamRepository = require('./../../../../server/repositories/team')
const repository = require('./../repository')

module.exports = class GetCurrentGridService extends AbstractService {
  schema() {
    return {
      type: 'Object',
      properties: {},
    }
  }

  async run() {
    const positions = await repository.findTeamPositions(this.competitionId)
    const teams = await teamRepository.findTeams()
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
