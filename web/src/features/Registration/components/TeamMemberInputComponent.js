import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import GradeSelectComponent from './GradeSelectComponent'

class TeamMemberInputComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      number: props.number,
      member: props.member,
      required: props.required,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(state => ({
      number: nextProps.number || state.number,
      member: nextProps.member || state.member,
      required: nextProps.required || state.required,
    }))
  }

  render() {
    const { number, member, required } = this.state
    return (
      <React.Fragment>
        {member && (
          <input
            type="hidden"
            id={`teamMemberId${number}`}
            name={`teamMemberId${number}`}
            value={member.id} />
        )}
        <Grid item xs={12} sm={4}>
          <TextField
            id={`firstName${number}`}
            key={member && member.id}
            name={`firstName${number}`}
            label="Jméno"
            defaultValue={member && member.firstName}
            fullWidth
            required={required}
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <TextField
            id={`lastName${number}`}
            key={member && member.id}
            name={`lastName${number}`}
            label="Příjmení"
            defaultValue={member && member.lastName}
            fullWidth
            required={required}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <GradeSelectComponent
            key={member && member.id}
            memberNumber={number}
            required={required}
            value={(member && member.grade) || 0}
          />
        </Grid>
      </React.Fragment>
    )
  }
}

TeamMemberInputComponent.defaultProps = {
  member: {},
}

TeamMemberInputComponent.propTypes = {
  member: PropTypes.object,
  number: PropTypes.number.isRequired,
  required: PropTypes.bool.isRequired,
}

export default TeamMemberInputComponent
