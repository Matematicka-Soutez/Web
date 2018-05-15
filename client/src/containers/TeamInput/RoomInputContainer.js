import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  AppBar,
  Tabs,
  Tab,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import Input from '../../../../games/water-bottling/client/Input'

const styles = theme => ({
  tabRoot: {
    marginRight: theme.spacing.unit,
  },
  typography: {
    padding: Number(theme.spacing.unit),
  },
})

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
    const tabs = teams.map(team => <Tab label={team.number} key={team.id} style={{ minWidth: 90 }} />) // eslint-disable-line max-len
    return (
      <div className="teamSelect">
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={this.handleChange}>
            {tabs}
          </Tabs>
        </AppBar>
        <Input teamId={teams[value].id} key={teams[value].id} />
      </div>
    )
  }
}

RoomInputContainer.propTypes = {
  teams: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default withStyles(styles)(RoomInputContainer)
