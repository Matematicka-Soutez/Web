/* eslint-disable react/jsx-closing-tag-location */
import React from 'react'
import PropTypes from 'prop-types'
import { getFieldColor } from '../utils/color'

function Field({ field }) {
  return (
    <td className="field" style={{ backgroundColor: getFieldColor(field.waterFlow) }}>
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
