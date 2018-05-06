import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import Game from '../../../games/water-bottling/client/Game'
import masoLogo from '../static/images/maso_logo.png'
import { subscribeToDisplayChange } from '../sockets'
import Timer from './Timer'

class GameContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      timer: {
        start: new Date('2018-04-05T16:00:00.000Z'),
        end: new Date('2018-04-05T17:30:00.000Z'),
      },
      displayChange: {},
    }
    subscribeToDisplayChange((err, displayChangeData) => {
      if (err) {
        return
      }
      if (displayChangeData) {
        this.setState({
          displayChange: displayChangeData,
          timer: this.state.timer,
        })
      }
    })
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
