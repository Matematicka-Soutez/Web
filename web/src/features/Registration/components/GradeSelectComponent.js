import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import { ALLOWED_GRADES } from '../../../config/index'


class GradeSelectComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      memberNumber: props.memberNumber,
      required: props.required,
      value: props.value,
    }
    this.handleChange = this.handleChange.bind(this)
  }

  // eslint-disable-next-line no-shadow
  handleChange(event) {
    this.setState({ value: event.target.value })
  }

  componentWillReceiveProps(nextProps) {
    this.setState(state => ({
      memberNumber: nextProps.memberNumber || state.memberNumber,
      required: nextProps.required || state.required,
      value: nextProps.value || state.value,
    }))
  }

  render() {
    const { memberNumber, required, value } = this.state
    return (
      <TextField
        id={`grade${memberNumber}`}
        name={`grade${memberNumber}`}
        label="Ročník"
        select
        value={value || ''}
        fullWidth
        required={required}
        onChange={this.handleChange}
        InputLabelProps={{ shrink: value > 4 }}
      >
        {!required && <MenuItem value="" />}
        {ALLOWED_GRADES.map(val => <MenuItem key={val} value={val}>{val}</MenuItem>)}
      </TextField>
    )
  }
}

GradeSelectComponent.defaultProps = {
  value: '',
}

GradeSelectComponent.propTypes = {
  memberNumber: PropTypes.number.isRequired,
  required: PropTypes.bool.isRequired,
  value: PropTypes.number,
}

export default GradeSelectComponent
