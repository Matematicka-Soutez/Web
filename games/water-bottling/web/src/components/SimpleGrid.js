import React from 'react'
import PropTypes from 'prop-types'
import { getFieldColor } from '../utils/color'

function getColumnLetter(index) {
  return String.fromCharCode(64 + index)
}

function SimpleGrid({ grid, position }) {
  const rows = []
  for (let rowIndex = 0; rowIndex < grid.height; rowIndex++) {
    const row = []
    for (let collIndex = 0; collIndex < grid.width; collIndex++) {
      row.push(simpleField(rowIndex, collIndex, grid, position))
    }
    rows.push(<tr key={rowIndex}><td>{getColumnLetter(rowIndex + 1)}&nbsp;&nbsp;</td>{row}</tr>)
  }
  const colNumbers = [<td key={0}></td>]
  for (let i = 1; i <= grid.width; i++) {
    colNumbers.push(<td key={i}>{i}</td>)
  }
  return (
    <table className="grid simpleGrid">
      <tbody>
        <tr>{colNumbers}</tr>
        {rows}
      </tbody>
    </table>
  )
}

function simpleField(rowIndex, collIndex, grid, position) {
  const index = (rowIndex * grid.width) + collIndex
  const positionIndex = ((grid.height - position.vertical) * grid.width) + position.horizontal - 1
  const color = getFieldColor(grid.waterFlows[rowIndex][collIndex])
  if (positionIndex !== index) {
    return <td className="field" style={{ backgroundColor: color }}>&nbsp;</td>
  }
  return (
    <td className="field" style={{ backgroundColor: color, fontSize: 33, fontWeight: 'bold' }}>
      <span className="material-icons" style={{ fontSize: 20 }}>flash_on</span> {position.power}
    </td>
  )
}

SimpleGrid.propTypes = {
  grid: PropTypes.object.isRequired,
  position: PropTypes.object.isRequired,
}

export default SimpleGrid
