import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'

class RegistrationCodeInput extends Component {
  constructor(props) {
    super(props)
    this.onChange = this.onChange.bind(this)
  }

  // eslint-disable-next-line no-shadow
  onChange(event) {
    if (event.target.value.length === 6) {
      this.props.history.push(`/registrace/${event.target.value.toLowerCase()}`)
    }
  }

  render() {
    return (
      <CardContent>
        <Typography color="textSecondary">
          Zadejte školní registrační kód
        </Typography>
        <Typography variant="headline" component="h1">
          <form>
            <TextField
              id="outlined-bare"
              margin="normal"
              variant="outlined"
              fullWidth
              onChange={this.onChange}
            />
          </form>
        </Typography>
      </CardContent>
    )
  }
}

RegistrationCodeInput.propTypes = {
  history: PropTypes.object.isRequired,
}


export default withRouter(RegistrationCodeInput)
