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
          "This lower pond helps complete the garden’s miniature mountain landscape: water flows down from the rocky cascade and settles here into a calm pool. The arched bridge, stones, and water lilies fit traditional Japanese garden ideas by encouraging slow movement, reflection, and carefully framed views across water.",
        detailImage: lily,
      },
      {
        id: "stoneSteps",
        x: 63,
        y: 59,
        title: "Water Spouts and Stepping Stones",
        description:
          'This area shows how Hillwood’s Japanese style garden blends tradition with adaptation. The stepping stones, lantern, guard dogs, rocks, and pond follow Japanese garden ideas by creating a slow, reflective path through a miniature landscape. The garden notes explain that the whole space represents a mountainside stream flowing through waterfalls and ponds before resting in a lake at the bottom of the hillside. The water spouts in this area is an example of a deviation from traditional Japanese gardens, which typically uses more natural water sources. However, this aligns with the garden\'s vision of being more "active".',
        detailImage: stoneSteps,
      },
      {
        id: "falls",
        x: 63,
        y: 51,
        title: "Waterfall",
        description:
          "This waterfall is central to the garden’s design because it turns Hillwood’s steep hillside into a miniature mountain landscape. The rushing water, large boulders, and layered rocks create the feeling of a mountain stream flowing downward into calmer ponds below. This fits traditional Japanese garden design, where rocks and water often represent natural landscapes in reduced form. Hillwood’s notes describe the garden as a “mountainside landscape in miniature,” with a stream moving through waterfalls and ponds before reaching a lake at the base of the hill. At the same time, the feature also shows Hillwood’s hybrid approach. Myaida transformed a narrow stream into a more dramatic cascade with vertical drops, making the hillside feel theatrical and visually impressive for an American estate garden.",
        detailImage: falls,
      },
      {
        id: "two-bridges",
        x: 19,
        y: 65,
        title: "Twin Bridges",
        description:
          "These bridges create a sense of passage, guiding visitors across the water and onto the small island. In Japanese gardens, bridges often mark a transition from one space or viewpoint to another, encouraging people to slow down and experience the pond, rocks, plants, and lanterns from different angles. The curved wooden form also adds visual rhythm to the pond. Instead of being purely functional, the bridges become part of the scenery, framing the water and helping the island feel like a quiet destination within the garden. They support the garden’s larger theme of a miniature natural landscape, where visitors move through a peaceful world of water, stone, plants, and carefully arranged views.",
        detailImage: twoBridges,
      },
      {
        id: "new-stone-path",
        x: 44.4,
        y: 39.5,
        title: "Stepping Stone Path",
        description:
          "This stepping stone path changes the pond from something visitors simply look at into something they physically move through. The stones create a slow, careful crossing over the water, which fits Japanese garden design because it encourages attention to balance, movement, and changing views. As visitors cross, they see the pond, bridges, lanterns, rocks, and plants from the middle of the landscape rather than only from the edge. This feature is also important because it was not part of the original sketch. It appears to have been added later as Myaida developed the garden, making the lower pond more interactive and immersive.",
        detailImage: newStonePath,
      },
      {
        id: "stoneBridge",
        x: 55,
        y: 48,
        title: "Stone Bridge",
        description:
          "This stone bridge helps turn the garden into a physical journey rather than just a view. Its rough, flat stones blend into the surrounding boulders, making the bridge feel like part of the landscape instead of a separate architectural object. This conforms to Japanese garden design because it uses natural materials, frames views of water and plants, and encourages slow, careful movement through the space. The bridge adds to the garden’s theme by connecting water, stone, plants, and movement. It makes the visitor feel as if they are crossing through a miniature mountain landscape, reinforcing the garden’s overall sense of escape, calm, and controlled natural beauty.",
        detailImage: stoneBridge,
      },
      {
        id: "island",
        x: 30,
        y: 62.5,
        title: "Island",
        description:
          "The island makes the pond feel like a small world within the garden. Instead of leaving the water as an open pool, the island gives the scene a center and creates a destination that visitors can reach by bridge or stepping stones. This fits Japanese garden design because islands often suggest separation, reflection, and a miniature natural landscape surrounded by water.",
        detailImage: island,
      },
      {
        id: "gate",
        x: 26.8,
        y: 48.8,
        title: "Wooden Gate",
        description:
          "The wooden gate works more as a visual destination than a normal entrance. In traditional Japanese gardens, gates often mark a boundary between spaces and create a sense of transition. Here, the gate sits at the end of the garden, partially hidden by trees, so it draws the eye through the landscape and gives the pond area a quiet stopping point. At Hillwood, the gate also shows how the garden adapts Japanese design rather than copying it exactly. Myaida positioned the gate as a focal point, where visitors could pause and look back over the garden instead of simply passing through it.",
        detailImage: gate,
      },
      {
        id: "entrance",
        x: 77.4,
        y: 82,
        title: "Entrance",
        description:
          "This entrance figure helps mark the beginning of the Japanese style garden as a separate, more contemplative space. Placed near the path, it signals that visitors are leaving the larger Hillwood estate and entering a smaller world of water, stone, plants, and carefully framed views. This fits Japanese garden design because entrances often create a sense of transition before the visitor moves deeper into the landscape. However, this figure that marks the entrance of the garden is western themed which may be acting as a tranistion between the garden and the rest of the American estate.",
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
