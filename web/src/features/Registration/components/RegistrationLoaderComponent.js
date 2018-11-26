import React from 'react'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'

const RegistrationLoaderComponent = () => (
  <CardContent>
    <br />
    <Typography variant="h5">
      Registrace
    </Typography>
    <br />
    <Typography color="textSecondary" style={{ textAlign: 'left' }}>
      Registrace se načítá, mějte prosím strpení...
    </Typography>
  </CardContent>
)

export default RegistrationLoaderComponent
