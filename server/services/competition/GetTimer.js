const moment = require('moment')
const AbstractService = require('./../AbstractService')
const competitionRepository = require('./../../repositories/competition')

module.exports = class GetTimerService extends AbstractService {
  schema() {
    return {
      type: 'Object',
      properties: {},
    }
  }

  async run() {
    const competition = await competitionRepository.findById(this.competitionId)
    const now = moment()
    return {
      start: moment(competition.start).diff(now),
      end: moment(competition.end).diff(now),
    }
  }
}
