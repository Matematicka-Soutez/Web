import React from 'react'
import ScrollableAnchor from 'react-scrollable-anchor'
import Grid from '@material-ui/core/Grid'
import './Timeline.css'

const TimeplanSection = () => (
  <ScrollableAnchor id="prubeh">
    <section className="content-section timeplan">
      <Grid container justify="center" spacing={24}>
        <Grid item xs={10} sm={8} lg={6}>
          <div className="content-section-heading">
            <h2 className="mb-5">Předpokládaný průběh soutěže</h2>
          </div>
          <section id="timeline" className="timeline-outer">
            <ul className="timeline">
              <li className="event" data-date="8:30 – 9:20">
                <h3>Prezence družstev</h3>
                <p>
                  Čas prezence je čas určený pro příchod, samotnou prezenci
                  (tj. nahlášení příchodu organizátorům) a usazení dětí. Prosíme Vás, abyste pokud
                  možno nechodili před zahájením prezence, ani těsně k jejímu konci.
                </p>
              </li>
              <li className="event" data-date="9:30 – 9:45">
                <h3>Zahájení soutěže</h3>
                <p>
                  Organizační pokyny, vysvětlení pravidel a příprava na hru.
                  V čase soutěže bude pro doprovázející učitele připravena přednáška.
                </p>
              </li>
              <li className="event" data-date="9:50 – 11:45">
                <h3>Soutěž</h3>
                <p>
                  Čas na samotnou hru a řešení příkladů.
                </p>
              </li>
              <li className="event" data-date="11:45 – 12:45">
                <h3>Vyhodnocení výsledků</h3>
                <p>
                  Čas vyhrazený pro pořadatele k vyhodnocení soutěže. V jeho průběhu se soutěžící
                  mohou občerstvit a zahrát si připravené deskové hry.
                </p>
              </li>
              <li className="event" data-date="13:00">
                <h3>Předpokládaný konec soutěže</h3>
                <p>
                  Vyhlášení výsledků a ukončení soutěže.
                </p>
              </li>
            </ul>
          </section>
        </Grid>
      </Grid>
    </section>
  </ScrollableAnchor>
)

export default TimeplanSection
