'use strict'

const jsonschema = require('jsonschema')
const moment = require('moment')
const _ = require('lodash')
const validationUtils = require('../../../core/validation')
const appErrors = require('../../../core/errors/application')


jsonschema.Validator.prototype.customFormats.latinString = input => validateLatinString(input)
jsonschema.Validator.prototype.customFormats.NAME = function NAME(input) {
  const numbers = validationUtils.numberInString(input)
  const latinCharacters = validationUtils.isLatinString(input)
  const characters = validationUtils.containsSpecialCharacter(input)
  return numbers.valid && latinCharacters.valid && characters.valid
}

/**
 * Validates email address according to W3C standard.
 * Refer to: https://www.w3.org/TR/html5/forms.html#valid-e-mail-address
 * @param {Object} options Default jsonschema options
 * @returns {Object} Decorated jsonschema options
 */
function emailValidator(options) {
  if (!options) {
    options = {}
  }
  if (!options.type) {
    options.type = ['string', 'null']
  }
  options.minLength = 1
  options.maxLength = 80
  options.pattern = /^[-a-z0-9~!$%^&*_=+}{'?]+(\.[-a-z0-9~!$%^&*_=+}{'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/iu // eslint-disable-line max-len
  return options
}

function passwordValidator(options) {
  if (!options) {
    options = {}
  }
  options.type = 'string'
  options.minLength = 8
  options.maxLength = 256
  return options
}

function advancePasswordValidation(value) {
  const lowerCasePatt = /^(?=.*[a-z]).+$/u
  const upperCasePatt = /^(?=.*[A-Z]).+$/u
  const digitPatt = /^(?=.*\d).+$/u
  const specialPatt = /^(?=.*[_\W]).+$/u

  if (!(lowerCasePatt.test(value) && upperCasePatt.test(value))
    || !(digitPatt.test(value) || specialPatt.test(value))
    || (value.length < 8)
  ) {
    throw new appErrors.PasswordWrongFormat()
  }
}

const addressProperties = {
  street: { type: 'string', format: 'latinString', required: true, minLength: 1, maxLength: 256 },
  city: { type: 'string', format: 'latinString', required: true, minLength: 1, maxLength: 256 },
  zip: { type: 'string', format: 'latinString', required: true, minLength: 1 },
  countryId: { type: 'number', required: true, minimum: 1 },
  stateId: { type: ['number', 'null'], required: false, minimum: 1 },
}

const requiredAddressSchema = {
  id: '/requiredAddress',
  type: 'Object',
  required: true,
  additionalProperties: false,
  not: { type: 'null' },
  properties: addressProperties,
}

const optionalAddressSchema = {
  id: '/optionalAddress',
  type: 'Object',
  required: false,
  additionalProperties: false,
  properties: addressProperties,
}

function validate(inputData, schema) {
  const validator = new jsonschema.Validator()
  validator.addSchema(requiredAddressSchema, '/requiredAddress')
  validator.addSchema(optionalAddressSchema, '/optionalAddress')
  return validator.validate(inputData, schema)
}

function formatName(originalName) {
  if (!originalName) {
    throw new Error('Function expects string parameter name')
  }
  const trimmed = originalName.trim()
  if (
    !validationUtils.allLowercase(trimmed).valid
    || !validationUtils.allUppercase(trimmed).valid
  ) {
    return trimmed.split(' ').map(part => _.capitalize(part)).join(' ')
  }
  return trimmed
}

function parseDob(dob) {
  if (!dob) {
    throw new Error('Parameter \'dob\' is mandatory.')
  }
  if (moment.utc(dob, 'MM-DD-YYYY').isValid() === false) {
    throw new appErrors.ValidationError('Datum narození není platné.')
  }
  return new Date(moment.utc(dob, 'MM-DD-YYYY').format())
}

function validateName(options) {
  if (!options) {
    options = {}
  }
  if (!options.type) {
    options.type = 'string'
  }
  options.format = 'NAME'
  options.minLength = 1
  return options
}

function emailValidatorNullAble(options) {
  if (!options) {
    options = {}
  }
  options.type = ['string', null]
  return emailValidator(options)
}

function validateLatinString(string) {
  const result = validationUtils.isLatinString(string)
  if (!result.valid) {
    throw new appErrors.ValidationError(result.message)
  }
  return result.valid
}

module.exports = {
  emailValidator,
  passwordValidator,
  advancePasswordValidation,
  validate,
  formatName,
  parseDob,
  validateName,
  emailValidatorNullAble,
}
