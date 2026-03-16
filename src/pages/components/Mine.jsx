import React, { useMemo, useRef, useState } from "react";
import { ReactTyped } from "react-typed";

const TypingEffect = () => {
  return (
    <div className="typing-wrap">
      <span className="typing-text">
        <ReactTyped
          strings={[
            "You're the best linkedin games player I know, the hottest girl in the world, and your smile never fails to put a smile on my face. Spending time with you is always the highlight of my day and I'm ecstatic I can spend Valentine's day with you.❤️",
          ]}
          typeSpeed={35}
          backSpeed={32}
          backDelay={900}
          startDelay={150}
        />
      </span>
    </div>
  );
};

export default function Mine() {
  const containerRef = useRef(null);
  const noBtnRef = useRef(null);

  const initialGif = useMemo(
    () =>
      "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExeDdmM2s2NmF5ejg3MjNxMjd3anFkNm90ZW51eWw0ZXVma3dsM2YzdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Gut8LeP5yefbSdpIOr/giphy.gif",
    []
  );

  const [question, setQuestion] = useState(
    "Katherine, will you be my valentine?"
  );
  const [gifSrc, setGifSrc] = useState(initialGif);
  const [accepted, setAccepted] = useState(false);

  const [noPos, setNoPos] = useState({ left: null, top: null });

  const onYes = () => {
    setQuestion("YAYYYY!!!");
    setGifSrc("https://media.giphy.com/media/D9j761FH8SYJLyW9WO/giphy.gif");
    setAccepted(true);
  };

  const moveNo = () => {
    const container = containerRef.current;
    const noBtn = noBtnRef.current;
    if (!container || !noBtn) return;

    const rect = noBtn.getBoundingClientRect();
    const maxX = window.innerWidth - rect.width;
    const maxY = window.innerHeight - rect.height;

    const randomX = Math.floor(Math.random() * Math.max(0, maxX));
    const randomY = Math.floor(Math.random() * Math.max(0, maxY));

    setNoPos({ left: randomX, top: randomY });
  };

  return (
    <div ref={containerRef} className="rbp-root">
      <style>{`
        .rbp-root {
          position: fixed;
          inset: 0;
          font-family: Arial, Helvetica, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: whitesmoke;
          overflow: hidden;
        }

        .rbp-gif {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          padding: 24px;
          gap: 12px;
        }

        .rbp-question {
          text-align: center;
          font-size: clamp(2rem, 4vw, 3rem);
          color: #e94d58;
          margin: 10px 0 0;
          line-height: 1.1;
        }

        /* Typing effect styling */
        .typing-wrap {
        display: inline-flex;
        align-items: baseline;
        gap: 10px;

        /* ✅ Bigger padding */
        padding: 26px 36px;

        border-radius: 999px;
        background: rgba(233, 77, 88, 0.12);
        border: 1px solid rgba(233, 77, 88, 0.25);
        box-shadow: 0 6px 18px rgba(0,0,0,0.08);

        /* ✅ Smaller width */
        max-width: min(500px, 85vw);
        }

        .typing-prefix {
          font-weight: 700;
          color: #e94d58;
          letter-spacing: 0.2px;
          white-space: nowrap;
        }

        .typing-text {
          font-size: 1.15rem;
          color: #1f2937;
        }

        .rbp-img {
          max-width: min(420px, 85vw);
          width: 100%;
          height: auto;
          border-radius: 16px;
        }

        .rbp-btn-group {
          width: 100%;
          height: 40px;
          display: flex;
          justify-content: center;
          margin-top: 44px;
        }

        .rbp-btn {
          position: absolute;
          width: 150px;
          height: 40px;
          color: white;
          font-size: 1.2em;
          border-radius: 30px;
          outline: none;
          cursor: pointer;
          box-shadow: 0 2px 4px gray;
          border: 2px solid #e94d58;
        }

        .rbp-btn.yes {
          margin-left: -200px;
          background: #e94d58;
        }

        .rbp-btn.no {
          margin-right: -200px;
          background: white;
          color: #e94d58;
        }
      `}</style>

      <div className="rbp-gif">
        <h2 className="rbp-question">{question}</h2>

        {accepted && <TypingEffect />}

        <img className="rbp-img" src={gifSrc} alt="gif" />

        {!accepted && (
          <div className="rbp-btn-group">
            <button className="rbp-btn yes" onClick={onYes}>
              YES!!!!!
            </button>

            <button
              ref={noBtnRef}
              className="rbp-btn no"
              onMouseOver={moveNo}
              style={{
                left: noPos.left == null ? undefined : `${noPos.left}px`,
                top: noPos.top == null ? undefined : `${noPos.top}px`,
              }}
            >
              No...
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
