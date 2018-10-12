import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid'
import masoLogo from '../../static/images/maso_logo.png'
import RegistrationContent from './RegistrationContent'
import RegistrationTimer from './RegistrationTimer'

class RegistrationContainer extends Component {
  constructor(props) {
    super(props)
    const registrationOpens = new Date('2018-10-03T05:30:00.000Z').getTime()
    const currentTime = new Date().getTime()
    const difference = registrationOpens - currentTime
    this.state = {
      schoolToken: this.props.match.params.schoolToken,
      remainingTime: difference > 0 ? difference : -1,
    }
    this.timer = null
  }

  componentDidMount() {
    this.timer = setInterval(
      () => this.tick(),
      1000,
    )
  }

  tick() {
    if (this.state.remainingTime > 0) {
      this.setState(state => ({
        remainingTime: state.remainingTime - 1000,
      }))
    } else {
      clearInterval(this.timer)
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  render() {
    const content = this.state.remainingTime >= 0
      ? <RegistrationTimer remainingTime={this.state.remainingTime} />
      : <RegistrationContent schoolToken={this.state.schoolToken} />
    return (
      <header className="masthead d-flex">
        <Grid container justify="center" spacing={24}>
          <Grid item xs={10} sm={8} lg={6}>
            <img className="registration" src={masoLogo} alt="MaSo" style={{ width: 150 }} />
            <Card>
              {content}
            </Card>
          </Grid>
        </Grid>
      </header>
    )
  }
}

RegistrationContainer.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      schoolToken: PropTypes.string,
    }),
  }).isRequired,
}


export default RegistrationContainer
