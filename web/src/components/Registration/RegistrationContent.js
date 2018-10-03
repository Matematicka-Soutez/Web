import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import AddTeamForm from './AddTeamForm'
import TeamPrintout from './TeamPrintout'

class RegistrationContent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      schoolToken: this.props.schoolToken,
    }
  }

  componentWillMount() {
    fetch(`${process.env.REACT_APP_SERVER_ADDRESS}api/competitions/current/registration/${this.state.schoolToken}`) // eslint-disable-line no-process-env, max-len
      .then(res => res.json())
      .then(
        result => {
          if (result.type === 'BAD_REQUEST') {
            this.setState({
              school: {},
              error: true,
            })
          } else {
            this.setState(result)
          }
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        error => {
          console.log(error) // eslint-disable-line no-console
          this.setState({
            school: {},
            error: true,
          })
        },
      )
  }

  render() {
    if (!this.state.school) {
      return (
        <CardContent>
          <br />
          <Typography variant="headline" component="h2">
            Registrace
          </Typography>
          <br />
          <Typography color="textSecondary" style={{ textAlign: 'left' }}>
            Registrace se načítá, mějte prosím strpení...
          </Typography>
        </CardContent>
      )
    }
    if (this.state.error) {
      return <Redirect to={{ pathname: '/' }} />
    }
    const registration = (
      <React.Fragment>
        <Typography color="textSecondary" style={{ textAlign: 'left' }}>
          Právě probíhá první kolo registrací.
          Nyní můžete přihlásit první tým.
          Pole s hvězdičkou jsou povinná.
        </Typography>
        <br />
        <AddTeamForm school={this.state.school} venues={this.state.venues} />
      </React.Fragment>
    )
    const isPastTeamLimit = this.state.school.teams && this.state.school.teams.length > 0
    const teamPrintout = (
      <React.Fragment>
        <Typography color="textSecondary" style={{ textAlign: 'left' }}>
          Máte úspěšně přihlášen jeden tým. Další tým budete moci (v případě nezaplnění
          kapacity soutěže) přihlásit v úterý 16. 10. 2018 od 7:30. Své už přihlášené týmy
          budete moci tou dobou také editovat. Zatím to náš nový systém bohužel neumí.
        </Typography>
        <br />
        <TeamPrintout teams={this.state.school.teams} />
      </React.Fragment>
    )
    return (
      <CardContent>
        <br />
        <Typography variant="headline" component="h2">
          Registrace
        </Typography>
        <Typography color="textSecondary">
          {this.state.school.fullName}
        </Typography>
        <br />
        {isPastTeamLimit ? teamPrintout : registration}
        <br />
      </CardContent>
    )
  }
}

RegistrationContent.propTypes = {
  schoolToken: PropTypes.string.isRequired,
}


export default RegistrationContent
