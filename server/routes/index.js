const Router = require('koa-router')
const publicRoutes = require('./public')
const authenticatedRoutes = require('./authenticated')
const adminRoutes = require('./admin')
const documentationRoutes = require('./documentation')
const errorsHandler = require('./../handlers/errors')
const responseErrors = require('./../utils/errors/response')
const passportHandler = require('./../handlers/passport')
const { publicGameRoutes, authenticatedGameRoutes, adminGameRoutes } = require('../../games/water-bottling/server/routes')
const config = require('../../config')

const router = new Router()
const apiRouter = new Router()

// Force redirect http requests to https
if (config.env === 'production') {
  apiRouter.use((ctx, next) => {
    if (ctx.headers['x-forwarded-proto'] !== 'https') {
      throw new responseErrors.ForbiddenError('Https is required.')
    }
    return next()
  })
}

// Routes
apiRouter.use(publicRoutes)
apiRouter.use('/auth', passportHandler.authenticateUser, authenticatedRoutes)
apiRouter.use('/admin', passportHandler.authenticateAdmin, adminRoutes)

// Game routes
apiRouter.use('/game', publicGameRoutes)
apiRouter.use('/auth/game', passportHandler.authenticateUser, authenticatedGameRoutes)
apiRouter.use('/admin/game', passportHandler.authenticateAdmin, adminGameRoutes)

apiRouter.use(errorsHandler.handleNotFound)

// Higher level composition
router.use(errorsHandler.handleErrors)
router.use('/api', apiRouter.routes())
// Serve documentation
if (config.env !== 'production') {
  router.use(documentationRoutes)
}

const routes = router.routes()

module.exports = routes
