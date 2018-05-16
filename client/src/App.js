import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import GameContainer from './containers/Game'
import TeamInputContainer from './containers/TeamInput'
import ResultsContainer from './containers/Results'
// import PrivateRoute from './containers/PrivateRoute'
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/" component={GameContainer} />
          <Route exact path="/results" component={ResultsContainer} />
          <Route path="/input/:jwtToken" component={TeamInputContainer} />
        </Switch>
      </div>
    </Router>
  )
}

export default App
