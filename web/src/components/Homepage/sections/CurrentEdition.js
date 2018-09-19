import React from 'react'
import ScrollableAnchor from 'react-scrollable-anchor'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'

function CurrentEditionSection() {
  return (
    <ScrollableAnchor id="aktualni">
      <section className="content-section current-edition">
        <Grid container justify="center" spacing={24}>
          <Grid item xs={10} sm={8} lg={6}>
            <div className="content-section-heading">
              <h2 className="mb-5">Podzimní MaSo 2018</h2>
            </div>
            <p className="lead">
              V pořadí 24. MaSo uspořádáme v úterý <strong>6.&nbsp;11.&nbsp;2018</strong> na
              následujících dvou místech. Kapacity jsou omezené, proto prosím neváhejte
              s registrací. První kolo registrací spustíme v
              úterý 2.&nbsp;10.&nbsp;2018 v 7:30 ráno.
            </p>

            <Grid container justify="center" spacing={24}>
              <Grid item md={6}>
                <Card>
                  <CardMedia frameBorder="0" style={{ border: 0 }} component="iframe"
                    src="https://www.google.com/maps/embed/v1/place?q=place_id:ChIJARqUH-KUC0cRyL3tboAzqoc&key=AIzaSyDdAnTl-DjPQY_p8vJ8E_g6MjlUiGngGrA" /> {/* eslint-disable-line max-len */}
                  <CardContent>
                    <Typography gutterBottom variant="headline" component="h2">
                      Praha
                    </Typography>
                    <Typography component="p" variant="caption">
                      Matematicko-fyzikální fakulta UK,<br />
                      Malostranské náměstí 25,<br />
                      Praha 1, 110 00<br />
                    </Typography>
                    <Typography component="p" style={{ marginTop: 8 }}>
                      <strong>Lukáš Kubacki</strong> (+420 731 986 917)
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item md={6}>
                <Card>
                  <CardMedia frameBorder="0" style={{ border: 0 }} component="iframe"
                    src="https://www.google.com/maps/embed/v1/place?q=place_id:ChIJxcUpbz6UEkcR4JO3h4GMCc4&key=AIzaSyDdAnTl-DjPQY_p8vJ8E_g6MjlUiGngGrA" /> {/* eslint-disable-line max-len */}
                  <CardContent>
                    <Typography gutterBottom variant="headline" component="h2">
                      Brno
                    </Typography>
                    <Typography component="p" variant="caption">
                      Gymnázium Matyáše Lercha,<br />
                      Žižkova ulice 980/55,<br />
                      Brno - Veveří, 616 00<br />
                    </Typography>
                    <Typography component="p" style={{ marginTop: 8 }}>
                      <strong>Filip Lux</strong> (+420 737 856 596)
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </section>
    </ScrollableAnchor>
  )
}

export default CurrentEditionSection
