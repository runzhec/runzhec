import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * HeartClicker
 * A single, exportable React component (no external libraries) that mimics a simple Cookie Clicker.
 * - Click the heart to increment balance by 1
 * - Heart shakes briefly on each click
 * - Unlock button becomes clickable once balance >= 214
 */
export default function HeartClicker({ onSuccess }) {
  const TARGET = 214;
  const [balance, setBalance] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const shakeTimerRef = useRef(null);

  const canUnlock = balance >= TARGET && !isUnlocked;

  const progressPct = useMemo(() => {
    const pct = (balance / TARGET) * 100;
    return Math.max(0, Math.min(100, pct));
  }, [balance]);

  useEffect(() => {
    return () => {
      if (shakeTimerRef.current) window.clearTimeout(shakeTimerRef.current);
    };
  }, []);

  const triggerShake = () => {
    setIsShaking(true);
    if (shakeTimerRef.current) window.clearTimeout(shakeTimerRef.current);
    shakeTimerRef.current = window.setTimeout(() => setIsShaking(false), 130);
  };

  const onHeartClick = () => {
    setBalance((b) => b + 1);
    triggerShake();
  };

  const onUnlock = () => {
    if (!canUnlock) return;
    setIsUnlocked(true);
    onSuccess("mine");
  };

  const unlockedText = isUnlocked
    ? "Unlocked"
    : canUnlock
    ? "Unlock"
    : `Unlock at ${TARGET}`;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.headerRow}>
          <div style={styles.balanceWrap}>
            <div style={styles.balanceLabel}>Hearts</div>
            <div style={styles.balanceValue}>{balance}</div>
          </div>

          <button
            type="button"
            onClick={onUnlock}
            disabled={!canUnlock}
            aria-disabled={!canUnlock}
            style={{
              ...styles.unlockBtn,
              ...(canUnlock ? styles.unlockBtnReady : styles.unlockBtnDisabled),
              ...(isUnlocked ? styles.unlockBtnUnlocked : null),
            }}
          >
            {unlockedText}
          </button>
        </div>

        <div style={styles.progressWrap}>
          <div style={styles.progressTrack} aria-label="Progress to unlock">
            <div style={{ ...styles.progressFill, width: `${progressPct}%` }} />
          </div>
          <div style={styles.progressText}>
            {Math.min(balance, TARGET)}/{TARGET}
          </div>
        </div>

        <div style={styles.centerArea}>
          <button
            type="button"
            onClick={onHeartClick}
            style={styles.heartButton}
            aria-label="Click heart"
          >
            <div
              style={{
                ...styles.heart,
                ...(isShaking ? styles.heartShake : null),
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width="200"
                height="200"
                role="img"
                aria-hidden="true"
                style={styles.heartSvg}
              >
                <path
                  d="M12 21s-7.2-4.35-9.6-8.58C.7 9.02 2.02 5.86 5.12 4.92c1.66-.5 3.46.04 4.7 1.36L12 8.6l2.18-2.32c1.24-1.32 3.04-1.86 4.7-1.36 3.1.94 4.42 4.1 2.72 7.5C19.2 16.65 12 21 12 21z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </button>

          <div style={styles.hint}>Almost there!!!</div>
        </div>
      </div>

      <style>{css}</style>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    background: "#fd9ed0",
    fontFamily:
      "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Apple Color Emoji, Segoe UI Emoji",
  },
  card: {
    width: "min(520px, 92vw)",
    borderRadius: 20,
    padding: 18,
    background: "rgba(255,255,255,0.92)",
    border: "1px solid rgba(0,0,0,0.08)",
    boxShadow: "0 18px 45px rgba(0,0,0,0.10)",
    backdropFilter: "blur(6px)",
  },
  headerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  balanceWrap: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  balanceLabel: {
    fontSize: 12,
    color: "rgba(0,0,0,0.55)",
    letterSpacing: 0.2,
  },
  balanceValue: {
    fontSize: 28,
    fontWeight: 800,
    color: "rgba(0,0,0,0.9)",
    lineHeight: 1.1,
  },
  unlockBtn: {
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.12)",
    padding: "10px 12px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    userSelect: "none",
    transition:
      "transform 120ms ease, opacity 120ms ease, box-shadow 120ms ease",
    background: "white",
  },
  unlockBtnDisabled: {
    opacity: 0.55,
    cursor: "not-allowed",
    boxShadow: "none",
  },
  unlockBtnReady: {
    opacity: 1,
    boxShadow: "0 10px 22px rgba(255, 64, 129, 0.20)",
  },
  unlockBtnUnlocked: {
    opacity: 1,
    cursor: "default",
  },
  progressWrap: {
    marginTop: 12,
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  progressTrack: {
    flex: 1,
    height: 10,
    borderRadius: 999,
    background: "rgba(0,0,0,0.08)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    background: "rgba(255, 64, 129, 0.85)",
    transition: "width 160ms ease",
  },
  progressText: {
    width: 86,
    textAlign: "right",
    fontSize: 12,
    color: "rgba(0,0,0,0.6)",
    fontVariantNumeric: "tabular-nums",
  },
  centerArea: {
    marginTop: 8,
    padding: "22px 12px 8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  heartButton: {
    border: "none",
    background: "transparent",
    padding: 0,
    cursor: "pointer",
    outline: "none",
    userSelect: "none",
  },
  heart: {
    width: 220,
    height: 220,
    display: "grid",
    placeItems: "center",
    borderRadius: 999,
    color: "rgba(255, 64, 129, 0.95)",
    filter: "drop-shadow(0 14px 22px rgba(255, 64, 129, 0.24))",
    transform: "translateZ(0)",
  },
  heartShake: {
    animation: "hc_shake 130ms ease-in-out",
  },
  heartSvg: {
    transform: "translateY(2px)",
  },
  hint: {
    fontSize: 13,
    color: "rgba(0,0,0,0.55)",
  },
};

const css = `
@keyframes hc_shake {
  0% { transform: translate(0px, 0px) rotate(0deg) scale(1); }
  20% { transform: translate(-2px, 1px) rotate(-2deg) scale(0.99); }
  40% { transform: translate(2px, -1px) rotate(2deg) scale(1.01); }
  60% { transform: translate(-1px, -1px) rotate(-1deg) scale(0.995); }
  80% { transform: translate(1px, 1px) rotate(1deg) scale(1.005); }
  100% { transform: translate(0px, 0px) rotate(0deg) scale(1); }
}

button:disabled {
  pointer-events: none;
}
`;
