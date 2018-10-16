import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid'
import masoLogo from '../../static/images/maso_logo.png'
import { API_ADDRESS } from '../../config'
import OpenRegistration from './containers/OpenRegistrationContainer'
import RegistrationCountdownComponent from './components/RegistrationCountdownComponent'
import RegistrationLoaderComponent from './components/RegistrationLoaderComponent'

class RegistrationContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      schoolToken: this.props.match.params.schoolToken,
    }
    this.switchRoundTimer = null
  }

  componentWillMount() {
    fetch(`${API_ADDRESS}/api/competitions/current/registration/${this.state.schoolToken}`) // eslint-disable-line no-process-env, max-len
      .then(res => res.json())
      .then(
        result => {
          if (result.type === 'BAD_REQUEST') {
            this.props.history.push('/#registrace')
          } else {
            this.setState(result)
            if (this.state.currentRound < 4) {
              this.switchRoundTimer = setTimeout(
                () => this.switchRound(),
                result.registrationRounds[result.currentRound].remainingTime,
              )
            }
          }
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        error => {
          console.log(error) // eslint-disable-line no-console
          this.props.history.push('/#registrace')
        },
      )
  }

  switchRound() {
    this.setState(state => ({
      currentRound: state.currentRound + 1,
      registrationRounds: state.registrationRounds.map(round => ({
        ...round,
        remainingTime: round.remainingTime > 0
          ? round.remainingTime - state.registrationRounds[state.currentRound].remainingTime
          : -1,
      })),
    }))
  }

  componentWillUnmount() {
    clearInterval(this.switchRoundTimer)
  }

  render() {
    if (!this.state.school) {
      return <RegistrationLoaderComponent />
    }
    const remainingTime = this.state.registrationRounds[this.state.currentRound].remainingTime
    return (
      <header className="masthead d-flex">
        <Grid container justify="center" spacing={24}>
          <Grid item xs={10} sm={8} lg={6}>
            <img className="registration" src={masoLogo} alt="MaSo" style={{ width: 150 }} />
            <Card>
              {this.state.currentRound === 0
                ? <RegistrationCountdownComponent remainingTime={remainingTime} />
                : <OpenRegistration registrationState={this.state} />}
            </Card>
          </Grid>
        </Grid>
      </header>
    )
  }
}

RegistrationContainer.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      schoolToken: PropTypes.string,
    }),
  }).isRequired,
}


export default RegistrationContainer
