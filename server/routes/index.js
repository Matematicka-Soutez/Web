const Router = require('koa-router')
const {
  organizerGameRoutes,
  publicGameRoutes,
} = require('../../games/water-bottling/server/routes')
const config = require('../../config')
const publicRoutes = require('./public')
const teacherRoutes = require('./teacher')
const organizerRoutes = require('./organizer')
const documentationRoutes = require('./documentation')
const errorsHandler = require('./../handlers/errors')
const responseErrors = require('./../utils/errors/response')
const passportHandler = require('./../handlers/passport')

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
apiRouter.use('/teacher', passportHandler.authenticateTeacher, teacherRoutes)
// apiRouter.use('/org', passportHandler.authenticateOrganizer, organizerRoutes)
apiRouter.use('/org', organizerRoutes)

// Game routes
apiRouter.use('/game', publicGameRoutes)
apiRouter.use('/org/game', passportHandler.authenticateOrganizer, organizerGameRoutes)

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
