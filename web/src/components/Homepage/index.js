import React from 'react'
import Header from './sections/Header'
import AboutSection from './sections/About'
import CurrentEditionSection from './sections/CurrentEdition'
import TimelineSection from './sections/Timeline'
import RegistrationSection from './sections/Registration'
import RegisteredTeamsSection from './sections/RegisteredTeams'
import FooterSection from './sections/Footer'
import ScrollToTop from './sections/ScrollToTop'

function HomapageContainer() {
  return (
    <div>
      <Header />
      <AboutSection />
      <CurrentEditionSection />
      <TimelineSection />
      <RegistrationSection />
      <RegisteredTeamsSection />
      <FooterSection />
      <ScrollToTop />
    </div>
  )
}

export default HomapageContainer
