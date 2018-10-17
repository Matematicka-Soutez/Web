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
    this.state = {
      school: props.school,
      venues: props.venues,
      registrationRound: props.registrationRound,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(state => ({
      school: nextProps.school || state.school,
      venues: nextProps.venues || state.venues,
      registrationRound: nextProps.registrationRound || state.registrationRound,
    }))
  }

  render() {
    const { school, venues, registrationRound } = this.state
    const registrationOptions = getRegistrationOptions(school, venues, registrationRound)
    const reachedTeamLimit = hasReachedTeamLimit(school, registrationRound)
    const isAnyRemainingCapacity = venues.map(venue => venue.remainingCapacity > 0).includes(true)
    const showForm = !reachedTeamLimit && isAnyRemainingCapacity
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
        {hasTeamsAlready && showForm && <br />}
        {showForm && <AddTeamForm school={school} venues={venues} />}
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
