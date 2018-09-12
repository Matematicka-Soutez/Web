import React from 'react'
import Header from './components/header'
import AboutSection from './components/about'
import TimeplanSection from './components/timeplan'
import RegistrationSection from './components/registration'
import MapSection from './components/map'
import FooterSection from './components/footer'
import ScrollToTop from './components/scrollToTop'

function HomapageContainer() {
  return (
    <div>
      <Header />
      <AboutSection />
      <TimeplanSection />
      <RegistrationSection />
      <MapSection />
      <FooterSection />
      <ScrollToTop />
    </div>
  )
}

export default HomapageContainer
