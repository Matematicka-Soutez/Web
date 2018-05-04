const AbstractService = require('./../../../../server/services/AbstractService')
const repository = require('./../repository')

module.exports = class GetCurrentGridService extends AbstractService {
  schema() {
    return {
      type: 'Object',
      properties: {},
    }
  }

  run() {
    return repository.getGrid(this.competitionId)
  }
}
