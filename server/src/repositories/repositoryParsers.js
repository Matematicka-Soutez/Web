const _ = require('lodash')

module.exports = {
  parseAdmin,
  parseUser,
  parseHobby,
  parseHobbies,
}

function parseHobby(hobby) {
  if (!hobby) {
    return null
  }
  const parsedHobby = {}
  parsedHobby.id = hobby.id
  parsedHobby.name = hobby.name
  parsedHobby.typeId = hobby.recordImportanceTypeId
  parsedHobby.createdBy = hobby.createdBy
  parsedHobby.createdAt = hobby.createdAt
  parsedHobby.updatedAt = hobby.updatedAt
  return parsedHobby
}

function parseHobbies(hobbies) {
  return hobbies ? _.map(hobbies, parseHobby) : hobbies
}

function parseAdmin(admin) {
  if (!admin) {
    return admin
  }
  const parsedAdmin = {}
  parsedAdmin.id = admin.id
  parsedAdmin.username = admin.username
  parsedAdmin.password = admin.password
  parsedAdmin.disabled = admin.disabled
  return parsedAdmin
}

function parseUser(user) {
  if (!user) {
    return user
  }
  const parsedUser = {}
  parsedUser.id = user.id
  parsedUser.email = user.email
  parsedUser.firstName = user.firstName
  parsedUser.lastName = user.lastName
  parsedUser.dob = user.dob
  parsedUser.registrationStepId = user.registrationStepId
  parsedUser.weight = user.weight
  parsedUser.height = user.height
  parsedUser.password = user.password

  parsedUser.publicToken = user.publicToken
  parsedUser.passwordPublicToken = user.passwordPublicToken
  parsedUser.passwordLastUpdatedAt = user.passwordLastUpdatedAt ? user.passwordLastUpdatedAt : null
  parsedUser.confirmed = user.confirmed
  parsedUser.lastLoginAt = user.lastLoginAt
  return parsedUser
}
