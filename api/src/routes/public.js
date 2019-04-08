/* eslint-disable max-len */
'use strict'

const Router = require('koa-router')
const teachers = require('../controllers/public/teachers')
const organizers = require('../controllers/public/organizers')
const competitions = require('../controllers/public/competitions')
// const optionalToken = require('./../controllers/passport').optionalToken

const router = new Router()

/**
 * @api {post} /api/session/organizer Login admin
 * @apiName LoginOrganizer
 * @apiGroup Organizers
 *
 * @apiParam {String{1..256}}   username            Organizer email to verify.
 * @apiParam {String{1..256}}   password            Organizer password to verify.
 *
 * @apiSuccess {Number}         id                  Organizer unique identifier.
 * @apiSuccess {String}         accessToken         Server issued access token.
 *
 * @apiUse BadRequestError
 * @apiUse UnauthorizedError
 *
 */
router.post('/session/organizer', organizers.login)

/**
 * @api {post} /api/session/teacher Login user
 * @apiName LoginTeacher
 * @apiGroup Teachers
 *
 * @apiParam {String{1..256}}   username            Teacher email to verify.
 * @apiParam {String{1..256}}   password            Teacher password to verify.
 *
 * @apiSuccess {Number}         id                  Teacher unique identifier.
 * @apiSuccess {String}         firstName           Teacher first name.
 * @apiSuccess {String}         lastName            Teacher last name.
 * @apiSuccess {Boolean}        confirmed           Teacher has confirmed email.
 * @apiSuccess {String}         accessToken         Server issued access token.
 *
 * @apiUse BadRequestError
 * @apiUse UnauthorizedError
 *
 */
router.post('/session/teacher', teachers.login)

/**
 * @api {POST} /api/teachers Sign Up
 * @apiName SignUp
 * @apiGroup Teachers
 *
 * @apiParam {String{1..40}}                firstName           Teacher first name.
 * @apiParam {String{1..80}}                lastName            Teacher last name.
 * @apiParam {String{1..80}}                email               Teacher email.
 * @apiParam {String{1..256}}               password            Teacher password.
 *
 * @apiSuccess (Created 201) {Number}       id                  Teacher unique identifier.
 * @apiSuccess (Created 201) {String}       username            Teacher username.
 * @apiSuccess (Created 201) {String}       firstName           Teacher first name.
 * @apiSuccess (Created 201) {String}       lastName            Teacher last name.
 * @apiSuccess (Created 201) {String}       email               Teacher email.
 * @apiSuccess (Created 201) {Boolean}      confirmed           Teacher has confirmed email.
 * @apiSuccess (Created 201) {Date}         createdAt           Teacher createdAt timestamp, format: ISO-8601.
 * @apiSuccess (Created 201) {Date}         updatedAt           Teacher updatedAt timestamp, format: ISO-8601.
 *
 * @apiUse BadRequestError
 * @apiUse WrongPasswordFormat
 * @apiUse ConflictError
 *
 */
router.post('/teachers', teachers.signUp)

/**
 * @api {POST} /api/teachers Sign Up
 * @apiName SignUp
 * @apiGroup Organizers
 *
 * @apiParam {String{1..40}}                firstName           Organizer first name.
 * @apiParam {String{1..80}}                lastName            Organizer last name.
 * @apiParam {String{1..80}}                email               Organizer email.
 * @apiParam {String{1..256}}               password            Organizer password.
 *
 * @apiSuccess (Created 201) {Number}       id                  Organizer unique identifier.
 * @apiSuccess (Created 201) {String}       firstName           Organizer first name.
 * @apiSuccess (Created 201) {String}       lastName            Organizer last name.
 * @apiSuccess (Created 201) {String}       email               Organizer email.
 * @apiSuccess (Created 201) {Boolean}      confirmed           Organizer has confirmed email.
 * @apiSuccess (Created 201) {Date}         createdAt           Organizer createdAt timestamp, format: ISO-8601.
 * @apiSuccess (Created 201) {Date}         updatedAt           Organizer updatedAt timestamp, format: ISO-8601.
 *
 * @apiUse BadRequestError
 * @apiUse WrongPasswordFormat
 * @apiUse ConflictError
 *
 */
router.post('/organizers', organizers.signUp)

/**
 * @api {PUT} /api/teachers/confirm Confirm teacher email address
 * @apiName ConfirmEmailAddress
 * @apiGroup Teachers
 *
 * @apiParam {String{1..256}}   token               Received token in confirm email.
 *
 * @apiSuccess {Number}         id                  Teacher unique identifier.
 * @apiSuccess {String}         firstName           Teacher first name.
 * @apiSuccess {String}         lastName            Teacher last name.
 * @apiSuccess {String}         accessToken         Server issued access token.
 *
 * @apiUse BadRequestError
 * @apiUse ForbiddenError
 *
 */
router.put('/teachers/confirm', teachers.confirmEmail)

/**
 * @api {POST} /api/teachers/reset-password Initiates teacher password reset action
 * @apiName ResetPassword
 * @apiGroup Teachers
 *
 * @apiParam {String{1..80}}    email               Email address where to send reset password link.
 *
 * @apiUse BadRequestError
 * @apiUse NotFoundError
 * @apiUse UnauthorizedError
 *
 */
router.post('/teachers/reset-password', teachers.resetPassword)

/**
 * @api {PUT} /api/teachers/reset-password Updates teachers password with new password
 * @apiName UpdatePassword
 * @apiGroup Teachers
 *
 * @apiParam {String{1..256}}               token               Received token in reset password email.
 * @apiParam {String{1..256}}               password            New password to update
 *
 * @apiUse BadRequestError
 * @apiUse ForbiddenError
 * @apiUse WrongPasswordFormat
 * @apiUse UnauthorizedError
 *
 */
router.put('/teachers/reset-password', teachers.updatePassword)

router.get('/competitions/current/timer', competitions.getTimer)
router.get('/competitions/current/teams', competitions.getTeams)

router.get('/competitions/current/registration/:schoolToken', competitions.getSchoolRegistrations)
router.post('/competitions/current/registration/:schoolToken', competitions.createSchoolTeam)
router.put('/competitions/current/registration/:schoolToken', competitions.updateSchoolTeam)

module.exports = router.routes()
