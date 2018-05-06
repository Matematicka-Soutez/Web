import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import GameContainer from './components/GameContainer'
import InputContainer from './components/InputContainer'
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Route exact path="/" component={GameContainer} />
        <Route exact path="/input" component={InputContainer} />
      </div>
    </Router>
  )
}

export default App
