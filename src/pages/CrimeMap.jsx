import "../assets/css/global.css";
import React, { useState, useEffect } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { useBodyBackground } from "../utils/css-utils";

const getData = (setData, horizon, flag) => {
  const url = `https://runzhec.com/flask_app_runzhec/crime?horizon=${horizon}&flag=${flag}`;
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      setData(data);
      console.log(data);
    })
    .catch((error) => {
      console.log(error.message);
    });
};

const MapComponent = ({ center, data }) => {
  const containerStyle = {
    width: "90%",
    height: "550px",
  };
  const mapId = process.env.REACT_APP_MAP_ID;
  const mapProps = {
    defaultCenter: center,
    defaultZoom: 15,
    mapId: mapId,
    style: containerStyle,
    options: {
      disableDefaultUI: false,
      draggable: true,
      scrollwheel: true,
      gestureHandling: "auto",
    },
  };

  // State to track the currently selected marker
  const [selectedMarker, setSelectedMarker] = useState(null);

  // Define your markers with additional info
  const markers = [];

  data.forEach((point, index) => {
    const lat = parseFloat(point.lat);
    const lng = parseFloat(point.lng);
    markers.push({
      id: index,
      position: {
        lat: lat,
        lng: lng,
      },
      color: point.flag === "Red" ? "#E60000" : "#FF6600",
      glyph: "1",
      info: point.comments,
      time: point.occurred.substring(0, point.occurred.length - 12),
    });
  });

  return (
    <Map {...mapProps}>
      {markers.map((marker) => (
        <AdvancedMarker
          key={marker.id}
          position={marker.position}
          onClick={() => setSelectedMarker(marker.id)}
        >
          <Pin
            background={marker.color}
            glyphColor="#ffffff"
            glyph={marker.glyph}
          />
          {selectedMarker === marker.id && (
            <InfoWindow
              headerContent={<h3>Criminal Activity</h3>}
              position={marker.position}
              onCloseClick={() => setSelectedMarker(null)}
              maxWidth={550}
            >
              {marker.info}
              <hr />
              {marker.time}
            </InfoWindow>
          )}
        </AdvancedMarker>
      ))}
    </Map>
  );
};

export default function CrimeMap() {
  useBodyBackground("white");
  const [data, setData] = useState([]);

  useEffect(() => getData(setData, "1y", "ro"), []);

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  const center = {
    lat: 41.792512,
    lng: -87.599724,
  };

  return (
    <APIProvider apiKey={apiKey}>
      <div className="maroon-bar" />
      <div className="default-margin">
        <div className="default-title">
          <h1 className="title-text-nf-m maroon-text">UChicago Crime Map</h1>
        </div>
        <div className="page-body mt-m">
          <MapComponent data={data} center={center} />
        </div>
      </div>
    </APIProvider>
  );
}
