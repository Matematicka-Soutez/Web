/* eslint-disable react/jsx-closing-tag-location */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import LegendItem from './LegendItem'

class TournamentLegend extends Component {
  constructor(props) {
    super(props)
    this.state = {
      strategies: props.strategies,
    }
    this.timer = null
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.strategies) {
      this.setState({ strategies: nextProps.strategies })
    }
  }

  render() {
    const { strategies } = this.state
    return (
      <Grid container className="Tournament-legend">
        {strategies.map(strategy => <LegendItem key={strategy.strategy} strategy={strategy}/>)}
      </Grid>
    )
  }
}

TournamentLegend.propTypes = {
  strategies: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default TournamentLegend
