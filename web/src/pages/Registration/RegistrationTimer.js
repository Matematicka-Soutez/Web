import React from 'react'
import PropTypes from 'prop-types'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import { formattedMS } from '../../utils/time'

const RegistrationTimer = ({ remainingTime }) => (
  <CardContent>
    <Typography
      variant="headline"
      component="h1">
          Pozor
    </Typography>
    <br />
    <Typography color="textSecondary">
          Z technických důvodů musíme registraci o 24 hodin odložit.
          Omlouváme se za prodlení a s ním spojené komplikace. Registrovat se bude možné
          dnes (středa 3. 10.) od 7:30, tedy za
    </Typography>
    <br />
    <Typography
      variant="headline"
      component="h1"
      style={{ fontSize: '1.9rem', color: '#2196f3', marginBottom: -10 }}>
      {formattedMS(remainingTime)}
    </Typography>
  </CardContent>
)

RegistrationTimer.propTypes = {
  remainingTime: PropTypes.number.isRequired,
}


export default RegistrationTimer
