const Router = require('koa-router')
const handlers = require('./handlers')

const publicRouter = new Router()
publicRouter.get('/grid', handlers.getCurrentGrid)

const organizerRouter = new Router()
organizerRouter.put('/init', handlers.initGame)
organizerRouter.put('/move', handlers.moveTeam)
organizerRouter.get('/teams/:teamId/position', handlers.getTeamPosition)

module.exports = {
  publicGameRoutes: publicRouter.routes(),
  organizerGameRoutes: organizerRouter.routes(),
}
