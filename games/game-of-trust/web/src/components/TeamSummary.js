/* eslint-disable no-console */
import React from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import { withStyles } from '@material-ui/core/styles'
import { STRATEGIES } from '../../../core/enums'


const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
  }),
})

function TeamSummary({ classes, score, strategy }) {
  return (
    <div className="inputControls">
      <Paper className={classes.root} elevation={2}>
        <Typography variant="h5">
          Informace
        </Typography>
        <Table className={classes.table}>
          <TableHead>
            <TableRow style={{ fontSize: 20, fontWeight: 'bold' }}>
              <TableCell numeric>Strategie</TableCell>
              <TableCell numeric>Platí&nbsp;do&nbsp;turnaje</TableCell>
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
                {STRATEGIES.ids[strategy.strategy].name}
              </TableCell>
              <TableCell
                numeric
                style={{ fontSize: 25, fontWeight: 'bold' }}>
                {strategy.validUntilTournament}
              </TableCell>
              <TableCell
                numeric
                style={{ fontSize: 25, fontWeight: 'bold' }}>
                {Math.floor(Number(score))}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    </div>
  )
}

TeamSummary.propTypes = {
  classes: PropTypes.object.isRequired,
  score: PropTypes.number.isRequired,
  strategy: PropTypes.object.isRequired,
}

export default withStyles(styles)(TeamSummary)
