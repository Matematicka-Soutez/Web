/* eslint-disable no-console */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Grid from 'material-ui/Grid'
import InputControls from './components/InputControls'
import SimpleGrid from './components/SimpleGrid'
import TeamSummary from './components/TeamSummary'

const headers = { Authorization: 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdhbml6ZXJJZCI6MywiaWF0IjoxNTI2MjA1Mjg2LCJleHAiOjE1MjYyMTI0ODYsImlzcyI6ImN6LmN1bmkubWZmLm1hc28ubG9jYWwifQ.6RcI-GljUWGoPzgvneoTvUzdadwjdf6IQ-avxbFva7M' } // eslint-disable-line max-len

class Input extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.moveTeam = this.moveTeam.bind(this)
  }

  async componentWillMount() {
    try {
      if (this.props.teamId) {
        const res = await fetch(`/api/org/game/teams/${this.props.teamId}/position`, { headers })
        const position = await res.json()
        this.setState(position)
      }
    } catch (err) {
      console.log(err)
    }
  }

  async moveTeam(direction) {
    try {
      const res = await fetch('/api/org/game/move', {
        headers: {
          ...headers,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'PUT',
        body: JSON.stringify({
          teamId: this.state.team.id,
          directionId: direction,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        return alert(err.message) // eslint-disable-line no-alert
      }
      const position = await res.json()
      this.setState(position)
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
            <Grid item container xs={12} sm={3}>
              <Grid item>
                <InputControls
                  onMove={this.moveTeam}
                  teamId={this.state.team.id}
                  possibleMoves={this.state.possibleMoves} />
              </Grid>
              <Grid item>
                <TeamSummary position={this.state} />
              </Grid>
            </Grid>
            <Grid item xs={12} sm={9}>
              <SimpleGrid grid={this.state.grid} position={this.state} />
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
  teamId: PropTypes.number.isRequired,
}

export default Input
