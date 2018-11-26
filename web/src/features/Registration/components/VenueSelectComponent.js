import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'


class VenueSelectComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: props.value,
      venues: props.venues,
      enabled: props.enabled,
    }
    this.handleChange = this.handleChange.bind(this)
  }

  // eslint-disable-next-line no-shadow
  handleChange(event) {
    this.setState({ value: event.target.value })
  }

  componentWillReceiveProps(nextProps) {
    this.setState(state => ({
      value: nextProps.value || state.value,
      venues: nextProps.venues || state.venues,
      enabled: nextProps.enabled || state.enabled,
    }))
  }

  render() {
    const { value, venues, enabled } = this.state
    return (
      <TextField
        id="competitionVenueId"
        name="competitionVenueId"
        label="Soutěžní místo"
        select
        value={value || ''}
        fullWidth
        required
        onChange={this.handleChange}
        InputLabelProps={{ shrink: value > 0 }}
      >
        {venues.map(venue => venueMenuItem(venue, enabled))}
      </TextField>
    )
  }
}

function venueMenuItem(venue, enabled) {
  return (
    <MenuItem
      key={venue.id}
      value={venue.id}
      disabled={!enabled || venue.remainingCapacity < 1}>
      {venue.name} (zbývá {venue.remainingCapacity} míst)
    </MenuItem>
  )
}

VenueSelectComponent.defaultProps = {
  value: '',
}

VenueSelectComponent.propTypes = {
  enabled: PropTypes.bool.isRequired,
  value: PropTypes.number,
  venues: PropTypes.array.isRequired,
}

export default VenueSelectComponent
