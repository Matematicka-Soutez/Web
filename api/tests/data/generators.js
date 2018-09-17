'use strict'

Promise = require('bluebird')
const Chance = require('chance')
const _ = require('lodash')
const crypto = require('../../src/utils/crypto')
const db = require('../../src/database')
const enums = require('../../../core/enums')

const chance = new Chance()

async function createCompetition(defaults) {
  const year = new Date().getFullYear()
  const names = [
    `Jarní MaSo ${year}`,
    `Podzimní MaSo ${year}`,
  ]
  const competition = _.assign({}, {
    name: chance.pickone(names),
    date: chance.date({ month: 5, year }),
    registrationRound1: chance.date({ month: 1, year }),
    registrationRound2: chance.date({ month: 2, year }),
    registrationRound3: chance.date({ month: 3, year }),
    registrationEnd: chance.date({ month: 4, year }),
    isPublic: chance.bool(),
    invitationEmailSent: chance.bool(),
    organizerId: 1,
    gameId: 1,
  }, defaults)
  const created = await db.Competition.create(competition)
  return _.assign({}, competition, { id: created.id })
}

async function createVenue(defaults) {
  const address = await createAddress(defaults.address)
  const venue = _.assign({}, {
    name: chance.city(),
    defaultCapacity: chance.integer({ min: 30, max: 90 }),
    addressId: address.id,
  }, defaults)
  const created = await db.Venue.create(venue)
  return _.assign({}, venue, { id: created.id, address })
}

async function createCompetitionVenue(defaults) {
  const competitionVenue = _.assign({}, {
    capacity: chance.integer({ min: 30, max: 90 }),
    competitionId: 1,
    venueId: 1,
  }, defaults)
  const created = await db.CompetitionVenue.create(competitionVenue)
  return _.assign({}, competitionVenue, { id: created.id })
}

async function createCompetitionVenueRoom(defaults) {
  const competitionVenueRoom = _.assign({}, {
    capacity: chance.integer({ min: 10, max: 30 }),
    competitionVenueId: 1,
    roomId: 1,
  }, defaults)
  const created = await db.CompetitionVenueRoom.create(competitionVenueRoom)
  return _.assign({}, competitionVenueRoom, { id: created.id })
}

async function createRoom(defaults) {
  const room = _.assign({}, {
    name: `${chance.letter({ casing: 'upper' })}${chance.integer({ min: 1, max: 9 })}`,
    defaultCapacity: chance.integer({ min: 10, max: 30 }),
    venueId: 1,
  }, defaults)
  const created = await db.Room.create(room)
  return _.assign({}, room, { id: created.id })
}

async function createGame(defaults) {
  const name = chance.word({ syllables: 3 })
  const game = _.assign({}, {
    name,
    description: chance.paragraph({ sentences: 2 }),
    folder: name,
  }, defaults)
  const created = await db.Game.create(game)
  return _.assign({}, game, { id: created.id })
}

async function createOrganizer(defaults) {
  const organizer = _.assign({}, {
    firstName: chance.first(),
    lastName: chance.last(),
    email: chance.email({ domain: 'sink.sendgrid.net' }),
    password: chance.word({ length: 10 }),
    confirmed: chance.bool(),
    roleId: chance.pickone(enums.ROLES.ids),
  }, defaults)
  const password = organizer.password
  organizer.password = await crypto.hashPassword(organizer.password) // eslint-disable-line require-atomic-updates, max-len
  const created = await db.Organizer.create(organizer)
  return _.assign({}, organizer, { id: created.id, password })
}

async function createTeacher(defaults = {}) {
  const threeDigits = () => chance.string({ length: 3, pool: '0123456789' })
  const teacher = _.assign({}, {
    firstName: chance.first(),
    lastName: chance.last(),
    email: chance.email({ domain: 'sink.sendgrid.net' }),
    phone: `+420 ${threeDigits()} ${threeDigits()} ${threeDigits()}`,
    password: chance.word({ length: 10 }),
    schoolId: 1,
  }, defaults)
  const password = teacher.password
  teacher.password = await crypto.hashPassword(teacher.password) // eslint-disable-line require-atomic-updates, max-len
  const created = await db.Teacher.create(teacher)
  return _.assign({}, teacher, { id: created.id, password })
}

async function createSchool(defaults = {}) {
  const address = await createAddress(defaults.address)
  const types = ['Gymnázium', 'Základní škola']
  const typesShort = ['G.', 'ZŠ']
  const whos = ['Palackého', 'F. X. Šaldy', 'Českolipská', 'Národní']
  const school = _.assign({}, {
    shortName: `${chance.pickone(typesShort)} ${chance.pickone(whos)}`,
    fullName: `${chance.pickone(types)} ${chance.pickone(whos)}`,
    aesopId: `aesop:${chance.integer({ min: 1, max: 3000 })}`,
    accessCode: chance.string({ length: 6, pool: 'abcdefghijklmnopqrstuvwxyz1234567890' }),
    addressId: address.id,
  }, defaults)
  const created = await db.School.create(school)
  const teacher = await createTeacher({ ...defaults.teacher, schoolId: created.id })
  return _.assign({}, school, { id: created.id, address, teacher })
}

async function createAddress(defaults = {}, allowedState = true) {
  const countries = enums.COUNTRIES.idsAsEnum
    .filter(id => enums.COUNTRIES.ids[id].allowed === allowedState)
  const address = _.assign({}, {
    titleLine1: chance.prefix(),
    titleLine2: chance.name(),
    countryId: chance.pickone(countries),
    city: chance.city(),
    street: chance.address(),
    zip: chance.zip(),
  }, defaults)
  const created = await db.Address.create(address)
  return _.assign({}, address, { id: created.id })
}

async function createTeam(defaults = {}) {
  const team = _.assign({}, {
    name: chance.word({ syllables: chance.integer({ min: 1, max: 5 }) }),
    teacherId: 1,
    schoolId: 1,
  }, defaults)
  const created = await db.Team.create(team)
  const memberCount = chance.integer({ min: 3, max: 4 })
  const teamMembers = defaults.teamMembers
    ? await Promise.map(defaults.teamMembers, tmd => createTeamMember({ ...tmd, teamId: created.id })) // eslint-disable-line max-len
    : await createN(memberCount, () => createTeamMember({ teamId: created.id }))
  return _.assign({}, team, { id: created.id, teamMembers })
}

async function createTeamMember(defaults = {}) {
  const teamMember = _.assign({}, {
    firstName: chance.first(),
    lastName: chance.last(),
    grade: chance.integer({ min: 5, max: 9 }),
    teamId: 1,
  }, defaults)
  const created = await db.TeamMember.create(teamMember)
  return _.assign({}, teamMember, { id: created.id })
}

function createN(amount, generator) {
  return Promise.map(new Array(amount), () => generator())
}

module.exports = {
  createCompetition,
  createVenue,
  createCompetitionVenue,
  createCompetitionVenueRoom,
  createRoom,
  createGame,
  createOrganizer,
  createTeacher,
  createSchool,
  createAddress,
  createTeam,
  createTeamMember,
  createN,
}
