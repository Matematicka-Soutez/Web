'use strict'

Promise = require('bluebird')
const fs = require('fs')
const path = require('path')
const request = require('request-promise')

async function prepareDiplomas() {
  const response = await request({
    method: 'GET',
    uri: 'https://maso23.herokuapp.com/api/competitions/current/game/results',
  })
  const results = JSON.parse(response)
  const diplomaData = results.map(result => ({
    venue: result.room === 'GML' ? 'Brno' : 'Praha',
    rank: `za ${result.place} místo`,
    team: `${result.teamName} (${result.school})`,
    teamMembers1: `${result.teamMembers[0] && result.teamMembers[0].name}, ${result.teamMembers[1] && result.teamMembers[1].name},`, // eslint-disable-line max-len
    teamMembers2: `${result.teamMembers[2] && result.teamMembers[2].name}${result.teamMembers[3] && `, ${result.teamMembers[3].name}`}`, // eslint-disable-line max-len
    dateAndLocation: `V ${result.room === 'GML' ? 'Brně' : 'Praze'} dne 6. 11. 2018`,
  }))
  const diplomaPairsPrague = []
  let last = {}
  diplomaData
    .filter(result => result.venue === 'Praha')
    .forEach((data, index) => {
      if (index % 2 === 0) {
        last = {
          rankA: `za ${index + 1}. místo`,
          teamA: data.team,
          teamMembers1A: data.teamMembers1,
          teamMembers2A: data.teamMembers2,
          dateAndLocationA: data.dateAndLocation,
        }
      } else {
        last = {
          ...last,
          rankB: `za ${index + 1}. místo`,
          teamB: data.team,
          teamMembers1B: data.teamMembers1,
          teamMembers2B: data.teamMembers2,
          dateAndLocationB: data.dateAndLocation,
        }
        diplomaPairsPrague.push(last)
      }
    })
  console.log(diplomaPairsPrague.slice(0, 5)) // eslint-disable-line no-console

  await Promise.mapSeries(diplomaPairsPrague.slice(0, 5), async (diplomaPair, index) => {
    const res = await request({
      method: 'POST',
      uri: 'http://localhost:3000/docs/create/diplomy',
      headers: {
        'x-api-key': 'd41d8cd98f00b204e9800998ecf8427e',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(diplomaPair),
      encoding: null,
    })
    await fs.writeFileSync(path.join(__dirname, `./tisk/praha${index}.pdf`), res) // eslint-disable-line no-sync, max-len
  })


  const diplomaPairsBrno = []
  last = {}
  diplomaData
    .filter(result => result.venue === 'Brno')
    .forEach((data, index) => {
      if (index % 2 === 0) {
        last = {
          rankA: `za ${index + 1}. místo`,
          teamA: data.team,
          teamMembers1A: data.teamMembers1,
          teamMembers2A: data.teamMembers2,
          dateAndLocationA: data.dateAndLocation,
        }
      } else {
        last = {
          ...last,
          rankB: `za ${index + 1}. místo`,
          teamB: data.team,
          teamMembers1B: data.teamMembers1,
          teamMembers2B: data.teamMembers2,
          dateAndLocationB: data.dateAndLocation,
        }
        diplomaPairsBrno.push(last)
      }
    })
  console.log(diplomaPairsBrno.slice(0, 5)) // eslint-disable-line no-console

  await Promise.mapSeries(diplomaPairsBrno.slice(0, 2), async (diplomaPair, index) => {
    const res = await request({
      method: 'POST',
      uri: 'http://localhost:3000/docs/create/diplomy',
      headers: {
        'x-api-key': 'd41d8cd98f00b204e9800998ecf8427e',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(diplomaPair),
      encoding: null,
    })
    await fs.writeFileSync(path.join(__dirname, `./tisk/brno${index}.pdf`), res) // eslint-disable-line no-sync, max-len
  })

  const specialAwards = {
    ...diplomaPairsPrague[0],
    rankA: 'za absolutní vítězství',
    rankB: 'pro nejlepší základní školu',
    teamB: 'Masožrouti (ZŠ Šutka)',
    teamMembers1B: 'Jiří Krejcar, Miroslav Mrázek,',
    teamMembers2B: 'Tomáš Vašíček, Michal Stránský',
    dateAndLocationB: 'V Praze dne 6. 11. 2018',
  }
  const res = await request({
    method: 'POST',
    uri: 'http://localhost:3000/docs/create/diplomy',
    headers: {
      'x-api-key': 'd41d8cd98f00b204e9800998ecf8427e',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(specialAwards),
    encoding: null,
  })
  await fs.writeFileSync(path.join(__dirname, `./tisk/special${5}.pdf`), res) // eslint-disable-line no-sync, max-len
}

prepareDiplomas()
