import React, { useMemo, useRef, useState } from "react";
import gardenMap from "../assets/images/gardenmap.jpg";
import lily from "../assets/images/lily.png";
import stoneSteps from "../assets/images/stone-steps.png";
import falls from "../assets/images/falls.png";
import twoBridges from "../assets/images/two-bridges.png";
import stoneBridge from "../assets/images/stone-bridge.png";
import newStonePath from "../assets/images/new-stone-path.png";
import island from "../assets/images/island.png";
import gate from "../assets/images/gate.png";
import entrance from "../assets/images/entrance.png";

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f3f4f6",
    padding: "20px 16px",
    boxSizing: "border-box",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    overflow: "hidden",
  },

  container: {
    width: "100%",
    maxWidth: "1400px",
    margin: "0 auto",
  },

  header: {
    textAlign: "center",
    marginBottom: "14px",
  },

  title: {
    margin: 0,
    fontSize: "28px",
    fontWeight: 700,
    color: "#111827",
  },

  subtitle: {
    marginTop: "6px",
    marginBottom: 0,
    fontSize: "14px",
    color: "#4b5563",
  },

  mapOuter: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  mapCard: {
    display: "inline-block",
    backgroundColor: "#ffffff",
    border: "1px solid #d1d5db",
    borderRadius: "18px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.12)",
    padding: "10px",
    maxWidth: "100%",
    maxHeight: "calc(100vh - 120px)",
    boxSizing: "border-box",
  },

  imageWrapper: {
    position: "relative",
    display: "inline-block",
    cursor: "crosshair",
    userSelect: "none",
  },

  mainImage: {
    display: "block",
    height: "calc(100vh - 170px)",
    maxWidth: "calc(100vw - 64px)",
    width: "auto",
    objectFit: "contain",
  },

  pointButton: {
    position: "absolute",
    transform: "translate(-50%, -50%)",
    border: "none",
    background: "transparent",
    padding: 0,
    cursor: "pointer",
  },

  pointOuter: {
    width: "28px",
    height: "28px",
    borderRadius: "999px",
    backgroundColor: "rgba(37, 99, 235, 0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 0 4px rgba(37, 99, 235, 0.15)",
  },

  pointInner: {
    width: "14px",
    height: "14px",
    borderRadius: "999px",
    backgroundColor: "#2563eb",
    border: "2px solid white",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.35)",
  },

  tooltip: {
    position: "absolute",
    left: "50%",
    top: "34px",
    transform: "translateX(-50%)",
    whiteSpace: "nowrap",
    backgroundColor: "#111827",
    color: "white",
    fontSize: "12px",
    padding: "5px 8px",
    borderRadius: "8px",
    pointerEvents: "none",
    opacity: 0,
  },

  coordBox: {
    position: "absolute",
    left: "12px",
    top: "12px",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    padding: "10px 12px",
    fontSize: "12px",
    fontWeight: 600,
    textAlign: "left",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
  },

  coordHint: {
    marginTop: "4px",
    fontSize: "10px",
    color: "#d1d5db",
  },

  modalBackdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
    boxSizing: "border-box",
  },

  modal: {
    width: "100%",
    maxWidth: "540px",
    backgroundColor: "white",
    borderRadius: "18px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
    overflow: "hidden",
  },

  modalHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    borderBottom: "1px solid #e5e7eb",
  },

  modalTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: 700,
    color: "#111827",
  },

  closeButton: {
    border: "none",
    backgroundColor: "transparent",
    color: "#6b7280",
    fontSize: "30px",
    lineHeight: 1,
    cursor: "pointer",
    padding: "2px 8px",
  },

  modalBody: {
    padding: "20px",
  },

  detailImage: {
    display: "block",
    width: "100%",
    maxHeight: "320px",
    objectFit: "contain",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    marginBottom: "14px",
  },

  description: {
    margin: 0,
    fontSize: "15px",
    lineHeight: 1.6,
    color: "#374151",
  },
};

