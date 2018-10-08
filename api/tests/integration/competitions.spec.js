'use strict'

require('chai').should()
const request = require('supertest')
const initDb = require('../data/init')

describe('Competition API endpoints: /api/competitions', function competitionAPI() {
  describe('Get Timer: /api/competitions/current/timer', function getCompetitionTimer() {
    before(async function() {
      this.data = await initDb()
    })

    it('SUCCESS 200 - get timer', async function getTimer() {
      const res = await request(this.server)
        .get('/api/competitions/current/timer')
        .expect('Content-Type', /json/u)
        .expect(200)
      res.body.should.have.own.property('start')
      res.body.should.have.own.property('end')
      res.body.start.should.be.a('number')
      res.body.end.should.be.a('number')
      res.body.start.should.be.below(res.body.end)
    })
  })

  describe('Get Teams By Venue: /api/competitions/current/teams', function getTeamsByVenue() {
    before(async function() {
      this.data = await initDb()
    })

    it('SUCCESS 200 - get teams', async function getTeams() {
      await request(this.server)
        .get('/api/competitions/current/teams')
        .expect('Content-Type', /json/u)
        .expect(200)
      // TODO: finish this with actual team data
    })
  })
})
