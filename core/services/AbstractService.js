'use strict'

const shortId = require('shortid')
const traverse = require('traverse')
const _ = require('lodash')
const appErrors = require('../errors/application')
const logger = require('../logger').serviceLogger
const config = require('../../config')
const validators = require('../../api/src/utils/validators')

let newrelic
if (config.newRelic.licenseKey) {
  newrelic = require('newrelic') // eslint-disable-line global-require
}

const sensitiveAttributes = ['password']

module.exports = class AbstractService {
  constructor(state = {}) {
    this.uuid = shortId.generate()
    this.competition = state.competition
  }

  async execute(inputData) {
    this.startTime = Date.now()
    const payload = JSON.stringify(removeSensitiveAttributes(inputData, sensitiveAttributes))
    this.log('info', `START EXECUTING... with payload: ${payload}`)
    try {
      inputData = prepareInput(inputData)
      if (this.schema && typeof this.schema === 'function') {
        const schema = this.schema()
        if (typeof schema === 'object') {
          schema.additionalProperties = false
          const validationErrors = validators.validate(inputData, schema).errors
          if (validationErrors.length > 0) {
            logger.info(validationErrors)
            throw new appErrors.ValidationError()
          }
          this.data = inputData
        } else {
          return new Error('Method \'schema\' does not return an object')
        }
      }
      if (!this.run || typeof this.run !== 'function') {
        return new Error('Method \'run\' is not implemented')
      }
      const result = await this.run()
      await this.done()
      return result
    } catch (err) {
      // If error shouldn't have happened, log it in newrelic
      if (!err.isOperational && newrelic) {
        newrelic.noticeError(err)
      }
      // Log all errors in log entries
      this.log('error', `CATCH ERROR ${err.type ? err.type : 'UnknownError'}`)
      // Pass it upwards
      throw err
    }
  }

  log(type, text) {
    logger[type](`${this.uuid}(${this.constructor.name}) - ${text} (${Date.now() - this.startTime} ms)`) // eslint-disable-line max-len
  }

  done() {
    this.log('info', 'DONE')
  }
}

function prepareInput(inputData) {
  traverse(inputData)
    .forEach(function trim(value) {
      if (typeof value === 'string') {
        const trimed = value.trim()
        this.update(trimed || null)
      }
    })
  return inputData
}

function removeSensitiveAttributes(inputData, excludes) {
  if (!inputData || !excludes || excludes.length <= 0) {
    return inputData
  }
  const clonedData = _.cloneDeep(inputData)
  traverse(clonedData)
    .forEach(function exclude() {
      if (excludes.find(item => item === this.key)) {
        this.remove()
      }
    })
  return clonedData
}
