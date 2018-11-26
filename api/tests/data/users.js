'use strict'

const enums = require('../../../core/enums')
const { createOrganizer, createTeacher } = require('./generators')

async function initUsers() {
  const teacher = {
    firstName: 'Josef',
    lastName: 'Pedagog',
    email: 'pedagog@sink.sendgrid.net',
    phone: '+420 722 959 878',
    password: 'Password123!',
    schooldId: 1,
  }

  const newcomer = {
    firstName: 'František',
    lastName: 'Nový',
    email: 'novy@sink.sendgrid.net',
    password: 'Password123!',
    problemScanningToken: 'jamujici-plostice',
  }

  const unconfirmed = {
    firstName: 'Anička',
    lastName: 'Nedoregistrovaná',
    email: 'nedoregistrovana@sink.sendgrid.net',
    confirmed: false,
    roleId: enums.ROLES.DRAFTSMAN.id,
  }

  const draftsman = {
    firstName: 'Jarda',
    lastName: 'Kreslič',
    email: 'kreslic@sink.sendgrid.net',
    password: 'Password123!',
    confirmed: true,
    roleId: enums.ROLES.DRAFTSMAN.id,
    problemScanningToken: 'zluty-bagr',
  }

  const admin = {
    firstName: 'Ondra',
    lastName: 'Administrátor',
    email: 'admin@sink.sendgrid.net',
    password: 'Password123!',
    confirmed: true,
    roleId: enums.ROLES.ADMIN.id,
    problemScanningToken: 'super-tajny-token',
  }

  return {
    teacher: await createTeacher(teacher),
    organizers: {
      newcomer,
      unconfirmed: await createOrganizer(unconfirmed),
      draftsman: await createOrganizer(draftsman),
      admin: await createOrganizer(admin),
    },
  }
}

module.exports = initUsers
