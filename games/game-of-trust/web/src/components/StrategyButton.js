/* eslint-disable react/jsx-closing-tag-location */
import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import { STRATEGIES } from '../../../core/enums'
import { strategyToImage } from '../utils/strategy'

function StrategyButton({ strategyId, possibleChanges, onClick }) {
  return (
    <Button
      size="large"
      aria-label={STRATEGIES.ids[strategyId].name}
      disabled={!possibleChanges.includes(strategyId)}
      onClick={onClick}
      value={strategyId}>
      <table>
        <tr><td><img
          src={strategyToImage(strategyId)}
          alt={STRATEGIES.ids[strategyId].name}
        /></td></tr>
        <tr><td>{STRATEGIES.ids[strategyId].name}</td></tr>
      </table>
    </Button>
  )
}

StrategyButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  possibleChanges: PropTypes.arrayOf(PropTypes.number).isRequired,
  strategyId: PropTypes.number.isRequired,
}

export default StrategyButton
