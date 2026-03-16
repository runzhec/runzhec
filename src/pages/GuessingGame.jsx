//import "../assets/css/game.css";
import React, { useState } from "react";

//unfinished

const NumberDropdown = ({ selectedNumber, setSelectedNumber }) => {
  const handleChange = (event) => {
    setSelectedNumber(event.target.value);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <select
        id="number-dropdown"
        value={selectedNumber}
        onChange={handleChange}
        style={{
          color: selectedNumber ? "black" : "#6c757d", // Default gray if nothing is selected
          backgroundColor: "white",
          border: selectedNumber ? "2px solid white" : "1px solid #ccc",
          borderRadius: "8px",
          padding: "5px 10px",
          outline: "none",
          fontSize: "1em",
          textAlign: "center", // Center text within the dropdown
          textAlignLast: "center", // Center selected option text
          appearance: "none", // Remove default browser arrow styles
          transition: "border-color 0.3s ease",
        }}
      >
        <option value="" disabled>
          # of Players
        </option>
        {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
          <option key={num} value={num}>
            {num}
          </option>
        ))}
      </select>
    </div>
  );
};

const StartButton = ({ setStartState }) => {
  const handleClick = () => {
    setStartState(true);
  };

  return (
    <div className="p-4">
      <button onClick={handleClick} className="mt-s">
        Start
      </button>
    </div>
  );
};

export default function GuessingGame() {
  const [selectedNumber, setSelectedNumber] = useState("");
  const [isStartState, setStartState] = useState(false);
  return (
    <div className="default-margin">
      <div className="default-title">
        <h1 className="text title-text">Guessing Game</h1>
        <h2 className="text sub-title-text mt-m"># of players:</h2>
        <NumberDropdown
          selectedNumber={selectedNumber}
          setSelectedNumber={setSelectedNumber}
        />
        <StartButton setStartState={setStartState} />
      </div>
    </div>
  );
}
