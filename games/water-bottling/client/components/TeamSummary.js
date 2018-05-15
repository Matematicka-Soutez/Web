/* eslint-disable no-console */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'
import Table, { TableHead, TableBody, TableCell, TableRow } from 'material-ui/Table'
import { withStyles } from 'material-ui/styles'
import { getPosition } from '../utils/position'

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
  }),
})

class TeamSummary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      position: props.position,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.position) {
      this.setState({ position: nextProps.position })
    }
  }

  render() {
    const { classes } = this.props
    return (
      <div className="inputControls">
        <Paper className={classes.root} elevation={2}>
          <Typography variant="headline" component="h3">
          Informace
          </Typography>
          <Table className={classes.table}>
            <TableHead>
              <TableRow style={{ fontSize: 20, fontWeight: 'bold' }}>
                <TableCell numeric>Síla</TableCell>
                <TableCell numeric>Pozice</TableCell>
                <TableCell numeric>Body</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell
                  numeric
                  component="th"
                  scope="row"
                  style={{ fontSize: 25, fontWeight: 'bold' }}>
                  {this.state.position.power}
                </TableCell>
                <TableCell
                  numeric
                  style={{ fontSize: 25, fontWeight: 'bold' }}>
                  {getPosition(this.state.position)}
                </TableCell>
                <TableCell
                  numeric
                  style={{ fontSize: 25, fontWeight: 'bold' }}>
                  {Math.round(Number(this.state.position.score))}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      </div>
    )
  }
}

TeamSummary.propTypes = {
  classes: PropTypes.object.isRequired,
  position: PropTypes.object.isRequired,
}

export default withStyles(styles)(TeamSummary)
