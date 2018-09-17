'use strict'

const _ = require('lodash')

function isLatinString(str) {
  return (_.isString(str) && /^([\u0000-\u024F]|[\u2000-\u206F])*$/u.test(str)) || _.isNil(str) // eslint-disable-line no-control-regex, max-len
    ? { valid: true }
    : { valid: false, message: 'api.errors.notALatinString' }
}

function numberInString(string, formatMessage = null, messages = null) {
  const validResponse = { valid: true }

  if (!string) {
    return validResponse
  }

  return /\d/u.test(string)
    ? {
      valid: false,
      message: formatMessage && messages
        ? formatMessage(messages.numbersForbiddenError)
        : 'Must not contain numbers',
    }
    : validResponse
}

function containsSpecialCharacter(string, formatMessage = null, messages = null) {
  const validResponse = { valid: true }
  if (!string) {
    return validResponse
  }

  if (string.match(/^[',.-]+$/u)) {
    return {
      valid: false,
      message: formatMessage && messages
        ? formatMessage(messages.specialCharactersAllowedError)
        : 'Must not consist solely from: \', . and -',
    }
  }

  const matches = string.match(/[$&§+:;_`~±\\/{}=?@#|<>^()[\]*"%!]/gu)
  if (matches) {
    const invalidCharacters = _.uniq(matches)
    const invalidCharactersString = invalidCharacters.join(', ')
    const characterSingular = 'character'
    const characterPlural = 'characters'
    const character = invalidCharacters.length === 1 ? characterSingular : characterPlural

    return {
      valid: false,
      message: formatMessage && messages
        ? formatMessage(messages.specialCharactersForbiddenError, {
          character,
          invalidCharacters: invalidCharactersString,
        })
        : `Must not contain ${character}: ${invalidCharactersString}`,
    }
  }

  return validResponse
}

function allUppercase(string, formatMessage = null, messages = null) {
  const validResponse = { valid: true }
  if (!string) {
    return validResponse
  }

  return /^[A-Z\s.\-']+$/u.test(string)
    ? {
      valid: false,
      message: formatMessage && messages
        ? formatMessage(messages.uppercaseError)
        : 'Must not be all uppercase',
    }
    : validResponse
}

function allLowercase(string, formatMessage = null, messages = null) {
  const validResponse = { valid: true }
  if (!string) {
    return validResponse
  }

  return /^[a-z\s.\-']+$/u.test(string)
    ? {
      valid: false,
      message: formatMessage && messages
        ? formatMessage(messages.lowercaseError)
        : 'Must not be all lowercase',
    }
    : validResponse
}

module.exports = {
  isLatinString,
  numberInString,
  containsSpecialCharacter,
  allUppercase,
  allLowercase,
}
