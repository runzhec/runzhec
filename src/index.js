import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Journal from "./pages/Journal";
import CrimeMap from "./pages/CrimeMap";
import GuessingGame from "./pages/GuessingGame";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<Landing />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/crime-map" element={<CrimeMap />} />
        {/* <Route path="/guessing-game" element={<GuessingGame />} /> */}
        {/*Make real error pg later*/}
        <Route path="*" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
