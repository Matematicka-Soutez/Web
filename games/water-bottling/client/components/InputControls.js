/* eslint-disable no-console */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import LeftIcon from '@material-ui/icons/KeyboardArrowLeft'
import RightIcon from '@material-ui/icons/KeyboardArrowRight'
import UpIcon from '@material-ui/icons/KeyboardArrowUp'
import DownIcon from '@material-ui/icons/KeyboardArrowDown'
import FlashOnIcon from '@material-ui/icons/FlashOn'
import Button from 'material-ui/Button'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'
import Grid from 'material-ui/Grid'
import { withStyles } from 'material-ui/styles'

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

  onClick(event) {
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
                <UpIcon />
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
                <LeftIcon />
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
                  <FlashOnIcon />
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
                  <RightIcon />
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
                <DownIcon />
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
