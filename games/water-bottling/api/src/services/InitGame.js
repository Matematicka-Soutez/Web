'use strict'

const _ = require('lodash')
const repository = require('../repository')
const gameConfig = require('../../../config.json')
const appErrors = require('../../../../../core/errors/application')
const TransactionalService = require('./../../../../../core/services/TransactionalService')
const venueRepository = require('./../../../../../api/src/repositories/venue')

const WATER_FLOWS = gameConfig.game.grid.waterFlows
const GRID_WIDTH = gameConfig.game.grid.width
const GRID_HEIGHT = gameConfig.game.grid.height
const START_POSITION = gameConfig.game.grid.startPosition

module.exports = class InitGameService extends TransactionalService {
  schema() {
    return {
      type: 'Object',
      properties: {
        organizerId: { type: 'integer', required: true, min: 1 },
      },
    }
  }

  async run() {
    const dbTransaction = await this.createOrGetTransaction()
    const grid = generateGridFromConfig(this.competition.id)
    const venues = await venueRepository.findCompetitionVenues(this.competition.id, dbTransaction)
    const teams = _.filter(
      _.flatten(_.map(venues, 'teams')),
      ['arrived', true],
    )
    const initialPositions = generatePositionsFromConfig(
      this.competition.id,
      teams,
      this.data.organizerId,
    )
    await repository.clearGameData(this.competition.id, dbTransaction)
    await Promise.all([
      repository.createGrid(grid, dbTransaction),
      repository.createTeamPositions(initialPositions, dbTransaction),
    ])
    return {
      result: 'Initialization successfull.',
      teamsEnroled: teams.length,
    }
  }
}

function generateGridFromConfig(competitionId) {
  if (WATER_FLOWS.length !== GRID_HEIGHT) {
    throw new appErrors.ValidationError('Inconsistent grid height.')
  }
  const grid = WATER_FLOWS.map((row, verticalIndex) => {
    if (row.length !== GRID_WIDTH) {
      throw new appErrors.ValidationError('Inconsistent grid width.')
    }
    return row.map((waterFlow, horizontalIndex) => ({
      horizontal: horizontalIndex + 1,
      vertical: GRID_HEIGHT - verticalIndex,
      waterFlow,
      competitionId,
    }))
  })
  return _.flatten(grid)
}

function generatePositionsFromConfig(competitionId, teams, organizerId) {
  return teams.map(team => _.assign({}, START_POSITION, {
    competitionId,
    organizerId,
    teamId: team.id,
  }))
}
