'use strict'

const Router = require('koa-router')
const controllers = require('./controllers')

const publicRouter = new Router()
publicRouter.get('/tournament/results', controllers.getTournamentResults)
publicRouter.get('/results', controllers.getResults)

const organizerRouter = new Router()
organizerRouter.put('/init', controllers.initGame)
organizerRouter.put('/change-strategy', controllers.changeTeamStrategy)
organizerRouter.put('/revert-change', controllers.revertChange)
organizerRouter.get('/teams/:teamId/strategy', controllers.getTeamStrategy)

module.exports = {
  publicGameRoutes: publicRouter.routes(),
  organizerGameRoutes: organizerRouter.routes(),
}
