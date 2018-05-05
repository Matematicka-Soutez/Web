const _ = require('lodash')
const TransactionalService = require('./../../../../server/services/TransactionalService')
const repository = require('./../repository')

module.exports = class ScoreTeamsService extends TransactionalService {
  schema() {
    return {
      type: 'Object',
      properties: {},
    }
  }

  async run() {
    const dbTransaction = await this.createOrGetTransaction()
    const positions = await repository.getCurrentTeamPositions(this.competitionId, dbTransaction)
    const scores = []
    let totalTeamsScored = 0
    positions.forEach(position => {
      const profits = calculateProfits(position.waterFlow, position.teams)
      profits.forEach(profit => scores.push({
        score: profit.score,
        teamId: profit.teamId,
        competitionId: this.competitionId,
      }))
      totalTeamsScored += position.teams.length
    })
    await repository.createTeamScores(scores, dbTransaction)
    this.log('info', `${totalTeamsScored} TEAMS WERE SCORED`)
    return true
  }
}

function calculateProfits(waterFlow, teams) {
  const combinedPower = _.sumBy(teams, 'power')
  return teams.map(team => ({
    teamId: team.id,
    score: (team.power / combinedPower) * waterFlow,
  }))
}
