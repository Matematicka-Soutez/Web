import React, { Component } from 'react'
import AppBar from 'material-ui/AppBar'
import Tabs, { Tab } from 'material-ui/Tabs'
import RoomInputContainer from './RoomInputContainer'

class InputContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: 0,
      venues: [{ rooms: [{ teams: [{}] }] }],
    }
  }

  async componentWillMount() {
    try {
      const headers = { Authorization: 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdhbml6ZXJJZCI6MywiaWF0IjoxNTI1Nzg3ODIzLCJleHAiOjE1MjU3OTUwMjMsImlzcyI6ImN6LmN1bmkubWZmLm1hc28ubG9jYWwifQ.vkFxbj_jP_gFiIzUJtZq2HAArhKFPiPKFDxVAFN-DV8' }
      const res = await fetch('/api/org/venues', { headers })
      const venues = await res.json()
      console.log(venues)
      this.setState({
        value: 0,
        venues,
      })
    } catch (err) {
      // TODO: proper logging
      console.log(err) // eslint-disable-line no-console
    }
  }

  handleChange = (event, value) => {
    this.setState({ value, venues: this.state.venues })
  };

  render() {
    const { value, venues } = this.state
    const rooms = []
    const tabs = []
    venues.forEach(venue => {
      tabs.push(<Tab label={`${venue.name}:`} key={venue.name} disabled />)
      venue.rooms.forEach(room => {
        rooms.push(room)
        tabs.push(<Tab label={room.name} key={venue.name + room.id} />)
      })
    })
    return (
      <div className="venueSelect">
        <AppBar position="static" color="default">
          <Tabs value={value} onChange={this.handleChange}>
            {tabs}
          </Tabs>
        </AppBar>
        <RoomInputContainer teams={rooms[value].teams} />
      </div>
    )
  }
}

export default InputContainer
