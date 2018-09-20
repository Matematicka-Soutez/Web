import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { formattedMS } from '../../utils/time'
import masoLogo from '../../static/images/maso_logo.png'

class RegistrationContainer extends Component {
  constructor(props) {
    super(props)
    const registrationOpens = new Date('2018-10-02T05:30:00.000Z').getTime()
    const currentTime = new Date().getTime()
    const difference = registrationOpens - currentTime
    this.state = {
      schoolToken: this.props.match.params.schoolToken,
      remainingTime: difference > 0 ? difference : -1,
    }
    this.timer = null
  }

  componentDidMount() {
    this.timer = setInterval(
      () => this.tick(),
      1000,
    )
  }

  tick() {
    if (this.state.remainingTime > 0) {
      this.setState({
        remainingTime: this.state.remainingTime - 1000,
      })
    } else {
      clearInterval(this.timer)
    }
  }

  render() {
    const { schoolToken } = this.state
    console.log(schoolToken) // eslint-disable-line no-console
    return (
      <header className="masthead d-flex">
        <Grid container justify="center" spacing={24}>
          <Grid item xs={10} sm={8} lg={6}>
            <Card className="registration">
              <CardContent>
                <Typography color="textSecondary">
                  Registraci spouštíme za
                </Typography>
                <Typography
                  variant="headline"
                  component="h1"
                  style={{ fontSize: '1.9rem', color: '#2196f3', marginBottom: -10 }}>
                  {formattedMS(this.state.remainingTime)}
                </Typography>
              </CardContent>
            </Card>
            <img src={masoLogo} alt="MaSo" style={{ width: 230 }} />
            <h1>Týmová matematická soutěž pro žáky šestých až devátých tříd.</h1>
            <br />
            <Button
              variant="contained"
              color="default"
              size="large"
              href="/"
              style={{ backgroundColor: '#333', color: '#eee' }}>
              Hlavní stránka
            </Button>
          </Grid>
        </Grid>
      </header>
    )
  }
}

RegistrationContainer.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      schoolToken: PropTypes.string,
    }),
  }).isRequired,
}


export default RegistrationContainer
