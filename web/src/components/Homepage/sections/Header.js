import React from 'react'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import masoLogo from '../../../static/images/maso_logo.png'

const Header = () => (
  <header className="masthead d-flex">
    <Grid container justify="center" spacing={24}>
      <Grid item xs={10} sm={8} lg={6}>
        <img src={masoLogo} alt="MaSo" style={{ width: 230 }} />
        <h1>Týmová matematická soutěž pro žáky šestých až devátých tříd.</h1>
        <br />
        <Button
          className="js-scroll-trigger"
          variant="contained"
          color="primary"
          size="large"
          href="#registrace">
          Registrace
        </Button>
        &nbsp;&nbsp;
        <Button
          className="js-scroll-trigger"
          variant="outlined"
          color="primary"
          size="large"
          href="#o-soutezi">
          O soutěži
        </Button>
        <div className="overlay"></div>
      </Grid>
    </Grid>
  </header>
)

export default Header
