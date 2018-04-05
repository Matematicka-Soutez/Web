const AbstractService = require('./../AbstractService')
const hobbyRepository = require('./../../repositories/hobby')
const enums = require('./../../../../common/enums')

module.exports = class GetAllHobbiesService extends AbstractService {
  schema() {
    return {
      type: 'Object',
      properties: {
        prefix: { type: 'string', required: false },
        typeId: { type: 'integer', required: false, enum: enums.RECORD_IMPORTANCE_TYPE.idsAsEnum },
        limit: { type: 'integer', required: false },
      },
    }
  }

  run() {
    return hobbyRepository.findAll({
      prefix: this.requestData.prefix ? this.requestData.prefix : null,
      recordImportanceTypeId: this.requestData.typeId ? this.requestData.typeId : null,
      limit: this.requestData.limit ? this.requestData.limit : 10,
    })
  }
}
