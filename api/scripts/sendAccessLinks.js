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

      if (readlineSync.keyInYN('Shall we send draftsmen invite mail?')) {
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
      pass: process.env.ERHART_PASS, // eslint-disable-line no-process-env
    },
  })

  const text = accessLink => `
Ahoj ${accessLink.name},

moc Ti děkuji, že ses ujal${accessLink.gender === 'f' ? 'a' : ''} důležité funkce kresliče/měniče na podzimním MaSu 2018.

POKYNY PRO KRESLIČE
Určitě jsi už četl${accessLink.gender === 'f' ? 'a' : ''} pravidla hry, tak se zkusím zmínit jen krátce k zadávátku strategií. Do zadávátka se dostaneš ve dvou krocích:

1. Otevři si ${SERVER}
2. Jakmile se odkaz jednou načte, můžeš pokračovat do zadávání tady: ${accessLink.accessLink}

Odkaz do zadávání je jen Tvůj a umožňuje měnit strategie týmů od teď do vyhlášení soutěže. Proto prosím:
 - odkaz nikde neukazuj a nesdílej, nesmí se k němu dostat soutěžící
 - zadávej jen tahy, o které Tě týmy budou žádat v herním čase

Tip: Pokud se uklikneš, co nejrychleji svou chybu vrať pomocí tlačítka "VRÁTIT POSLEDNÍ ZMĚNU". Turnajů bude během soutěže jen 90 a nechceme žádnému týmu naší chybou přilepšit ani ublížit.

Poznámka: Strategii lze předplatit jen právě na 4 turnaje od kliknutí v zadávátku. Pokud tou dobou měl tým některou strategii vybranou, o zbývající účasti v turnajích s ní přichází. Strategii nelze předplatit na jinou (delší/kratší) dobu než 4 turnaje.

POKYNY PRO MĚNIČE
Role měniče se nám od tohoto ročníku trochu mění. Jde o první nesmělý krok ke zrychlení vyhodnocování a automatizaci celé soutěže, proto nepanikař, když něco nebude fungovat. I s takovou variantou počítáme a soutěž zvládneme.

Na příkladech se nově objevily QR kódy. Ty slouží pro rychlé zadávání vyřešených úloh do systému. Tvým úkolem bude krom vybírání vyřešených příkladů a vydávání nových příkladů týmům také skenování všech vyřešených příkladů. Slouží k tomu jednoduchá aplikace na telefon, kterou stáhneš zde:

https://play.google.com/store/apps/details?id=cz.cuni.mff.maso

Aplikaci si prosím nainstaluj a ujisti se, že máš telefon nabitý a spolehlivě připojený k internetu. Aplikaci vyzkoušej předem na nějakých přilehlých příkladech, jen nezapomeň přidané příklady zase odebrat. Abys mohl${accessLink.gender === 'f' ? 'a' : ''} příklady skenovat, budeš potřebovat následující heslo:

${accessLink.problemScanningToken}

Heslo Tě identifikuje v systému. Prosím postarej se, ať se nedostane k dětem. S heslem může aplikaci používat kdokoliv.

Tip: Pokud QR kód nelze naskenovat, aplikace umožňuje ho zadat ručně.
Tip 2: Pokud si nejsi jist${accessLink.gender === 'f' ? 'á' : 'ý'} opakované naskenování kódu nic nepokazí.
Tip 3: Nezapomeň naskenovat i příklady opravené po konci soutěžní doby, jinak se týmům nezapočtou.

Poznámka: Zkoušej kódy skenovat co nejvíc průběžně. Postupem času chceme eliminovat kresliče a proto potřebujeme mít vyřešené příklady v systému ideálně hned po opravení. Pokud to nepůjde, dej mi vědět, i to je cenná informace.

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

