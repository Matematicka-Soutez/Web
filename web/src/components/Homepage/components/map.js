import React from "react";
import ScrollableAnchor from "react-scrollable-anchor";

const MapSection = () => (
  <ScrollableAnchor id="map">
    <section className="map">
      <iframe
        title="Gymnázium Děčín"
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        marginHeight="0"
        marginWidth="0"
        src="https://www.google.com/maps/embed/v1/place?q=place_id:ChIJ4d2ki9CfCUcRLMk1s93QyHA&key=AIzaSyC89NhjaC6kCprV5KNHN-w0W7I22ND51Xw"
      />
      <br />
    </section>
  </ScrollableAnchor>
);

export default MapSection;
