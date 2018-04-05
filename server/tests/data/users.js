const db = require('../../src/database')
const enums = require('../../src/common/enums')
const crypto = require('../../src/utils/crypto')
const Chance = require('chance')
const _ = require('lodash')

const chance = new Chance()

module.exports = initUsers

async function initUsers() {
  const newcomer = {
    email: chance.email({ domain: 'sink.sendgrid.net' }),
  }

  const stage2 = {
    firstName: chance.first(),
    lastName: chance.last(),
    genderId: chance.pick(enums.GENDER.idsAsEnum),
    dob: chance.birthday({ string: true }),
    email: chance.email({ domain: 'sink.sendgrid.net' }),
  }

  const unconfirmed = {
    firstName: chance.first(),
    lastName: chance.last(),
    genderId: chance.pick(enums.GENDER.idsAsEnum),
    dob: chance.birthday({ string: true }),
    email: chance.email({ domain: 'sink.sendgrid.net' }),
    confirmed: false,
  }

  const confirmed = {
    firstName: chance.first(),
    lastName: chance.last(),
    genderId: chance.pick(enums.GENDER.idsAsEnum),
    dob: chance.birthday({ string: true }),
    email: chance.email({ domain: 'sink.sendgrid.net' }),
    weight: chance.integer({ min: 1, max: 300 }),
    height: chance.integer({ min: 30, max: 250 }),
    weeklyExcerciseFrequencyId: chance.pick(enums.WEEKLY_EXCERCISE_FREQUENCY.idsAsEnum),
    confirmed: false,
  }

  const ordinal = {
    firstName: chance.first(),
    lastName: chance.last(),
    genderId: chance.pick(enums.GENDER.idsAsEnum),
    dob: chance.birthday({ string: true }),
    email: chance.email({ domain: 'sink.sendgrid.net' }),
    password: chance.word({ length: 10 }),
    weight: chance.integer({ min: 1, max: 300 }),
    height: chance.integer({ min: 30, max: 250 }),
    weeklyExcerciseFrequencyId: chance.pick(enums.WEEKLY_EXCERCISE_FREQUENCY.idsAsEnum),
    confirmed: true,
  }
  ordinal.addressId = await createAddress(ordinal.firstName, chance.last(), true)

  const subscriber = {
    firstName: chance.first(),
    lastName: chance.last(),
    genderId: chance.pick(enums.GENDER.idsAsEnum),
    dob: chance.birthday({ string: true }),
    email: chance.email({ domain: 'sink.sendgrid.net' }),
    password: chance.word({ length: 10 }),
    weight: chance.integer({ min: 1, max: 300 }),
    height: chance.integer({ min: 30, max: 250 }),
    weeklyExcerciseFrequencyId: chance.pick(enums.WEEKLY_EXCERCISE_FREQUENCY.idsAsEnum),
    confirmed: true,
  }
  subscriber.addressId = await createAddress(subscriber.firstName, subscriber.lastName, true)

  return {
    newcomer,
    stage2: await createUser(stage2),
    unconfirmed: await createUser(unconfirmed),
    confirmed: await createUser(confirmed),
    ordinal: await createUser(ordinal),
    subscriber: await createUser(subscriber),
  }
}

/* PRIVATE METHODS */

async function createUser(user) {
  const newUser = _.cloneDeep(user)
  if (newUser.password) {
    newUser.password = await crypto.hashPassword(newUser.password)
  }
  const created = await db.User.create(newUser)
  user.id = created.id
  return user
}

async function createAddress(firstName, lastName, allowedState = true) {
  const states = enums.STATES.idsAsEnum.filter(id => enums.STATES.ids[id].allowed === allowedState)
  const address = await db.Address.create({
    firstName,
    lastName,
    stateId: chance.pick(states),
    city: chance.city(),
    street: chance.address(),
    zip: chance.zip(),
  })
  return address.id
}
