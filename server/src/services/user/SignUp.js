const TransactionalService = require('./../TransactionalService')
const userRepository = require('./../../repositories/user')
const appErrors = require('./../../utils/errors/application')
const crypto = require('./../../utils/crypto')
const mailer = require('./../../utils/email/mailer')
const validators = require('./../../utils/validators')
const enums = require('./../../../../common/enums')
const time = require('./../../utils/time')

module.exports = class SignUpService extends TransactionalService {
  schema() {
    return {
      type: 'Object',
      properties: {
        email: validators.emailValidator({ required: true }),
        // firstName: validators.validateName({ required: true, maxLength: 40 }),
        // lastName: validators.validateName({ required: true, maxLength: 80 }),
        // dob: { type: 'string', required: true, minLength: 1, maxLength: 40,
        //   // MM-DD-YYYY
        //   pattern: /(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d/ },
        // gender: { type: 'integer', required: true, minimum: 1, enum: enums.GENDER.idsAsEnum },
      },
    }
  }

  async run() {
    const newUser = parseUserFromRequest(this.requestData)
    const transaction = await this.createOrGetTransaction()
    const alreadyExists = await userRepository.findByEmail(newUser.email, transaction)
    if (alreadyExists) {
      throw new appErrors.UserPotentiallyExistsError('token', true)
    }
    newUser.publicToken = await crypto.generateRandomToken()
    newUser.lastLoginAt = new Date().toISOString()
    const createdUser = await userRepository.create(newUser, transaction)
    await mailer.sendInviteEmail({
      toAddress: createdUser.email,
      confirmToken: createdUser.publicToken,
      fullName: `${createdUser.firstName} ${createdUser.lastName}`,
    })
    createdUser.accessToken = await crypto.generateUserAccessToken(createdUser.id)
    return createdUser
  }
}

function parseUserFromRequest(data) {
  return {
    email: data.email.toLowerCase(),
    // firstName: validators.formatName(data.firstName),
    // lastName: validators.formatName(data.lastName),
    // dob: time.dateToISO(data.dob),
    // gender: data.gender,
  }
}
