'use strict'

const Router = require('koa-router')
const {
  organizerGameRoutes,
  publicGameRoutes,
} = require('../../../games/water-bottling/api/src/routes')
const config = require('../../../config')
const errorsHandler = require('../controllers/errors')
const responseErrors = require('../../../core/errors/response')
const passportHandler = require('../controllers/passport')
const publicRoutes = require('./public')
const teacherRoutes = require('./teacher')
const organizerRoutes = require('./organizer')
const documentationRoutes = require('./documentation')

const router = new Router()
const apiRouter = new Router()
router.use(errorsHandler.handleErrors)

// Force redirect http requests to https
if (config.env === 'production' || config.env === 'staging') {
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
apiRouter.use('/org', passportHandler.authenticateOrganizer, organizerRoutes)
// apiRouter.use('/org', organizerRoutes)

// Game routes
apiRouter.use('/game', publicGameRoutes)
apiRouter.use('/org/game', passportHandler.authenticateOrganizer, organizerGameRoutes)
// apiRouter.use('/org/game', organizerGameRoutes)

apiRouter.use(errorsHandler.handleNotFound)

// Higher level composition
router.use('/api', apiRouter.routes())
// Serve documentation
if (config.env !== 'production') {
  router.use(documentationRoutes)
}

const routes = router.routes()

module.exports = routes
