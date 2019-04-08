'use strict'

Promise = require('bluebird')
const _ = require('lodash')
const enums = require('../../../core/enums')
const {
  createVenue,
  createRoom,
  createGame,
  createCompetition,
  createCompetitionVenue,
  createCompetitionVenueRoom,
} = require('./generators')

async function initStatic() {
  const games = await initGames()
  const venues = await initVenues()
  const rooms = await initRooms(venues)
  const competitions = await initCompetitions(games)
  const competitionVenues = await initCompetitionVenues(competitions, venues)
  await initCompetitionVenueRooms(competitionVenues, rooms)
  return { games, rooms, venues, competitions }
}

function initVenues() {
  const venues = [{
    id: 1,
    name: 'Praha',
    defaultCapacity: 86,
    address: {
      titleLine1: '',
      titleLine2: 'Matematicko-fyzikální fakulta UK',
      street: 'Malostranské náměstí 25',
      city: 'Praha 1',
      zip: '110 00',
      countryId: enums.COUNTRIES.CZECH_REPUBLIC.id,
    },
  }, {
    id: 2,
    name: 'Brno',
    defaultCapacity: 30,
    address: {
      titleLine1: '',
      titleLine2: 'Gymnázium Matyáše Lercha',
      street: 'Žižkova ulice 980/55',
      city: 'Brno - Veveří',
      zip: '616 00',
      countryId: enums.COUNTRIES.CZECH_REPUBLIC.id,
    },
  }]
  return Promise.map(venues, venue => createVenue(venue))
}

function initRooms(venues) {
  const rooms = [{
    id: 1,
    name: 'S3',
    defaultCapacity: 24,
    venueId: venues[0].id,
  }, {
    id: 2,
    name: 'S4',
    defaultCapacity: 14,
    venueId: venues[0].id,
  }, {
    id: 3,
    name: 'S5',
    defaultCapacity: 24,
    venueId: venues[0].id,
  }, {
    id: 4,
    name: 'S9',
    defaultCapacity: 24,
    venueId: venues[0].id,
  }, {
    id: 5,
    name: 'GML',
    defaultCapacity: 30,
    venueId: venues[1].id,
  }]
  return Promise.map(rooms, room => createRoom(room))
}

function initGames() {
  const games = [{
    id: 1,
    name: 'Lahvování vody',
    description: 'TBA',
    folder: 'water-bottling',
  }, {
    id: 2,
    name: 'Game of trust',
    description: 'TBA',
    folder: 'game-of-trust',
  }]
  return Promise.map(games, game => createGame(game))
}

function initCompetitions() {
  const competitions = [{
    id: 1,
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
    gameId: 1,
  }, {
    id: 2,
    name: 'Podzimní MaSo 2018',
    date: new Date('2018-11-06T06:30:00.000Z'),
    start: new Date('2018-11-06T08:00:00.000Z'),
    end: new Date('2018-11-06T09:30:00.000Z'),
    registrationRound1: new Date('2018-10-02T05:30:00.000Z'),
    registrationRound2: new Date('2018-10-16T05:30:00.000Z'),
    registrationRound3: new Date('2018-10-23T05:30:00.000Z'),
    registrationEnd: new Date('2018-10-30T21:00:00.000Z'),
    isPublic: true,
    invitationEmailSent: true,
    organizerId: null,
    gameId: 2,
  }, {
    id: 3,
    name: 'Jarní MaSo 2019',
    date: new Date('2019-05-14T05:00:00.000Z'),
    start: new Date('2019-05-14T08:00:00.000Z'),
    end: new Date('2019-05-14T09:30:00.000Z'),
    registrationRound1: new Date('2019-04-09T07:00:00.000Z'),
    registrationRound2: new Date('2019-04-23T07:00:00.000Z'),
    registrationRound3: new Date('2019-04-30T07:00:00.000Z'),
    registrationEnd: new Date('2019-05-07T22:00:00.000Z'),
    isPublic: true,
    invitationEmailSent: true,
    organizerId: null,
    gameId: 2,
  }]
  return Promise.map(competitions, competition => createCompetition(competition))
}

async function initCompetitionVenues(competitions, venues) {
  const competitionVenues = await Promise.mapSeries(
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

function initCompetitionVenueRooms(competitionVenues, rooms) {
  const competitionVenueRooms = [{
    competitionVenueId: competitionVenues[0].id,
    roomId: rooms[0].id,
    capacity: rooms[0].defaultCapacity,
  }, {
    competitionVenueId: competitionVenues[0].id,
    roomId: rooms[1].id,
    capacity: rooms[1].defaultCapacity,
  }, {
    competitionVenueId: competitionVenues[0].id,
    roomId: rooms[2].id,
    capacity: rooms[2].defaultCapacity,
  }, {
    competitionVenueId: competitionVenues[0].id,
    roomId: rooms[3].id,
    capacity: rooms[3].defaultCapacity,
  }, {
    competitionVenueId: competitionVenues[1].id,
    roomId: rooms[4].id,
    capacity: rooms[4].defaultCapacity,
  }, {
    competitionVenueId: competitionVenues[2].id,
    roomId: rooms[0].id,
    capacity: rooms[0].defaultCapacity,
  }, {
    competitionVenueId: competitionVenues[2].id,
    roomId: rooms[1].id,
    capacity: rooms[1].defaultCapacity,
  }, {
    competitionVenueId: competitionVenues[2].id,
    roomId: rooms[2].id,
    capacity: rooms[2].defaultCapacity,
  }, {
    competitionVenueId: competitionVenues[2].id,
    roomId: rooms[3].id,
    capacity: rooms[3].defaultCapacity,
  }, {
    competitionVenueId: competitionVenues[3].id,
    roomId: rooms[4].id,
    capacity: rooms[4].defaultCapacity,
  }]
  return Promise.map(
    competitionVenueRooms,
    competitionVenueRoom => createCompetitionVenueRoom(competitionVenueRoom),
  )
}

module.exports = initStatic
