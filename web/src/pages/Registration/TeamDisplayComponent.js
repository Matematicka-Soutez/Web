import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

class TeamDisplayComponent extends Component {
  constructor(props) {
    super(props)
    this.onClick = this.onClick.bind(this)
  }

  onClick(event) { // eslint-disable-line no-shadow
    const teamId = event.currentTarget.getAttribute('value')
    this.props.editTeam(teamId)
  }

  render() {
    const { team, teamEditEnabled } = this.props
    return (
      <React.Fragment key={team.id}>
        <Typography variant="subheading" style={{ textAlign: 'left' }} gutterBottom>
          {team.name} ({team.competitionVenue.venue.name})
          <Button
            style={{ float: 'right' }}
            size="small"
            aria-label="Nahoru"
            disabled={!teamEditEnabled}
            onClick={this.onClick}
            value={team.id}>
            Editovat
          </Button>
        </Typography>
        <Typography color="textSecondary" style={{ textAlign: 'left' }} gutterBottom>
          {team.members.map(displayMember).join(', ')}
        </Typography>
      </React.Fragment>
    )
  }
}

function displayMember(member) {
  return `${member.firstName} ${member.lastName} (${member.grade})`
}

TeamDisplayComponent.propTypes = {
  editTeam: PropTypes.func.isRequired,
  team: PropTypes.object.isRequired,
  teamEditEnabled: PropTypes.bool.isRequired,
}

export default TeamDisplayComponent
