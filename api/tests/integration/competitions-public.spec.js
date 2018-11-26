'use strict'

require('chai').should()
const request = require('supertest')
const initDb = require('../data/init')
const db = require('../../src/database')

describe('Public competition API endpoints: /api/competitions', function competitionAPI() {
  describe('Get Timer: GET /api/competitions/current/timer', function getCompetitionTimer() {
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

  describe('Get Teams By Venue: GET /api/competitions/current/teams', function getTeamsByVenue() {
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

  describe('Update team solution: PUT /api/competitions/current/team-solutions', function getTeamsByVenue() {
    before(async function() {
      this.data = await initDb()
      await db.sequelize.query('UPDATE public."Teams" SET number = id')
    })

    it('ERROR 401 - should get unauthorized on unknown password', async function getTeams() {
      await request(this.server)
        .put('/api/competitions/current/team-solutions')
        .send({
          action: 'add',
          team: 3,
          problem: 42,
          password: 'unknown-password',
        })
        .expect('Content-Type', /json/u)
        .expect(401, {
          type: 'UNAUTHORIZED',
          message: 'Heslo není platné.',
        })
    })

    it('ERROR 400 - should fail on unknown team number', async function getTeams() {
      await request(this.server)
        .put('/api/competitions/current/team-solutions')
        .send({
          action: 'add',
          team: 123,
          problem: 42,
          password: 'zluty-bagr',
        })
        .expect('Content-Type', /json/u)
        .expect(400, {
          type: 'BAD_REQUEST',
          message: 'Tým nebyl nalezen.',
        })
    })

    it('ERROR 400 - should fail on out of range problem number', async function getTeams() {
      await request(this.server)
        .put('/api/competitions/current/team-solutions')
        .send({
          action: 'add',
          team: 3,
          problem: 101,
          password: 'zluty-bagr',
        })
        .expect('Content-Type', /json/u)
        .expect(400, {
          type: 'BAD_REQUEST',
          message: 'Požadavek postrádá nebo obsahuje neplatná data.',
        })
    })

    it('ERROR 400 - should fail on missing action', async function getTeams() {
      await request(this.server)
        .put('/api/competitions/current/team-solutions')
        .send({
          team: 3,
          problem: 42,
          password: 'zluty-bagr',
        })
        .expect('Content-Type', /json/u)
        .expect(400, {
          type: 'BAD_REQUEST',
          message: 'Požadavek postrádá nebo obsahuje neplatná data.',
        })
    })

    it('SUCCESS 200 - should update team solution to solved', async function getTeams() {
      const { body } = await request(this.server)
        .put('/api/competitions/current/team-solutions')
        .send({
          action: 'add',
          team: 3,
          problem: 42,
          password: 'zluty-bagr',
        })
        .expect('Content-Type', /json/u)
        .expect(200)
      body.should.deep.include({
        id: 1,
        competitionId: 2,
        teamId: 3,
        teamNumber: 3,
        problemNumber: 42,
        solved: true,
        createdBy: 2,
      })
      // Test the TeamSolution View is also correct
      const solution = await db.TeamSolution.findOne({
        where: {
          competitionId: 2,
          teamId: 3,
          problemNumber: 42,
          createdBy: 2,
        },
      })
      solution.solved.should.equal(true)
    })

    it('SUCCESS 200 - should cancel team solution', async function getTeams() {
      const { body } = await request(this.server)
        .put('/api/competitions/current/team-solutions')
        .send({
          action: 'cancel',
          team: 3,
          problem: 42,
          password: 'super-tajny-token',
        })
        .expect('Content-Type', /json/u)
        .expect(200)
      body.should.deep.include({
        id: 2,
        competitionId: 2,
        teamId: 3,
        teamNumber: 3,
        problemNumber: 42,
        solved: false,
        createdBy: 3,
      })
      // Test the TeamSolution View is also correct
      const solution = await db.TeamSolution.findOne({
        where: {
          competitionId: 2,
          teamId: 3,
          problemNumber: 42,
          createdBy: 3,
        },
      })
      solution.solved.should.equal(false)
    })
  })
})
