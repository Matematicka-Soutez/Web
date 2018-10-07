'use strict'

const Router = require('koa-router')
const controllers = require('./controllers')

const publicRouter = new Router()
publicRouter.get('/grid', controllers.getCurrentGrid)
publicRouter.get('/results', controllers.getResults)

const organizerRouter = new Router()
organizerRouter.put('/init', controllers.initGame)
organizerRouter.put('/move', controllers.moveTeam)
organizerRouter.put('/revert-move', controllers.revertMove)
organizerRouter.get('/teams/:teamId/position', controllers.getTeamPosition)

module.exports = {
  publicGameRoutes: publicRouter.routes(),
  organizerGameRoutes: organizerRouter.routes(),
}
