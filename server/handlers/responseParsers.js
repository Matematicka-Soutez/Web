
module.exports = {
  parseUser,
}

function parseUser(user) {
  if (!user) {
    throw new Error('User is empty in response parsing')
  }
  const parsedUser = {}
  parsedUser.id = user.id
  parsedUser.email = user.email
  parsedUser.confirmed = user.confirmed
  parsedUser.accessToken = user.accessToken
  parsedUser.registrationStepId = user.registrationStepId

  if (user.registrationStepId > 2) {
    parsedUser.firstName = user.firstName
    parsedUser.lastName = user.lastName
    parsedUser.dob = user.dob
  }

  return parsedUser
}
