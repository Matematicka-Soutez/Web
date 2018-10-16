import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import { getRegistrationOptions, hasReachedTeamLimit } from '../utils'
import AddTeamForm from '../AddTeamForm'
import TeamPrintoutComponent from '../components/TeamPrintoutComponent'

class OpenRegistrationContainer extends Component {
  constructor(props) {
    super(props)
    this.state = props.registrationState
  }

  render() {
    const { school, venues } = this.state
    const currentRound = this.state.registrationRounds[this.state.currentRound]
    const registrationOptions = getRegistrationOptions(school, venues, currentRound)
    const reachedTeamLimit = hasReachedTeamLimit(school, currentRound)
    const hasTeamsAlready = (school.teams || []).length > 0
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
        {hasTeamsAlready && <TeamPrintoutComponent teams={school.teams} />}
        {hasTeamsAlready && !reachedTeamLimit && <br />}
        {!reachedTeamLimit && <AddTeamForm school={school} venues={venues} />}
        <br />
      </CardContent>
    )
  }
}

OpenRegistrationContainer.propTypes = {
  registrationState: PropTypes.object.isRequired,
}


export default withRouter(OpenRegistrationContainer)
