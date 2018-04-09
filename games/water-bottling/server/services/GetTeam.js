const AbstractService = require('./../../../../server/services/AbstractService')
const repository = require('./../repository')
const enums = require('./../../../../common/enums')

module.exports = class GetTeamService extends AbstractService {
  schema() {
    return {
      type: 'Object',
      properties: {
        teamId: { type: 'integer', required: true, min: 1 },
      },
    }
  }

  run() {
    return repository.findTeamById(this.requestData.teamId)
  }
}
