import React, { useEffect, useRef, useState } from "react";
import "./NightSky.css";

const getStars = async () => {
  const now = new Date();

  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const url = `https://runzhec.com/api/numStars?month=${month}&year=${year}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.count;
  } catch (error) {
    console.log(error.message);
    return 0;
  }
};

const getTotalStars = async () => {
  const url = `https://runzhec.com/api/totalStars`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.count;
  } catch (error) {
    console.log(error.message);
    return 0;
  }
};

function createStars(count, skyRect, moonRect) {
  const stars = [];

  const moonCenterX = moonRect.left - skyRect.left + moonRect.width / 2;
  const moonCenterY = moonRect.top - skyRect.top + moonRect.height / 2;
  const moonRadius = moonRect.width / 2;

  const buffer = 40;
  let attempts = 0;
  const maxAttempts = count * 50;

  while (stars.length < count && attempts < maxAttempts) {
    attempts++;

    const xPercent = Math.random() * 100;
    const yPercent = Math.random() * 100;

    const xPixel = (xPercent / 100) * skyRect.width;
    const yPixel = (yPercent / 100) * skyRect.height;

    const distanceFromMoon = Math.sqrt(
      Math.pow(xPixel - moonCenterX, 2) + Math.pow(yPixel - moonCenterY, 2)
    );

    if (distanceFromMoon > moonRadius + buffer) {
      stars.push({
        id: stars.length,
        x: xPercent,
        y: yPercent,
        size: 4,
        opacity: 0.85,
        blur: 0,
        twinkleDelay: 0,
        twinkleDuration: 3,
      });
    }
  }

  return stars;
}

export default function NightSky({ isTotal = false }) {
  const skyRef = useRef(null);
  const moonRef = useRef(null);

  const [stars, setStars] = useState([]);
  const [starCount, setStarCount] = useState(0);

  useEffect(() => {
    const loadStars = async () => {
      let count = await getStars();

      if (isTotal) {
        count = await getTotalStars();
      }

      setStarCount(count);
    };

    loadStars();
  }, [isTotal]);

  useEffect(() => {
    function generateStars() {
      if (!skyRef.current || !moonRef.current) return;

      const skyRect = skyRef.current.getBoundingClientRect();
      const moonRect = moonRef.current.getBoundingClientRect();

      setStars(createStars(starCount, skyRect, moonRect));
    }

    generateStars();

    window.addEventListener("resize", generateStars);

    return () => {
      window.removeEventListener("resize", generateStars);
    };
  }, [starCount]);

  return (
    <section ref={skyRef} className="night-sky">
      <div className="sky-gradient" />

      <div ref={moonRef} className="moon" />

      <div className="spaceship-wrapper">
        <div className="spaceship-scene">
          <div className="banner">
            <span>katherineeeee let's go to nyc tog!!</span>
          </div>

          <div className="spaceship">
            <div className="ship-body">
              <div className="ship-window" />
            </div>
            <div className="ship-fin ship-fin-top" />
            <div className="ship-fin ship-fin-bottom" />
            <div className="ship-flame" />
          </div>
        </div>
      </div>

      <div className="stars-layer">
        {stars.map((star) => (
          <span
            key={star.id}
            className="star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              filter: `blur(${star.blur}px)`,
              animationDelay: `${star.twinkleDelay}s`,
              animationDuration: `${star.twinkleDuration}s`,
            }}
          />
        ))}
      </div>

      <div className="bottom-fade" />
    </section>
  );
}
