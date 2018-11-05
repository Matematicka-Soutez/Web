/* eslint-disable no-console, max-len, no-sync */
'use strict'

Promise = require('bluebird')
const fs = require('fs')
const path = require('path')
const parse = require('csv-parse/lib/sync')
const _ = require('lodash')
const config = require('../../config/index')
const enums = require('../../core/enums')
const db = require('../src/database/index')
const crypto = require('../src/utils/crypto')
const initEnums = require('../tests/data/enums')
const initStatic = require('../tests/data/static')
const initUsers = require('../tests/data/users')

async function syncDb() {
  if (config.env === 'production' || config.env === 'staging') {
    throw new Error('!!! dbsync can\'t be run in production or staging !!!')
  }
  try {
    const force = config.env === 'local' || config.env === 'test'
    await db.sequelize.sync({ force })
    if (force === true) {
      await initEnums()
      await initStatic()
      await importOldDb()
      await initUsers()
    }
    await db.sequelize.close()
    console.log('DB is synced.')
  } catch (err) {
    console.error(err)
    throw new Error('Dbsync failed')
  }
  return true
}

async function importOldDb() {
  const schools = await importSchools()
  await importTeachers(schools)
  // await importTeams(schools)
}

function importSchools() {
  const input = fs.readFileSync(path.resolve(__dirname, 'importData/skoly.csv'))
  const schools = parse(input, { columns: true, delimiter: ';' })
  return Promise.map(schools, async school => {
    const title1 = school.SK_NAZOV.trim()
    const title2 = school.short_name.trim()
    const short = title1.length <= title2.length ? title1 : title2
    const long = title1.length <= title2.length ? title2 : title1
    const address = await db.Address.create({
      titleLine1: 'Kabinet matematiky',
      titleLine2: short,
      countryId: school.state === 'CZE' ? enums.COUNTRIES.CZECH_REPUBLIC.id : enums.COUNTRIES.SLOVAKIA.id,
      city: school.city.trim(),
      street: school.address.trim(),
      zip: school.zip.trim(),
    })
    const created = await db.School.create({
      shortName: short,
      fullName: long,
      aesopId: school.ovvp_id.trim(),
      accessCode: school.KOD.trim(),
      addressId: address.id,
    })
    return _.assign({}, school, { addressId: address.id, id: created.id })
  })
}

function importTeachers(schools) {
  const input = fs.readFileSync(path.resolve(__dirname, 'importData/teachers.csv'))
  const teachers = parse(input, { columns: true, delimiter: ';' })
  return Promise.map(teachers, async teacher => {
    const school = schools.find(item => item.SKOLA_ID === teacher.sid)
    const name = teacher.name.trim().split(' ')
    if (teacher.name.trim() === 'Pavlína Vágenknechtová Edrová') {
      name[1] = `${name[1]} ${name[2]}`
      name.splice(2, 1)
    }
    const phone = teacher.phone.trim()
    const created = await db.Teacher.create({
      title: name.length === 3 ? name[0] : '',
      firstName: name.length === 3 ? name[1] : name[0],
      lastName: name.length === 3 ? name[2] : name[1],
      email: teacher.email.trim(),
      phone: phone === '' ? null : `+420 ${phone}`,
      password: await crypto.hashPassword(school.KOD.trim()),
    })
    school.teacher = _.assign({}, teacher, { id: created.id })
    return school.teacher
  })
}

function importTeams(schools) { // eslint-disable-line no-unused-vars
  const input = fs.readFileSync(path.resolve(__dirname, 'importData/druzstva.csv'))
  const teams = parse(input, { columns: true, delimiter: ';' })
  return Promise.map(teams, async team => {
    const school = schools.find(item => item.SKOLA_ID === team.SKOLA_ID)
    const created = await db.Team.create({
      name: team.DR_NAZOV.trim(),
      teacherId: school.teacher.id,
      schoolId: school.id,
      competitionVenueId: team.site.trim().toLowerCase() === 'praha' ? 1 : 2,
    })
    const teamMembers = await importTeamMembers(created.id, team)
    school.team = _.assign({}, team, { id: created.id, teamMembers })
    return school.team
  })
}

async function importTeamMembers(teamId, team) {
  const manNames = ['Marek', 'Jan', 'Ondřej', 'Adam', 'Šimon', 'Jiří', 'Daniel', 'Matěj', 'David', 'Tomáš', 'Radek', 'Arnošt', 'Tadeáš', 'Jakub', 'Václav', 'Pavel', 'Samuel']
  const members = await Promise.map([1, 2, 3, 4], i => {
    const name = team[`MP${i}`] && team[`MP${i}`].trim()
      ? team[`MP${i}`].trim().split(' ')
      : null
    if (name && name.length > 0) {
      let firstName = name.length > 1 ? name[0] : ''
      let lastName = name.length > 1 ? name[1] : name[0]
      if (name.length === 2 && (name[0].slice(-1) === 'á' || manNames.includes(name[1]))) {
        firstName = name[1]
        lastName = name[0]
      }
      if (name.length > 2) {
        const firstNames = ['Thomas', 'Anna', 'Julie', 'Anh', 'Lumir', 'Ondřej', 'A.', 'Matěj', 'Ludmila']
        const suffix = name.length > 3 ? ` ${name[3]}` : ''
        if (firstNames.includes(name[1])) {
          firstName = `${name[0]} ${name[1]}`
          lastName = name[2] + suffix
        } else {
          lastName = `${name[1]} ${name[2]}${suffix}`
        }
      }
      return db.TeamMember.create({
        teamId,
        firstName: _.upperFirst(firstName),
        lastName: _.upperFirst(lastName),
        grade: Number(team[`T${i}`].trim()),
      })
    }
    return null
  })
  return _.remove(members, null)
}

return syncDb()

