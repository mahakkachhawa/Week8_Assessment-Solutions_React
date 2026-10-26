import React, { useState } from "react";

// Provided in the starter code (do not change these two values)
const SECRET_NUMBER = 42;
const MAX_ATTEMPTS = 5;

function App() {
  const [guess, setGuess] = useState("");
  const [attemptsUsed, setAttemptsUsed] = useState(0);
  const [hint, setHint] = useState("");
  const [status, setStatus] = useState("playing"); // "playing" | "won" | "lost"

  const handleGuessChange = (event) => {
    setGuess(event.target.value);
  };

  const handleGuess = () => {
    if (status !== "playing") return;

    const value = Number(guess);
    const isValid =
      guess.trim() !== "" && Number.isInteger(value) && value >= 1 && value <= 100;

    // An invalid guess does not use an attempt
    if (!isValid) {
      setHint("Enter a number between 1 and 100");
      return;
    }

    const used = attemptsUsed + 1;
    setAttemptsUsed(used);
    setGuess("");

    if (value === SECRET_NUMBER) {
      setStatus("won");
      setHint(`Correct! Attempts used: ${used}`);
    } else if (used >= MAX_ATTEMPTS) {
      setStatus("lost");
      setHint(`Game over! The number was ${SECRET_NUMBER}`);
    } else {
      setHint(value < SECRET_NUMBER ? "Too low" : "Too high");
    }
  };

  const handlePlayAgain = () => {
    setGuess("");
    setAttemptsUsed(0);
    setHint("");
    setStatus("playing");
  };

  const isPlaying = status === "playing";
  const attemptsLeft = MAX_ATTEMPTS - attemptsUsed;

  let hintClass = "msg msg-info";
  if (status === "won") hintClass = "msg msg-ok";
  if (status === "lost") hintClass = "msg msg-error";

  return (
    <div className="page">
      <div className="card">
        <h1 id="title" className="title">Number Guessing Game</h1>
        <p className="muted intro">I am thinking of a number between 1 and 100.</p>

        <div className="stat-row">
          <div className="stat-box">
            <span className="stat-label">Attempts left</span>
            <span id="attemptsLeft" className="stat-value">{attemptsLeft}</span>
          </div>
        </div>

        <div className="guess-row">
          <input
            id="guessInput"
            className="text-input"
            type="number"
            placeholder="Your guess"
            value={guess}
            disabled={!isPlaying}
            onChange={handleGuessChange}
          />
          <button
            id="guessBtn"
            className="btn btn-primary"
            disabled={!isPlaying}
            onClick={handleGuess}
          >
            Guess
          </button>
        </div>

        {hint && <p id="hint" className={hintClass}>{hint}</p>}

        {!isPlaying && (
          <button id="playAgainBtn" className="btn btn-outline btn-block again" onClick={handlePlayAgain}>
            Play Again
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
