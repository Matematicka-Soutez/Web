import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'

const TeamPrintoutComponent = ({ teams }) => (
  <React.Fragment>
    <Typography
      variant="headline"
      component="h2"
      style={{ textAlign: 'left', fontSize: '120%' }} gutterBottom>
      Přihlášené týmy
    </Typography>
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

TeamPrintoutComponent.propTypes = {
  teams: PropTypes.array.isRequired,
}


export default TeamPrintoutComponent
