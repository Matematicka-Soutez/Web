/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { withStyles } from '@material-ui/core/styles'
import { STRATEGIES } from '../../../core/enums'
import StrategyButton from './StrategyButton'

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
  }),
})

class InputControls extends Component {
  constructor(props) {
    super(props)
    this.onClick = this.onClick.bind(this)
  }

  onClick(event) { // eslint-disable-line no-shadow
    const direction = event.currentTarget.getAttribute('value')
    this.props.onMove(direction)
  }

  render() {
    const { classes, possibleChanges } = this.props
    return (
      <div className="inputControls">
        <Paper className={classes.root} elevation={2}>
          <Typography variant="h5">
          Výběr strategie
          </Typography>
          <Grid container>
            {STRATEGIES.idsAsEnum.map(id => (
              <StrategyButton
                key={id}
                strategyId={id}
                possibleChanges={possibleChanges || []}
                onClick={this.onClick}
              />
            ))}
          </Grid>
        </Paper>
      </div>
    )
  }
}

InputControls.propTypes = {
  classes: PropTypes.object.isRequired,
  onMove: PropTypes.func.isRequired,
  possibleChanges: PropTypes.arrayOf(PropTypes.number).isRequired,
}

export default withStyles(styles)(InputControls)
