import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Homepage from './components/Homepage'
import GameContainer from './components/Game'
import TeamInputContainer from './components/TeamInput'
import ResultsContainer from './components/Results'
// import PrivateRoute from './components/PrivateRoute'
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/" component={Homepage} />

          <Route exact path="/results" component={ResultsContainer} />
          <Route exact path="/game" component={GameContainer} />
          <Route path="/input/:jwtToken" component={TeamInputContainer} />
        </Switch>
      </div>
    </Router>
  )
}

export default App
