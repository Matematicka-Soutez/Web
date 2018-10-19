import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import TeamFormContainer from '../../features/Registration/TeamFormContainer'
import { getRegistrationOptions, hasReachedTeamLimit } from './utils'
import TeamsSectionComponent from './TeamsSectionComponent'

class OpenRegistrationContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      school: props.school,
      team: null,
      venues: props.venues,
      registrationRound: props.registrationRound,
    }
    this.editTeam = this.editTeam.bind(this)
  }

  editTeam(teamId) {
    this.setState(state => ({
      team: state.school.teams.find(team => team.id === parseInt(teamId)),
    }))
  }

  componentWillReceiveProps(nextProps) {
    this.setState(state => ({
      school: nextProps.school || state.school,
      venues: nextProps.venues || state.venues,
      registrationRound: nextProps.registrationRound || state.registrationRound,
    }))
  }

  render() {
    const { school, team, venues, registrationRound } = this.state
    const registrationOptions = getRegistrationOptions(school, venues, registrationRound)
    const reachedTeamLimit = hasReachedTeamLimit(school, registrationRound)
    const isAnyRemainingCapacity = venues.map(venue => venue.remainingCapacity > 0).includes(true)
    const showForm = (!reachedTeamLimit && isAnyRemainingCapacity) || team
    const hasTeamsAlready = (school.teams || []).length > 0
    const teamEditEnabled = this.state.registrationRound.number < 4
    return (
      <CardContent>
        <br />
        <Typography variant="headline" component="h2">
          Registrace
        </Typography>
        <Typography color="textSecondary">
          {school.fullName}
        </Typography>
        <br />
        <Typography color="textSecondary" style={{ textAlign: 'left' }}>
          {registrationOptions}
        </Typography>
        <br />
        {hasTeamsAlready && (
          <TeamsSectionComponent
            teams={school.teams}
            editTeam={this.editTeam}
            teamEditEnabled={teamEditEnabled} />
        )}
        {hasTeamsAlready && showForm && <br />}
        {showForm && <TeamFormContainer school={school} team={team} venues={venues} />}
        <br />
      </CardContent>
    )
  }
}

OpenRegistrationContainer.propTypes = {
  registrationRound: PropTypes.object.isRequired,
  school: PropTypes.object.isRequired,
  venues: PropTypes.array.isRequired,
}


export default withRouter(OpenRegistrationContainer)
