/* eslint-disable no-console */
import React, { Component } from 'react'
// import { subscribeToGridChange } from './sockets'
import Grid from './components/Grid'

class Game extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fields: [],
      size: { height: 0, width: 0 },
    }
    // subscribeToGridChange(this.handleGridChange)
  }

  handleGridChange(err, grid) {
    if (err) {
      console.log(err)
    }
    if (grid) {
      this.setState(grid)
    }
  }

  async componentWillMount() {
    try {
      const res = await fetch('/api/game/grid')
      const grid = await res.json()
      console.log(grid)
      this.setState(grid)
    } catch (err) {
      console.log(err)
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

export default Game
