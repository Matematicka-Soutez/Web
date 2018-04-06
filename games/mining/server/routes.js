const Router = require('koa-router')
const handlers = require('./handlers.js')

const publicRouter = new Router()
publicRouter.get('/grid', handlers.getCurrentGrid)

const authenticatedRouter = new Router()
authenticatedRouter.get('/input', handlers.getPossibleMoves)

const adminRouter = new Router()

module.exports = {
  publicGameRoutes: publicRouter.routes(),
  authenticatedGameRoutes: authenticatedRouter.routes(),
  adminGameRoutes: adminRouter.routes()
}
