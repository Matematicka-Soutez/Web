import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import Game from '../../../../games/game-of-trust/web/src/Game'
import masoLogo from '../../static/images/maso_logo.png'
import { subscribeToDisplayChange } from '../../sockets/index'
import { API_ADDRESS } from '../../config'
import Timer from './components/Timer'

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
      const res = await fetch(`${API_ADDRESS}/api/competitions/current/timer`)
      const timer = await res.json()
      this.setState({
        loaded: true,
        timer,
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
            <Link to="/hra/admin">
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
