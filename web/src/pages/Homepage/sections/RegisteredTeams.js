import React, { Component } from 'react'
import ScrollableAnchor from 'react-scrollable-anchor'
import Grid from '@material-ui/core/Grid'
import { API_ADDRESS } from '../../../config'

class RegisteredTeamsSection extends Component {

  constructor(props) {
    super(props)
    this.state = { teamsByVenue: null }
  }

  componentWillMount() {
    fetch(`${API_ADDRESS}/api/competitions/current/teams`) // eslint-disable-line no-process-env, max-len
      .then(res => res.json())
      .then(
        result => this.setState({ teamsByVenue: result }),
        error => {
          console.log(error) // eslint-disable-line no-console
        },
      )
  }

  render() {
    return (
      <ScrollableAnchor id="registered-teams">
        <section className="content-section registered-teams">
          <Grid container justify="center" spacing={24}>
            <Grid item xs={10} sm={8} lg={6}>
              <div className="content-section-heading">
                <h2 className="mb-5">Přihlášené týmy</h2>
              </div>
              <p className="lead">
                Zde můžete vidět již registrované týmy. Čísla za místem konání
                udávají počet obsazených míst z celkového počtu dostupných.
              </p>
              {this.state.teamsByVenue
                ? this.state.teamsByVenue.map(displayVenue)
                : <p>Načítání týmů ...</p>}
            </Grid>
          </Grid>
        </section>
      </ScrollableAnchor>
    )
  }
}

function displayVenue(venue) {
  return (
    <React.Fragment key={venue.id}>
      <h2>{venue.name} ({venue.teams.length} / {venue.capacity})</h2>
      {venue.teams.length > 0
        ? <table><tbody>{venue.teams.map(displayTeam)}</tbody></table>
        : <p>Zatím není přihlášen žádný tým.</p>}
    </React.Fragment>
  )
}

function displayTeam(team) {
  return (
    <tr key={team.id}>
      <td>{team.name}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
      <td>{team.school.fullName}</td>
    </tr>
  )
}

export default RegisteredTeamsSection
