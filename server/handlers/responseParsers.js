function parseTeacher(teacher) {
  if (!teacher) {
    throw new Error('User is empty in response parsing')
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

module.exports = {
  parseTeacher,
}
