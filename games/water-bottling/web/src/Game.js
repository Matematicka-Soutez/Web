/* eslint-disable no-console */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { API_ADDRESS } from '../../../../web/src/config'
import Grid from './components/Grid'

class Game extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fields: [],
      size: { height: 0, width: 0 },
    }
  }

  async componentWillMount() {
    try {
      const res = await fetch(`${API_ADDRESS}/api/competitions/current/game/grid`)
      const grid = await res.json()
      this.setState(grid)
    } catch (err) {
      console.log(err)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.displayChange) {
      const change = nextProps.displayChange
      const grid = { ...this.state }
      grid.fields = grid.fields.map(field => {
        if (
          field.horizontal === change.from.horizontal
          && field.vertical === change.from.vertical
        ) {
          field.teamCount--
          field.combinedPower -= change.from.power
        }
        if (
          field.horizontal === change.to.horizontal
          && field.vertical === change.to.vertical
        ) {
          field.teamCount++
          field.combinedPower += change.to.power
        }
        return field
      })
      this.setState(grid)
    }
  }

  render() {
    return (
      <div className="game">
        <Grid
          fields={this.state.fields}
          size={this.state.size}
        />
      </div>
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
