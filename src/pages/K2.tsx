import React, { useEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {
  APIProvider,
  Map,
  useMapsLibrary,
  useMap,
} from "@vis.gl/react-google-maps";

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const trips = [
  {
    origin: "Millennium Station",
    destination: "871 N Wabash Ave, Chicago, IL 60611",
    originTooltip: "Pre-Date: Millennium Station",
    destinationTooltip:
      "Pre-Date: Jeni's, only time we've seen each others at Jeni's(cope)",
    waypoints: [
      {
        location: "313 W Wolf Point Plaza",
        stopover: true,
      },
      {
        location: "100 W Ontario St, Chicago, IL 60610",
        stopover: true,
      },
      {
        location: "12 S Michigan Ave, Chicago, IL 60603",
        stopover: true,
      },
      {
        location: "210 E Illinois St, Chicago, IL 60611",
        stopover: true,
      },
    ],
    waypointTooltips: [
      "Pre-Date: Blue Bottle Coffee, you got through a whole chapter of physics #academicweapon",
      "Pre-Date: Portillo's & Barnelli's, cake shake was mid",
      "Pre-Date: Chicago Athletic Association, thought this was a study sesh but we alr walked sm today...",
      "Pre-Date: Qiao Lin Hotpot, was dying from the spice, fake it until u make it :)",
    ],
  },
  {
    origin: "215 E Grand Ave, Chicago, IL 60611",
    destination: "V9RX+V5 Streeterville, Chicago, IL",
    originTooltip:
      "1st Date: Shang Noodle, food was eh but I got my fav photo of u here, yayy!!",
    destinationTooltip:
      "1st Date: Navy Pier, the moment I realized I was cooked",
    waypoints: [
      {
        location: "322 E Illinois St, Chicago, IL 60611",
        stopover: true,
      },
    ],
    waypointTooltips: [
      "1st Date: Lucky Strike Arcade, took a decade to convince u to let me take a photo...",
    ],
  },
  {
    origin: "230 N Clark St, Chicago, IL 60601",
    destination: "500 W Madison St STE 700, Chicago, IL 60661",
    originTooltip:
      "2nd Date: Ace Bounce, next time we need to get a non black table!!",
    destinationTooltip:
      "2nd Date: Expedia Group, I alr knew Panda was gonna have me in a chokehold",
    waypoints: [
      {
        location: "230 W Erie St, Chicago, IL 60654",
        stopover: true,
      },
      {
        location: "20 S Wacker Dr, Chicago, IL 60606",
        stopover: true,
      },
    ],
    waypointTooltips: [
      "2nd Date: Union Sushi, b r u h, why the waiters ask to check our res like 10 times...",
      "2nd Date: Wells Fargo, a visit to ur t̶o̶r̶t̶u̶r̶e̶ workplace",
    ],
  },
  {
    origin: "201 E Randolph St Chicago, IL 60602",
    destination: "1200 S DuSable Lake Shore Dr, Chicago, IL 60605",
    originTooltip: "3rd Date: Millennium Park, u were late smh",
    destinationTooltip:
      "3rd Date: Shedd Aquarium, wait we acc walked sm this date",
    waypoints: [
      {
        location: "Maggie Dalley Park",
        stopover: true,
      },
      {
        location: "210 E Ohio St, Chicago, IL 60611",
        stopover: true,
      },
    ],
    waypointTooltips: [
      "3rd Date: Maggie Dalley Park, walking on the bridge was aesthetics",
      "3rd Date: Gyu Kaku, had enough food left over to feed a village oop",
    ],
  },
  {
    origin: "Chicago Bean",
    destination: "V9J6+VH Chicago, Illinois",
    originTooltip: "Wthelley talk: Bean",
    destinationTooltip: "Wthelley talk: River Walk",
    waypoints: [
      {
        location: "29 E Madison St SUITE 191, Chicago, IL 60602",
        stopover: true,
      },
    ],
    waypointTooltips: [
      "Wthelley talk: Panda Express, my addiction going strong",
    ],
  },
  {
    origin: "Grant Park Pickleball Courts",
    destination: "10 E Jackson Blvd, Chicago, IL 60604",
    originTooltip: "PICKLEBALL: Pickleball!!!!!",
    destinationTooltip:
      "PICKLEBALL: Chipolate, just 2 sweaty mfs being fatasses",
  },
  {
    origin: "525 S State Street Chicago",
    destination: "VCR2+PG Chicago, Illinois",
    originTooltip: "4th Date: Meetup",
    destinationTooltip: "4th Date: End of Navy Pier, the view was so prettyyy",
    waypoints: [
      {
        location: "22 N State St, Chicago, IL 60602",
        stopover: true,
      },
      {
        location: "465 E Illinois St, Chicago, IL 60611",
        stopover: true,
      },
    ],
    waypointTooltips: [
      "4th Date: Uniqlo, so, small or medium...?",
      "4th Date: Carson's Ribs Prime Steaks, how does this place have 4.5 stars...",
    ],
  },
  {
    origin: "2162 S Archer Ave, Chicago, IL 60616",
    destination: "V958+WH Chicago, Illinois",
    originTooltip: "5th Date: Chubby Cattle, my FAV resturant",
    destinationTooltip:
      "5th Date: Chinatown Park, thanks for ditching work to hang out w me!!",
  },
  {
    origin: "525 S State Street",
    destination: "525 S State Street",
    originTooltip: "6th Date: Meetup",
    destinationTooltip: "6th Date: Drop Off",
    waypoints: [
      {
        location: "1011 S Delano Ct, Chicago, IL 60605",
        stopover: true,
      },
      {
        location: "59 W Hubbard St #2, Chicago, IL 60654",
        stopover: true,
      },
    ],
    waypointTooltips: [
      "6th Date: AMC, wow Katherine FINALLY picked smth to do",
      "6th Date: Ramen-San, ur sneaky af",
    ],
  },
];

const DEFAULT_CENTER = { lat: 41.8827, lng: -87.6293 };
const DEFAULT_ZOOM = 15;

const COLORS = [
  "#1b998b",
  "#2d3047",
  "#e07a5f",
  "#FF9B71",
  "#E84855",
  "#E08E45",
  "#ad7a99",
  "#A64253",
  "#5ECDE0",
];

const MilesOfMemories = () => (
  <APIProvider apiKey={apiKey}>
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <Map
        style={{ width: "100%", height: "100%", position: "absolute" }}
        defaultCenter={DEFAULT_CENTER}
        defaultZoom={DEFAULT_ZOOM}
        gestureHandling="greedy"
        fullscreenControl={false}
      >
        <Directions trips={trips} />
      </Map>

      <div
        style={{
          position: "absolute",
          top: 35,
          left: 35,
          zIndex: 10,
          background: "#fff",
          borderRadius: 12,
          padding: "1rem",
          boxShadow: "0 2px 8px rgba(0,0,0,.15)",
          maxWidth: 300,
          pointerEvents: "auto",
          display: "flex", // ⬅️ put items on one line
          alignItems: "center", // ⬅️ vertical centering
          gap: "0", // ⬅️ space between them (optional)
        }}
      >
        <h3 style={{ margin: 0 }}>Miles of Memories</h3>
        <DotLottieReact
          style={{
            width: 40,
            height: 40,
            flexShrink: 0,
            alignSelf: "flex-start",
            marginTop: "-12px",
          }}
          src="bunnyanimation.lottie"
          loop
          autoplay
        />
      </div>
    </div>
  </APIProvider>
);

function Directions({ trips }) {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");

  const [directionsService, setDirectionsService] = useState();
  const [renderers, setRenderers] = useState([]);
  const [markerSets, setMarkerSets] = useState([]);

  useEffect(() => {
    if (!map || !window.google) return;
    map.setOptions({
      mapTypeControl: true,
      mapTypeControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM,
      },
    });
  }, [map]);

  useEffect(() => {
    if (document.getElementById("gm-custom-style")) return;
    const style = document.createElement("style");
    style.id = "gm-custom-style";
    style.innerHTML = `
      .gm-ui-hover-effect { display:none !important; }
    `;
    document.head.appendChild(style);
  }, []);

  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    map.setCenter(DEFAULT_CENTER);
    map.setZoom(DEFAULT_ZOOM);
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsService) return;

    renderers.forEach((r) => r.setMap(null));
    markerSets.flat().forEach((m) => m.setMap(null));
    setRenderers([]);
    setMarkerSets([]);

    Promise.all(
      trips.map(({ origin, destination, waypoints = [] }) =>
        directionsService.route({
          origin,
          destination,
          waypoints,
          travelMode: google.maps.TravelMode.WALKING,
          provideRouteAlternatives: false,
        })
      )
    ).then((responses) => {
      const newRenderers = [];
      const newMarkerSets = [];

      responses.forEach((resp, idx) => {
        const trip = trips[idx];

        const dr = new routesLibrary.DirectionsRenderer({
          map,
          directions: resp,
          draggable: false,
          preserveViewport: true,
          suppressMarkers: true,
          polylineOptions: {
            strokeColor: COLORS[idx % COLORS.length],
            strokeOpacity: 1.0,
            strokeWeight: 5,
          },
        });
        newRenderers.push(dr);

        const markerIcon = {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: COLORS[idx % COLORS.length],
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
          scale: 6,
        };

        const createMarkerWithTooltip = (position, tooltipText) => {
          const marker = new google.maps.Marker({
            position,
            map,
            icon: markerIcon,
            title: tooltipText,
          });
          const infoWin = new google.maps.InfoWindow({
            content: `<div>${tooltipText}</div>`,
            disableAutoPan: true,
          });
          marker.addListener("mouseover", () =>
            infoWin.open({ anchor: marker, map })
          );
          marker.addListener("mouseout", () => infoWin.close());
          marker.addListener("click", () =>
            infoWin.open({ anchor: marker, map })
          );
          return marker;
        };

        const routeLegs = resp.routes[0].legs;

        const originMarker = createMarkerWithTooltip(
          routeLegs[0].start_location,
          trip.originTooltip || routeLegs[0].start_address
        );

        const waypointMarkers = routeLegs
          .slice(0, -1)
          .map((lg, wpIdx) =>
            createMarkerWithTooltip(
              lg.end_location,
              (trip.waypointTooltips && trip.waypointTooltips[wpIdx]) ||
                lg.end_address
            )
          );

        const destMarker = createMarkerWithTooltip(
          routeLegs[routeLegs.length - 1].end_location,
          trip.destinationTooltip || routeLegs[routeLegs.length - 1].end_address
        );

        newMarkerSets.push([originMarker, ...waypointMarkers, destMarker]);
      });

      setRenderers(newRenderers);
      setMarkerSets(newMarkerSets);
    });

    return () => {
      renderers.forEach((r) => r.setMap(null));
      markerSets.flat().forEach((m) => m.setMap(null));
    };
  }, [directionsService, trips, map]);

  return null;
}

export default MilesOfMemories;
