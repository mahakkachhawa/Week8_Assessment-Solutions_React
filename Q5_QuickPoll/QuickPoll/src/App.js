import React, { useState } from "react";

const OPTIONS = ["React", "Angular", "Vue"];
const emptyVotes = { React: 0, Angular: 0, Vue: 0 };

function App() {
  const [votes, setVotes] = useState(emptyVotes);
  const [lastVote, setLastVote] = useState(null); // option voted most recently (null = none)

  const handleVote = (option) => {
    setVotes((prev) => ({ ...prev, [option]: prev[option] + 1 }));
    setLastVote(option);
  };

  // Undo removes only the most recent vote (one level of undo)
  const handleUndo = () => {
    if (lastVote === null) return;
    setVotes((prev) => ({ ...prev, [lastVote]: prev[lastVote] - 1 }));
    setLastVote(null);
  };

  const handleReset = () => {
    setVotes(emptyVotes);
    setLastVote(null);
  };

  // Derived values
  const totalVotes = OPTIONS.reduce((sum, option) => sum + votes[option], 0);
  const percentOf = (option) =>
    totalVotes === 0 ? 0 : Math.round((votes[option] / totalVotes) * 100);

  const highest = Math.max(...OPTIONS.map((option) => votes[option]));
  const leaders = OPTIONS.filter((option) => votes[option] === highest);

  let leaderText;
  if (totalVotes === 0) {
    leaderText = "No votes yet";
  } else if (leaders.length > 1) {
    leaderText = "It's a tie";
  } else {
    leaderText = `Leading: ${leaders[0]}`;
  }

  return (
    <div className="page">
      <div className="card">
        <h1 id="title" className="title">Quick Poll</h1>
        <p className="muted question">Which front-end library do you like the most?</p>

        <div className="options">
          {OPTIONS.map((option) => (
            <div key={option} className="option-row">
              <div className="option-top">
                <span className="option-name">{option}</span>
                <span className="option-stats">
                  <span id={`count${option}`}>{votes[option]}</span> votes (
                  <span id={`percent${option}`}>{percentOf(option)}</span>%)
                </span>
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${percentOf(option)}%` }} />
              </div>
              <button
                id={`vote${option}`}
                className="btn btn-outline vote-btn"
                onClick={() => handleVote(option)}
              >
                {`Vote ${option}`}
              </button>
            </div>
          ))}
        </div>

        <p className="total-line">
          Total votes: <span id="totalVotes">{totalVotes}</span>
        </p>
        <p id="leader" className="msg msg-info leader">{leaderText}</p>

        <div className="btn-row">
          <button id="undoBtn" className="btn btn-primary" onClick={handleUndo}>Undo Last Vote</button>
          <button id="resetBtn" className="btn btn-outline" onClick={handleReset}>Reset</button>
        </div>
      </div>
    </div>
  );
}

export default App;
