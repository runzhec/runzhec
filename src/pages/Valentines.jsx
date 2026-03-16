import ValentinePasscode from "./components/Passcode";
import Wordle from "./components/Wordle";
import HeartClicker from "./components/Heart";
import Mine from "./components/Mine";
import { useState } from "react";

export default function App() {
  const [page, setPage] = useState("passcode");

  const renderPage = () => {
    switch (page) {
      case "passcode":
        return (
          <ValentinePasscode
            length={6}
            expectedCode="050225"
            onSuccess={setPage}
          />
        );
      case "wordle":
        return <Wordle target="shang" onSuccess={setPage} />;
      case "clicker":
        return <HeartClicker onSuccess={setPage} />;
      default:
        return <Mine />;
    }
  };

  return renderPage();
}
