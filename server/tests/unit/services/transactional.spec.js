const TransactionalService = require('../../../src/services/TransactionalService')

require('chai').should()

describe('Transact service', () => {
  it('should throw error when getExisting transaction is called before create transaction', () => {
    const TestService = class extends TransactionalService {
      schema() {
        return {
          type: 'Object', required: true, additionalProperties: false,
          properties: {
            data: { type: 'string', required: true },
          },
        }
      }

      run() {
        this.getExistingTransaction()
      }
    }
    const service = new TestService()
    const stubData = { data: 'input data' }
    return service.execute(stubData)
      .catch(err => {
        err.message.should.be.equal('Method \'getExistingTransaction\' can be called only after \'createOrGetTransaction\'')
      })
  })
})
