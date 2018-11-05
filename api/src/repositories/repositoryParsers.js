'use strict'

const _ = require('lodash')

function parseTeams(teams) {
  return teams ? _.map(teams, parseTeam) : teams
}

function parseTeam(team) {
  if (!team) {
    return null
  }
  const parsed = {}
  parsed.id = team.id
  parsed.name = team.name
  parsed.number = team.number
  parsed.arrived = team.arrived
  parsed.schoolId = team.schoolId
  parsed.createdAt = team.createdAt
  parsed.updatedAt = team.updatedAt

  if (team.members) {
    parsed.members = parseTeamMembers(team.members)
  }
  if (team.teacher) {
    parsed.members = parseTeacher(team.teacher)
  }
  if (team.school) {
    parsed.school = parseSchool(team.school)
  }
  if (team.competitionVenue) {
    parsed.competitionVenue = parseCompetitionVenue(team.competitionVenue)
  }

  return parsed
}

function parseTeamMembers(members) {
  return members ? _.map(members, parseTeamMember) : members
}

function parseTeamMember(member) {
  if (!member) {
    return null
  }
  const parsed = {}
  parsed.id = member.id
  parsed.firstName = member.firstName
  parsed.lastName = member.lastName
  parsed.grade = member.grade
  parsed.createdAt = member.createdAt
  parsed.updatedAt = member.updatedAt
  return parsed
}

function parseCompetition(competition) {
  if (!competition) {
    return competition
  }
  const parsed = {}
  parsed.id = competition.id
  parsed.name = competition.name
  parsed.date = competition.date
  parsed.start = competition.start
  parsed.end = competition.end
  parsed.registrationRound1 = competition.registrationRound1
  parsed.registrationRound2 = competition.registrationRound2
  parsed.registrationRound3 = competition.registrationRound3
  parsed.registrationEnd = competition.registrationEnd
  parsed.isPublic = competition.isPublic
  parsed.invitationEmailSent = competition.invitationEmailSent

  if (competition.game) {
    parsed.game = parseGame(competition.game)
  }

  return parsed
}

function parseGame(game) {
  if (!game) {
    return null
  }
  const parsed = {}
  parsed.id = game.id
  parsed.name = game.name
  parsed.description = game.description
  parsed.folder = game.folder
  parsed.createdAt = game.createdAt
  parsed.updatedAt = game.updatedAt
  return parsed
}

function parseCompetitionVenues(competitionVenues) {
  return competitionVenues ? _.map(competitionVenues, parseCompetitionVenue) : competitionVenues
}

function parseCompetitionVenue(competitionVenue) {
  if (!competitionVenue) {
    return competitionVenue
  }
  const parsed = {}
  parsed.id = competitionVenue.id
  parsed.capacity = competitionVenue.capacity
  parsed.competitionId = competitionVenue.competitionId
  parsed.venueId = competitionVenue.venueId

  if (competitionVenue.teams) {
    parsed.teams = parseTeams(competitionVenue.teams)
  }
  if (competitionVenue.venue) {
    parsed.venue = parseVenue(competitionVenue.venue)
  }
  if (competitionVenue.cvrooms) {
    parsed.cvrooms = parseCompetitionVenueRooms(competitionVenue.cvrooms)
  }

  return parsed
}

function parseCompetitionVenueRooms(cvrooms) {
  return cvrooms ? _.map(cvrooms, parseCompetitionVenueRoom) : cvrooms
}

function parseCompetitionVenueRoom(cvroom) {
  if (!cvroom) {
    return cvroom
  }
  const parsed = {}
  parsed.id = cvroom.id
  parsed.capacity = cvroom.capacity
  parsed.roomId = cvroom.roomId
  parsed.competitionVenueId = cvroom.competitionVenueId

  if (cvroom.teams) {
    parsed.teams = parseTeams(cvroom.teams)
  }

  if (cvroom.room) {
    parsed.room = parseRoom(cvroom.room)
  }

  return parsed
}

function parseRoom(room) {
  if (!room) {
    return room
  }
  const parsed = {}
  parsed.id = room.id
  parsed.name = room.name
  parsed.defaultCapacity = room.defaultCapacity
  return parsed
}

