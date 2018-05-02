const Promise = require('bluebird')
const enums = require('../../common/enums')
const { createVenue, createRoom, createGame } = require('./generators')

async function initStatic() {
  const games = await initGames()
  const venues = await initVenues()
  const rooms = await initRooms(venues)
  return { games, rooms, venues }
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

module.exports = initStatic
