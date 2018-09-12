import React from "react";
import ScrollableAnchor from "react-scrollable-anchor";

const TimeplanSection = () => (
  <ScrollableAnchor id="prubeh">
    <section className="content-section bg-primary text-white">
      <div className="container">
        <div className="content-section-heading text-center">
          <h2 className="mb-5">Předpokládaný průběh klání</h2>
        </div>
        <div className="row">
          <div className="col-lg-5 col-md-7 mx-auto container text-center text-md-left" style={{ margin: '0 auto', fontSize: '20pt' }}>
            <div className="row">
              <div className="col-md-5 ">8.30 - 9.15</div>
              <div className="col-md-7">prezence</div>
            </div>
            <div className="d-md-none"><br /></div>

            <div className="row">
              <div className="col-md-5">9.15 - 9.45</div>
              <div className="col-md-7">vysvětlení pravidel</div>
            </div>
            <div className="d-md-none"><br /></div>
                  
            <div className="row">
              <div className="col-md-5">9.45 - 11.30</div>
              <div className="col-md-7">klání</div>
            </div>
            <div className="d-md-none"><br /></div>
                  
            <div className="row">
              <div className="col-md-5">12.15</div>
              <div className="col-md-7">vyhlášení výsledků</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </ScrollableAnchor>
);

export default TimeplanSection;