function ClickableImageMap({
  mainImage,
  mainImageAlt = "Interactive image",
  points = [],
}) {
  const imageWrapRef = useRef(null);
  const [hoverCoords, setHoverCoords] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [hoveredPointId, setHoveredPointId] = useState(null);

  function getPercentCoords(event) {
    if (!imageWrapRef.current) return null;

    const rect = imageWrapRef.current.getBoundingClientRect();

    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    return {
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    };
  }

  function handleMouseMove(event) {
    const coords = getPercentCoords(event);

    if (coords) {
      setHoverCoords(coords);
    }
  }

  function handleMouseLeave() {
    setHoverCoords(null);
  }

  function copyCurrentCoords() {
    if (!hoverCoords) return;

    const text = `x: ${hoverCoords.x.toFixed(2)}, y: ${hoverCoords.y.toFixed(
      2
    )}`;

    navigator.clipboard?.writeText(text);
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Hillwood Japanese Style Garden Sketch</h1>

        <p style={styles.subtitle}>Click points on the image to learn more.</p>
      </div>

      <div style={styles.mapOuter}>
        <div style={styles.mapCard}>
          <div
            ref={imageWrapRef}
            style={styles.imageWrapper}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={mainImage}
              alt={mainImageAlt}
              style={styles.mainImage}
              draggable="false"
            />

            {points.map((point) => (
              <button
                key={point.id}
                type="button"
                onClick={() => setSelectedPoint(point)}
                onMouseEnter={() => setHoveredPointId(point.id)}
                onMouseLeave={() => setHoveredPointId(null)}
                style={{
                  ...styles.pointButton,
                  left: `${point.x}%`,
                  top: `${point.y}%`,
                }}
                aria-label={`Open information for ${point.title}`}
              >
                <span style={styles.pointOuter}>
                  <span style={styles.pointInner} />
                </span>

                <span
                  style={{
                    ...styles.tooltip,
                    opacity: hoveredPointId === point.id ? 1 : 0,
                  }}
                >
                  {point.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedPoint && (
        <InfoModal
          point={selectedPoint}
          onClose={() => setSelectedPoint(null)}
        />
      )}
    </div>
  );
}

function InfoModal({ point, onClose }) {
  return (
    <div
      style={styles.modalBackdrop}
      onMouseDown={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        style={styles.modal}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>{point.title}</h2>

          <button
            type="button"
            onClick={onClose}
            style={styles.closeButton}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div style={styles.modalBody}>
          {point.detailImage && (
            <img
              src={point.detailImage}
              alt={point.title}
              style={styles.detailImage}
            />
          )}

          <p style={styles.description}>{point.description}</p>
        </div>
      </div>
    </div>
  );
}

export default function Garden() {
  const samplePoints = useMemo(
    () => [
      {
        id: "lily",
        x: 36.58,
        y: 30.93,
        title: "Pond, Bridge, and Water Lilies",
        description:
          "The lower pond adds to the garden's miniature moutain landscape. The water flows down from the rocky waterfall and settles into this calm pool. The arched bridge, stones, and lilies fit traditional Japanese garden features, which helps to encourage slow movement and reflection",
        detailImage: lily,
      },
      {
        id: "stoneSteps",
        x: 63,
        y: 59,
        title: "Water Spouts and Stepping Stones",
        description:
          'This part of the garden showcases how the Hillwood Japanese style garden blends tradition with adaptation. There are many traditional Japanese garden elements including the stepping stones, lantern, guard dogs, rocks, and pond. The notes explain that this space represents a mountainside stream which flows through waterfalls and bonds. The water spouts in this area is an example of a deviation from traditional Japanese gardens, which typically uses more natural water sources. However, this aligns with the garden\'s vision of being more "active".',
        detailImage: stoneSteps,
      },
      {
        id: "falls",
        x: 63,
        y: 51,
        title: "Waterfall",
        description:
          "This waterfall is central to the garden's design, it is a showcasing a mintature mountain landscape. The rushing water, combinded with the large booulders and layered rocks helps to create a feeling of a stream flowing down the mountain. Furthermore, this illustrates Hillwood's hybrid approach where the stream contains multiple dramatic vertical drops and jetting rocks, making the garden feel more active and theatrical.",
        detailImage: falls,
      },
      {
        id: "two-bridges",
        x: 19,
        y: 65,
        title: "Twin Bridges",
        description:
          "The arched bridges are a signature element of Japanese gardens, which helps to create a sense of passage, guiding visitors across the water to the small island. The arched bridge, helps to encourage people to slow down and exprience the beauty of the garden from multiple different angles. The curved nature of the bridge also helps the bridge to become part of the scenery and helping to make the island feel more like a quiet destination within the garden.",
        detailImage: twoBridges,
      },
      {
        id: "new-stone-path",
        x: 44.4,
        y: 39.5,
        title: "Stepping Stone Path",
        description:
          "This stepping stone path, instead of just being rocks of visitors to look at, allows for visitos to be able to physically move through the garden. Through this stone path, visitors are able to see the bond, bridge, and most notably the waterfall from a different view point. This feature is also important because it was not part of the original sketch. It appears to have been added later as Myaida developed the garden, making the lower pond more interactive and immersive.",
        detailImage: newStonePath,
      },
      {
        id: "stoneBridge",
        x: 55,
        y: 48,
        title: "Stone Bridge",
        description:
          "The stone bridge is what helps turn the garden from a simple view into a path you actually walk. Its apperance of being rough and being tucked into the nearby boulders, helps make the whole thing look like it belongs to the earth rather than being a separate piece of architecture. By linking the water, the rocks, and the greenery, the bridge makes you feel like you're trekking through a tiny mountain range. ",
        detailImage: stoneBridge,
      },
      {
        id: "island",
        x: 30,
        y: 62.5,
        title: "Island",
        description:
          "The islands is also makes the pond feel like a small world within the overall garden. Instead of just leaving the pool as empty/open, the island helps give the scene a center and creates a destination for visitors. These types of islands are a common theme in Japanese gardens as the islands often help to suggest seperation and reflection.",
        detailImage: island,
      },
      {
        id: "gate",
        x: 26.8,
        y: 48.8,
        title: "Wooden Gate",
        description:
          "The wodden gate in this case, is used more as a visual destination than a normal entrance. In traditional Japanese gardens, these gates are often used to mark a boundary between spaces and are used to help create a sense of transition. However, in this case, the gate sits at the end of the garden and is used as a destination rather than a transition piece, refelcting the western influences of the garden. Myaida positioned the gate as a focal point, where visitors could pause and look back over the garden instead of simply passing through.",
        detailImage: gate,
      },
      {
        id: "entrance",
        x: 77.4,
        y: 82,
        title: "Entrance",
        description:
          "The entrance figure helps mark the start of the Japanese style garden. It is placed near the path to signal to visitors that they are leaving the Hillwood estate and enter the smaller Japanese garden. This fits Japanese garden design as entrances are often used to create a sense of transition. However, this figure is notab ly western themed which may be acting as a tranistion between the garden and the rest of the American estate.",
        detailImage: entrance,
      },
    ],
    []
  );

  return (
    <main style={styles.page}>
      <ClickableImageMap
        mainImage={gardenMap}
        mainImageAlt="Main map"
        points={samplePoints}
      />
    </main>
  );
}
