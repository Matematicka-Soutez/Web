import React from 'react'

const Header = () => (
  <header className="masthead d-flex">
    <div className="container text-center my-auto">
      <h1 className="mb-1">DěMaK</h1>
      <h3 className="mb-5">
        <em>Děčínské Matematické Klání</em><br />
        <em>Čtvrtek 13. 9. 2018</em>
      </h3>
      <a className="btn btn-primary btn-xl js-scroll-trigger" href="#about">O soutěži</a>
      &nbsp;&nbsp;
      <a className="btn btn-primary btn-xl js-scroll-trigger" href="/results">Výsledky</a>
    </div>
    <div className="overlay"></div>
  </header>
)

export default Header
