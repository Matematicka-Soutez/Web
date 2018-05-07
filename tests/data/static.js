const Promise = require('bluebird')
const _ = require('lodash')
const enums = require('../../common/enums')
const {
  createVenue,
  createRoom,
  createGame,
  createCompetition,
  createCompetitionVenue,
} = require('./generators')

async function initStatic() {
  const games = await initGames()
  const venues = await initVenues()
  const rooms = await initRooms(venues)
  const competitions = await initCompetitions(games)
  await initCompetitionVenues(competitions, venues)
  return { games, rooms, venues, competitions }
}

function initVenues() {
  const venues = [{
    name: 'Praha',
    defaultCapacity: 86,
    address: {
      titleLine1: '',
      titleLine2: 'Budova MFF UK',
      street: 'Malostranské náměstí 25',
      city: 'Praha 1',
      zip: '110 00',
      countryId: enums.COUNTRIES.CZECH_REPUBLIC.id,
    },
  }, {
    name: 'Brno',
    defaultCapacity: 30,
    address: {
      titleLine1: '',
      titleLine2: 'Budova FI MUNI',
      street: 'Botanická 68a',
      city: 'Brno',
      zip: '602 00',
      countryId: enums.COUNTRIES.CZECH_REPUBLIC.id,
    },
  }]
  return Promise.map(venues, venue => createVenue(venue))
}

function initRooms(venues) {
  const rooms = [{
    name: 'S3',
    defaultCapacity: 14,
    venueId: venues[0].id,
  }, {
    name: 'S4',
    defaultCapacity: 24,
    venueId: venues[0].id,
  }, {
    name: 'S5',
    defaultCapacity: 24,
    venueId: venues[0].id,
  }, {
    name: 'S9',
    defaultCapacity: 24,
    venueId: venues[0].id,
  }, {
    name: 'MUNI',
    defaultCapacity: 30,
    venueId: venues[1].id,
  }]
  return Promise.map(rooms, room => createRoom(room))
}

function initGames() {
  const games = [{
    name: 'Lahvování vody',
    description: 'TBA',
    folder: 'watter-bottling',
  }]
  return Promise.map(games, game => createGame(game))
}

function initCompetitions(games) {
  const competitions = [{
    name: 'Jarní MaSo 2018',
    date: new Date('2018-05-16T08:30:00.000Z'),
    start: new Date('2018-05-16T10:00:00.000Z'),
    end: new Date('2018-05-16T11:30:00.000Z'),
    registrationRound1: new Date('2018-04-11T07:30:00.000Z'),
    registrationRound2: new Date('2018-04-25T07:30:00.000Z'),
    registrationRound3: new Date('2018-05-02T07:30:00.000Z'),
    registrationEnd: new Date('2018-05-09T23:00:00.000Z'),
    isPublic: true,
    invitationEmailSent: true,
    organizerId: null,
    gameId: games[0].id,
  }]
  return Promise.map(competitions, competition => createCompetition(competition))
}

async function initCompetitionVenues(competitions, venues) {
  const competitionVenues = await Promise.map(
    competitions,
    competition => Promise.mapSeries(
      venues,
      venue => createCompetitionVenue({
        capacity: venue.defaultCapacity,
        competitionId: competition.id,
        venueId: venue.id,
      }),
    ),
  )
  return _.flatten(competitionVenues)
}

module.exports = initStatic
