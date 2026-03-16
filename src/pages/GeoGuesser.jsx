import "../assets/css/global.css";
import React, { useState, useCallback } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
} from "@vis.gl/react-google-maps";
import { useBodyBackground } from "../utils/css-utils";
import geolocationIcon from "../assets/images/maroon-icon.png";

const MapComponent = ({ center }) => {
  const [marker, setMarker] = useState(null);
  // We'll use a separate key for each pin placement
  const [markerKey, setMarkerKey] = useState(0);

  const handleMapClick = useCallback((event) => {
    if (event.detail && event.detail.latLng) {
      const { lat, lng } = event.detail.latLng;
      setMarker({ lat, lng });
      // Increment our key so React re-mounts the marker
      setMarkerKey((prevKey) => prevKey + 1);
    } else {
      console.error("Map click event did not provide latLng", event);
    }
  }, []);

  const containerStyle = {
    width: "90%",
    height: "550px",
  };
  const mapId = process.env.REACT_APP_MAP_ID;

  const mapProps = {
    defaultCenter: center,
    defaultZoom: 16,
    mapId,
    style: containerStyle,
    options: {
      disableDefaultUI: true,
      clickableIcons: false,
      draggable: true,
      scrollwheel: true,
      gestureHandling: "auto",
    },
    onClick: handleMapClick,
  };

  return (
    <Map {...mapProps}>
      {marker && marker.lat && marker.lng && (
        <AdvancedMarker
          // Using a unique key each time the marker is placed
          key={markerKey}
          position={marker}
          anchorPoint={AdvancedMarkerAnchorPoint.BOTTOM_CENTER}
        >
          <img
            src={geolocationIcon}
            alt="Geolocation Pin"
            style={{ width: 35, height: 35 }}
            className="drop-pin-animation"
          />
        </AdvancedMarker>
      )}
    </Map>
  );
};

export default function GeoGuesser() {
  useBodyBackground("white");

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  const center = {
    lat: 41.790302,
    lng: -87.599724,
  };

  return (
    <APIProvider apiKey={apiKey}>
      <div className="top-20">
        <h1 className="title-text">UChicago GeoGuesser</h1>
      </div>
      <div className="bot-80">
        <div className="default-margin">
          <div className="page-body mt-m">
            <MapComponent center={center} />
          </div>
        </div>
      </div>
    </APIProvider>
  );
}
