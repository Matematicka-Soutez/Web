'use strict'

const schedule = require('node-schedule')
const moment = require('moment')
const gameConfig = require('../config.json')
const log = require('../../../core/logger').workerLogger
const ScoreTeamsService = require('../api/src/services/ScoreTeams')

function init(competition) {
  const job = async invoked => {
    log.info(`Watter bottling evaluation started ${invoked}/${new Date()}`)
    await new ScoreTeamsService().execute({ competitionId: competition.id })
    log.info(`Watter bottling evaluation ended ${new Date()}`)
  }

  const scheduledJobs = []
  const rules = computeRules(competition)
  rules.forEach(rule => {
    const scheduledJob = schedule.scheduleJob(rule, job)
    scheduledJobs.push(scheduledJob)
  })
}

function computeRules(competition) {
  const rules = []
  const start = moment(competition.start)
  const end = moment(competition.end).add(gameConfig.game.afterEndRunTime, 'seconds')

  if (start.isSame(end, 'hour')) {
    const rule = getRecurrenceRuleDefaults(start)
    rule.minute = [new schedule.Range(start.minute(), end.minute())]
    rule.hour = start.hour()
    rules.push(rule)
    return rules
  }

  const ruleStart = getRecurrenceRuleDefaults(start)
  ruleStart.minute = [new schedule.Range(start.minute(), 59)]
  ruleStart.hour = start.hour()
  rules.push(ruleStart)

  const middle = start.clone().add(1, 'hour').minute(0)
  while (middle.hour() < end.hour()) {
    const ruleMiddle = getRecurrenceRuleDefaults(middle)
    ruleMiddle.minute = [new schedule.Range(0, 59)]
    ruleMiddle.hour = middle.hour()
    rules.push(ruleMiddle)
    middle.add(1, 'hour')
  }

  const ruleEnd = getRecurrenceRuleDefaults(end)
  ruleEnd.minute = [new schedule.Range(0, end.minute())]
  ruleEnd.hour = end.hour()
  rules.push(ruleEnd)

  return rules
}

function getRecurrenceRuleDefaults(date) {
  const rule = new schedule.RecurrenceRule()
  rule.second = [0, 10, 20, 30, 40, 50]
  rule.date = date.date()
  rule.month = date.month()
  rule.year = date.year()
  return rule
}

module.exports = {
  init,
}
