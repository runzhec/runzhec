import "../assets/css/global.css";
import React, { useRef, useEffect } from "react";
import { GoogleMap, LoadScript, MarkerF } from "@react-google-maps/api";
import { useBodyBackground } from "../utils/css-utils";

// Don't forget to restrict and protect your API key later
// https://developers.google.com/maps/api-security-best-practices#restricting-api-keys

const MapComponent = ({ center, apiKey }) => {
  const containerStyle = {
    width: "90%",
    height: "550px",
  };

  const zoom = 15;

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={zoom}>
        <MarkerF position={center} />
      </GoogleMap>
    </LoadScript>
  );
};

export default function CrimeMap() {
  useBodyBackground("white");

  // Use an environment variable to secure the API key
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  const center = {
    lat: 41.792512,
    lng: -87.599724,
  };

  return (
    <>
      <div className="maroon-bar" />
      <div className="default-margin">
        <div className="default-title">
          <h1 className="title-text-nf-m maroon-text">UChicago Crime Map</h1>
        </div>
        <div className="page-body mt-m">
          <MapComponent center={center} apiKey={apiKey} />
        </div>
      </div>
    </>
  );
}
