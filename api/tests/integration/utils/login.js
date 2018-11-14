'use strict'

const request = require('supertest')
const app = require('../../../src/app')

module.exports = {
  loginUser,
  loginOrganizer,
}

async function loginUser(body) {
  console.log(body) // eslint-disable-line no-console
  const response = await request(app)
    .post('/api/session/user')
    .send(body)
    .expect('Content-Type', /json/u)
    .expect(200)
  return response.body
}

async function loginOrganizer(server, organizer) {
  const response = await request(server)
    .post('/api/session/organizer')
    .send({
      username: organizer.email,
      password: organizer.password,
    })
    .expect('Content-Type', /json/u)
    .expect(200)
  return response.body
}
