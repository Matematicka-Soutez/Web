import React, { Component } from 'react'
import ScrollableAnchor from 'react-scrollable-anchor'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import RegistrationTimer from '../../Registration/RegistrationTimer'
import RegistrationCodeInput from '../../Registration/RegistrationCodeInput'

class RegistrationSection extends Component {
  constructor(props) {
    super(props)
    const registrationOpens = new Date('2018-10-03T05:30:00.000Z').getTime()
    const currentTime = new Date().getTime()
    const difference = registrationOpens - currentTime
    this.state = {
      remainingTime: difference > 0 ? difference : -1,
    }
    this.timer = null
  }

  componentDidMount() {
    this.timer = setInterval(
      () => this.tick(),
      1000,
    )
  }

  tick() {
    if (this.state.remainingTime > 0) {
      this.setState({
        remainingTime: this.state.remainingTime - 1000,
      })
    } else {
      clearInterval(this.timer)
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  render() {
    const content = this.state.remainingTime > 0
      ? <RegistrationTimer remainingTime={this.state.remainingTime} />
      : <RegistrationCodeInput />
    return (
      <ScrollableAnchor id="registrace">
        <section className="content-section registration">
          <Grid container justify="center" spacing={24}>
            <Grid item xs={10} sm={8} lg={6}>
              <div className="content-section-heading">
                <h2 className="mb-5">Registrace</h2>
              </div>
              <Card>
                {content}
              </Card>
              <p className="lead">
                Nyní je možné registrovat první tým za školu. Druhý tým bude možné (v případě
                zbývající kapacity) registrovat od úterý 16.&nbsp;10.&nbsp;2018 7:30 ráno.
                Pro registraci potřebujete <strong>školní registrační kód</strong>,
                název přihlašovaného týmu a celá jména jeho členů.
              </p>
              <br />
              <h2>Nemáte registrační kód?</h2>
              <p className="lead">
                Pokud se vaše škola MaSa již účastnila, nejpozději týden před zahájením registrací
                by registrační kód měl mít pedagog, který týmy posledně přihlašoval.
                Pokud tomu tak není, napište nám na{' '}
                <a href="mailto:maso-soutez@googlegroups.com">maso-soutez@googlegroups.com</a>
                {' '}a my situaci ihned napravíme.
              </p>
              <br />
              <h2>Účastníte se poprvé?</h2>
              <p className="lead">
                To máme radost! Pošlete nám prosím krátký email s kontaktem na vaši školu na{' '}
                <a href="mailto:maso-soutez@googlegroups.com">maso-soutez@googlegroups.com</a>
                {' '}a my vám obratem pošleme pozvánku se všemi potřebnými pokyny.
              </p>
            </Grid>
          </Grid>
        </section>
      </ScrollableAnchor>
    )
  }
}

export default RegistrationSection
