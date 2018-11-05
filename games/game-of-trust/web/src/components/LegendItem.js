/* eslint-disable react/jsx-closing-tag-location */
import React from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import { STRATEGIES } from '../../../core/enums'
import { strategyToImage } from '../utils/strategy'

function LegendItem({ strategy }) {
  return (
    <Grid container item md={6}>
      <Grid item xs={2}>
        <img
          src={strategyToImage(strategy.strategy)}
          alt={STRATEGIES.ids[strategy.strategy].name}
          style={{ height: 140 }}
        />
      </Grid>
      <Grid
        item
        style={{ fontSize: '2em', color: '#666', paddingLeft: '20px', paddingTop: '35px' }}
        xs={10}>
        {strategy.profitMin}&nbsp;
        <span style={{ fontSize: '2em', color: '#000' }}>{strategy.profitMedian}</span>&nbsp;
        {strategy.profitMax}
      </Grid>
    </Grid>
  )
}


LegendItem.propTypes = {
  strategy: PropTypes.objectOf(PropTypes.number).isRequired,
}

export default LegendItem
