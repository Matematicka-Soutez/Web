import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

const FooterSection = () => (
  <footer className="footer">
    <Grid container justify="center" spacing={24}>
      <Grid item xs={10} sm={8} lg={6}>
        <br />
        <Typography variant="subtitle1" gutterBottom
          align="center" style={{ color: 'white' }}>
          Pokud máte k soutěži jakékoliv dotazy, neváhejte nám napsat na<br />
          <a href="mailto:maso-soutez@googlegroups.com">maso-soutez@googlegroups.com</a>
        </Typography>
        <br />
        <Typography variant="caption" gutterBottom align="center">
          Copyright &copy; MaSo 2006 - {new Date().getUTCFullYear()}
        </Typography>
      </Grid>
    </Grid>
  </footer>
)

export default FooterSection
