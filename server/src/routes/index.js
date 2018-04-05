const Router = require('koa-router')
const publicRoutes = require('./public')
const authenticatedRoutes = require('./authenticated')
const adminRoutes = require('./admin')
const documentationRoutes = require('./documentation')
const errorsHandler = require('./../handlers/errors')
const responseErrors = require('./../utils/errors/response')
const passportHandler = require('./../handlers/passport')
const { public, authenticated, admin } = require('./../games/mining/routes')
const config = require('../config')

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
apiRouter.use('/game', gameRouter)
apiRouter.use('/auth', passportHandler.authenticateUser, authenticatedRoutes)
apiRouter.use('/admin', passportHandler.authenticateAdmin, adminRoutes)
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
