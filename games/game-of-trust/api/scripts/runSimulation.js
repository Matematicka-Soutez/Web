'use strict'

Promise = require('bluebird')
const request = require('request-promise')
const config = require('../../../../config/index')
const { STRATEGIES } = require('../../core/enums')

const AUTH = 'JWT TOKEN' // eslint-disable-line max-len

async function runSimulation() {
  while (true) { // eslint-disable-line no-constant-condition
    const sleepTime = Math.random() * 300
    await Promise.delay(sleepTime) // eslint-disable-line no-await-in-loop
    const body = {
      teamId: Math.floor((Math.random() * 114) + 1),
      strategyId: Math.floor((Math.random() * STRATEGIES.idsAsEnum.length) + 1),
    }
    await request({ // eslint-disable-line no-await-in-loop
      method: 'PUT',
      uri: `${config.hostname}/api/org/competitions/current/game/change-strategy`,
      headers: {
        Authorization: AUTH,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
  }
}

runSimulation()
