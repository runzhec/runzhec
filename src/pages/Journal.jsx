import "../assets/css/global.css";

function Card() {}

export default function Journal() {
  return (
    <div className="default-margin">
      <div className="default-title">
        <h1 className="text title-text">Rinja's Journal</h1>
      </div>
      <hr className="divider" />
      <p className="text">A messy collection of my various shower thoughts</p>
    </div>
  );
}
