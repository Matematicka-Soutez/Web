/* eslint-disable react/jsx-closing-tag-location */
import React, { Component } from 'react'
import PropTypes from 'prop-types'

const commencingLength = 10 * 60 * 1000

class Timer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      phase: getPhase(props.start, props.end),
      start: props.start,
      end: props.end,
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
    this.setState({
      start: this.state.start - 1000,
      end: this.state.end - 1000,
      phase: getPhase(this.state.start, this.state.end),
    })
  }

  render() {
    return (
      <div className="App-timer">

        {this.state.phase === 'BEFORE'
        && <div className="fullHeightCapture">Vítejte na DěMaKu</div>}

        {this.state.phase === 'AFTER'
        && <div className="fullHeightCapture" style={{ color: 'red' }}>Hra skončila</div>}

        {this.state.phase === 'COMMENCING'
        && <div className="fullHeightCapture">
          <span style={{ color: 'gray', fontWeight: 400 }}>Čas do začátku:</span>
          &nbsp;{formattedMS(this.state.start)}
        </div>}

        {this.state.phase === 'RUNNING'
        && <div className="fullHeightCapture">
          <span style={{ color: 'gray', fontWeight: 400 }}>Čas do konce:</span>
          &nbsp;{formattedMS(this.state.end)}
        </div>}
      </div>
    )
  }
}

function formattedMS(ms) {
  let result = ''
  const sec = Math.round(ms / 1000)
  const hours = Math.floor(sec / 3600)
  if (hours > 0) {
    result += `${hours}:`
  }
  const minutes = Math.floor(sec / 60) - (hours * 60)
  const fill = hours > 0 && minutes < 10 ? '0' : ''
  return `${result + fill + minutes}:${`0${sec % 60}`.slice(-2)}`
}

function getPhase(start, end) {
  if (start - commencingLength > 0) {
    return 'BEFORE'
  }
  if (start > 0) {
    return 'COMMENCING'
  }
  if (end > 0) {
    return 'RUNNING'
  }
  return 'AFTER'
}

Timer.propTypes = {
  end: PropTypes.number.isRequired,
  start: PropTypes.number.isRequired,
}

export default Timer
