import React from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'

function CurrentRound(props) {
  const { classes } = props
  return (
    <div className="currentRound">
      <Grid item xs={12} style={{ fontSize: 18 }}>
        <h2>Podzimní MaSo 2018</h2>
        <p><strong>Kdy:</strong> 6. 11. 2018</p>
      </Grid>
      <Grid item xs={6}>
        <Card className={classes.card}>
          <CardMedia
            className={classes.media}
            image="/static/images/cards/contemplative-reptile.jpg"
            title="Contemplative Reptile"
          />
          <CardContent>
            <Typography gutterBottom variant="headline" component="h2">
                  Praha
            </Typography>
            <Typography component="p" style={{ fontStyle: 'italic' }}>
                Budova MFF UK,<br />
                Malostranské náměstí 25,<br />
                Praha 1, 110 00<br />
            </Typography>
            <Typography component="p" style={{ marginTop: 8 }}>
              <strong>Ondra Draganov</strong> (+420 786 364 100)
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6}>
        <Card className={classes.card}>
          <CardMedia
            className={classes.media}
            image="/static/images/cards/contemplative-reptile.jpg"
            title="Contemplative Reptile"
          />
          <CardContent>
            <Typography gutterBottom variant="headline" component="h2">
            Brno
            </Typography>
            <Typography component="p" style={{ fontStyle: 'italic' }}>
                Budova FI MUNI,<br />
                Botanická 68a,<br />
                Brno, 602 00<br />
            </Typography>
            <Typography component="p" style={{ marginTop: 8 }}>
              <strong>Filip Lux</strong> (+420 737 856 596)
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </div>
  )
}

CurrentRound.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default CurrentRound

