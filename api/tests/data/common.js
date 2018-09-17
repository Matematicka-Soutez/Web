'use strict'

Promise = require('bluebird')
const Chance = require('chance')
const _ = require('lodash')
const { createSchool, createTeam, createN } = require('./generators')

const chance = new Chance()

const NUMBER_OF_SCHOOLS = 20

async function initCommon() {
  const schools = await initSchools()
  const teams = await initTeams(schools)
  return { schools, teams }
}

function initSchools() {
  return createN(NUMBER_OF_SCHOOLS, createSchool)
}

async function initTeams(schools) {
  const teams = await Promise.map(schools, school => {
    const teamCount = chance.integer({ min: 1, max: 3 })
    return createN(teamCount, () => createTeam({
      schoolId: school.id,
      teacherId: school.teacher.id,
    }))
  })
  return _.flatten(teams)
}

module.exports = initCommon
