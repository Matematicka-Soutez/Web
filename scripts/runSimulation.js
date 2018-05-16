const request = require('request-promise')
const Promise = require('bluebird')

const SERVER = 'https://maso23.herokuapp.com'
const AUTH = 'JWT TOKEN' // eslint-disable-line max-len

async function runSimulation() {
  while (true) { // eslint-disable-line no-constant-condition
    const sleepTime = Math.random() * 300
    await Promise.delay(sleepTime) // eslint-disable-line no-await-in-loop
    const body = {
      teamId: Math.floor((Math.random() * 114) + 1),
      directionId: Math.floor((Math.random() * 5) + 1),
    }
    await request({ // eslint-disable-line no-await-in-loop
      method: 'PUT',
      uri: `${SERVER}/api/org/game/move`,
      headers: {
        Authorization: AUTH,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
  }
}

runSimulation()
