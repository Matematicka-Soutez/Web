'use strict'

const Router = require('koa-router')
const {
  organizerGameRoutes,
  publicGameRoutes,
} = require('../../../games/game-of-trust/api/src/routes')
const config = require('../../../config')
const setCurrentCompetition = require('../middleware/competition')
const { authenticateTeacher, authenticateOrganizer } = require('../middleware/authentication')
const { handleErrors, handleNotFound } = require('../middleware/errors')
const responseErrors = require('../../../core/errors/response')
const publicRoutes = require('./public')
const teacherRoutes = require('./teacher')
const organizerRoutes = require('./organizer')
const documentationRoutes = require('./documentation')

const router = new Router()
const apiRouter = new Router()
router.use(handleErrors)

// Force redirect http requests to https
if (config.env === 'production' || config.env === 'staging') {
  apiRouter.use((ctx, next) => {
    if (ctx.headers['x-forwarded-proto'] !== 'https') {
      throw new responseErrors.ForbiddenError('Https is required.')
    }
    return next()
  })
}

// Add current competition to all services through middleware
apiRouter.use(setCurrentCompetition)

// Routes
apiRouter.use(publicRoutes)
apiRouter.use('/teacher', authenticateTeacher, teacherRoutes)
apiRouter.use('/org/competitions/current', authenticateOrganizer, organizerRoutes)

// Game routes
apiRouter.use('/competitions/current/game', publicGameRoutes)
apiRouter.use('/org/competitions/current/game', authenticateOrganizer, organizerGameRoutes)

apiRouter.use(handleNotFound)

// Higher level composition
router.use('/api', apiRouter.routes())
// Serve documentation
if (config.env !== 'production') {
  router.use(documentationRoutes)
}

const routes = router.routes()

module.exports = routes
