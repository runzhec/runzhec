import React, { useEffect, useState } from "react";
import "./StarCounterButton.css";

export default function StarCounterButton() {
  const [sessionCount, setSessionCount] = useState(0);
  const [monthlyStars, setMonthlyStars] = useState(0);
  const [totalStars, setTotalStars] = useState(0);
  const [loading, setLoading] = useState(false);

  const getCurrentMonthAndYear = () => {
    const now = new Date();

    return {
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    };
  };

  const loadStarCounts = async () => {
    try {
      const { month, year } = getCurrentMonthAndYear();

      const monthlyUrl = `https://runzhec.com/api/numStars?month=${month}&year=${year}`;
      const totalUrl = "https://runzhec.com/api/totalStars";

      const [monthlyResponse, totalResponse] = await Promise.all([
        fetch(monthlyUrl),
        fetch(totalUrl),
      ]);

      if (!monthlyResponse.ok) {
        throw new Error(
          `Monthly stars error. Status: ${monthlyResponse.status}`
        );
      }

      if (!totalResponse.ok) {
        throw new Error(`Total stars error. Status: ${totalResponse.status}`);
      }

      const monthlyData = await monthlyResponse.json();
      const totalData = await totalResponse.json();

      setMonthlyStars(monthlyData.count);
      setTotalStars(totalData.count);
    } catch (error) {
      console.error("Failed to load star counts:", error);
    }
  };

  const handleClick = async () => {
    setLoading(true);

    try {
      const response = await fetch("https://runzhec.com/api/postStars", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`Post star error. Status: ${response.status}`);
      }

      setSessionCount((prevCount) => prevCount + 1);

      await loadStarCounts();
    } catch (error) {
      console.error("Failed to post star:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStarCounts();
  }, []);

  return (
    <div className="star-counter-container">
      <button
        className="star-counter-button"
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? "Adding Star..." : "⭐ Add Star"}
      </button>

      <div className="star-counts">
        <p>Stars added this visit: {sessionCount}</p>
        <p>Stars this month: {monthlyStars}</p>
        <p>Total stars: {totalStars}</p>
      </div>
    </div>
  );
}
