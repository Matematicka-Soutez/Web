import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import Homepage from './components/Homepage'
import GameContainer from './components/Game'
import TeamInputContainer from './components/TeamInput'
import RegistrationContainer from './components/Registration'
import ResultsContainer from './components/Results'
// import PrivateRoute from './components/PrivateRoute'
import './App.css'

const theme = createMuiTheme({
  palette: {
    primary: { main: '#2196f3' },
    secondary: { main: '#ffd42d' },
  },
})

function App() {
  return (
    <Router>
      <MuiThemeProvider theme={theme}>
        <div className="App">
          <Switch>
            <Route exact path="/" component={Homepage} />

            <Route exact path="/vysledky" component={ResultsContainer} />
            <Route exact path="/hra" component={GameContainer} />
            <Route path="/input/:jwtToken" component={TeamInputContainer} />
            <Route path="/registrace/:schoolToken" component={RegistrationContainer} />
            <Route path="/registrace" component={RegistrationContainer} />
          </Switch>
        </div>
      </MuiThemeProvider>
    </Router>
  )
}

export default App
