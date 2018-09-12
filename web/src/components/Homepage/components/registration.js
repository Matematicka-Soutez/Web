import React from 'react'
import ScrollableAnchor from 'react-scrollable-anchor'

function RegistrationSection() {
  return (
    <ScrollableAnchor id="registrace">
      <section className="content-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="content-section-heading text-center">
                <h2 className="mb-5">Registrace</h2>
              </div>
              <p className="lead text-center">
                  Registrace již skončila, těšíme se na Vás na klání.
              </p>
            </div>
          </div>
        </div>
      </section>
    </ScrollableAnchor>
  )
}

export default RegistrationSection
