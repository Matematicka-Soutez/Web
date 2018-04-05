const moment = require('moment')

module.exports = {
  dateToISO,
}

function dateToISO(date) {
  return moment.tz(date, 'America/Los_Angeles').toISOString()
}
