/* eslint-disable no-console, max-len, no-sync */
'use strict'

Promise = require('bluebird')
const fs = require('fs')
const path = require('path')
const parse = require('csv-parse/lib/sync')
const stringify = require('csv-stringify/lib/sync')
const request = require('request-promise')
const readlineSync = require('readline-sync')
const nodemailer = require('nodemailer')
const _ = require('lodash')

const SERVER = 'https://maso23.herokuapp.com'
const INPUT_LINK = `${SERVER}/hra/admin/`

async function generateLinks() {
  try {
    const input = fs.readFileSync(path.resolve(__dirname, 'draftsmen.csv'))
    const draftsmen = parse(input, { columns: true, delimiter: ';', comment: '#' })
    await signUp(draftsmen)

    if (readlineSync.keyInYN('Draftsmen signed up, shall we log them in now?')) {
      // 'Y' key was pressed.
      const accessLinks = await login(draftsmen)
      const csv = stringify(accessLinks, { header: true, delimiter: ';' })
      fs.writeFileSync(path.resolve(__dirname, 'draftsmen-access.csv'), csv)
      console.log('Access links were saved.')

      if (readlineSync.keyInYN('Shall we send drftsmen invite mail?')) {
        await email(accessLinks)
        console.log('Access links were mailed.')
      }
    } else {
      // Another key was pressed.
      console.log('Ok, maybe some other time.')
    }
  } catch (err) {
    console.error(err)
    throw new Error('Link generation failed')
  }
  return true
}

function signUp(draftsmen) {
  return Promise.mapSeries(draftsmen, async draftsman => {
    await request({ // eslint-disable-line no-await-in-loop
      method: 'POST',
      uri: `${SERVER}/api/organizers`,
      json: true,
      body: draftsman,
    })
  })
}

function login(draftsmen) {
  return Promise.mapSeries(draftsmen, async draftsman => {
    const response = await request({ // eslint-disable-line no-await-in-loop
      method: 'POST',
      uri: `${SERVER}/api/session/organizer`,
      json: true,
      body: {
        username: draftsman.email,
        password: draftsman.password,
      },
    })
    return {
      ...draftsman,
      accessLink: INPUT_LINK + response.accessToken,
    }
  })
}

function email(accessLinks) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'erhart.jiri@gmail.com',
      pass: 'lanosrepretupmoc',
    },
  })

  const text = accessLink => `
Ahoj ${accessLink.name},

moc Ti děkuji, že ses ujal${accessLink.gender === 'f' ? 'a' : ''} důležité funkce kresliče na jarním MaSu 2018.

Určitě jsi už četl${accessLink.gender === 'f' ? 'a' : ''} pravidla hry, tak se zkusím zmínit jen krátce k zadávátku tahů. Do zadávátka se dostaneš přes tento odkaz:

${accessLink.accessLink}

Odkaz je jen Tvůj a umožňuje pohybovat týmy od teď do vyhlášení soutěže. Proto prosím:
 - odkaz nikde neukazuj a nesdílej, nesmí se k němu dostat soutěžící
 - zadávej jen tahy o které Tě týmy budou žádat v herním čase

Tip: Pokud se uklikneš, co nejrychleji svou chybu vrať pomocí tlačítka "VRÁTIT ZMĚNU". Hra se vyhodnocuje každých deset vteřin a nechceme žádnému týmu naší chybou přilepšit ani ublížit.

MaSu zdar
Jirka Erhart
`

  const mailOptions = {
    from: 'erhart.jiri@gmail.com',
    subject: 'MaSo hra 2018',
  }
  return Promise.mapSeries(accessLinks, async accessLink => {
    const options = _.assign({}, mailOptions, {
      to: accessLink.email,
      text: text(accessLink),
    })
    try {
      const info = await transporter.sendMail(options)
      console.log(`Email for ${accessLink.email} sent: ${info.response}`)
    } catch (err) {
      console.log(`EMAIL FAIL ${accessLink.email}: `, err)
    }
  })


}

return generateLinks()

