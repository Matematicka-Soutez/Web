import React, { Component } from 'react'
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'
import Timer from './components/Timer'
import Game from './games/mining/Game'
import Input from './games/mining/Input'
import masoLogo from './static/images/maso_logo.png'
import './App.css'

class App extends Component {
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
