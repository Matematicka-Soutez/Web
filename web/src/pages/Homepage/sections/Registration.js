import React, { Component } from 'react'
import ScrollableAnchor from 'react-scrollable-anchor'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import RegistrationCountdownComponent from '../../../components/Registration/RegistrationCountdownComponent' // eslint-disable-line max-len
import RegistrationCodeInput from '../../../components/Registration/RegistrationCodeInputComponent'

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
      this.setState(state => ({
        remainingTime: state.remainingTime - 1000,
      }))
    } else {
      clearInterval(this.timer)
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  render() {
    return (
      <ScrollableAnchor id="registrace">
        <section className="content-section registration">
          <Grid container justify="center" spacing={24}>
            <Grid item xs={10} sm={8} lg={6}>
              <div className="content-section-heading">
                <h2 className="mb-5">Registrace</h2>
              </div>
              <Card>
                {this.state.remainingTime > 0
                  ? <RegistrationCountdownComponent remainingTime={this.state.remainingTime} />
                  : <RegistrationCodeInput />
                }
              </Card>
              <p className="lead">
                Kapacita soutěže byla naplněna a již není možné registrovat další týmy.
                Omlouváme se všem, na které se nedostalo. Na jaro připravujeme pro MaSo
                nové prostory s větší kapacitou, kde už by se mělo dostat na všechny.
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
