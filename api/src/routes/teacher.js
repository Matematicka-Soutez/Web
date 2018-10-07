/* eslint-disable max-len */
'use strict'

const Router = require('koa-router')
const teachers = require('../controllers/teacher/teachers')

const router = new Router()

/**
 * @api {get} /api/auth/users/me/personal-info          Get users personal info
 * @apiName GetPersonalInfo
 * @apiGroup Users
 *
 * @apiHeader {String}          Authorization           Format: JWT ${access_token}
 *
 * @apiSuccess {String{1..40}}    firstName               User first name.
 * @apiSuccess {String{1..80}}    lastName                User last name.
 * @apiSuccess {String{1..40}}    dob                     User date of birth in format MM-DD-YYYY.
 * @apiSuccess {Object}           address                 Address Of user
 * @apiSuccess {String{1..256}}   address.street          User address part - street name.
 * @apiSuccess {String{1..256}}   address.city            User address part - city name.
 * @apiSuccess {String{1..256}}   address.zip             User address part - postal code.
 * @apiSuccess {Number}           address.countryId       User address part - unique identifier of country.
 * @apiSuccess {Number}           address.stateId         User address part - unique identifier of state.
 *
 * @apiUse  BadRequestError
 * @apiUse  NotFoundError
 *
 */
// router.get('/users/me/personal-info', users.getPersonalInfo)

/**
 * @api {put} /api/teacher/teachers/me/password     Updates user password in settings.
 * @apiName UpdateUserPasswordInSettings
 * @apiGroup Users
 *
 * @apiHeader {String}  Authorization  Format: JWT ${access_token}
 *
 * @apiParam {String{8..256}}   oldPassword             Old password validated with existing in db.
 * @apiParam {String{8..256}}   newPassword             New password for user.
 *
 * @apiParam {String}           accessToken             The access_token of authorized user.
 *
 * @apiUse NotFoundError
 * @apiUse WrongPasswordFormat
 *
 */
router.put('/teachers/me/password', teachers.updatePasswordAuthenticated)

/**
 * @api {put} /api/teacher/teachers/me/personal-info          Updates user personal info
 * @apiName UpdatePersonalInfo
 * @apiGroup Users
 *
 * @apiHeader {String}          Authorization           Format: JWT ${access_token}
 *
 * @apiParam {String{1..40}}    firstName               User first name.
 * @apiParam {String{1..80}}    lastName                User last name.klacko1989
 * @apiParam {String{1..40}}    dob                     User date of birth in format MM-DD-YYYY.
 * @apiParam {Object}           address                 Address Of user
 * @apiParam {String{1..256}}   address.street          User address part - street name.
 * @apiParam {String{1..256}}   address.city            User address part - city name.
 * @apiParam {String{1..256}}   address.zip             User address part - postal code.
 * @apiParam {Number}           address.countryId       User address part - unique identifier of country.
 * @apiParam {Number}           address.stateId         User address part - unique identifier of state.
 *
 * @apiUse  BadRequestError
 * @apiUse  NotFoundError
 *
 */
// router.put('/users/me/personal-info', users.updatePersonalInfo)

/**
 * @api {post} /api/teacher/teachers/me/resend-confirmation-email Resend confirmation email
 * @apiName Resend confirmation email
 * @apiGroup Users
 *
 * @apiHeader {String}       Authorization        Format: JWT ${access_token}
 *
 * @apiUse BadRequestError
 * @apiUse ForbiddenError
 * @apiUse UnauthorizedError
 *
 */
router.post('/teachers/me/resend-confirmation-email', teachers.resendConfirmEmail)

module.exports = router.routes()
