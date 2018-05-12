/* eslint-disable no-console */
import React, { Component } from 'react'
import PropTypes from 'prop-types'

const headers = { Authorization: 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdhbml6ZXJJZCI6MywiaWF0IjoxNTI1Nzg3ODIzLCJleHAiOjE1MjU3OTUwMjMsImlzcyI6ImN6LmN1bmkubWZmLm1hc28ubG9jYWwifQ.vkFxbj_jP_gFiIzUJtZq2HAArhKFPiPKFDxVAFN-DV8' }

class Input extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  async componentWillReceiveProps(nextProps) {
    try {
      if (nextProps.teamId) {
        const res = await fetch(`/api/org/game/teams/${nextProps.teamId}/position`, { headers })
        const position = await res.json()
        this.setState(position)
      }
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    return (
      <div className="input">
        {this.state.position}
      </div>
    )
  }
}

Input.propTypes = {
  teamId: PropTypes.number.isRequired,
}

export default Input
