import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'

const TeamPrintout = ({ teams }) => (
  <React.Fragment>
    <Typography
      variant="headline"
      component="h2"
      style={{ textAlign: 'left', fontSize: '120%' }}>
      Přihlášené týmy
    </Typography>
    <br />
    {teams.map(displayTeam)}
  </React.Fragment>
)

function displayTeam(team) {
  return (
    <React.Fragment key={team.id}>
      <Typography variant="subheading" style={{ textAlign: 'left' }} gutterBottom>
        {team.name} ({team.competitionVenue.venue.name})
      </Typography>
      <Typography color="textSecondary" style={{ textAlign: 'left' }} gutterBottom>
        {team.members.map(displayMember).join(', ')}
      </Typography>
    </React.Fragment>
  )
}

function displayMember(member) {
  return `${member.firstName} ${member.lastName} (${member.grade})`
}

TeamPrintout.propTypes = {
  teams: PropTypes.array.isRequired,
}


export default TeamPrintout
