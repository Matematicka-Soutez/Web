const AbstractService = require('./../../../../server/services/AbstractService')
const repository = require('./../repository')

module.exports = class GetRoomService extends AbstractService {
  schema() {
    return {
      type: 'Object',
      properties: {
        roomId: { type: 'integer', required: true, min: 1 },
      },
    }
  }

  run() {
    return repository.findRoomById(this.requestData.roomId)
  }
}
