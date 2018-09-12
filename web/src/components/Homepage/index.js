import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import masoLogo from '../../static/images/maso_logo.png'
import MainNavigation from './MainNavigation'
import About from './About'
import CurrentRound from './CurrentRound'

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 4,
    color: '#444',
  },
})

class HomapageContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = { destination: 'about' }
    this.destinationChange = this.destinationChange.bind(this)
  }

  destinationChange(newDestination) {
    this.setState({ destination: newDestination })
  }

  render() {
    const { classes } = this.props
    let Content = About
    switch (this.state.destination) {
      case 'about':
        Content = About
        break
      case 'current':
        Content = CurrentRound
        break
      default:
        Content = About
    }
    return (
      <div className="homepage" style={{ width: 800, margin: '30px auto' }}>
        <Grid container spacing={24}>
          <Grid item xs={12} style={{ textAlign: 'center' }}>
            <img
              src={masoLogo}
              alt="logo"
              style={{ width: 150 }}
              onClick={() => this.destinationChange(null, 'about')}
              role="presentation"
              onKeyPress={() => {}} />
          </Grid>
          <Grid item xs={12}>
            <MainNavigation
              destination={this.state.destination}
              destinationChange={this.destinationChange}
              classes={classes} />
          </Grid>
          <Grid item xs={12}>
            <Content classes={classes} />
          </Grid>
          <Grid item xs={12}>
            <p>
              Pokud máte k soutěži jakékoliv dotazy, neváhejte nám napsat
              na <a href="mailto:maso-soutez@googlegroups.com">maso-soutez@googlegroups.com</a>.
            </p>
          </Grid>
        </Grid>
      </div>
    )
  }

}

HomapageContainer.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(HomapageContainer)
