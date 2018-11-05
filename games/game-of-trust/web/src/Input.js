/* eslint-disable no-console */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import { API_ADDRESS } from '../../../../web/src/config'
import InputControls from './components/InputControls'
import TeamSummary from './components/TeamSummary'

class Input extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.changeStrategy = this.changeStrategy.bind(this)
    this.revertChange = this.revertChange.bind(this)
  }

  async componentWillMount() {
    try {
      if (this.props.teamId) {
        const res = await fetch(
          `${API_ADDRESS}/api/org/competitions/current/game/teams/${this.props.teamId}/strategy`,
          { headers: { Authorization: `JWT ${this.props.jwtToken}` } },
        )
        const strategy = await res.json()
        this.setState(strategy)
      }
    } catch (err) {
      console.log(err)
    }
  }

  async changeStrategy(newStrategy) {
    try {
      const res = await fetch(`${API_ADDRESS}/api/org/competitions/current/game/change-strategy`, {
        headers: {
          Authorization: `JWT ${this.props.jwtToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'PUT',
        body: JSON.stringify({
          teamId: this.state.team.id,
          strategyId: newStrategy,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        return alert(err.message) // eslint-disable-line no-alert
      }
      const strategy = await res.json()
      this.setState(strategy)
    } catch (err) {
      console.log(err)
    }
    return true
  }

  async revertChange() {
    try {
      const res = await fetch(`${API_ADDRESS}/api/org/competitions/current/game/revert-change`, {
        headers: {
          Authorization: `JWT ${this.props.jwtToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'PUT',
        body: JSON.stringify({ teamId: this.state.team.id }),
      })
      if (!res.ok) {
        const err = await res.json()
        return alert(err.message) // eslint-disable-line no-alert
      }
      const strategy = await res.json()
      this.setState(strategy)
    } catch (err) {
      console.log(err)
    }
    return true
  }

  render() {
    if (this.state.team) {
      return (
        <div className="input" style={{ paddingLeft: 8 * 3, paddingRight: 8 * 3 }}>
          <Grid container spacing={24}>
            <Grid item xs={12}>
              <h1 style={{ marginBottom: 10 }}>
                {this.state.team.number} - {this.state.team.name}
              </h1>
            </Grid>
            <Grid item>
              <InputControls
                onMove={this.changeStrategy}
                teamId={this.state.team.id}
                possibleChanges={this.state.possibleChanges} />
            </Grid>
            <Grid item>
              <TeamSummary strategy={this.state.strategy} score={this.state.score} />
            </Grid>
            <Grid item container>
              <Button
                variant="raised"
                style={{ backgroundColor: '#c62d35' }}
                onClick={this.revertChange}>
              Vrátit poslední změnu
              </Button>
            </Grid>
          </Grid>
        </div>
      )
    }
    return (
      <div className="input">Loading...</div>
    )
  }
}

Input.propTypes = {
  jwtToken: PropTypes.string.isRequired,
  teamId: PropTypes.number.isRequired,
}

export default Input
