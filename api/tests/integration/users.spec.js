'use strict'

// const should = require('chai').should()
const request = require('supertest')
// const moment = require('moment')
const _ = require('lodash')
const initDb = require('../data/init')
const db = require('./../../src/database')
// const login = require('./utils/login').loginUser
// const enums = require('./../../core/enums')
// const crypto = require('./../../api/utils/crypto')
const helpers = require('./utils/helpers')

describe('User API endpoints: /api/users', function userAPI() {
  before(function() {
    this.timeout(5000)
  })

  describe('SignUp: /api/organizers', function signup() {
    before(async function() {
      this.data = await initDb()
    })

    it('FAIL 400 - invalid email', function invalidEmail() {
      const newcomer = _.cloneDeep(this.data.organizers.newcomer)
      newcomer.email = 'fake_mail'
      return request(this.server)
        .post('/api/organizers')
        .send(newcomer)
        .expect('Content-Type', /json/u)
        .expect(400, { message: 'Požadavek postrádá nebo obsahuje neplatná data.', type: 'BAD_REQUEST' })
    })

    it('SUCCESS 201 - create user', async function createUser() {
      // Expectations
      const expectedResponse = _.cloneDeep(this.data.organizers.newcomer)
      expectedResponse.confirmed = false
      delete expectedResponse.password
      delete expectedResponse.problemScanningToken
      // Action
      const payload = _.cloneDeep(this.data.organizers.newcomer)
      const res = await request(this.server)
        .post('/api/organizers')
        .send(payload)
        .expect('Content-Type', /json/u)
        .expect(201)
      // Validation
      expectedResponse.accessToken = res.body.accessToken
      expectedResponse.id = res.body.id
      res.body.should.be.deep.equal(expectedResponse)
      const user = await db.Organizer.find({ where: { email: this.data.organizers.newcomer.email } })
      helpers.checkDateRangeValidity(user.lastLoginAt)
    })

    it('FAIL 409 - users email already exists', async function existingEmail() {
      // Expectations
      const conflictError = {
        type: 'CONFLICT',
        message: { duplicate: true, emailExists: true },
      }
      // Action
      const payload = _.cloneDeep(this.data.organizers.newcomer)
      const res = await request(this.server)
        .post('/api/organizers')
        .send(payload)
        .expect('Content-Type', /json/u)
        .expect(409)
      // Validation
      conflictError.message.duplicateResetPasswordToken = res.body.message.duplicateResetPasswordToken
      res.body.should.be.deep.equal(conflictError)
      // const user = await db.User.findOne({ where: { duplicateResetPasswordToken: res.body.message.duplicateResetPasswordToken } })
      // TODO user.email.should.equals(this.data.users.newcomer.email.toLowerCase())
    })

    // it('should respond with 409 when users email, phone and first name combination exists', function test() {
    //   return request(this.app)
    //     .post('/api/users')
    //     .send(duplicateUserPayload)
    //     .expect('Content-Type', /json/)
    //     .expect(409)
    //     .then(res => {
    //       this.conflictError.message.emailExists = true
    //       this.conflictError.message.duplicateResetPasswordToken = res.body.message.duplicateResetPasswordToken
    //       res.body.should.be.deep.equal(this.conflictError)
    //       return db.User.findOne({ where: { duplicateResetPasswordToken: res.body.message.duplicateResetPasswordToken } })
    //     })
    //     .then(user => {
    //       user.email.toLowerCase().should.equals(duplicateUserPayload.email.toLowerCase())
    //     })
    // })

    // it('should respond with 409 when users phone and first name combination exists, but email doesn\'t match', function test() {
    //   return request(this.app)
    //     .post('/api/users')
    //     .send(potentiallyDuplicateUserPayload)
    //     .expect('Content-Type', /json/)
    //     .expect(409)
    //     .then(res => {
    //       this.conflictError.message.emailExists = false
    //       this.conflictError.message.duplicateResetPasswordToken = res.body.message.duplicateResetPasswordToken
    //       res.body.should.be.deep.equal(this.conflictError)
    //       return db.User.findOne({ where: { duplicateResetPasswordToken: res.body.message.duplicateResetPasswordToken } })
    //     })
    //     .then(user => {
    //       user.firstName.toLowerCase().should.equals(potentiallyDuplicateUserPayload.firstName.toLowerCase())
    //       formatPhoneNumber(user.phone).should.equals(formatPhoneNumber(potentiallyDuplicateUserPayload.phone))
    //     })
    // })

    // it('should respond with 400 invalid phone number', function test() {
    //   signUpUserPayload.phone = '(899)100949'
    //   return request(this.app)
    //     .post('/api/users')
    //     .send(signUpUserPayload)
    //     .expect('Content-Type', /json/)
    //     .expect(400, this.badRequestError)
    // })

    // it('should respond with 400 invalid first name with number', function test() {
    //   signUpUserPayload.phone = '+12425551212'
    //   signUpUserPayload.firstName = 'Mi1ous'
    //   return request(this.app)
    //     .post('/api/users')
    //     .send(signUpUserPayload)
    //     .expect('Content-Type', /json/)
    //     .expect(400, this.badRequestError)
    // })

    // it('should respond with 400 invalid first name with special character', function test() {
    //   signUpUserPayload.firstName = 'Ke$ha'
    //   return request(this.app)
    //     .post('/api/users')
    //     .send(signUpUserPayload)
    //     .expect('Content-Type', /json/)
    //     .expect(400, this.badRequestError)
    // })

    // it('should create user with student-housing-interest', function test() {
    //   signUpUserPayload.password = 'passWord!23'
    //   signUpUserPayload.email = 'pavel.polacek@strv.com'
    //   signUpUserPayload.phone = '+12425551212'
    //   signUpUserPayload.firstName = 'Franta'
    //   const expectedUserAddress = {
    //     id: 5,
    //     city: null,
    //     countryId: 1,
    //     stateId: 1,
    //     street: null,
    //     zip: null,
    //   }
    //   return request(this.app)
    //     .post('/api/signup/student-housing-interest')
    //     .send(signUpUserPayload)
    //     .expect('Content-Type', /json/)
    //     .expect(201)
    //     .then(res => {
    //       expectedSignUpResponse.accessToken = res.body.accessToken
    //       expectedSignUpResponse.id = res.body.id
    //       expectedSignUpResponse.email = 'pavel.polacek@strv.com'
    //       expectedSignUpResponse.firstName = 'Franta'
    //       expectedSignUpResponse.correctInterest = false

    //       res.body.should.be.deep.equal(expectedSignUpResponse)
    //       return db.User.find({ where: { email: 'pavel.polacek@strv.com' } })
    //     })
    //     .then(user => {
    //       helpers.checkDateRangeValidity(user.lastLoginAt)
    //       return db.Address.find({ where: { id: user.addressId } })
    //     })
    //     .then(address => {
    //       helpers.removeCreatedAndUpdatedAt(address.dataValues)
    //       address.dataValues.should.be.deep.equal(expectedUserAddress)
    //     })
    // })

    // it('should create user with last_location', function test() {
    //   signUpUserPayload.password = 'passWord!23'
    //   signUpUserPayload.email = 'pavel.polacek+2@strv.com'
    //   signUpUserPayload.phone = '+12425551212'
    //   signUpUserPayload.firstName = 'Horvác'
    //   signUpUserPayload.reitInterest = 1
    //   signUpUserPayload.location = 'Czech Republic'
    //   return request(this.app)
    //     .post('/api/users')
    //     .send(signUpUserPayload)
    //     .expect('Content-Type', /json/)
    //     .expect(201)
    //     .then(res => {
    //       expectedSignUpResponse.accessToken = res.body.accessToken
    //       expectedSignUpResponse.id = res.body.id
    //       expectedSignUpResponse.email = signUpUserPayload.email
    //       expectedSignUpResponse.firstName = 'Horvác'
    //       expectedSignUpResponse.correctInterest = true

    //       res.body.should.be.deep.equal(expectedSignUpResponse)
    //       return db.User.find({ where: { email: signUpUserPayload.email } })
    //     })
    //     .then(user => {
    //       user.lastLocation.should.be.equal(signUpUserPayload.location)
    //       helpers.checkDateRangeValidity(user.lastLoginAt)
    //     })
    // })

    // it('should respond with 400 when sending non-latin characters', function test() {
    //   const testFunc = attribute => {
    //     const payload = _.cloneDeep(signUpUserPayload)
    //     payload.password = 'CoolPassword1!'
    //     payload[attribute] = '汉字'
    //     return request(this.app)
    //       .post('/api/users')
    //       .send(payload)
    //       .expect('Content-Type', /json/)
    //       .expect(400)
    //       .then(response => response.body.should.be.deep.equal(helpers.getLatinStringValidationError()))
    //   }
    //   return helpers.testLatinStringValidation(testFunc, ['leadSource', 'referredBy'])
    // })
  })

  // describe('Login', () => {

  //   it('should log user in and not count share repurchase as unfinished transaction', function test() {
  //     const expectedLoginResponse = {
  //       id: null,
  //       email: 'confirmed@sink.sendgrid.net',
  //       firstName: 'ConfirmedUser',
  //       incompleteTransactionsCount: 4,
  //       lastName: 'UserConfirmed',
  //       phone: '+1 242-555-1212',
  //       accessToken: null,
  //       confirmed: true,
  //       correctInterest: false,
  //       residenceCountryId: 1,
  //       residenceStateId: 5,
  //     }
  //     return db.Transaction.create({
  //       amount: 2000,
  //       netAmount: 2000,
  //       transactionTypeId: enums.TRANSACTION_TYPES.BONUS_SHARES.id,
  //       transactionStatusId: enums.TRANSACTION_STATUSES.INCOMPLETE.id,
  //       investmentId: 4,
  //       pps: 10.00,
  //       shares: 3434.23 / 10.00,
  //       paymentTypeId: enums.PAYMENT_TYPES.ACH.id,
  //     }).then(() => request(this.app)
  //       .post('/api/access-token')
  //       .send(userDb.users.confirmed)
  //       .expect('Content-Type', /json/)
  //       .expect(200)
  //       .then(res => {
  //         res.body.should.to.have.ownProperty('accessToken')
  //         expectedLoginResponse.accessToken = res.body.accessToken
  //         expectedLoginResponse.id = res.body.id
  //         res.body.should.be.deep.equal(expectedLoginResponse)
  //         return db.User.find({ where: { email: 'confirmed@sink.sendgrid.net' } })
  //       })
  //       .then(user => {
  //         helpers.checkDateRangeValidity(user.lastLoginAt)
  //       }))
  //   })

  //   it('should log user in and return incorrect interest', function test() {
  //     const expectedLoginResponse = {
  //       id: null,
  //       email: 'confirmed@sink.sendgrid.net',
  //       firstName: 'ConfirmedUser',
  //       incompleteTransactionsCount: 4,
  //       lastName: 'UserConfirmed',
  //       phone: '+1 242-555-1212',
  //       accessToken: null,
  //       confirmed: true,
  //       correctInterest: false,
  //       residenceCountryId: 1,
  //       residenceStateId: 5,
  //     }
  //     return db.Transaction.create({
  //       amount: 2000,
  //       netAmount: 2000,
  //       transactionTypeId: enums.TRANSACTION_TYPES.BONUS_SHARES.id,
  //       transactionStatusId: enums.TRANSACTION_STATUSES.INCOMPLETE.id,
  //       investmentId: 4,
  //       pps: 10.00,
  //       shares: 3434.23 / 10.00,
  //       paymentTypeId: enums.PAYMENT_TYPES.ACH.id,
  //     }).then(() => db.UserReitInterest.findOrCreate({
  //       where: {
  //         userId: 2,
  //         reitId: enums.REITS.REG_A.id,
  //       },
  //       defaults: { userId: 2, reitId: enums.REITS.REG_A.id },
  //     })).then(() => request(this.app)
  //       .post('/api/access-token')
  //       .send(userDb.users.confirmed)
  //       .expect('Content-Type', /json/)
  //       .expect(200)
  //       .then(res => {
  //         res.body.should.to.have.ownProperty('accessToken')
  //         expectedLoginResponse.accessToken = res.body.accessToken
  //         expectedLoginResponse.id = res.body.id
  //         res.body.should.be.deep.equal(expectedLoginResponse)
  //         return db.User.find({ where: { email: 'confirmed@sink.sendgrid.net' } })
  //       })
  //       .then(user => {
  //         helpers.checkDateRangeValidity(user.lastLoginAt)
  //       }))
  //   })

  //   it('should log user in and return correct interest', function test() {
  //     const expectedLoginResponse = {
  //       id: null,
  //       email: 'confirmed@sink.sendgrid.net',
  //       firstName: 'ConfirmedUser',
  //       incompleteTransactionsCount: 4,
  //       lastName: 'UserConfirmed',
  //       phone: '+1 242-555-1212',
  //       accessToken: null,
  //       confirmed: true,
  //       correctInterest: true,
  //       residenceCountryId: 1,
  //       residenceStateId: 5,
  //     }
  //     return db.Transaction.create({
  //       amount: 2000,
  //       netAmount: 2000,
  //       transactionTypeId: enums.TRANSACTION_TYPES.BONUS_SHARES.id,
  //       transactionStatusId: enums.TRANSACTION_STATUSES.INCOMPLETE.id,
  //       investmentId: 4,
  //       pps: 10.00,
  //       shares: 3434.23 / 10.00,
  //       paymentTypeId: enums.PAYMENT_TYPES.ACH.id,
  //     }).then(() => db.UserReitInterest.findOrCreate({
  //       where: {
  //         userId: 2,
  //         reitId: enums.REITS.NNN_REIT.id,
  //       },
  //       defaults: { userId: 2, reitId: enums.REITS.NNN_REIT.id },
  //     })).then(() => request(this.app)
  //       .post('/api/access-token')
  //       .send(userDb.users.confirmed)
  //       .expect('Content-Type', /json/)
  //       .expect(200)
  //       .then(res => {
  //         res.body.should.to.have.ownProperty('accessToken')
  //         expectedLoginResponse.accessToken = res.body.accessToken
  //         expectedLoginResponse.id = res.body.id
  //         res.body.should.be.deep.equal(expectedLoginResponse)
  //         return db.User.find({ where: { email: 'confirmed@sink.sendgrid.net' } })
  //       })
  //       .then(user => {
  //         helpers.checkDateRangeValidity(user.lastLoginAt)
  //       }))
  //   })

  //   it('should log user in and get 0 incomplete transaction count', function test() {
  //     const expectedLoginResponse = {
  //       confirmed: true,
  //       email: 'confirmedWithoutAddress@sink.sendgrid.net',
  //       firstName: 'Joe',
  //       incompleteTransactionsCount: 0,
  //       lastName: 'Homeless',
  //       phone: '+1 242-555-1212',
  //       correctInterest: false,
  //       residenceCountryId: null,
  //       residenceStateId: null,
  //     }
  //     return request(this.app)
  //       .post('/api/access-token')
  //       .send(userDb.users.confirmedWithoutAddress)
  //       .expect('Content-Type', /json/)
  //       .expect(200)
  //       .then(res => {
  //         res.body.should.to.have.ownProperty('accessToken')
  //         expectedLoginResponse.accessToken = res.body.accessToken
  //         expectedLoginResponse.id = res.body.id
  //         res.body.should.be.deep.equal(expectedLoginResponse)
  //         return db.User.find({ where: { email: 'confirmed@sink.sendgrid.net' } })
  //       })
  //       .then(user => {
  //         helpers.checkDateRangeValidity(user.lastLoginAt)
  //       })
  //   })

  //   it('should log user in user with new dividend from MONTHLY', function test() {
  //     let transactionId = null
  //     const expectedLoginResponse = {
  //       id: null,
  //       email: 'confirmed@sink.sendgrid.net',
  //       firstName: 'ConfirmedUser',
  //       lastName: 'UserConfirmed',
  //       phone: '+1 242-555-1212',
  //       incompleteTransactionsCount: 4,
  //       accessToken: null,
  //       confirmed: true,
  //       correctInterest: true,
  //       residenceCountryId: 1,
  //       residenceStateId: 5,
  //       newDividend: {
  //         amount: 300,
  //         annualReturn: 0.075,
  //         month: 10,
  //         quarter: null,
  //         reitId: 1,
  //         reitName: 'Rich Uncles CALIFORNIA REIT',
  //       },
  //     }
  //     return db.Reit.update({ cashPayout: enums.CASH_PAYOUT.MONTHLY.name }, { where: { id: 1 } })
  //       .then(() => db.Transaction.create({
  //         investmentId: 4,
  //         amount: 300,
  //         netAmount: 300,
  //         shares: 30,
  //         transactionTypeId: enums.TRANSACTION_TYPES.DIVIDENDS_PAID.id,
  //         transactionStatusId: enums.TRANSACTION_STATUSES.ISSUED.id,
  //         createdAt: '2016-11-10 00:00:00+00',
  //       })).then(transaction => {
  //         transactionId = transaction.id
  //         return db.User.update({ lastLoginAt: '2016-11-09 00:00:00+00' }, { where: { id: 2 } })
  //       })
  //       .then(() => request(this.app)
  //         .post('/api/access-token')
  //         .send(userDb.users.confirmed)
  //         .expect('Content-Type', /json/)
  //         .expect(200))
  //       .then(res => {
  //         console.log(res.body)
  //         res.body.should.to.have.ownProperty('accessToken')
  //         expectedLoginResponse.accessToken = res.body.accessToken
  //         expectedLoginResponse.id = res.body.id
  //         res.body.should.be.deep.equal(expectedLoginResponse)
  //         return db.User.find({ where: { email: 'confirmed@sink.sendgrid.net' } })
  //       })
  //       .then(user => {
  //         helpers.checkDateRangeValidity(user.lastLoginAt)
  //         return request(this.app)
  //           .post('/api/access-token')
  //           .send(userDb.users.confirmed)
  //           .expect('Content-Type', /json/)
  //           .expect(200)
  //       })
  //       .then(res => {
  //         res.body.should.to.have.ownProperty('accessToken')
  //         expectedLoginResponse.accessToken = res.body.accessToken
  //         expectedLoginResponse.id = res.body.id
  //         delete expectedLoginResponse.newDividend
  //         res.body.should.be.deep.equal(expectedLoginResponse)
  //         return db.Transaction.destroy({ where: { id: transactionId } })
  //       })
  //   })

  //   it('should log user in user with new dividend QUARTERLY', function test() {
  //     const expectedLoginResponse = {
  //       id: null,
  //       email: 'confirmed@sink.sendgrid.net',
  //       firstName: 'ConfirmedUser',
  //       lastName: 'UserConfirmed',
  //       incompleteTransactionsCount: 4,
  //       phone: '+1 242-555-1212',
  //       accessToken: null,
  //       confirmed: true,
  //       correctInterest: true,
  //       residenceCountryId: 1,
  //       residenceStateId: 5,
  //       newDividend: {
  //         amount: 300,
  //         annualReturn: 0.075,
  //         month: null,
  //         quarter: 3,
  //         reitId: 1,
  //         reitName: 'Rich Uncles CALIFORNIA REIT',
  //       },
  //     }
  //     return db.Reit.update({ cashPayout: enums.CASH_PAYOUT.QUARTERLY.name }, { where: { id: 1 } })
  //       .then(() => db.Transaction.create({
  //         investmentId: 4,
  //         amount: 300,
  //         netAmount: 300,
  //         shares: 30,
  //         transactionTypeId: enums.TRANSACTION_TYPES.DIVIDENDS_REINVESTED.id,
  //         transactionStatusId: enums.TRANSACTION_STATUSES.ISSUED.id,
  //         createdAt: '2016-10-20 00:00:00+00',
  //       })).then(() => db.User.update({ lastLoginAt: '2016-10-09 00:00:00+00' }, { where: { id: 2 } }))
  //       .then(() => request(this.app)
  //         .post('/api/access-token')
  //         .send(userDb.users.confirmed)
  //         .expect('Content-Type', /json/)
  //         .expect(200))
  //       .then(res => {
  //         res.body.should.to.have.ownProperty('accessToken')
  //         expectedLoginResponse.accessToken = res.body.accessToken
  //         expectedLoginResponse.id = res.body.id
  //         res.body.should.be.deep.equal(expectedLoginResponse)
  //         return db.User.find({ where: { email: 'confirmed@sink.sendgrid.net' } })
  //       })
  //       .then(user => {
  //         helpers.checkDateRangeValidity(user.lastLoginAt)
  //         return request(this.app)
  //           .post('/api/access-token')
  //           .send(userDb.users.confirmed)
  //           .expect('Content-Type', /json/)
  //           .expect(200)
  //       })
  //       .then(res => {
  //         res.body.should.to.have.ownProperty('accessToken')
  //         expectedLoginResponse.accessToken = res.body.accessToken
  //         expectedLoginResponse.id = res.body.id
  //         delete expectedLoginResponse.newDividend
  //         res.body.should.be.deep.equal(expectedLoginResponse)
  //       })
  //   })
  //   // it.skip('should not login user when user is not confirmed by email', function test() {
  //   //  return request(this.app)
  //   //    .post('/api/access-token')
  //   //    .send(userDb.users.unconfirmed)
  //   //    .expect('Content-Type', /json/)
  //   //    .expect(401, this.unconfirmedError);
  //   // });

  //   it('should deny user with not valid credentials', function test() {
  //     const invalidCredentials = {
  //       username: 'invalidUsername@maso.cz',
  //       password: 'invalid credentials',
  //     }
  //     return request(this.app)
  //       .post('/api/access-token')
  //       .send(invalidCredentials)
  //       .expect('Content-Type', /json/)
  //       .expect(401, this.unauthorizedError)
  //   })

  //   it('should return invalid credetials when BAD_REQUEST', function test() {
  //     const invalidCredentials = {
  //       username: 'invalidUsername@maso.cz',
  //       password: 'a',
  //     }
  //     return request(this.app)
  //       .post('/api/access-token')
  //       .send(invalidCredentials)
  //       .expect('Content-Type', /json/)
  //       .expect(401, this.unauthorizedError)
  //   })
  // })

  // describe('ConfirmEmail', () => {
  //   before(function before() {
  //     this.invalidTokenError = { type: 'FORBIDDEN', message: 'Your confirmation link is expired.' }
  //     return userDb.init()
  //   })

  //   it('should confirm email with valid token', function test() {
  //     const expectedLoginResponse = {
  //       id: null,
  //       firstName: 'ConfirmedUser',
  //       email: 'confirmed@sink.sendgrid.net',
  //       lastName: 'UserConfirmed',
  //       phone: '+1 242-555-1212',
  //       incompleteTransactionsCount: 0,
  //       accessToken: null,
  //       confirmed: true,
  //       residenceCountryId: 1,
  //       residenceStateId: 5,
  //     }
  //     return request(this.app)
  //       .put('/api/users/confirm')
  //       .send({ token: 'publicToken' })
  //       .expect(200)
  //       .then(res => {
  //         expectedLoginResponse.id = res.body.id
  //         expectedLoginResponse.accessToken = res.body.accessToken
  //         expectedLoginResponse.should.be.deep.equal(res.body)
  //         return db.User.findById(res.body.id)
  //       })
  //       .then(updatedUser => {
  //         helpers.checkDateRangeValidity(updatedUser.lastLoginAt)
  //         updatedUser.confirmed.should.to.equal(true)
  //         should.not.exist(updatedUser.publicToken)
  //       })
  //   })

  //   it('should respond with 403 when invalid token', function test() {
  //     return request(this.app)
  //       .put('/api/users/confirm')
  //       .send({ token: 'nonExistingUserToken' })
  //       .expect('Content-Type', /json/)
  //       .expect(403, this.invalidTokenError)
  //   })
  // })

  // describe('ResetPassword', () => {
  //   before(function before() {
  //     this.unconfirmedError = { type: 'UNAUTHORIZED', message: 'Email address is not verified.' }
  //     this.invalidTokenError = { type: 'FORBIDDEN', message: 'This action is invalid.' }
  //     return userDb.init()
  //   })

  //   it('should send link to reset password (email)', function test() {
  //     return request(this.app)
  //       .post('/api/users/reset-password')
  //       .send({ email: userDb.users.confirmed.userName })
  //       .expect(200, {})
  //   })

  //   it('should send link to reset password (duplicateResetPasswordToken)', function test() {
  //     return request(this.app)
  //       .post('/api/users/reset-password')
  //       .send({ duplicateResetPasswordToken: 'duplicateResetPasswordToken' })
  //       .expect(200, {})
  //   })

  //   it.skip('should respond 401 email address has not activated account', function test() {
  //     return request(this.app)
  //       .post('/api/users/reset-password')
  //       .expect('Content-Type', /json/)
  //       .send({ email: userDb.users.unconfirmed.userName })
  //       .expect(401, this.unconfirmedError)
  //   })

  //   it('should respond with 404 when user not found by email', function test() {
  //     return request(this.app)
  //       .post('/api/users/reset-password')
  //       .send({ email: 'notAssociated@ru.com' })
  //       .expect('Content-Type', /json/)
  //       .expect(404, this.notFoundError)
  //   })

  //   it('should respond with 404 when user not found by email', function test() {
  //     return request(this.app)
  //       .post('/api/users/reset-password')
  //       .send({ email: 'notAssociated@ru.com' })
  //       .expect('Content-Type', /json/)
  //       .expect(404, this.notFoundError)
  //   })

  //   it('should respond with 403 when user not found by duplicateResetPasswordToken', function test() {
  //     return request(this.app)
  //       .post('/api/users/reset-password')
  //       .send({ duplicateResetPasswordToken: 'fake-token-42' })
  //       .expect('Content-Type', /json/)
  //       .expect(403, this.invalidTokenError)
  //   })
  // })

  // describe('UpdatePassword', () => {
  //   beforeEach(function beforeEach() {
  //     this.invalidTokenError = { type: 'FORBIDDEN', message: 'Token is no longer valid.' }
  //     this.passwordFormat = { message: 'Password must: include both lower and upper case characters, include at least one number or symbol, be at least 8 characters long', type: 'WRONG_PASSWORD_FORMAT' }
  //     return userDb.init()
  //   })

  //   it('should update user password', function test() {
  //     return request(this.app)
  //       .put('/api/users/reset-password')
  //       .send({
  //         password: 'newUserPassword123',
  //         token: 'passwordPublicToken',
  //       })
  //       .expect(200)
  //       .then(() => request(this.app)
  //         .post('/api/access-token/')
  //         .send({ username: userDb.users.confirmed.username, password: 'newUserPassword123' })
  //         .expect(200))
  //   })

  //   it('should fail on update user password because wrong pass format', function test() {
  //     return request(this.app)
  //       .put('/api/users/reset-password')
  //       .send({
  //         password: 'newUserPassword',
  //         token: 'publicToken',
  //       })
  //       .expect(400, this.passwordFormat)
  //   })

  //   it('should respond with 403 token is not valid when user not found by token', function test() {
  //     return request(this.app)
  //       .put('/api/users/reset-password')
  //       .send({
  //         password: 'passwordD123',
  //         token: 'nonExistingToken',
  //       })
  //       .expect('Content-Type', /json/)
  //       .expect(403, this.invalidTokenError)
  //   })
  // })

  // describe('GET /api/auth/users/me/personal-info', () => {
  //   beforeEach(function beforeEach() {
  //     return userDb.init()
  //       .then(() => login(userDb.users.confirmed))
  //       .then(userData => this.user = userData)
  //   })
  //   it('should respond with 401 when token is invalid', function test() {
  //     return request(this.app)
  //       .get('/api/auth/users/me/personal-info')
  //       .expect(401)
  //   })

  //   it('should respond with 200 and get personal info about user', function test() {
  //     const expectedResponse = {
  //       id: 2,
  //       email: 'confirmed@sink.sendgrid.net',
  //       firstName: 'ConfirmedUser',
  //       lastName: 'UserConfirmed',
  //       dob: '1977-07-08T00:00:00.000Z',
  //       phone: '+1 242-555-1212',
  //       ssn: '666-12-3456',
  //       leadSource: 'Facebook',
  //       referredBy: null,
  //       maritalStatus: 'Married',
  //       occupation: 'Developer',

  //       amlCheck: false,
  //       lock: false,
  //       updatedBy: 'WEBSITE',
  //       confirmed: true,
  //       address: {
  //         id: 1,
  //         city: 'New York City',
  //         street: '740 Delmer Grove',
  //         zip: '20749',

  //         country: {

  //           name: 'United States',
  //           abbr1: 'US',
  //           abbr2: 'USA',
  //         },
  //         state: {
  //           abbr: 'CA',
  //           allowed: true,
  //           id: 5,
  //           name: 'California',
  //         },
  //         stateId: 5,
  //       },
  //       addressId: 1,
  //       incompleteData: false,
  //       citizenshipId: 1,
  //       citizenshipCountryId: null,
  //       taxWithholdingRate: null,
  //     }
  //     return request(this.app)
  //       .get('/api/auth/users/me/personal-info')
  //       .expect(200)
  //       .set('Authorization', `JWT ${this.user.accessToken}`)
  //       .then(res => {
  //         helpers.removeCreatedAndUpdatedAt(res.body)
  //         helpers.removeCreatedAndUpdatedAt(expectedResponse)
  //         expectedResponse.should.be.deep.equal(res.body)
  //       })
  //   })
  // })

  // describe('PUT /api/auth/users/me/password', () => {
  //   beforeEach(function beforeEach() {
  //     this.unauthorizedError = { message: 'Site access denied.', type: 'UNAUTHORIZED' }
  //     this.badRequestError = { message: 'Old password does not match actual user password', type: 'BAD_REQUEST' }
  //     return userDb.init()
  //       .then(() => login(userDb.users.confirmed))
  //       .then(userData => this.user = userData)
  //   })

  //   it('should update user password for authenticated user', function test() {
  //     return request(this.app)
  //       .put('/api/auth/users/me/password')
  //       .set('Authorization', `JWT ${this.user.accessToken}`)
  //       .send({
  //         oldPassword: userDb.users.confirmed.password,
  //         newPassword: 'newPassword123',
  //       })
  //       .expect('Content-Type', /json/)
  //       .expect(200)
  //       .then(res => {
  //         res.body.should.to.have.ownProperty('accessToken')
  //         const expectedLoginResponse = {}
  //         expectedLoginResponse.accessToken = res.body.accessToken
  //         expectedLoginResponse.should.be.deep.equal(res.body)
  //         return request(this.app)
  //           .get('/api/auth/users/me/personal-info')
  //           .set('Authorization', `JWT ${res.body.accessToken}`)
  //           .expect(200)
  //       })
  //   })

  //   it('should respond with 401 when updating password and not authenticated', function test() {
  //     return request(this.app)
  //       .put('/api/auth/users/me/password')
  //       .send({
  //         password: 'password',
  //         token: 'nonExistingToken',
  //       })
  //       .expect('Content-Type', /json/)
  //       .expect(401, this.unauthorizedError)
  //   })

  //   it('should reject user password update when old password does not match actual user password', function test() {
  //     return request(this.app)
  //       .put('/api/auth/users/me/password')
  //       .set('Authorization', `JWT ${this.user.accessToken}`)
  //       .send({
  //         oldPassword: 'notOldPassword123',
  //         newPassword: 'newPassword123',
  //       })
  //       .expect('Content-Type', /json/)
  //       .expect(400, this.badRequestError)
  //   })
  // })

  // describe('UpdatePersonalInfo: PUT /api/auth/users/me/personal-info', () => {
  //   before(function before() {
  //     this.updatePersonalInfoRequest = (requestBody, status, body) => request(this.app)
  //       .put('/api/auth/users/me/personal-info')
  //       .set('Authorization', `JWT ${this.user.accessToken}`)
  //       .send(requestBody)
  //       .expect(status)
  //       .then(res => {
  //         if (body) {
  //           helpers.removeCreatedAndUpdatedAt(res.body)
  //           res.body.should.be.deep.equal(body)
  //         }
  //       })
  //     this.getPersonalInfoRequest = () => request(this.app)
  //       .get('/api/auth/users/me/personal-info')
  //       .set('Authorization', `JWT ${this.user.accessToken}`)
  //       .expect(200)
  //     this.validateResponse = (req, res, address, citizenshipId, phoneNumber) => {
  //       req.firstName.should.equal(res.firstName)
  //       req.lastName.should.equal(res.lastName)
  //       new Date(moment.utc(req.dob, 'MM-DD-YYYY').format()).getTime().should.equal(new Date(res.dob).getTime())
  //       req.ssn.should.equal(res.ssn)
  //       req.backupWithHolding.should.equal(res.backupWithHolding)
  //       phoneNumber.should.equal(res.phone)
  //       res.citizenshipId.should.equal(citizenshipId)
  //       address.street.should.equal(res.address.street)
  //       address.city.should.equal(res.address.city)
  //       address.zip.should.equal(res.address.zip)
  //       address.country.should.deep.equal(res.address.country)
  //       address.state.should.deep.equal(res.address.state)
  //       res.incompleteData.should.equal(false)
  //     }
  //     this.badRequestError = { message: 'Požadavek postrádá nebo obsahuje neplatná data.', type: 'BAD_REQUEST' }
  //     return accountDb()
  //       .then(() => login(userDb.users.confirmed))
  //       .then(userData => this.user = userData)
  //       .then(() => initRegulationDb())
  //       .then(() => regulationsDbInit())
  //   })

  //   const updatePayload = {
  //     firstName: 'John',
  //     lastName: 'Doe',
  //     maritalStatus: '', // should be ignored
  //     occupation: 'Developer',
  //     dob: '12-12-2015',
  //     ssn: '123341237',
  //     backupWithHolding: true,
  //     phone: '+420729485812',
  //     citizenshipId: 1,
  //     address: {
  //       street: 'Beverly Hills 1',
  //       city: 'San Francisco',
  //       zip: '90210',

  //       stateId: 5,
  //     },
  //   }

  //   const testAddress = {
  //     id: 1,
  //     city: 'San Francisco',
  //     street: 'Beverly Hills 1',
  //     zip: '90210',
  //     country: {
  //       abbr1: 'US',
  //       abbr2: 'USA',

  //       name: 'United States',
  //     },
  //     state: {
  //       abbr: 'CA',
  //       allowed: true,
  //       id: 5,
  //       name: 'California',
  //     },
  //   }

  //   const withoutChangingDobOrSsnOrFirstNameOrLastName = {
  //     firstName: 'John',
  //     lastName: 'Doe',
  //     dob: '12-12-2015',
  //     ssn: '123-34-1237',
  //     backupWithHolding: true,
  //     phone: '+420724777777',
  //     occupation: 'Developer',
  //     citizenshipId: 1,
  //     address: {
  //       street: 'Manhattan a/1',
  //       city: 'New York',
  //       zip: '90111',

  //       stateId: 5,
  //     },
  //   }

  //   const updatedAddress = {
  //     street: withoutChangingDobOrSsnOrFirstNameOrLastName.address.street,
  //     city: withoutChangingDobOrSsnOrFirstNameOrLastName.address.city,
  //     zip: withoutChangingDobOrSsnOrFirstNameOrLastName.address.zip,
  //     country: {
  //       abbr1: 'US',
  //       abbr2: 'USA',

  //       name: 'United States',
  //     },
  //     state: {
  //       abbr: 'CA',
  //       allowed: true,
  //       id: 5,
  //       name: 'California',
  //     },
  //   }

  //   it('should update user\'s personal info', function test() {
  //     const expectedResponse = {
  //       addressId: 1,
  //       backupWithHolding: true,
  //       citizenshipId: 1,
  //       citizenshipCountryId: enums.CITIZENSHIP.US.id,
  //       dob: '2015-12-12T00:00:00.000Z',
  //       email: 'confirmed@sink.sendgrid.net',
  //       firstName: 'John',
  //       id: 2,
  //       incompleteData: false,
  //       lastName: 'Doe',
  //       leadSource: 'Facebook',
  //       lock: false,

  //       maritalStatus: 'Married',
  //       occupation: 'Developer',
  //       phone: '+420 729 485 812',
  //       referredBy: null,
  //       taxWithholdingRate: null,
  //     }

  //     return db.User.update({ incompleteData: true }, { where: { email: userDb.users.confirmed.userName } })
  //       .then(() => this.updatePersonalInfoRequest(updatePayload, 200, expectedResponse))
  //       .then(() => this.getPersonalInfoRequest())
  //       .then(res => this.validateResponse(updatePayload, res.body, testAddress, enums.CITIZENSHIP.US.id, '+420 729 485 812'))
  //   })

  //   it.skip('should update user\'s personal info by changing country to not the US', function test() {
  //     const updateAddressPayload = {
  //       firstName: 'John',
  //       lastName: 'Doe',
  //       maritalStatus: '', // should be ignored
  //       occupation: 'Developer',
  //       dob: '12-12-2015',
  //       ssn: '123-34-1237',
  //       backupWithHolding: true,
  //       phone: '+420729485812',
  //       citizenshipId: 1,
  //       address: {
  //         street: 'Some street',
  //         city: 'Some city',
  //         zip: '90210',

  //         stateId: null,
  //       },
  //     }
  //     const expectedUpdatedAddress = {
  //       id: 1,
  //       street: 'Some street',
  //       city: 'Some city',
  //       zip: '90210',

  //       country: {
  //         abbr1: 'AF',
  //         abbr2: 'AFG',

  //         name: 'Afghanistan',
  //       },
  //       stateId: null,
  //     }
  //     return db.User.update({ incompleteData: true }, { where: { email: userDb.users.confirmed.userName } })
  //       .then(() => this.updatePersonalInfoRequest(updateAddressPayload, 200))
  //       .then(() => this.getPersonalInfoRequest())
  //       .then(res => res.body.address.should.be.deep.equal(expectedUpdatedAddress))
  //   })

  //   it.skip('should not update user\'s personal info when changing country to not the US, but not editing tax ID to match the country', function test() {
  //     const updateAddressPayload = {
  //       firstName: 'John',
  //       lastName: 'Doe',
  //       maritalStatus: '', // should be ignored
  //       occupation: 'Developer',
  //       dob: '12-12-2015',
  //       ssn: '123-34-1237',
  //       backupWithHolding: true,
  //       phone: '+420729485812',
  //       citizenshipId: 1,
  //       address: {
  //         street: 'Some street',
  //         city: 'Some city',
  //         zip: '90210',

  //         stateId: null,
  //       },
  //     }
  //     return db.User.update({ incompleteData: true }, { where: { email: userDb.users.confirmed.userName } })
  //       .then(() => this.updatePersonalInfoRequest(updateAddressPayload, 400, { message: 'Please enter a valid Resident Tax ID.', type: 'BAD_REQUEST' }))
  //   })

  //   it('should not update user\'s country when user is locked', function test() {
  //     const payload = _.cloneDeep(updatePayload)
  //     payload.address.countryId = 5
  //     return db.User.update({ lock: true }, {
  //       where: { email: userDb.users.confirmed.userName },
  //     })
  //       .then(() => this.updatePersonalInfoRequest(payload, 400, this.badRequestError))
  //   })

  //   it('should update user\'s country when user is not locked', function test() {
  //     const payload = _.cloneDeep(updatePayload)

  //     return db.User.update({ lock: false }, {
  //       where: { email: userDb.users.confirmed.userName },
  //     })
  //       .then(() => this.updatePersonalInfoRequest(payload, 200))
  //   })

  //   it('should update user\'s personal info if user isn\'t locked', function test() {
  //     const updateAddressPayload = {
  //       firstName: 'John',
  //       lastName: 'Doe',
  //       maritalStatus: '', // should be ignored
  //       occupation: 'Developer',
  //       dob: '12-12-2015',
  //       ssn: '123-34-1237',
  //       backupWithHolding: true,
  //       phone: '+420729485812',
  //       citizenshipId: enums.CITIZENSHIP.FOREIGN.id,

  //       address: {
  //         street: 'Some street',
  //         city: 'Some city',
  //         zip: '90210',

  //         stateId: 5,
  //       },
  //     }
  //     const expectedReponse = {
  //       addressId: 1,
  //       backupWithHolding: true,
  //       citizenshipId: 3,

  //       dob: '2015-12-12T00:00:00.000Z',
  //       email: 'confirmed@sink.sendgrid.net',
  //       firstName: 'John',
  //       id: 2,
  //       incompleteData: false,

  //       lastName: 'Doe',
  //       leadSource: 'Facebook',
  //       lock: false,
  //       maritalStatus: 'Married',
  //       occupation: 'Developer',
  //       phone: '+420 729 485 812',
  //       referredBy: null,
  //       taxWithholdingRate: null,
  //     }
  //     return db.User.update({ incompleteData: true }, { where: { email: userDb.users.confirmed.userName } })
  //       .then(() => this.updatePersonalInfoRequest(updateAddressPayload, 200, expectedReponse))
  //       .then(() => db.User.find({ where: { id: this.user.id } }))
  //       .then(user => user.ssn.should.exist)
  //   })

  //   it('should update personal info when not changing dob or ssn or firstName or lastName and user is locked for update', function test() {
  //     return db.User.update({ lock: true }, { where: { email: userDb.users.confirmed.userName } })
  //       .then(() => this.updatePersonalInfoRequest(withoutChangingDobOrSsnOrFirstNameOrLastName, 200))
  //       .then(() => this.getPersonalInfoRequest())
  //       .then(res => this.validateResponse(withoutChangingDobOrSsnOrFirstNameOrLastName, res.body, updatedAddress, enums.CITIZENSHIP.US.id, '+420 724 777 777'))
  //   })

  //   it('should not update personal info when user has jointee from restricted state', function test() {
  //     const userId = 2
  //     const accountId = 4
  //     const addressId = 2
  //     return db.Account.update({
  //       jointeeId: userId,
  //       accountTypeId: enums.ACCOUNT_TYPES.JOINT.id,
  //       accountSubTypeId: enums.ACCOUNT_SUB_TYPES.COMMUNITY_PROPERTY.id,
  //     }, { where: { id: accountId } })
  //       .then(() => db.Address.update({
  //         stateId: 11,
  //       }, { where: { id: addressId } }))
  //       .then(() => {
  //         withoutChangingDobOrSsnOrFirstNameOrLastName.address.stateId = 11
  //         return this.updatePersonalInfoRequest(withoutChangingDobOrSsnOrFirstNameOrLastName, 409, { type: 'CONFLICT',
  //           message: 'You have Community Property account which is not allowed in state Hawaii.' })
  //       })
  //       .then(() => this.getPersonalInfoRequest())
  //       .then(res => this.validateResponse(withoutChangingDobOrSsnOrFirstNameOrLastName, res.body, updatedAddress, enums.CITIZENSHIP.US.id, '+420 724 777 777'))
  //   })

  //   it('should respond 400 when updating dob or ssn or firstName or lastName and user is locked for update', function test() {
  //     return db.User.update({ lock: true }, {
  //       where: { email: userDb.users.confirmed.userName },
  //     })
  //       .then(() => {
  //         const withChangedDob = _.cloneDeep(updatePayload)
  //         withChangedDob.dob = '2015-12-11'
  //         return this.updatePersonalInfoRequest(withChangedDob, 400, this.badRequestError)
  //       })
  //       .then(() => {
  //         const withChangedSsn = _.cloneDeep(updatePayload, 400, this.badRequestError)
  //         withChangedSsn.ssn = '222-11-0100'
  //         return this.updatePersonalInfoRequest(withChangedSsn, 400, this.badRequestError)
  //       })
  //       .then(() => {
  //         const withChangedFirstName = _.cloneDeep(updatePayload, 400, this.badRequestError)
  //         withChangedFirstName.firstName = 'Lenon'
  //         return this.updatePersonalInfoRequest(withChangedFirstName, 400, this.badRequestError)
  //       })
  //       .then(() => {
  //         const withChangedLastName = _.cloneDeep(updatePayload, 400, this.badRequestError)
  //         withChangedLastName.lastName = 'McCartney'
  //         return this.updatePersonalInfoRequest(withChangedLastName, 400, this.badRequestError)
  //       })
  //       .then(() => this.getPersonalInfoRequest())
  //       .then(res => {
  //         this.validateResponse(withoutChangingDobOrSsnOrFirstNameOrLastName, res.body, updatedAddress, enums.CITIZENSHIP.US.id, '+420 724 777 777')
  //       })
  //   })

  //   it('should update user\'s personal info when changing to us citizenship and adding ssn if user is locked', function test() {
  //     const updateAddressPayload = {
  //       firstName: 'John',
  //       lastName: 'Doe',
  //       maritalStatus: '', // should be ignored
  //       occupation: 'Developer',
  //       dob: '12-12-2015',
  //       ssn: '123-34-1237',
  //       backupWithHolding: true,
  //       phone: '+420729485812',
  //       citizenshipId: enums.CITIZENSHIP.US.id,
  //       address: {
  //         street: 'Some street',
  //         city: 'Some city',
  //         zip: '90210',

  //         stateId: 5,
  //       },
  //     }
  //     const expectedResponse = {
  //       addressId: 1,
  //       backupWithHolding: true,
  //       citizenshipId: 1,

  //       dob: '2015-12-12T00:00:00.000Z',
  //       email: 'confirmed@sink.sendgrid.net',
  //       firstName: 'John',
  //       id: 2,
  //       incompleteData: false,
  //       lastName: 'Doe',

  //       leadSource: 'Facebook',
  //       lock: true,
  //       maritalStatus: 'Married',
  //       occupation: 'Developer',
  //       phone: '+420 729 485 812',
  //       referredBy: null,
  //       taxWithholdingRate: null,
  //     }
  //     return db.User.update({ lock: true }, { where: { email: userDb.users.confirmed.userName } })
  //       .then(() => this.updatePersonalInfoRequest(updateAddressPayload, 200, expectedResponse))
  //       .then(() => db.User.find({ where: { id: 2 } }))
  //       .then(user => cryptoUtils.decrypt(user.ssn).should.equal('123-34-1237'))
  //   })

  //   it('should restrict deleting user\'s ssn when changing to foreign citizenship while user is locked', function test() {
  //     const updateAddressPayload = {
  //       firstName: 'John',
  //       lastName: 'Doe',
  //       maritalStatus: '', // should be ignored
  //       occupation: 'Developer',
  //       dob: '12-12-2015',
  //       ssn: null,
  //       backupWithHolding: true,
  //       phone: '+420729485812',
  //       citizenshipId: enums.CITIZENSHIP.FOREIGN.id,
  //       address: {
  //         street: 'Some street',
  //         city: 'Some city',
  //         zip: '90210',

  //         stateId: null,
  //       },
  //     }
  //     return db.User.update({ lock: true }, { where: { email: userDb.users.confirmed.userName } })
  //       .then(() => this.updatePersonalInfoRequest(updateAddressPayload, 400, this.badRequestError))
  //   })

  //   it('should fail on updating user\'s personal info because of US state is not allowed', function test() {
  //     const updateAddressPayload = {
  //       firstName: 'John',
  //       lastName: 'Doe',
  //       maritalStatus: '', // should be ignored
  //       occupation: 'Developer',
  //       dob: '12-12-2015',
  //       ssn: '123-34-1237',
  //       backupWithHolding: true,
  //       phone: '+420729485812',
  //       citizenshipId: 1,
  //       address: {
  //         street: 'Some street',
  //         city: 'Some city',
  //         zip: '90210',

  //         stateId: 2,
  //       },
  //     }
  //     return db.User.update({ incompleteData: true }, { where: { email: userDb.users.confirmed.userName } })
  //       .then(() => this.updatePersonalInfoRequest(updateAddressPayload, 400, { type: 'BAD_REQUEST', message: 'Provided state is not allowed.' }))
  //   })

  //   it('should respond with 400 when sending non-latin characters', function test() {
  //     const testFunc = attribute => {
  //       const payload = _.cloneDeep(updatePayload)
  //       payload[attribute] = String.fromCharCode(664)
  //       return this.updatePersonalInfoRequest(payload, 400, helpers.getLatinStringValidationError())
  //     }
  //     return helpers.testLatinStringValidation(testFunc, ['maritalStatus', 'occupation'])
  //   })
  // })

  // describe('POST /api/users/me/resend-confirmation-email', () => {
  //   before(function before() {
  //     return accountDb().then(() => login(userDb.users.confirmed)).then(() => login(userDb.users.confirmed)
  //       .then(confirmedUser => this.confirmedUser = confirmedUser).then(() => login(userDb.users.unconfirmed))
  //       .then(unconfirmedUser => this.unconfirmedUser = unconfirmedUser))
  //   })

  //   it('should respond with 200 when resending validation email with confirmed account and don\'t change anything', function test() {
  //     const testedUser = this.confirmedUser
  //     return db.User.findById(testedUser.id)
  //       .then(userBefore => {
  //         const publicTokenBefore = userBefore.publicToken
  //         should.equal(userBefore.confirmed, true)

  //         return request(this.app)
  //           .post('/api/auth/users/me/resend-confirmation-email')
  //           .set('Authorization', `JWT ${testedUser.accessToken}`)
  //           .expect(200)
  //           .then(res => {
  //             res.body.should.be.deep.equal({})
  //             return db.User.findById(testedUser.id)
  //           })
  //           .then(userAfter => {
  //             should.equal(userAfter.publicToken, publicTokenBefore)
  //             should.equal(userAfter.confirmed, true)
  //           })
  //       })
  //   })

  //   it('should respond with 200 when resending validation email with unconfirmed account and do not change public token', function test() {
  //     const testedUser = this.unconfirmedUser

  //     return db.User.update({ publicToken: 'publicToken' }, {
  //       where: { id: testedUser.id },
  //     }).then(() => db.User.findById(testedUser.id)).then(userBefore => {
  //       const publicTokenBefore = userBefore.publicToken
  //       should.equal(userBefore.confirmed, false)
  //       return request(this.app)
  //         .post('/api/auth/users/me/resend-confirmation-email')
  //         .set('Authorization', `JWT ${testedUser.accessToken}`)
  //         .expect(200)
  //         .then(res => {
  //           res.body.should.be.deep.equal({})
  //           return db.User.findById(testedUser.id)
  //         })
  //         .then(userAfter => {
  //           should.equal(userBefore.confirmed, false)
  //           should.equal(userAfter.publicToken, publicTokenBefore)
  //         })
  //     })
  //   })

  //   it('should respond with 200 when resending validation email with unconfirmed account and generate new public token', function test() {
  //     const testedUser = this.unconfirmedUser
  //     db.User.update({ publicToken: null }, {
  //       where: { id: testedUser.id },
  //     }).then(() => db.User.findById(testedUser.id)).then(userBefore => {
  //       const publicTokenBefore = userBefore.publicToken
  //       should.equal(userBefore.confirmed, false)
  //       return request(this.app)
  //         .post('/api/auth/users/me/resend-confirmation-email')
  //         .set('Authorization', `JWT ${testedUser.accessToken}`)
  //         .expect(200)
  //         .then(res => {
  //           res.body.should.be.deep.equal({})
  //           return db.User.findById(testedUser.id)
  //         })
  //         .then(userAfter => {
  //           should.equal(userBefore.confirmed, false)
  //           should.not.equal(userAfter.publicToken, publicTokenBefore)
  //         })
  //     })
  //   })
  // })
})
