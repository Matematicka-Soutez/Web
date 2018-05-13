import React, { Component } from 'react'
import AppBar from 'material-ui/AppBar'
import Grid from 'material-ui/Grid'
import Tabs, { Tab } from 'material-ui/Tabs'
import { FormControlLabel } from 'material-ui/Form'
import Switch from 'material-ui/Switch'
import RoomInputContainer from './RoomInputContainer'

class InputContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: 0,
      evenRooms: true,
      venues: [{ rooms: [{ teams: [{}] }] }],
    }
  }

  async componentWillMount() {
    try {
      const headers = { Authorization: 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdhbml6ZXJJZCI6MSwiaWF0IjoxNTI2MjI3NTc0LCJleHAiOjE1MjYyMzQ3NzQsImlzcyI6ImN6LmN1bmkubWZmLm1hc28ucHJvZHVjdGlvbiJ9.7Q5_julNLKey2bNvJ6Nld_4MdGAHyixks3JwI2QdlU4' } // eslint-disable-line max-len
      const res = await fetch('/api/org/venues', { headers })
      const venues = await res.json()
      this.setState({
        value: 1,
        evenRooms: true,
        venues,
      })
    } catch (err) {
      // TODO: proper logging
      console.log(err) // eslint-disable-line no-console
    }
  }

  handleChange = (event, value) => {
    this.setState({ value, venues: this.state.venues })
  }

  handleSwitch = event => {
    this.setState({ ...this.state, evenRooms: event.target.checked })
  }

  render() {
    const { value, venues } = this.state
    const rooms = []
    const tabs = []
    venues.forEach(venue => {
      tabs.push(<Tab label={`${venue.name}:`} key={venue.name} disabled />)
      rooms.push({ teams: [{}] })
      venue.rooms.forEach(room => {
        rooms.push(room)
        tabs.push(<Tab label={room.name} key={venue.name + room.id} />)
      })
    })
    return (
      <div className="venueSelect">
        <Grid container spacing={24}>
          <Grid item xs={10} sm={11}>
            <AppBar position="static">
              <Tabs value={value} onChange={this.handleChange}>
                {tabs}
              </Tabs>
            </AppBar>
          </Grid>
          <Grid item xs={2} sm={1}>
            <FormControlLabel
              control={<Switch
                checked={this.state.evenRooms}
                onChange={this.handleSwitch}
                value="evenRooms"
                color="primary"
              />}
              label="Sudé" />
          </Grid>
        </Grid>
        <RoomInputContainer
          teams={rooms[value].teams
            .filter(team => (team.number % 2 === 0) === this.state.evenRooms)
          } />
      </div>
    )
  }
}

export default InputContainer
