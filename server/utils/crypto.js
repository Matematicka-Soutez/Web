const Promise = require('bluebird')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const config = require('../../config')

const BEARER_PREFIX = 'Bearer '

module.exports = {

  generateUserAccessToken(userId) {
    const payload = { userId }
    return jwt.sign(payload, config.auth.secret, config.auth.createOptions)
  },

  generateAdminAccessToken(adminId) {
    const payload = { adminId }
    return jwt.sign(payload, config.auth.secret, config.auth.createOptions)
  },

  verifyAccessToken(authToken) {
    const token = authToken.replace(BEARER_PREFIX, '')
    return jwt.verify(token, config.auth.secret, config.auth.verifyOptions)
  },

  hashPassword(password) {
    return bcrypt.hash(pepperify(password), config.auth.saltRounds)
  },

  comparePasswords(plaintext, ciphertext) {
    return bcrypt.compare(pepperify(plaintext), ciphertext)
  },

  async generateResetPasswordToken() {
    const bytes = await Promise.fromCallback(done =>
      crypto.randomBytes(config.auth.resetPasswordTokenLength, done))

    return bytes.toString('hex')
  },

  async generateRandomToken() {
    const bytes = await Promise.fromCallback(done =>
      crypto.randomBytes(32, done))

    return bytes.toString('hex')
  },
}

/**
 * Apply system-configured pepper to any given string
 *
 * @param {String} string The string to pepperify
 * @return {String} SHA-1 hash of the input string with pepper applied
 */
function pepperify(string) {
  return crypto
    .createHmac('sha1', config.auth.secret)
    .update(string)
    .digest('hex')
}
