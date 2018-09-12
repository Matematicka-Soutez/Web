import React from 'react'
import ScrollableAnchor from 'react-scrollable-anchor'

const AboutSection = () => (
  <ScrollableAnchor id="about">
    <section className="content-section bg-light">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 mx-auto text-justify">

            <h2>O soutěži</h2>
            <p className="lead">
              DěMaK je děčínské matematické klání mezi týmy tvořenými žáky 2. stupně
              základních škol. A v čem se bude soutěžit? Budou se řešit nejen
              matematické a logické úlohy, ale půjde i o zvolení dobré strategie.
              Účastníci se zde nepotkají s obvyklými školními příklady,
              ale&nbsp;s&nbsp;netradičními úkoly, které procvičí jejich matematické myšlení.
            </p>
            <p className="lead">
              Za správně vyřešené příklady získávají týmy tahy ve strategické hře,
              která běží na pozadí celé soutěže.
              Hra se promítá na plátno a všechny týmy vidí, jak se vyvíjí.
              O čem hra bude, se&nbsp;účastníci dozví až na místě.
            </p>
            <p className="lead">
              Soutěží čtyřčlenné týmy, které jsou složené ze žáků tak,
              aby součet školních ročníků jednotlivých žáků nepřesáhl 32.
              (V jednom týmů tedy nemohou být všichni čtyři žáci z&nbsp;9.&nbsp;ročníku,
              ale mohou být ve složení např. 9 + 9 + 7 + 7 = 32.)
            </p>

            <p className="lead">
              <strong>DěMaK proběhne ve čtvrtek 13. 9. 2018 v aule
                <a href="http://www.gymnaziumdc.cz/">Gymnázia Děčín</a>.
              </strong>
            </p>
            <br />
            <br />
            <a className="btn btn-dark btn-xl js-scroll-trigger" href="#registrace">Chci soutěžit</a>
          </div>
        </div>
      </div>
    </section>
  </ScrollableAnchor>
)

export default AboutSection
