import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import Game from '../../../../games/water-bottling/client/Game'
import masoLogo from '../../static/images/maso_logo.png'
import { subscribeToDisplayChange } from '../../sockets'
import Timer from './Timer'

class GameContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      timer: {
        start: 1000 * 60 * 60 * 24,
        end: (1000 * 60 * 60 * 24) + (90 * 60),
      },
      displayChange: {},
    }
    this.updateState.bind(this)
    subscribeToDisplayChange(function subscribe(err, displayChangeData) {
      if (err) {
        return
      }
      if (displayChangeData && displayChangeData !== {}) {
        this.updateState(displayChangeData)
      }
    })
  }

  updateState(displayChangeData) {
    this.setState({
      displayChange: displayChangeData,
      timer: this.state.timer,
    })
  }

  async componentWillMount() {
    try {
      const res = await fetch('/api/competitions/current/timer')
      const timer = await res.json()
      this.setState({
        timer,
        displayChange: this.state.displayChange,
      })
    } catch (err) {
      // TODO: proper logging
      console.log(err) // eslint-disable-line no-console
    }
  }

  render() {
    return (
      <Fragment>

        <header className="App-header">
          <div className="App-logo">
            <Link to="/input">
              <img src={masoLogo} alt="logo" />
            </Link>
          </div>
          <Timer
            start={this.state.timer.start}
            end={this.state.timer.end} />
        </header>

        <main>
          <Game displayChange={this.state.displayChange} />
        </main>

      </Fragment>
    )
  }
}

export default GameContainer
