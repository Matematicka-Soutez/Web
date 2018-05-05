/* eslint-disable react/jsx-closing-tag-location */
import React from 'react'
import PropTypes from 'prop-types'

function Field({ field }) {
  // const light = 100 - (Math.abs(field.waterFlow - 10) * 5)
  const light = 100 - (Math.abs(5 - field.waterFlow) * 5)
  // const hue = field.waterFlow > 10 ? 240 : 360
  const hue = 240
  const tdStyle = {
    backgroundColor: `hsl(${hue},80%,${light}%)`,
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
