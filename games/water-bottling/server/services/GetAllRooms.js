const AbstractService = require('./../../../../server/services/AbstractService')
const repository = require('./../repository')

module.exports = class GetAllRoomsService extends AbstractService {
  schema() {
    return {
      type: 'Object',
      properties: {},
    }
  }

  run() {
    return repository.findAllRooms()
  }
}
