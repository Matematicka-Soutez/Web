import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'

const GRADES = [5, 6, 7, 8, 9]
const MEMBER_INPUTS = [1, 2, 3, 4]

class AddTeamForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      school: this.props.school,
      venues: this.props.venues,
      errors: [],
      selects: {
        grade1: '',
        grade2: '',
        grade3: '',
        grade4: '',
        competitionVenueId: 0,
      },
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  // eslint-disable-next-line no-shadow
  handleChange(event) {
    const selects = { ...this.state.selects }
    selects[event.target.name] = event.target.value
    this.setState({ selects })
  }

  // eslint-disable-next-line no-shadow
  onSubmit(event) {
    event.preventDefault()
    // Additional validations
    const newErrors = []
    if (
      !(event.target.firstName4.value !== '' && event.target.lastName4.value !== '' && event.target.grade4.value !== '') // eslint-disable-line max-len
      && !(event.target.firstName4.value === '' && event.target.lastName4.value === '' && event.target.grade4.value === '') // eslint-disable-line max-len
    ) {
      newErrors.push('Čtvrtý člen týmu nutně není povinný, ale musí být vyplněn kompletně nebo vůbec.') // eslint-disable-line max-len
    }
    const gradeSum = (event.target.grade1.value !== '' ? parseInt(event.target.grade1.value, 10) : 0) // eslint-disable-line max-len
      + (event.target.grade2.value !== '' ? parseInt(event.target.grade2.value, 10) : 0)
      + (event.target.grade3.value !== '' ? parseInt(event.target.grade3.value, 10) : 0)
      + (event.target.grade4.value !== '' ? parseInt(event.target.grade4.value, 10) : 0)
    if (gradeSum > 32) {
      newErrors.push('Součet ročníků členů týmu nesmí přesáhnout 32.')
    }
    if (event.target.grade1.value === ''
    || event.target.grade2.value === ''
    || event.target.grade3.value === '') {
      newErrors.push('Ročníky všech členů musí být vyplněny.')
    }
    if (newErrors.length > 0) {
      this.setState({ errors: newErrors })
      return
    }

    // Form submission
    const payload = {
      teamName: event.target.teamName.value,
      competitionVenueId: event.target.competitionVenueId.value,
      members: [{
        firstName: event.target.firstName1.value,
        lastName: event.target.lastName1.value,
        grade: event.target.grade1.value,
      }, {
        firstName: event.target.firstName2.value,
        lastName: event.target.lastName2.value,
        grade: event.target.grade2.value,
      }, {
        firstName: event.target.firstName3.value,
        lastName: event.target.lastName3.value,
        grade: event.target.grade3.value,
      }],
    }
    if (event.target.firstName4.value !== '') {
      payload.members.push({
        firstName: event.target.firstName4.value,
        lastName: event.target.lastName4.value,
        grade: event.target.grade4.value,
      })
    }
    fetch(`${process.env.REACT_APP_SERVER_ADDRESS}api/competitions/current/registration/${this.state.school.accessCode}`, { // eslint-disable-line no-process-env, max-len
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).then(res => res.json())
      .then(
        result => {
          if (result.success) {
            window.location.reload()
          } else {
            this.setState({
              errors: [result.message],
            })
          }
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        error => {
          console.log(error) // eslint-disable-line no-console
          this.setState({
            errors: ['Odeslání formuláře selhalo, zkuste to prosím později, případě se obraťte na náš <a href="mailto:maso-soutez@googlegroups.com">email</a>.'], // eslint-disable-line max-len
          })
        },
      )
  }

  render() {
    const memberInput = id => (
      <React.Fragment key={id}>
        <Grid item xs={12} sm={4}>
          <TextField
            id={`firstName${id}`}
            name={`firstName${id}`}
            label="Jméno"
            fullWidth
            required={id !== 4}
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <TextField
            id={`lastName${id}`}
            name={`lastName${id}`}
            label="Příjmení"
            fullWidth
            required={id !== 4}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            id={`grade${id}`}
            name={`grade${id}`}
            label="Ročník"
            select
            value={this.state.selects[`grade${id}`]}
            fullWidth
            required={id !== 4}
            onChange={this.handleChange}
            InputLabelProps={{ shrink: this.state.selects[`grade${id}`] > 4 }}
          >
            {GRADES.map(value => <MenuItem key={value} value={value}>{value}</MenuItem>)}
          </TextField>
        </Grid>
      </React.Fragment>
    )
    return (
      <form onSubmit={this.onSubmit}>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <TextField
              id="competitionVenueId"
              name="competitionVenueId"
              label="Soutěžní místo"
              select
              value={this.state.selects.competitionVenueId}
              fullWidth
              required
              onChange={this.handleChange}
              InputLabelProps={{ shrink: this.state.selects.competitionVenueId > 0 }}
            >
              {this.state.venues.map(venueMenuItem)}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="teamName"
              name="teamName"
              label="Název týmu"
              fullWidth
              required
            />
          </Grid>
          {MEMBER_INPUTS.map(memberInput)}
        </Grid>
        {this.state.errors.map(errorBox)}
        <br />
        <Button variant="contained" color="primary" type="submit">
          Přihlásit tým
        </Button>
      </form>
    )
  }
}

function errorBox(error, index) {
  const style = {
    marginTop: '1rem',
    padding: '0.5rem',
    textAlign: 'left',
    backgroundColor: '#f5c6cb',
    fontSize: '80%',
  }
  return (
    <div style={style} key={index}>{error}</div>
  )
}

function venueMenuItem(venue) {
  return (
    <MenuItem
      key={venue.id}
      value={venue.id}
      disabled={venue.remainingCapacity === 0}>
      {venue.name} (zbývá {venue.remainingCapacity} míst)
    </MenuItem>
  )
}

// TODO: proper prop types
AddTeamForm.propTypes = {
  school: PropTypes.object.isRequired,
  venues: PropTypes.array.isRequired,
}

export default AddTeamForm
