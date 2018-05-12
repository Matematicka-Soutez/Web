import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AppBar from 'material-ui/AppBar'
import Tabs, { Tab } from 'material-ui/Tabs'
import Input from '../../../../games/water-bottling/client/Input'

class RoomInputContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: 0,
      teams: [{}],
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.teams && nextProps.teams.length > 0) {
      this.setState({
        value: this.state.value,
        teams: nextProps.teams,
      })
    }
  }

  handleChange = (event, value) => {
    this.setState({ value, teams: this.state.teams })
  };

  render() {
    const { value, teams } = this.state
    const tabs = teams.map(team => <Tab label={team.name} key={team.id} />)
    return (
      <div className="teamSelect">
        <AppBar position="static">
          <Tabs value={value} onChange={this.handleChange}>
            {tabs}
          </Tabs>
        </AppBar>
        <Input teamId={teams[value].id} />
      </div>
    )
  }
}

RoomInputContainer.propTypes = {
  teams: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default RoomInputContainer
