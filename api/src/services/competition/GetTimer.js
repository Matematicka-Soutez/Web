'use strict'

const moment = require('moment')
const AbstractService = require('../../../../core/services/AbstractService')

module.exports = class GetTimerService extends AbstractService {
  schema() {
    return {
      type: 'Object',
      properties: {},
    }
  }

  run() {
    const now = moment()
    return {
      start: moment(this.competition.start).diff(now),
      end: moment(this.competition.end).diff(now),
    }
  }
}
