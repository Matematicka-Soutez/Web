/* eslint-disable max-len */

const nock = require('nock')
const config = require('../config')
const app = require('../server/app')
const log = require('../server/utils/logger').logger

const nockSendGrid = () => {
  nock('https://api.sendgrid.com')
    .post('/v3/mail/send')
    .times(100)
    .reply(200, { message: 'success' })
}

beforeEach(() => {
  nockSendGrid()
})

before(async function before() {
  if (config.database.connectionString.indexOf('localhost') < 0 && !config.server.isTravis) {
    log.warn('!!WARNING: You are trying to RUN tests on external database. Please use local database instead :WARNING!!')
    process.exit(129) // eslint-disable-line no-process-exit
  }
  await app.start()
  this.app = app
  this.server = app.server
  log.info('==> In test mode.')
})

after(async function after() {
  await this.app.stop()
})
