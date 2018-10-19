import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { API_ADDRESS, NUMBER_OF_TEAM_MEMBERS } from '../../config/index'
import FormErrorsComponent from '../../components/FormErrorsComponent'
import TeamMemberInputComponent from './components/TeamMemberInputComponent'
import VenueSelectComponent from './components/VenueSelectComponent'
import validateForm from './validation'
import parseFormData from './parser'

const MEMBER_INPUTS = Array.from({ length: NUMBER_OF_TEAM_MEMBERS }, (val, i) => ++i)

class TeamFormContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      school: props.school,
      team: props.team,
      venues: props.venues,
      errors: [],
    }
    this.onSubmit = this.onSubmit.bind(this)
  }

  // eslint-disable-next-line no-shadow
  onSubmit(event) {
    event.preventDefault()
    const errors = validateForm(event.target)
    if (errors.length > 0) {
      this.setState({ errors })
      return
    }
    const team = parseFormData(event.target)
    this.setState(state => ({ team: Object.assign(state.team, team) }))
    fetch(`${API_ADDRESS}/api/competitions/current/registration/${this.state.school.accessCode}`, { // eslint-disable-line no-process-env, max-len
      method: this.state.team ? 'PUT' : 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(team),
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
            errors: ['Odeslání formuláře selhalo, zkuste to prosím později, případně se obraťte na náš email maso-soutez@googlegroups.com.'], // eslint-disable-line max-len
          })
        },
      )
  }

  componentWillReceiveProps(nextProps) {
    this.setState(state => ({
      school: nextProps.school || state.school,
      team: nextProps.team || state.team,
      venues: nextProps.venues || state.venues,
      errors: [],
    }))
  }

  render() {
    const { team, venues, errors } = this.state
    return (
      <form onSubmit={this.onSubmit}>
        <Typography
          variant="headline"
          component="h2"
          style={{ textAlign: 'left', fontSize: '120%' }}>
          {team ? 'Editace týmu' : 'Registrovat nový tým'}
        </Typography>
        <FormErrorsComponent errors={errors} />
        <Grid container spacing={24}>
          <Grid item xs={12}>
            {team && (
              <input
                type="hidden"
                id="teamId"
                name="teamId"
                value={team.id} />
            )}
            <VenueSelectComponent
              key={team && team.id}
              value={team && team.competitionVenue.id}
              venues={venues}
              enabled={!team}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="teamName"
              key={team && team.id}
              name="teamName"
              label="Název týmu"
              defaultValue={team && team.name}
              fullWidth
              required
            />
          </Grid>
          {MEMBER_INPUTS.map(inputId => (
            <TeamMemberInputComponent
              key={inputId}
              number={inputId}
              member={team && team.members[inputId - 1]}
              required={inputId < MEMBER_INPUTS.length}
            />
          ))}
        </Grid>
        <br />
        <Button variant="contained" color="primary" type="submit">
          {team ? 'Upravit' : 'Přihlásit tým'}
        </Button>
      </form>
    )
  }
}

TeamFormContainer.defaultProps = {
  team: null,
}

TeamFormContainer.propTypes = {
  school: PropTypes.object.isRequired,
  team: PropTypes.object,
  venues: PropTypes.array.isRequired,
}

export default TeamFormContainer
