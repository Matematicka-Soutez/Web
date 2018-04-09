import React from 'react'
import PropTypes from 'prop-types'

function Field({ field }) {
  return (
    <div className="field">
      {field.weight} ({field.players})
    </div>
  )
}

Field.propTypes = {
  field: PropTypes.objectOf(PropTypes.number).isRequired,
}

export default Field
