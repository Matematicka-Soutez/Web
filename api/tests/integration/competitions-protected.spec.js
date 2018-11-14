'use strict'

require('chai').should()
const request = require('supertest')
const initDb = require('../data/init')
const { loginOrganizer } = require('./utils/login')

describe('Protected competition API endpoints: /api/org/competitions/current', function competitionAPI() {
  describe('Get Venues: GET /api/org/competitions/current/venues', function getCompetitionVenues() {
    before(async function() {
      this.data = await initDb()
      this.admin = await loginOrganizer(this.server, this.data.organizers.admin)
      this.draftsman = await loginOrganizer(this.server, this.data.organizers.draftsman)
    })

    it('ERROR 401 - Unauthorized', async function failOnUnauthorized() {
      await request(this.server)
        .get('/api/org/competitions/current/venues')
        .set('Authorization', 'JWT ')
        .expect('Content-Type', /json/u)
        .expect(401)
    })

    it('SUCCESS 200 - get venues for admin', async function getVenuesForAdmin() {
      const res = await request(this.server)
        .get('/api/org/competitions/current/venues')
        .set('Authorization', `JWT ${this.admin.accessToken}`)
        .expect('Content-Type', /json/u)
        .expect(200)
      validateVenues(res.body)
    })

    it('SUCCESS 200 - get venues for admin', async function getVenuesForDraftsman() {
      const res = await request(this.server)
        .get('/api/org/competitions/current/venues')
        .set('Authorization', `JWT ${this.draftsman.accessToken}`)
        .expect('Content-Type', /json/u)
        .expect(200)
      validateVenues(res.body)
    })
  })
})

function validateVenues(venues){
  venues.should.be.an('array').of.length(2)
  venues[0].should.deep.include({
    id: 1,
    name: 'Praha',
    capacity: 86,
  })
  venues[0].rooms.should.deep.include({ id: 1, name: 'S3', defaultCapacity: 24, capacity: 24, teams: [] })
  venues[0].rooms.should.deep.include({ id: 2, name: 'S4', defaultCapacity: 14, capacity: 14, teams: [] })
  venues[0].rooms.should.deep.include({ id: 3, name: 'S5', defaultCapacity: 24, capacity: 24, teams: [] })
  venues[0].rooms.should.deep.include({ id: 4, name: 'S9', defaultCapacity: 24, capacity: 24, teams: [] })
  venues[1].should.deep.include({
    id: 2,
    name: 'Brno',
    capacity: 30,
    rooms: [{
      id: 5,
      name: 'GML',
      defaultCapacity: 30,
      capacity: 30,
      teams: [],
    }],
  })

}