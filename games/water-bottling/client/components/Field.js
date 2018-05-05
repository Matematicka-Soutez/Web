/* eslint-disable react/jsx-closing-tag-location */
import React from 'react'
import PropTypes from 'prop-types'

function Field({ field }) {
  const frequency = 0.18
  const center = 192
  const width = 63
  const i = (25 - field.waterFlow) + 25
  const red = (Math.sin(frequency * i) * width) + center
  const green = (Math.sin((frequency * i) + 1) * width) + center
  const blue = (Math.sin((frequency * i) + 2) * width) + center
  const tdStyle = {
    backgroundColor: `rgb(${red},${green},${blue})`,
  }
  return (
    <td className="field" style={tdStyle}>
      {field.teamCount !== 0
      && <table><tbody>
        <tr>
          <td className="material-icons">group</td>
          <td className="capture teamCount">{field.teamCount}</td>
        </tr>
        <tr>
          <td className="material-icons">flash_on</td>
          <td className="capture">{field.combinedPower}</td>
        </tr>
      </tbody></table>}
      {field.teamCount === 0 && <span> </span>}
    </td>
  )
}

Field.propTypes = {
  field: PropTypes.objectOf(PropTypes.number).isRequired,
}

export default Field
