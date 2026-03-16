import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * Minimal single-file Wordle component
 * - No how-to-play, stats, settings
 * - No valid word list (accepts any A–Z guess of correct length)
 * - Grid + keyboard + physical keyboard
 * - Duplicate-safe scoring
 * - Shake on invalid length
 * - Flip on submit
 * - Tile + keyboard colors reveal at mid-flip (Wordle-style)
 *
 * Flip made "more normal":
 * - Adds a subtle scale + uses perspective on the grid (not per-row)
 * - Uses translateZ to prevent flat/odd rendering
 * - Keeps tiles from looking like they warp
 */
export default function Wordle({
  target,
  solutions,
  wordLength = 5,
  maxGuesses = 6,
  title = "WORDLE :0",
  onSuccess,
}) {
  const solutionIndex = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const solution = useMemo(() => {
    let s = "";
    if (Array.isArray(solutions) && solutions.length) {
      s = String(solutions[hashToIndex(solutionIndex, solutions.length)] || "");
    } else if (target != null) {
      s = String(target);
    } else {
      s = "REACT";
    }
    s = s
      .toUpperCase()
      .replace(/[^A-Z]/g, "")
      .slice(0, wordLength);
    if (s.length !== wordLength) s = (s + "AAAAA").slice(0, wordLength);
    return s;
  }, [solutions, target, wordLength, solutionIndex]);

  const [guesses, setGuesses] = useState([]);
  const [current, setCurrent] = useState("");
  const [shakeRow, setShakeRow] = useState(false);
  const [flipRow, setFlipRow] = useState(-1);
  const [toast, setToast] = useState("");

  // revealed[r][c] = "" until revealed, then "correct"|"present"|"absent"
  const [revealed, setRevealed] = useState([]);

  const rootRef = useRef(null);
  const toastTimer = useRef(null);
  const flipTimersRef = useRef([]);

  const isWon = guesses.includes(solution);
  const isLost = !isWon && guesses.length >= maxGuesses;
  useEffect(() => {
    if (isWon) {
      showToast("YAYYYYY YOU DID IT!!", 9999999);
      onSuccess("clicker");
    }
  }, [isWon]);
  useEffect(() => {
    if (isLost) {
      jiggle();
      showToast(
        "I did not expect you to fail... just restart this page",
        9999999
      );
    }
  }, [isLost]);
  const canPlay = !isWon && !isLost;

  // timings (match CSS)
  const delayPerTile = 250;
  const flipDuration = 520; // shorter + snappier looks more "normal"
  const revealAt = Math.floor(flipDuration / 2);
  const totalFlipTime = (wordLength - 1) * delayPerTile + flipDuration + 100;

  useEffect(() => {
    rootRef.current?.focus?.();
    return () => {
      for (const t of flipTimersRef.current) clearTimeout(t);
      flipTimersRef.current = [];
    };
  }, []);

  const showToast = (t, ms = 1100) => {
    setToast(t);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), ms);
  };

  const jiggle = () => {
    setShakeRow(true);
    setTimeout(() => setShakeRow(false), 420);
  };

  const add = (ch) => {
    if (!canPlay) return;
    setCurrent((p) => (p.length < wordLength ? p + ch : p));
  };

  const del = () => {
    if (!canPlay) return;
    setCurrent((p) => p.slice(0, -1));
  };

  const clearFlipTimers = () => {
    for (const t of flipTimersRef.current) clearTimeout(t);
    flipTimersRef.current = [];
  };

  const enter = () => {
    if (!canPlay) {
      return;
    }
    const g = current.toUpperCase();
    if (g.length !== wordLength) {
      jiggle();
      showToast("Not enough letters");
      return;
    }

    const rowIndex = guesses.length;
    const scored = scoreGuess(g, solution);

    setGuesses((p) => [...p, g]);
    setCurrent("");

    setRevealed((prev) => {
      const next = [...prev];
      next[rowIndex] = Array(wordLength).fill("");
      return next;
    });

    setFlipRow(rowIndex);

    clearFlipTimers();

    for (let i = 0; i < wordLength; i++) {
      const t = window.setTimeout(() => {
        setRevealed((prev) => {
          const next = prev.map((row) => (Array.isArray(row) ? [...row] : row));
          if (!Array.isArray(next[rowIndex]))
            next[rowIndex] = Array(wordLength).fill("");
          next[rowIndex][i] = scored[i];
          return next;
        });
      }, i * delayPerTile + revealAt);
      flipTimersRef.current.push(t);
    }

    const tEnd = window.setTimeout(() => setFlipRow(-1), totalFlipTime);
    flipTimersRef.current.push(tEnd);
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Enter") return enter();
      if (e.key === "Backspace") return del();
      const up = e.key.toUpperCase();
      if (/^[A-Z]$/.test(up)) add(up);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canPlay, current, guesses.length, solution]);

  // keyboard coloring based ONLY on revealed
  const keyboardStatus = useMemo(() => {
    const rank = { absent: 0, present: 1, correct: 2 };
    const best = {};

    for (let r = 0; r < guesses.length; r++) {
      const g = guesses[r] || "";
      const row = revealed[r] || [];
      for (let i = 0; i < wordLength; i++) {
        const ch = g[i];
        const st = row[i];
        if (!ch || !st) continue;
        const v = rank[st] ?? 0;
        best[ch] = Math.max(best[ch] ?? -1, v);
      }
    }

    const inv = { 0: "absent", 1: "present", 2: "correct" };
    const out = {};
    Object.keys(best).forEach((k) => (out[k] = inv[best[k]]));
    return out;
  }, [guesses, revealed, wordLength]);

  const rows = useMemo(() => {
    const out = [];
    for (let r = 0; r < maxGuesses; r++) {
      const committed = r < guesses.length;
      const guess = committed
        ? guesses[r]
        : r === guesses.length
        ? current.toUpperCase()
        : "";

      const status = committed
        ? revealed[r] || Array(wordLength).fill("")
        : Array(wordLength).fill("");

      const shake = r === guesses.length && shakeRow;
      const flip = r === flipRow;

      out.push(
        <div
          key={r}
          className={`wm-row ${shake ? "wm-shake" : ""} ${
            flip ? "wm-flip" : ""
          }`}
        >
          {Array.from({ length: wordLength }).map((_, c) => {
            const ch = guess[c] || "";
            const st = status[c] || "";
            const filled = !!ch && !st;
            return (
              <div
                key={c}
                className={`wm-cell ${st ? `wm-${st}` : ""} ${
                  filled ? "wm-filled" : ""
                }`}
              >
                {ch}
              </div>
            );
          })}
        </div>
      );
    }
    return out;
  }, [maxGuesses, wordLength, guesses, current, shakeRow, flipRow, revealed]);

  const kb = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
  ];

  const reset = () => {
    clearFlipTimers();
    setGuesses([]);
    setRevealed([]);
    setCurrent("");
    setFlipRow(-1);
    setShakeRow(false);
    showToast("");
  };

  const css = `
    .wm-wrap {
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 24px;
      background: #0b1220;
      color: #e5e7eb;
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
      outline: none;
    }

    .wm-card {
      width: min(520px, 92vw);
      border-radius: 18px;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.12);
      box-shadow: 0 22px 70px rgba(0,0,0,0.35);
      padding: 16px 14px 14px;
    }

    .wm-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 10px;
    }

    .wm-title {
      font-weight: 900;
      letter-spacing: 1px;
      font-size: 14px;
      user-select: none;
    }

    .wm-reset {
      height: 36px;
      padding: 0 12px;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.12);
      background: rgba(255,255,255,0.08);
      color: #e5e7eb;
      cursor: pointer;
      font-weight: 800;
      font-size: 13px;
    }
    .wm-reset:hover { background: rgba(255,255,255,0.12); }
    .wm-reset:active { transform: scale(0.98); }

    .wm-grid {
      display: grid;
      gap: 8px;
      justify-content: center;
      padding: 10px 0 12px;
      perspective: 1000px; /* more natural: perspective on container */
    }

    .wm-row {
      display: grid;
      grid-template-columns: repeat(${wordLength}, 1fr);
      gap: 8px;
    }

    .wm-cell {
      width: 54px;
      height: 54px;
      display: grid;
      place-items: center;
      border-radius: 10px;
      border: 2px solid rgba(255,255,255,0.14);
      background: rgba(255,255,255,0.03);
      font-size: 24px;
      font-weight: 900;
      text-transform: uppercase;
      user-select: none;
      transition: transform 120ms ease, border-color 120ms ease, background 120ms ease;

      transform-style: preserve-3d;
      backface-visibility: hidden;
      will-change: transform;
    }

    .wm-filled {
      border-color: rgba(255,255,255,0.26);
      transform: scale(1.02);
    }

    .wm-correct { background: rgba(34,197,94,0.40); border-color: rgba(34,197,94,0.75); }
    .wm-present { background: rgba(234,179,8,0.36); border-color: rgba(234,179,8,0.70); }
    .wm-absent  { background: rgba(148,163,184,0.20); border-color: rgba(148,163,184,0.30); }

    .wm-kb { display: grid; gap: 8px; padding-top: 10px; }
    .wm-kbRow { display: flex; justify-content: center; gap: 6px; }
    .wm-key {
      height: 46px;
      min-width: 36px;
      padding: 0 10px;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.12);
      background: rgba(255,255,255,0.08);
      color: #e5e7eb;
      cursor: pointer;
      font-weight: 900;
      font-size: 13px;
      user-select: none;
      transition: transform 80ms ease, background 120ms ease, border-color 120ms ease;
    }
    .wm-key:hover { background: rgba(255,255,255,0.12); }
    .wm-key:active { transform: scale(0.98); }
    .wm-key.wide { min-width: 78px; }

    .wm-k-correct { background: rgba(34,197,94,0.30); border-color: rgba(34,197,94,0.55); }
    .wm-k-present { background: rgba(234,179,8,0.26); border-color: rgba(234,179,8,0.55); }
    .wm-k-absent  { background: rgba(148,163,184,0.18); border-color: rgba(148,163,184,0.28); }

    .wm-toast {
      position: fixed;
      top: 30px;
      left: 50%;
      transform: translateX(-50%);
      padding: 10px 12px;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.16);
      background: rgba(17,24,39,0.88);
      color: #fff;
      font-weight: 800;
      font-size: 13px;
      z-index: 50;
      min-width: 140px;
      text-align: center;
      backdrop-filter: blur(10px);
    }

    .wm-footer {
      margin-top: 10px;
      height: 20px;
      font-size: 13px;
      text-align: center;
      color: rgba(229,231,235,0.75);
      user-select: none;
    }

    @keyframes wmShake {
      0% { transform: translateX(0); }
      15% { transform: translateX(-10px); }
      30% { transform: translateX(10px); }
      45% { transform: translateX(-8px); }
      60% { transform: translateX(8px); }
      75% { transform: translateX(-5px); }
      90% { transform: translateX(5px); }
      100% { transform: translateX(0); }
    }
    .wm-shake { animation: wmShake 420ms ease-in-out; }

    /* "normal" flip: rotate with tiny scale to feel snappy */
    .wm-flip .wm-cell { 
      animation: wmFlip ${flipDuration}ms cubic-bezier(.2,.8,.2,1) both; 
      transform-origin: center; 
    }
    .wm-flip .wm-cell:nth-child(1) { animation-delay: 0ms; }
    .wm-flip .wm-cell:nth-child(2) { animation-delay: ${1 * delayPerTile}ms; }
    .wm-flip .wm-cell:nth-child(3) { animation-delay: ${2 * delayPerTile}ms; }
    .wm-flip .wm-cell:nth-child(4) { animation-delay: ${3 * delayPerTile}ms; }
    .wm-flip .wm-cell:nth-child(5) { animation-delay: ${4 * delayPerTile}ms; }

    @keyframes wmFlip {
      0%   { transform: translateZ(0) rotateX(0deg) scale(1); }
      48%  { transform: translateZ(0) rotateX(90deg) scale(1.03); }
      52%  { transform: translateZ(0) rotateX(90deg) scale(1.03); }
      100% { transform: translateZ(0) rotateX(0deg) scale(1); }
    }

    @media (max-width: 420px) {
      .wm-cell { width: 46px; height: 46px; font-size: 20px; }
      .wm-key { height: 42px; border-radius: 10px; }
      .wm-key.wide { min-width: 70px; }
    }
  `;

  return (
    <div className="wm-wrap" ref={rootRef} tabIndex={0} aria-label="Wordle">
      <style>{css}</style>

      {toast ? <div className="wm-toast">{toast}</div> : null}

      <div className="wm-card">
        <div className="wm-top">
          <div className="wm-title">{title}</div>
        </div>

        <div className="wm-grid" aria-label="Guess grid">
          {rows}
        </div>

        <div className="wm-kb" aria-label="Keyboard">
          {kb.map((row, ri) => (
            <div className="wm-kbRow" key={ri}>
              {row.map((k) => {
                const wide = k === "ENTER" || k === "BACKSPACE";
                const letter = k.length === 1 ? k : null;
                const st = letter ? keyboardStatus[letter] : null;

                const cls = [
                  "wm-key",
                  wide ? "wide" : "",
                  st ? `wm-k-${st}` : "",
                ].join(" ");

                return (
                  <button
                    key={k}
                    className={cls}
                    type="button"
                    onClick={() => {
                      if (k === "ENTER") enter();
                      else if (k === "BACKSPACE") del();
                      else add(k);
                    }}
                    aria-label={k === "BACKSPACE" ? "Delete" : k}
                  >
                    {k === "BACKSPACE" ? "⌫" : k}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function scoreGuess(guess, solution) {
  const g = guess.split("");
  const s = solution.split("");
  const out = Array(g.length).fill("absent");

  const counts = {};
  for (let i = 0; i < g.length; i++) {
    if (g[i] === s[i]) {
      out[i] = "correct";
    } else {
      counts[s[i]] = (counts[s[i]] || 0) + 1;
    }
  }
  for (let i = 0; i < g.length; i++) {
    if (out[i] === "correct") continue;
    const ch = g[i];
    if ((counts[ch] || 0) > 0) {
      out[i] = "present";
      counts[ch] -= 1;
    }
  }
  return out;
}

function hashToIndex(str, mod) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return mod ? h % mod : 0;
}
