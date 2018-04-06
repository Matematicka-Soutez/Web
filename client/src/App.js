import React, { Component } from 'react'
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'
import Timer from './components/Timer'
import Game from '../../games/mining/client/Game'
import Input from '../../games/mining/client/Input'
import masoLogo from './static/images/maso_logo.png'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      game: {
        start: new Date('2018-04-05T16:00:00.000Z'),
        end: new Date('2018-04-05T17:30:00.000Z')
      }
    }
  }

  render() {
    return (
      <Router>
        <div className="App">

          <header className="App-header">
            <div className="App-logo">
              <Link to="/input">
                <img src={masoLogo} alt="logo" />
              </Link>
            </div>
            <Timer
              start={this.state.game.start}
              end={this.state.game.end} />
          </header>

          <main>
            <Route exact path="/" component={Game} />
            <Route exact path="/input" component={Input} />
          </main>

        </div>
      </Router>
    )
  }
}

export default App
