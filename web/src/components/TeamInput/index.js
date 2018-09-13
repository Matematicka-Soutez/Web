import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AppBar from '@material-ui/core/AppBar'
import Grid from '@material-ui/core/Grid'
import Tabs, { Tab } from '@material-ui/core/Tabs'
import RoomInputContainer from './RoomInputContainer'

class InputContainer extends Component {
  constructor(props) {
    super(props)
    const { match: { params } } = this.props
    this.state = {
      jwtToken: params.jwtToken,
      value: 0,
      venues: [{ rooms: [{ teams: [{}] }] }],
    }
  }

  async componentWillMount() {
    try {
      const headers = { Authorization: `JWT ${this.state.jwtToken}` }
      const res = await fetch('/api/org/venues', { headers })
      const venues = await res.json()
      this.setState({
        jwtToken: this.state.jwtToken,
        value: 1,
        venues,
      })
    } catch (err) {
      // TODO: proper logging
      console.log(err) // eslint-disable-line no-console
    }
  }

  handleChange = (event, value) => {
    this.setState({ ...this.state, value })
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
          <Grid item xs={12} sm={12}>
            <AppBar position="static">
              <Tabs value={value} onChange={this.handleChange}>
                {tabs}
              </Tabs>
            </AppBar>
          </Grid>
        </Grid>
        <RoomInputContainer
          teams={rooms[value].teams.filter(team => team.arrived)}
          jwtToken={this.state.jwtToken} />
      </div>
    )
  }
}

InputContainer.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      jwtToken: PropTypes.string,
    }),
  }).isRequired,
}


export default InputContainer
