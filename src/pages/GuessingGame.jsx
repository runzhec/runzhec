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

function StringInput({ placeholder, onInputChange }) {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    if (onInputChange) {
      onInputChange(value); // Pass the input value to the parent component if a callback is provided
    }
  };

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
        style={{
          padding: "8px",
          fontSize: "16px",
          borderRadius: "12px",
          border: "1px solid #ccc",
          width: "30%",
          boxSizing: "border-box",
          textAlign: "center",
          outline: "none",
        }}
        onFocus={(e) => (e.target.placeholder = "")} // Clear placeholder on focus
        onBlur={(e) => (e.target.placeholder = placeholder)} // Restore placeholder on blur
      />
    </div>
  );
}

export default function GuessingGame() {
  const [selectedNumber, setSelectedNumber] = useState("");
  return (
    <div className="default-margin">
      <div className="default-title">
        <h1 className="text title-text">Guessing Game</h1>
        <h2 className="text sub-title-text">Settings:</h2>
        <StringInput placeholder={"Category"} />
        <NumberDropdown
          selectedNumber={selectedNumber}
          setSelectedNumber={setSelectedNumber}
        />
      </div>
    </div>
  );
}
