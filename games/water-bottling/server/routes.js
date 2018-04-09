const Router = require('koa-router')
const handlers = require('./handlers')

const publicRouter = new Router()
publicRouter.get('/grid', handlers.getCurrentGrid)

const authenticatedRouter = new Router()
authenticatedRouter.get('/rooms', handlers.getAllRooms)
authenticatedRouter.get('/rooms/:roomId', handlers.getRoom)
authenticatedRouter.get('/teams/:teamId', handlers.getTeam)

const adminRouter = new Router()

module.exports = {
  publicGameRoutes: publicRouter.routes(),
  authenticatedGameRoutes: authenticatedRouter.routes(),
  adminGameRoutes: adminRouter.routes(),
}
