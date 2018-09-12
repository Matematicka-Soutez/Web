const GetAllByCompetitionVenueService = require('../../services/room/GetAllByCompetitionVenue')
const appErrors = require('../../../../core/errors/application')
const responseErrors = require('../../../../core/errors/response')

module.exports = {
  getAllByCompetitionVenue,
}

async function getAllByCompetitionVenue(ctx) {
  try {
    ctx.body = await new GetAllByCompetitionVenueService()
      .execute({
        venueId: ctx.request.body.venueId,
      })
  } catch (err) {
    if (err instanceof appErrors.UnauthorizedError || err instanceof appErrors.NotFoundError) {
      throw new responseErrors.UnauthorizedError('Invalid credentials.')
    }
    throw err
  }
}
