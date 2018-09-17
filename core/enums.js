'use strict'

const enumize = require('./enumize')

const COUNTRIES = enumize({
  CZECH_REPUBLIC: { id: 1, name: 'Česká Republika', abbreviation: 'ČR', allowed: true },
  SLOVAKIA: { id: 2, name: 'Slovenská Republika', abbreviation: 'SK', allowed: true },
})

const ROLES = enumize({
  ADMIN: { id: 1, name: 'Administrátor' },
  DRAFTSMAN: { id: 2, name: 'Kreslič' },
})

module.exports = {
  COUNTRIES,
  ROLES,
}
