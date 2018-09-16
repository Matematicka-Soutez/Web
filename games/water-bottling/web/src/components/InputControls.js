/* eslint-disable no-console */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  KeyboardArrowUp,
  KeyboardArrowDown,
  FlashOn,
} from '@material-ui/icons'
import {
  Button,
  Paper,
  Typography,
  Grid,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
  }),
})

class InputControls extends Component {
  constructor(props) {
    super(props)
    this.state = {
      possibleMoves: props.possibleMoves,
    }
    this.onClick = this.onClick.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.possibleMoves) {
      this.setState({ possibleMoves: nextProps.possibleMoves })
    }
  }

  onClick(event) { // eslint-disable-line no-shadow
    const direction = event.currentTarget.getAttribute('value')
    this.props.onMove(direction)
  }

  render() {
    const { classes } = this.props
    return (
      <div className="inputControls">
        <Paper className={classes.root} elevation={2}>
          <Typography variant="headline" component="h3">
          Ovládání
          </Typography>
          <Grid container justify="center">
            <Grid item>
              <Button
                className="directionButton"
                size="large"
                aria-label="Nahoru"
                disabled={!this.state.possibleMoves.includes(1)}
                onClick={this.onClick}
                value={1}>
                <KeyboardArrowUp />
              </Button>
            </Grid>
          </Grid>
          <Grid container justify="center">
            <Grid item xs={4}>
              <Button
                className="directionButton"
                size="large"
                aria-label="Doleva"
                disabled={!this.state.possibleMoves.includes(4)}
                onClick={this.onClick}
                value={4}>
                <KeyboardArrowLeft />
              </Button>
            </Grid>
            <Grid item container xs={4} justify="center">
              <Grid item>
                <Button
                  className="directionButton"
                  size="large"
                  aria-label="Vylepšit"
                  disabled={!this.state.possibleMoves.includes(5)}
                  onClick={this.onClick}
                  value={5}>
                  <FlashOn />
                </Button>
              </Grid>
            </Grid>
            <Grid item container xs={4} alignItems="flex-end" direction="column" spacing={0}>
              <Grid item>
                <Button
                  className="directionButton"
                  size="large"
                  aria-label="Doprava"
                  disabled={!this.state.possibleMoves.includes(3)}
                  onClick={this.onClick}
                  value={3}>
                  <KeyboardArrowRight />
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid container justify="center">
            <Grid item>
              <Button
                className="directionButton"
                size="large"
                aria-label="Dolů"
                disabled={!this.state.possibleMoves.includes(2)}
                onClick={this.onClick}
                value={2}>
                <KeyboardArrowDown />
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </div>
    )
  }
}

InputControls.propTypes = {
  classes: PropTypes.object.isRequired,
  onMove: PropTypes.func.isRequired,
  possibleMoves: PropTypes.arrayOf(PropTypes.number).isRequired,
}

export default withStyles(styles)(InputControls)
