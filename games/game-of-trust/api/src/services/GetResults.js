'use strict'

const repository = require('../repository')
const AbstractService = require('./../../../../../core/services/AbstractService')

module.exports = class GetResultsService extends AbstractService {
  async run() {
    const results = await repository.getResults(this.competition.id)
    return results
  }
}
