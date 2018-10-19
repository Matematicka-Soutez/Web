import React from 'react'
import PropTypes from 'prop-types'

function FormErrorsComponent({ errors }) {
  const style = {
    marginTop: '0.5rem',
    marginBottom: '0.5rem',
    padding: '0.5rem',
    textAlign: 'left',
    backgroundColor: '#f5c6cb',
    fontSize: '80%',
  }
  // eslint-disable-next-line react/no-array-index-key
  return errors.map((error, index) => <div style={style} key={index}>{error}</div>)
}

FormErrorsComponent.propTypes = {
  errors: PropTypes.array.isRequired,
}

export default FormErrorsComponent
