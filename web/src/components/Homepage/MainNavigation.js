import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
// import HelpIcon from '@material-ui/icons/Help'
// import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled'
// import HistoryIcon from '@material-ui/icons/History'
// import PhoneIcon from '@material-ui/icons/Phone'
// import FavoriteIcon from '@material-ui/icons/Favorite'

const styles = {
  root: {
    width: 500,
  },
}

// eslint-disable-next-line
class MainNavigation extends React.Component {

  render() {
    const { destination, destinationChange } = this.props
    console.log(destination) // eslint-disable-line
    return (
      <Grid container spacing={16} justify="center">
        <Grid item>
          <Button
            variant={destination === 'about' ? 'contained' : 'outlined'}
            color="primary"
            onClick={destinationChange} >
            O soutěži
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant={destination === 'current-round' ? 'contained' : 'outlined'}
            color="primary"
            onClick={destinationChange} >
            Chci soutěžit
          </Button>
        </Grid>
      </Grid>
    )
  }
}

MainNavigation.propTypes = {
  destination: PropTypes.string.isRequired,
  destinationChange: PropTypes.func.isRequired,
}

export default withStyles(styles)(MainNavigation)
