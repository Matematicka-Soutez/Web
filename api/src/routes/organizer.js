/* eslint-disable max-len */
'use strict'

const Router = require('koa-router')
const venues = require('../controllers/organizer/venues')
// const user = require('../controllers/admin/user')

const router = new Router()

/**
 * @api {get} /api/admin/users Get list of filtered users
 * @apiName GetFilteredUsers
 * @apiGroup Organizer
 *
 * @apiParam {String}            [id]                   Filter by id.
 * @apiParam {String}            [firstName]            First name.
 * @apiParam {String}            [lastName]             Last name.
 * @apiParam {String}            [email]                Email.
 * @apiParam {Number}            [page]                 Pagination starts with 1.
 * @apiParam {Number[]}          [citizenshipId]        Citizenship identification (eq. [1,2,3])
 *
 * @apiUse BadRequestError
 *
 */
// router.get('/users', user.getFilteredUsers)

/**
 * @api {get} /api/admin/users/:userId              Get user detail
 * @apiName GetWholeUserDetail
 * @apiGroup Organizer
 *
 * @apiParam {String}   [id]                   User id.
 *
 * @apiUse BadRequestError
 *
 */
// router.get('/users/:userId', user.getWholeUserDetail)

/**
 * @api {post} /api/admin/users/:userId/resend-confirmation-email Resend confirmation email
 * @apiName Resend confirmation email
 * @apiGroup Organizer
 *
 * @apiHeader {String}       Authorization        Format: JWT ${access_token}
 * @apiParam {Number}        userId               User identification.
 *
 * @apiUse BadRequestError
 * @apiUse ForbiddenError
 * @apiUse UnauthorizedError
 *
 */
// router.post('/users/:userId/resend-confirmation-email', user.resendConfirmEmail)

/**
 * @api {put} /api/admin/users/:userId/personal-info          Updates users personal info
 * @apiName UpdatePersonalInfo
 * @apiGroup Organizer
 *
 * @apiHeader {String}          Authorization           Format: JWT ${access_token} - ADMIN
 *
 * @apiParam {Number}           userId                  User ID.
 * @apiParam {String{1..40}}    firstName               User first name.
 * @apiParam {String{1..80}}    lastName                User last name.
 * @apiParam {String{1..40}}    dob                     User date of birth in format MM-DD-YYYY.
 * @apiParam {Object}           address                 Address Of user.
 * @apiParam {String{1..256}}   address.street          User address part - street name.
 * @apiParam {String{1..256}}   address.city            User address part - city name.
 * @apiParam {String{1..256}}   address.zip             User address part - postal code.
 * @apiParam {Number}           address.countryId       User address part - unique identifier of country.
 * @apiParam {Number}           address.stateId         User address part - unique identifier of state.
 * @apiParam {Number}           address.stateId         User address part - unique identifier of state.
 * @apiParam {Boolean}          secureMode              If admin is in secure mode or not (true means that FirstName, LastName, dob and ssn can't be updated) - default is TRUE
 *
 * @apiUse  BadRequestError
 * @apiUse  NotFoundError
 *
 */
// router.put('/users/:userId/personal-info', user.updatePersonalInfo)

/**
 * @api {PUT} /api/admin/users/:userId/email Should change email
 * @apiName ChangeUserEmail
 * @apiGroup Organizer
 *
 * @apiHeader {String}       Authorization                  Format: JWT ${access_token}
 *
 * @apiParam {String}       email                           Email
 *
 * @apiUse BadRequestError
 * @apiUse NotFoundError
 */
// router.put('/users/:userId/email', user.changeEmail)


router.get('/venues', venues.getAllByCompetition)


module.exports = router.routes()
