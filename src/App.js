import { useState, useEffect } from "react";
import { animalNames } from "./data.js";
import { shuffle } from "./utils.js";
import { useIsMount } from "./utils.js";
import { startTimer, stopTimer, resetTimer, returnTime } from "./stopwatch.js";
import TopNav from "./top-nav.js";
import HelpModal from "./help-modal.js";
import WinModal from "./win-modal.js";
import "./App.css";

function App() {
  const [theme, setTheme] = useState("light");
  const [showHelpModal, setShowHelpModal] = useState(true);
  const [gameCount, setGameCount] = useState(1);
  const [imageLinks, setImageLinks] = useState([]);
  const [gameReady, setGameReady] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [animalNamePair, setAnimalNamePair] = useState({
    first: "",
    second: "",
  });
  const [target, setTarget] = useState("");
  const isMount = useIsMount();

  const handleHelpModalShow = () => {
    setShowHelpModal(true);
  };

  const handleHelpModalHide = () => {
    setShowHelpModal(false);
  };

  useEffect(() => {
    const close = (e) => {
      if (e.keyCode === 27) {
        handleHelpModalHide();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  const getNames = () => {
    const getRandomAnimal = () => {
      return animalNames[Math.floor(Math.random() * animalNames.length)];
    };
    var animal1 = getRandomAnimal();

    var getMinorityAnimal = () => {
      var animal2 = getRandomAnimal();
      while (animal1 === animal2) {
        animal2 = getMinorityAnimal();
      }
      return animal2;
    };

    getMinorityAnimal();
    setAnimalNamePair({ first: animal1, second: getMinorityAnimal() });
  };

  const fetchRequest = async () => {
    var imageArray = [];
    var majorityAnimalRequest = await fetch(
      `https://api.unsplash.com/search/photos?page=1&query=${
        animalNamePair.first
      }&orientation=landscape&client_id=${"HSHyd3uB_pmCjDlMXp7ZN4d5Jd-DtI8vEN-jBopzTPE"}&per_page=10`
    );
    var majorityAnimalRequestJ = await majorityAnimalRequest.json();
    var majorityAnimalResult = await majorityAnimalRequestJ.results;

    if (majorityAnimalResult.length < 5) {
      alert("Error fetching data, please refresh the page");
    } else {
      for (let i = 0; i < 5; i++) {
        imageArray.push("" + majorityAnimalResult[i].urls.regular + "");
      }
    }

    var minorityAnimalRequest = await fetch(
      `https://api.unsplash.com/search/photos?page=1&query=${
        animalNamePair.second
      }&orientation=landscape&client_id=${"HSHyd3uB_pmCjDlMXp7ZN4d5Jd-DtI8vEN-jBopzTPE"}&per_page=10`
    );
    var minorityAnimalRequestJ = await minorityAnimalRequest.json();
    var minorityAnimalResult = await minorityAnimalRequestJ.results;
    var minorityAnimalImageLink = minorityAnimalResult[0].urls.regular;

    if (minorityAnimalResult === null) {
      alert("Error fetching data, please refresh the page");
    } else {
      imageArray.push("" + minorityAnimalImageLink + "");
      setTarget(minorityAnimalImageLink);
      shuffle(imageArray);
      setImageLinks(imageArray);
    }
  };

  const startGame = () => {
    setGameReady(false);
    setGameWon(false);
    var images = document.getElementById("image-grid").querySelectorAll("img");
    images.forEach((image) => (image.style.visibility = "visible"));
    startTimer();
  };

  const resetImages = () => {
    var images = document.getElementById("image-grid").querySelectorAll("img");
    images.forEach((image) => (image.style.visibility = "hidden"));
  };

  useEffect(() => {
    getNames();
  }, []);

  useEffect(() => {
    if (!isMount) {
      fetchRequest();
    }
  }, [animalNamePair]);

  useEffect(() => {
    if (!isMount) {
      for (let i = 0; i < 6; i++) {
        document.getElementById("image" + i).src = "" + imageLinks[i] + "";
      }
      setGameReady(true);
    }
  }, [imageLinks]);

  useEffect(() => {
    document.getElementById("gameCounter").innerHTML =
      "Level:  " + gameCount + " / 3";
    if (gameCount > 3) {
      setGameWon(true);
      setGameCount(1);
      setGameTime(returnTime());
      resetTimer();
    }
  }, [gameCount]);

  const determineSuccess = (e) => {
    stopTimer();
    if (e.target.src === target) {
      setGameCount(gameCount + 1);
    } else {
      setGameCount(1);
      alert("incorrect");
      resetTimer();
    }
    resetImages();
    getNames();
  };

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="app">
      <TopNav showModal={handleHelpModalShow} toggleTheme={toggleTheme} />
      <HelpModal show={showHelpModal} handleClose={handleHelpModalHide} />
      {gameWon && <WinModal time={gameTime} />}
      <div className="component">
        <div id="gameText">
          <div id="gameCounter"></div>
          <button className="button" onClick={startGame} disabled={!gameReady}>
            {" "}
            Ready{" "}
          </button>
        </div>
        <div id="timer">
          <span id="seconds">00:</span>
          <span id="tens">00</span>
        </div>
        <br></br>
        <div id="image-grid">
          <div className="center-block">
            <div className="row">
              <img
                src=""
                id="image0"
                className="imageBox"
                onClick={determineSuccess}
              ></img>
              <img
                src=""
                id="image1"
                className="imageBox"
                onClick={determineSuccess}
              ></img>
            </div>
            <div className="row">
              <img
                src=""
                id="image2"
                className="imageBox"
                onClick={determineSuccess}
              ></img>
              <img
                src=""
                id="image3"
                className="imageBox"
                onClick={determineSuccess}
              ></img>
            </div>
            <div className="row">
              <img
                src=""
                id="image4"
                className="imageBox"
                onClick={determineSuccess}
              ></img>
              <img
                src=""
                id="image5"
                className="imageBox"
                onClick={determineSuccess}
              ></img>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;
