'use strict'

Promise = require('bluebird')
const logger = require('../logger').serviceLogger
const db = require('../../api/src/database')
const AbstractService = require('./AbstractService')

module.exports = class TransactionalService extends AbstractService {
  constructor(options) {
    super(options)
    if (
      (options instanceof TransactionalService || options instanceof Object)
      && options.transaction
    ) {
      this.setTransactionOwnerToParentService(options)
    } else {
      this.setTransactionOwnerToThisService()
      logger.info(`Missing options when creating transactional service UUID: ${this.uuid}`)
    }
  }

  async execute(inputData) {
    try {
      return await super.execute(inputData)
    } catch (err) {
      await this.rollback()
      throw err
    }
  }

  setTransactionOwnerToParentService(instanceOrOption) {
    this.transaction = instanceOrOption.transaction
    this.transactionHandled = false
    this.isOwnerOfTransacion = false
  }

  setTransactionOwnerToThisService() {
    this.transactionHandled = true
    this.isOwnerOfTransacion = true
  }

  commit() {
    if (!this.transactionHandled && this.isOwnerOfTransacion === true) {
      this.transactionHandled = true
      this.log('info', 'TRANSACTION COMMITTED...')
      return this.transaction.commit()
    }
    return Promise.resolve()
  }

  rollback() {
    if (!this.transactionHandled && this.isOwnerOfTransacion === true) {
      this.transactionHandled = true
      this.log('info', 'TRANSACTION ROLLED BACK...')
      return this.transaction.rollback()
    }
    return Promise.resolve()
  }

  createOrGetTransaction() {
    if (this.transaction) {
      this.log('info', 'EXISTING TRANSACTION RETURNED...')
      return Promise.resolve(this.transaction)
    }
    this.log('info', 'TRANSACTION CREATED...')
    this.transactionHandled = false
    return db.sequelize.transaction({ autocommit: false })
      .then(transaction => {
        this.transaction = transaction
        return transaction
      })
  }

  done() {
    return this.commit()
      .then(() => super.done())
  }
}
