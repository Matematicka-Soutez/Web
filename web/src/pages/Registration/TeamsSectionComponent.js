import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import TeamDisplayComponent from './TeamDisplayComponent'

const TeamsSectionComponent = ({ teams, editTeam, teamEditEnabled }) => (
  <React.Fragment>
    <Typography
      variant="h5"
      style={{ textAlign: 'left', fontSize: '120%' }} gutterBottom>
      Přihlášené týmy
    </Typography>
    {teams.map(team => (
      <TeamDisplayComponent
        key={team.id}
        team={team}
        editTeam={editTeam}
        teamEditEnabled={teamEditEnabled} />
    ))}
  </React.Fragment>
)

TeamsSectionComponent.propTypes = {
  editTeam: PropTypes.func.isRequired,
  teamEditEnabled: PropTypes.bool.isRequired,
  teams: PropTypes.array.isRequired,
}

export default TeamsSectionComponent
