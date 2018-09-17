'use strict'

const Router = require('koa-router')
const handlers = require('./handlers')

const publicRouter = new Router()
publicRouter.get('/grid', handlers.getCurrentGrid)
publicRouter.get('/results', handlers.getResults)

const organizerRouter = new Router()
organizerRouter.put('/init', handlers.initGame)
organizerRouter.put('/move', handlers.moveTeam)
organizerRouter.put('/revert-move', handlers.revertMove)
organizerRouter.get('/teams/:teamId/position', handlers.getTeamPosition)

module.exports = {
  publicGameRoutes: publicRouter.routes(),
  organizerGameRoutes: organizerRouter.routes(),
}
