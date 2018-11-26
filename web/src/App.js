import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import Homepage from './pages/Homepage'
import GameScreen from './pages/GameScreen/index'
import GameInput from './pages/GameInput'
import Registration from './pages/Registration'
import Results from './pages/Results'
import ResultsSimple from './pages/Results/simple'
// import PrivateRoute from './components/PrivateRoute'
import './App.css'

const theme = createMuiTheme({
  palette: {
    primary: { main: '#2196f3' },
    secondary: { main: '#ffd42d' },
  },
  typography: {
    useNextVariants: true,
  },
})

function App() {
  return (
    <Router>
      <MuiThemeProvider theme={theme}>
        <div className="App">
          <Switch>
            <Route exact path="/" component={Homepage} />
            <Route exact path="/vysledky" component={ResultsSimple} />
            <Route exact path="/vysledky/full" component={Results} />
            <Route path="/hra/admin/:jwtToken" component={GameInput} />
            <Route exact path="/hra" component={GameScreen} />
            <Route path="/registrace/:schoolToken" component={Registration} />
            <Route path="/registrace" component={Registration} />
          </Switch>
        </div>
      </MuiThemeProvider>
    </Router>
  )
}

export default App
