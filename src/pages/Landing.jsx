import "../assets/css/global.css";
import github from "../assets/images/github.svg";
import linkedin from "../assets/images/linkedin.svg";
import React from "react";
import { ReactTyped } from "react-typed";

const TypingEffect = () => {
  return (
    <ReactTyped
      strings={[
        "fullstack developer.",
        "software engineer.",
        "NYT games addict.",
        "part time pickle baller.",
        "avid quote collecter.",
      ]}
      typeSpeed={50}
      backSpeed={30}
      loop
    />
  );
};

const TwoColumn = () => {
  return (
    <div className="two-column-container">
      <div className="column">
        <h2 className="text body-text">Professional Me</h2>
        <p className="text body-text link"> Experience</p>
        <p className="text body-text link"> Skills</p>
        <p className="text body-text link"> Projects</p>
      </div>
      <div className="vertical-line" />
      <div className="column">
        <h2 className="text body-text">Authentic Me</h2>
        <p className="text body-text link"> Journals</p>
        <p className="text body-text link"> Quotes</p>
        <p className="text body-text link"> Pics</p>
      </div>
    </div>
  );
};

export default function Landing() {
  return (
    <div className="default-margin">
      <div className="default-title">
        <h1 className="text title-text">
          <div className="pad-right-mini">Runzhe Cui</div>
          <img src={github} className="image-link" alt="github link" />
          <img src={linkedin} className="image-link" alt="linkedin link" />
        </h1>
      </div>
      <hr className="divider" />
      <div>
        <p className="text body-text">
          👋 Hellooo, my name is Runzhe (aka Rinja).
        </p>
        <p className="text body-text">
          I'm a current undergrad at the University of Chicago double majoring
          in Computer Science & Economics and <TypingEffect />
        </p>
        <p className="text body-text">
          I spend most of my time building fullstack projects, experimenting
          with LLMs, going to the gym, and watching psychological kdramas.
        </p>
        <p className="text body-text">Get to know me a little bit more!!</p>
      </div>
      {/* <TwoColumn /> */}
    </div>
  );
}
