'use strict'

const repository = require('../repository')
const AbstractService = require('./../../../../../core/services/AbstractService')

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
