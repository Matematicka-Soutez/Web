/* eslint-disable no-console */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import { API_ADDRESS } from '../../../../web/src/config'
import TournamentGraph from './components/TournamentGraph'
import TournamentLegend from './components/TournamentLegend'
import TournamentTimer from './components/TournamentTimer'

class Game extends Component {
  constructor(props) {
    super(props)
    this.state = {
      strategies: [],
      number: 0,
    }
  }

  async componentWillMount() {
    try {
      const res = await fetch(`${API_ADDRESS}/api/competitions/current/game/tournament/results`)
      const tournament = await res.json()
      this.setState(tournament)
    } catch (err) {
      console.log(err)
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps.displayChange)
    if (nextProps.displayChange) {
      this.setState(nextProps.displayChange)
    }
  }

  render() {
    const { number, strategies, remainingTime, mistakeRate } = this.state
    return (
      <Grid container className="game">
        <Grid item sm={5}>
          <TournamentGraph tournamentNumber={number} strategies={strategies} />
        </Grid>
        <Grid item sm={7}>
          <br />
          <br />
          <TournamentLegend strategies={strategies} />
          <TournamentTimer
            remainingTime={parseInt(remainingTime)}
            mistakeRate={parseFloat(mistakeRate)}
          />
        </Grid>
      </Grid>
    )
  }
}

Game.propTypes = {
  displayChange: PropTypes.objectOf(PropTypes.objectOf(PropTypes.number)),
}
Game.defaultProps = {
  displayChange: null,
}

export default Game
