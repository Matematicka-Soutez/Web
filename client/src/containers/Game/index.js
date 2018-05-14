import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import Game from '../../../../games/water-bottling/client/Game'
import masoLogo from '../../static/images/maso_logo.png'
import { subscribeToDisplayChange } from '../../sockets'
import Timer from './Timer'

class GameContainer extends Component {
  constructor(props) {
    super(props)
    this.state = { loaded: false }
    subscribeToDisplayChange((err, displayChangeData) => {
      if (err) {
        return
      }
      if (displayChangeData && displayChangeData !== {}) {
        this.setState({
          displayChange: displayChangeData,
        })
      }
    })
  }

  async componentWillMount() {
    try {
      const res = await fetch('/api/competitions/current/timer')
      const timer = await res.json()
      this.setState({
        loaded: true,
        timer,
        displayChange: this.state.displayChange,
      })
    } catch (err) {
      // TODO: proper logging
      console.log(err) // eslint-disable-line no-console
    }
  }

  render() {
    if (!this.state.loaded) {
      return <div>Loading ...</div>
    }
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
