import React, { useEffect, useMemo, useRef, useState } from "react";

export default function ValentinePasscode({
  length = 6,
  expectedCode,
  onSuccess = () => {},
}) {
  const [digits, setDigits] = useState([]);

  // track wrong guesses + last wrong guess
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [lastWrongGuess, setLastWrongGuess] = useState("");

  // reliable shake replay
  const [shakeCount, setShakeCount] = useState(0);

  const rootRef = useRef(null);
  const code = useMemo(() => digits.join(""), [digits]);

  useEffect(() => {
    rootRef.current?.focus?.();
  }, []);

  const triggerShake = () => setShakeCount((c) => c + 1);
  const resetDigits = () => setDigits([]);

  // add special wrong guess messages here
  const specialGuessMessages = {
    "011626": "let's do quebec this time",
    "072625": "i can't make it THAT ez",
    676767: "brain rotted af",
    696969: "tn?",
    123456: "bffr",
    "040904": "self obsessed much?",
    "050925": "almost made it this one",
    "021426": "try again lil bro",
    "051803": "wow u remembered this time",
  };

  // hint has priority over special messages
  const titleText =
    wrongGuesses === 7
      ? "seems like ur having trouble(hint: couch)"
      : specialGuessMessages[String(lastWrongGuess)] || "Enter Passcode";

  // validate when we reach length
  useEffect(() => {
    if (digits.length !== length) return;

    const expected = expectedCode == null ? null : String(expectedCode);

    // If no expected code, treat as success
    if (expected === null) {
      onSuccess(code);
      return;
    }

    if (code === expected) {
      onSuccess("wordle");
      // reset attempts so hint clears (optional, but usually desired)
      setWrongGuesses(0);
      setLastWrongGuess("");
      resetDigits();
    } else {
      // delay before shake + reset
      const timer = window.setTimeout(() => {
        // store wrong attempt info
        setWrongGuesses((g) => g + 1);
        setLastWrongGuess(code);

        // shake every time (reliable)
        triggerShake();

        // clear input
        resetDigits();
      }, 100); // 0.5s

      return () => window.clearTimeout(timer);
    }
  }, [digits, length, expectedCode, code, onSuccess]);

  const add = (d) => {
    setDigits((p) => (p.length < length ? [...p, d] : p));
  };

  const del = () => setDigits((p) => p.slice(0, -1));

  const onKeyDown = (e) => {
    const k = e.key;
    if (k >= "0" && k <= "9") add(k);
    if (k === "Backspace") del();
  };

  const keyLayout = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
  ];

  const styles = {
    root: {
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      background: "#fd9ed0",
      fontFamily:
        'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial',
      outline: "none",
      padding: 24,
    },
    card: {
      width: "min(430px, 92vw)",
      borderRadius: 30,
      background: "rgba(255,255,255,0.18)",
      backdropFilter: "blur(16px)",
      border: "1px solid rgba(255,255,255,0.25)",
      boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
      padding: "28px 24px 24px",
      textAlign: "center",
      color: "white",
    },
    title: { fontSize: 20, fontWeight: 600, marginBottom: 18 },
    dots: {
      display: "flex",
      justifyContent: "center",
      gap: 16,
      marginBottom: 28,
    },
    dot: (filled) => ({
      width: 14,
      height: 14,
      aspectRatio: "1 / 1",
      borderRadius: "50%",
      background: filled ? "#ffffff" : "rgba(255,255,255,0.35)",
      display: "inline-block",
      transition: "all 0.2s ease",
    }),
    pad: {
      display: "grid",
      gridTemplateColumns: "repeat(3, auto)",
      columnGap: 14, // tighter columns
      rowGap: 14,
      justifyContent: "center",
      padding: "0 6px",
    },
    key: {
      width: 78,
      height: 78,
      aspectRatio: "1 / 1",
      borderRadius: "50%",
      background: "rgba(255,255,255,0.25)",
      border: "1px solid rgba(255,255,255,0.35)",
      color: "white",
      fontSize: 28,
      fontWeight: 500,
      cursor: "pointer",
      transition: "all 0.18s ease",
      backdropFilter: "blur(6px)",
      userSelect: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      justifySelf: "center",
      padding: 0,
      lineHeight: 1,
    },
    ghost: { visibility: "hidden" },
  };

  const pressHandlers = (onClick) => ({
    onClick,
    onMouseEnter: (e) => {
      e.currentTarget.style.background = "rgba(255,255,255,0.42)";
    },
    onMouseLeave: (e) => {
      e.currentTarget.style.background = styles.key.background;
      e.currentTarget.style.transform = "scale(1)";
    },
    onMouseDown: (e) => {
      e.currentTarget.style.transform = "scale(0.95)";
    },
    onMouseUp: (e) => {
      e.currentTarget.style.transform = "scale(1)";
    },
  });

  return (
    <div ref={rootRef} style={styles.root} onKeyDown={onKeyDown} tabIndex={0}>
      <style>{`
        @keyframes vshake {
          0% { transform: translateX(0); }
          15% { transform: translateX(-10px); }
          30% { transform: translateX(10px); }
          45% { transform: translateX(-8px); }
          60% { transform: translateX(8px); }
          75% { transform: translateX(-5px); }
          90% { transform: translateX(5px); }
          100% { transform: translateX(0); }
        }
        .valentine-shake {
          animation: vshake 420ms ease-in-out;
        }
      `}</style>

      {/* key={shakeCount} forces remount so shake replays on every fail */}
      <div
        key={shakeCount}
        style={styles.card}
        className={shakeCount > 0 ? "valentine-shake" : ""}
      >
        <div style={styles.title}>{titleText}</div>

        <div style={styles.dots}>
          {Array.from({ length }).map((_, i) => (
            <span key={i} style={styles.dot(i < digits.length)} />
          ))}
        </div>

        <div style={styles.pad}>
          {keyLayout.flat().map((n) => (
            <button
              key={n}
              type="button"
              style={styles.key}
              aria-label={`Digit ${n}`}
              {...pressHandlers(() => add(n))}
            >
              {n}
            </button>
          ))}

          <div style={styles.ghost} aria-hidden="true" />

          <button
            type="button"
            style={styles.key}
            aria-label="Digit 0"
            {...pressHandlers(() => add("0"))}
          >
            0
          </button>

          <button
            type="button"
            style={styles.key}
            aria-label="Delete"
            {...pressHandlers(del)}
          >
            ⌫
          </button>
        </div>
      </div>
    </div>
  );
}
