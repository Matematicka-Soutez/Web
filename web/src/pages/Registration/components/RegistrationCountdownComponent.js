import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import { formattedMS } from '../../../utils/time'

// 1 second refresh interval
const REFRESH_INTERVAL = 1000

class RegistrationCountdownComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      remainingTime: props.remainingTime,
    }
    this.timer = null
  }

  componentDidMount() {
    this.timer = setInterval(
      () => this.tick(),
      REFRESH_INTERVAL,
    )
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  tick() {
    if (this.state.remainingTime > 0) {
      this.setState(state => ({
        remainingTime: state.remainingTime - REFRESH_INTERVAL,
      }))
    } else {
      clearInterval(this.timer)
    }
  }

  render() {
    const { remainingTime } = this.state
    return (
      <CardContent>
        <Typography color="textSecondary">
          Registrace spustíme za
        </Typography>
        <br />
        <Typography
          variant="headline"
          component="h1"
          style={{ fontSize: '1.9rem', color: '#2196f3', marginBottom: -10 }}>
          {formattedMS(remainingTime)}
        </Typography>
      </CardContent>
    )
  }
}

RegistrationCountdownComponent.propTypes = {
  remainingTime: PropTypes.number.isRequired,
}


export default RegistrationCountdownComponent
