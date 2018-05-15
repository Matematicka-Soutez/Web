const AbstractService = require('./../../../../server/services/AbstractService')
const repository = require('./../repository')

module.exports = class GetCurrentGridService extends AbstractService {
  schema() {
    return {
      type: 'Object',
      properties: {},
    }
  }

  async run() {
    const results = await repository.getResults(this.competitionId)
    return results
  }
}
