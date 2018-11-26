'use strict'

const _ = require('lodash')
const TransactionalService = require('./../../../../core/services/TransactionalService')
const venueRepository = require('./../../repositories/venue')
const teamRepository = require('./../../repositories/team')

const EXCEPTIONS = [{
  venueId: 1,
  roomId: 1,
  number: 1,
}, {
  venueId: 1,
  roomId: 1,
  number: 2,
}]

module.exports = class DivideIntoRoomsService extends TransactionalService {
  async run() {
    const dbTransaction = await this.createOrGetTransaction()
    const cvenues = await venueRepository.findCompetitionVenues(this.competition.id, dbTransaction)
    addVenueStartingNumbers(cvenues)
    const updates = _.map(cvenues, cvenue => {
      this.log('info', `Venue: ${cvenue.venue.name}`)
      this.splitTeamsIntoRooms(cvenue)
      this.numberTeamsInRooms(cvenue)
      return getTeamUpdates(cvenue)
    })
    await teamRepository.bulkUpdate(_.flatten(updates), dbTransaction)
    return true
  }

  splitTeamsIntoRooms(cvenue) {
    addRoomStartingNumbers(cvenue.startingNumber, _.orderBy(cvenue.cvrooms, 'room.name'))
    // Init room team arrays
    cvenue.cvrooms.forEach(room => {
      room.teams = []
    })
    // Add exceptions to rooms and remove them from veue teams
    this.applyExceptions(cvenue)
    // Split remaining teams so that teams from the same school
    // never share room if possible
    const schoolTeams = _.groupBy(cvenue.teams, 'schoolId')
    _.forOwn(schoolTeams, teams => {
      const sorted = sortRoomsByRemainingCapacity(cvenue.cvrooms)
      for (let i = 0; i < teams.length; i++) {
        sorted[i % sorted.length].teams.push(teams[i])
      }
    })
  }

  numberTeamsInRooms(cvenue) {
    cvenue.cvrooms.forEach(cvroom => this.numberTeams(cvroom))
  }

  numberTeams(cvroom) {
    const possibleNumbers = this.getPossibleNumbers(cvroom.startingNumber, cvroom.capacity, cvroom.teams) // eslint-disable-line max-len
    let validOrder = false
    let order = null
    let iterations = 0
    while (!validOrder) {
      this.log('info', `Numbering teams in: ${cvroom.room.name}`)
      order = _.shuffle(possibleNumbers)
      validOrder = this.validateOrder(order, cvroom.teams)
      if (iterations > 100) {
        throw new Error('numbering failed')
      }
      iterations++
    }
    applyOrder(order, cvroom.teams)
  }

  getPossibleNumbers(start, capacity, teams) {
    const taken = _.compact(_.map(teams, 'number'))
    this.log('info', `Taken numbers: ${taken}`)
    const invalid = taken.filter(number => number < start || number >= start + capacity)
    if (invalid.length > 0) {
      throw new Error(`Invalid exception number declared: ${invalid} (range ${start}-${start + capacity})`) // eslint-disable-line max-len
    }
    const fullRange = _.range(start, start + capacity)
    return _.difference(fullRange, taken)
  }

  applyExceptions(cvenue) {
    EXCEPTIONS.forEach(exception => {
      if (cvenue.venue.id === exception.venueId) {
        const cvroom = cvenue.cvrooms.find(cvr => cvr.room.id === exception.roomId)
        if (!cvroom) {
          throw new Error(`Invalid exception declared, room not found: ${exception}`)
        }
        const team = cvenue.teams.find(tm => tm.number === exception.number)
        if (!team) {
          throw new Error(`Invalid exception declared, team not found: ${exception}`)
        }
        cvroom.teams.push({ ...team, number: exception.number })
        _.pull(cvenue.teams, team)
      }
    })
  }

  validateOrder(order, teams) {
    const testTeams = _.cloneDeep(teams)
    applyOrder(order, testTeams)
    const sorted = _.orderBy(testTeams, 'number')
    const ranges = [-3, -2, -1]
    for (let i = 0; i < sorted.length; i++) {
      const team = sorted[i]
      for (const range of ranges) {
        if (i + range >= 0 && sorted[i + range].schoolId === team.schoolId) {
          return false
        }
      }
    }
    return true
  }
}

function getTeamUpdates(cvenue) {
  const updates = cvenue.cvrooms.map(cvroom => cvroom.teams.map(team => ({
    id: team.id,
    competitionVenueRoomId: cvroom.id,
    number: team.number,
  })))
  return _.flatten(updates)
}

function applyOrder(order, teams) {
  let teamIndex = 0
  for (let i = 0; i < order.length; i++, teamIndex++) {
    if (!teams[teamIndex]) {
      continue
    }
    while (teams[teamIndex].number) {
      teamIndex++
    }
    teams[teamIndex].number = order[i]
  }
}

function addVenueStartingNumbers(venues) {
  let startingNumber = 1
  venues.forEach(venue => {
    venue.startingNumber = startingNumber
    startingNumber += _.sumBy(venue.cvrooms, 'capacity')
  })
}

function addRoomStartingNumbers(start, cvrooms) {
  let startingNumber = start
  cvrooms.forEach(room => {
    room.startingNumber = startingNumber
    startingNumber += room.capacity
  })
}

function sortRoomsByRemainingCapacity(cvrooms) {
  const sorted = _.orderBy(cvrooms, room => room.capacity - room.teams.length, 'desc')
  return sorted.filter(room => room.capacity - room.teams.length > 0)
}
