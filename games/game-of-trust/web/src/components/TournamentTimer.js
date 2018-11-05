/* eslint-disable react/jsx-closing-tag-location */
import React, { Component } from 'react'
import PropTypes from 'prop-types'

class TournamentTimer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      remainingTime: props.remainingTime,
      mistakeRate: props.mistakeRate,
    }
    this.timer = null
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.remainingTime || nextProps.mistakeRate > -1) {
      this.setState({
        remainingTime: nextProps.remainingTime,
        mistakeRate: nextProps.mistakeRate,
      })
    }
  }

  componentDidMount() {
    this.timer = setInterval(
      () => this.tick(),
      1000,
    )
  }

  tick() {
    this.setState(state => ({
      remainingTime: state.remainingTime <= 0 ? state.remainingTime : state.remainingTime - 1000,
    }))
  }

  render() {
    const time = Math.round(this.state.remainingTime / 1000)
    const seconds = time > 4 || time === 0 ? 'vteřin' : time > 1 ? 'vteřiny' : 'vteřinu' // eslint-disable-line no-nested-ternary, max-len
    const timeString = `za ${time > 0 ? time : 0} ${seconds}`
    return (
      <div className="Tournament-timer">
        Šance na chybu {this.state.mistakeRate} %<br />
        Další turnaj {time === -42 ? 'už nebude' : timeString}
      </div>
    )
  }
}

TournamentTimer.propTypes = {
  mistakeRate: PropTypes.number.isRequired,
  remainingTime: PropTypes.number.isRequired,
}

export default TournamentTimer
