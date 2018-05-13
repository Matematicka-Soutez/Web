/* eslint-disable no-console */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'
import Table, { TableBody, TableCell, TableRow } from 'material-ui/Table'
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
    let id = 0

    function createData(property, value) {
      id += 1
      return { id, property, value }
    }

    const data = [
      createData('Pozice', getPosition(this.state.position)),
      createData('Síla', this.state.position.power),
      createData('Skóre', this.state.position.score),
    ]
    return (
      <div className="inputControls">
        <Paper className={classes.root} elevation={2}>
          <Typography variant="headline" component="h3">
          Informace
          </Typography>
          <Table className={classes.table}>
            <TableBody>
              {data.map(row => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    {row.property}
                  </TableCell>
                  <TableCell numeric>{row.value}</TableCell>
                </TableRow>
              ))}
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
