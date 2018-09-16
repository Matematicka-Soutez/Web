import React from 'react'
import ScrollableAnchor from 'react-scrollable-anchor'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'

const AboutSection = () => (
  <ScrollableAnchor id="o-soutezi">
    <section className="content-section">
      <Grid container justify="center" spacing={24}>
        <Grid item xs={10} sm={8} lg={6} style={{ textAlign: 'justify' }}>
          <div className="content-section-heading">
            <h2 className="mb-5">O soutěži</h2>
          </div>
          <p className="lead">
            MaSo je <strong>týmová matematická soutěž pro žáky šestých až devátých tříd</strong>
            {' '}základních škol a odpovídajících ročníků víceletých gymnázií, která se koná{' '}
            <strong>dvakrát ročně</strong>.
            Nejde tu ovšem jen o <strong>počítání příkladů</strong>.
            Za spočítané příklady získávají týmy tahy do <strong>hry</strong>,
            která je pak hlavním zdrojem jejich bodů do celkového hodnocení.
            Hra je každý rok jiná. Týmy, které se již účastnily, tedy nemají výhodu její znalosti.
          </p>
          <br />
          <h2>Složení týmů</h2>
          <p className="lead">
            Týmy jsou 3 - 4 členné, součet ročníků jednotlivých žáků v jednom z nich může
            být nejvýše 32. Například v jednom družstvu mohou být jeden žák sedmé třídy,
            dva žáci osmých tříd a jeden žák deváté třídy, protože 7 + 8 + 8 + 9 = 32.
          </p>
          <br />
          <h2>Průběh soutěže</h2>
          <p className="lead">
            Žáci počítají matematické příklady a řeší různé logické úlohy.
            Za jejich vyřešení pak mohou odehrávat tahy ve hře.
            Kromě samostatné činnosti je důležitá i koordinace a vzájemná spolupráce.
            Umístnění týmu na stupních vítězů pak záleží nejen na tom,
            kolik správně vyřeší příkladů, ale také na jeho strategii ve hře.
            Během hry je povoleno používat papíry a tužky,
            ostatní pomůcky jako tabulky (a další literatura), kalkulačky, rýsovací pomůcky,
            elektronická zařízení je používat zakázáno.
            Hry a příklady, které se již na MaSu objevily, najdete v Archivu.
          </p>
          <br />
          <Button
            className="js-scroll-trigger"
            variant="contained"
            color="primary"
            size="large"
            href="#aktualni">
            Chci soutěžit
          </Button>
        </Grid>
      </Grid>
    </section>
  </ScrollableAnchor>
)

export default AboutSection
