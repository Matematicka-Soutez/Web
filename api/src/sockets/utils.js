'use strict'

function parseRedisConnectionString(connectionString) {
  const colonSplitted = connectionString.split(':')
  const withoutPassword = colonSplitted.length === 3
  if (withoutPassword) {
    return {
      host: colonSplitted[1].slice(2),
      port: Number.parseInt(colonSplitted[2]),
    }
  }
  const passwordHostname = colonSplitted[2].split('@')
  return {
    host: passwordHostname[1],
    port: Number.parseInt(colonSplitted[3]),
    password: passwordHostname[0],
  }
}

module.exports = {
  parseRedisConnectionString,
}
