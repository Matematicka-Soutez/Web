require('chai').should()
const traverse = require('traverse')
const nock = require('nock')
const Promise = require('bluebird')

exports.removeCreatedAndUpdatedAt = object => {
  if (!object) {
    throw new Error('Parameter \'object\' is mandatory')
  }
  traverse(object)
    .forEach(function remove(value) {
      if (this.key === 'createdAt' || this.key === 'updatedAt') {
        if (value) {
          delete this.remove()
        }
      }
    })
}
exports.removeStatusUpdatedAt = object => {
  if (!object) {
    throw new Error('Parameter \'object\' is mandatory')
  }
  traverse(object)
    .forEach(function remove(value) {
      if (this.key === 'statusUpdatedAt') {
        if (value) {
          delete this.remove()
        }
      }
    })
}
exports.checkDateRangeValidity = (date, confidence) => {
  if (!date) {
    throw new Error('Parameter \'date\' is mandatory')
  }

  const defConfidence = confidence || 6000

  const dateInMilliseconds = new Date(date).getTime()
  const now = Date.now()

  dateInMilliseconds.should.to.be.below(now + 1)
  dateInMilliseconds.should.to.be.above(now - defConfidence)
}
exports.nockPostAndExpectEmail = (action, expectations) => {
  this.nockPostAndExpect('https://api.sendgrid.com', '/v3/mail/send', true, requestBody => {
    expectations(requestBody)
  }, [], 1)
  return action()
}
exports.cleanAllNocks = () => nock.cleanAll()

exports.addNulls = (target, properties) => {
  properties.forEach(property => {
    target[property] = null
  })
  return target
}

exports.testLatinStringValidation = (test, attributes) => Promise.each(attributes, attribute => test(attribute))
exports.getLatinStringValidationError = () => ({ type: 'BAD_REQUEST', message: 'String must only contain latin characters and possibly basic punctuation.' })
