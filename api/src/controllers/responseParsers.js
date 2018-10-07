'use strict'

function parseTeacher(teacher) {
  if (!teacher) {
    throw new Error('Teacher is empty in response parsing')
  }
  const parsed = {}
  parsed.id = teacher.id
  parsed.title = teacher.title
  parsed.firstName = teacher.firstName
  parsed.lastName = teacher.lastName
  parsed.email = teacher.email
  parsed.phone = teacher.phone
  parsed.allowNotifications = teacher.allowNotifications
  parsed.confirmed = teacher.confirmed
  parsed.accessToken = teacher.accessToken

  return parsed
}

function parseOrganizer(organizer) {
  if (!organizer) {
    throw new Error('Organizer is empty in response parsing')
  }
  const parsed = {}
  parsed.id = organizer.id
  parsed.firstName = organizer.firstName
  parsed.lastName = organizer.lastName
  parsed.email = organizer.email
  parsed.confirmed = organizer.confirmed
  parsed.accessToken = organizer.accessToken

  return parsed
}

module.exports = {
  parseTeacher,
  parseOrganizer,
}
