import React from 'react'
import PropTypes from 'prop-types'
import Field from './Field'

function Grid({ size, fields }) {
  const rows = []
  for (let rowIndex = 0; rowIndex < size.height; rowIndex++) {
    const row = []
    for (let collIndex = 0; collIndex < size.width; collIndex++) {
      const index = (rowIndex * size.width) + collIndex
      row.push(<Field key={index} field={fields[index]} />)
    }
    rows.push(<div className="grid-row">{row}</div>)
  }
  return <div className="grid">{rows}</div>
}

Grid.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.number)).isRequired,
  size: PropTypes.objectOf(PropTypes.number).isRequired,
}

export default Grid
