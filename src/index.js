import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Journal from "./pages/Journal";
import CrimeMap from "./pages/CrimeMap";
import MilesOfMemories from "./pages/MilesOfMemories.tsx";
import GeoGuesser from "./pages/GeoGuesser";
import GuessingGame from "./pages/GuessingGame";
import Valentines from "./pages/Valentines";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<Landing />} />
        <Route path="/k&r" element={<MilesOfMemories />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/crime-map" element={<CrimeMap />} />
        <Route path="/uchicago-geoguesser" element={<GeoGuesser />} />
        <Route path="/guessing-game" element={<GuessingGame />} />
        <Route path="/valentines-katherine" element={<Valentines />} />
        {/*Make real error pg later*/}
        <Route path="*" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