function parseVenue(venue) {
  if (!venue) {
    return venue
  }
  const parsed = {}
  parsed.id = venue.id
  parsed.name = venue.name
  parsed.defaultCapacity = venue.defaultCapacity
  return parsed
}

function parseSchool(school) {
  if (!school) {
    return school
  }
  const parsed = {}
  parsed.id = school.id
  parsed.shortName = school.shortName
  parsed.fullName = school.fullName
  parsed.aesopId = school.aesopId
  parsed.accessCode = school.accessCode
  parsed.createdAt = school.createdAt
  parsed.updatedAt = school.updatedAt

  if (school.teams) {
    parsed.teams = parseTeams(school.teams)
  }
  if (school.teachers) {
    parsed.teachers = parseTeachers(school.teachers)
  }
  if (school.address) {
    parsed.address = parseAddress(school.address)
  }

  return parsed
}

function parseAddress(address) {
  if (!address) {
    return address
  }
  const parsed = {}
  parsed.id = address.id
  parsed.titleLine1 = address.titleLine1
  parsed.titleLine2 = address.titleLine2
  parsed.street = address.street
  parsed.city = address.city
  parsed.zip = address.zip

  if (address.country) {
    parsed.country = parseCountry(address.country)
  }

  return parsed
}

function parseCountry(country) {
  if (!country) {
    return country
  }
  const parsed = {}
  parsed.id = country.id
  parsed.name = country.name
  parsed.abbreviation = country.abbreviation
  return parsed
}

function parseOrganizer(organizer) {
  if (!organizer) {
    return organizer
  }
  const parsed = {}
  parsed.id = organizer.id
  parsed.firstName = organizer.firstName
  parsed.lastName = organizer.lastName
  parsed.email = organizer.email
  parsed.password = organizer.password
  parsed.disabled = organizer.disabled
  parsed.roleId = organizer.roleId

  parsed.publicToken = organizer.publicToken
  parsed.passwordPublicToken = organizer.passwordPublicToken
  parsed.duplicateResetPasswordToken = organizer.duplicateResetPasswordToken
  parsed.confirmed = organizer.confirmed
  parsed.passwordLastUpdatedAt = organizer.passwordLastUpdatedAt
  parsed.lastLoginAt = organizer.lastLoginAt
  parsed.createdAt = organizer.createdAt
  parsed.updatedAt = organizer.updatedAt
  return parsed
}

function parseTeachers(teachers) {
  return teachers ? _.map(teachers, parseTeacher) : teachers
}

function parseTeacher(teacher) {
  if (!teacher) {
    return teacher
  }
  const parsed = {}
  parsed.id = teacher.id
  parsed.title = teacher.title
  parsed.firstName = teacher.firstName
  parsed.lastName = teacher.lastName
  parsed.email = teacher.email
  parsed.phone = teacher.phone
  parsed.password = teacher.password
  parsed.allowNotifications = teacher.allowNotifications

  parsed.publicToken = teacher.publicToken
  parsed.passwordPublicToken = teacher.passwordPublicToken
  parsed.passwordLastUpdatedAt = teacher.passwordLastUpdatedAt
  parsed.duplicateResetPasswordToken = teacher.duplicateResetPasswordToken
  parsed.confirmed = teacher.confirmed
  parsed.lastLoginAt = teacher.lastLoginAt
  parsed.createdAt = teacher.createdAt
  parsed.updatedAt = teacher.updatedAt
  return parsed
}

function parseTeamSolution(problem) {
  if (!problem) {
    return problem
  }
  const parsed = {}
  parsed.id = problem.id
  parsed.competitionId = problem.competitionId
  parsed.teamId = problem.teamId
  parsed.problemNumber = problem.problemNumber
  parsed.solved = problem.solved
  parsed.createdBy = problem.createdBy
  parsed.createdAt = problem.createdAt
  parsed.updatedAt = problem.updatedAt
  return parsed
}

module.exports = {
  parseTeams,
  parseTeam,
  parseTeamMembers,
  parseTeamMember,
  parseCompetition,
  parseCompetitionVenues,
  parseCompetitionVenue,
  parseCompetitionVenueRooms,
  parseCompetitionVenueRoom,
  parseGame,
  parseSchool,
  parseAddress,
  parseCountry,
  parseOrganizer,
  parseTeachers,
  parseTeacher,
  parseTeamSolution,
}
