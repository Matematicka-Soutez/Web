const request = require('supertest')
const app = require('../../../server/app')

module.exports = {
  loginUser,
  loginAdmin,
}

async function loginUser(body) {
  console.log(body) // eslint-disable-line no-console
  const response = await request(app)
    .post('/api/session/user')
    .send(body)
    .expect('Content-Type', /json/)
    .expect(200)
  return response.body
}

async function loginAdmin(body) {
  const response = await request(app)
    .post('/api/session/admin')
    .send(body)
    .expect('Content-Type', /json/)
    .expect(200)
  return response.body
}
