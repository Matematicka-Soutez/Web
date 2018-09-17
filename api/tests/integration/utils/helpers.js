'use strict'

require('chai').should()
Promise = require('bluebird')
const traverse = require('traverse')
const nock = require('nock')

const removeCreatedAndUpdatedAt = object => {
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

const removeStatusUpdatedAt = object => {
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

const checkDateRangeValidity = (date, confidence) => {
  if (!date) {
    throw new Error('Parameter \'date\' is mandatory')
  }

  const defConfidence = confidence || 6000

  const dateInMilliseconds = new Date(date).getTime()
  const now = Date.now()

  dateInMilliseconds.should.to.be.below(now + 1)
  dateInMilliseconds.should.to.be.above(now - defConfidence)
}

const nockPostAndExpectEmail = (action, expectations) => {
  this.nockPostAndExpect('https://api.sendgrid.com', '/v3/mail/send', true, requestBody => {
    expectations(requestBody)
  }, [], 1)
  return action()
}

const cleanAllNocks = () => nock.cleanAll()

const addNulls = (target, properties) => {
  properties.forEach(property => {
    target[property] = null
  })
  return target
}

function testLatinStringValidation(test, attributes) {
  return Promise.each(attributes, attribute => test(attribute))
}

function getLatinStringValidationError() {
  return {
    type: 'BAD_REQUEST',
    message: 'String must only contain latin characters and possibly basic punctuation.',
  }
}

module.exports = {
  removeCreatedAndUpdatedAt,
  removeStatusUpdatedAt,
  checkDateRangeValidity,
  nockPostAndExpectEmail,
  cleanAllNocks,
  addNulls,
  testLatinStringValidation,
  getLatinStringValidationError,
}
