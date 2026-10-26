import React, { useState } from "react";

const MODE_LABELS = {
  normal: "Normal",
  upper: "Uppercase",
  lower: "Lowercase",
  reverse: "Reverse",
};

function formatText(text, mode) {
  switch (mode) {
    case "upper":
      return text.toUpperCase();
    case "lower":
      return text.toLowerCase();
    case "reverse":
      return text.split("").reverse().join("");
    default:
      return text;
  }
}

function App() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState("normal");

  // Input/change event: read the typed text from event.target.value
  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleClear = () => {
    setText("");
    setMode("normal");
  };

  // Derived values (calculated on every render, no extra state needed)
  const trimmed = text.trim();
  const wordCount = trimmed === "" ? 0 : trimmed.split(/\s+/).length;
  const output = formatText(text, mode);

  return (
    <div className="page">
      <div className="card">
        <h1 id="title" className="title">Text Formatter</h1>

        <textarea
          id="textInput"
          className="text-input"
          rows="4"
          placeholder="Type or paste your text here..."
          value={text}
          onChange={handleTextChange}
        />

        <div className="btn-row">
          <button id="normalBtn" className="btn btn-outline" onClick={() => setMode("normal")}>Normal</button>
          <button id="upperBtn" className="btn btn-outline" onClick={() => setMode("upper")}>UPPERCASE</button>
          <button id="lowerBtn" className="btn btn-outline" onClick={() => setMode("lower")}>lowercase</button>
          <button id="reverseBtn" className="btn btn-outline" onClick={() => setMode("reverse")}>Reverse</button>
        </div>

        <p className="muted">
          Current mode: <strong id="currentMode">{MODE_LABELS[mode]}</strong>
        </p>

        <div className="output-box">
          <p id="output" className="output-text">{output}</p>
        </div>

        <div className="stat-row">
          <div className="stat-box">
            <span className="stat-label">Words</span>
            <span id="wordCount" className="stat-value">{wordCount}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Characters</span>
            <span id="charCount" className="stat-value">{text.length}</span>
          </div>
        </div>

        <button id="clearBtn" className="btn btn-primary btn-block" onClick={handleClear}>Clear</button>
      </div>
    </div>
  );
}

export default App;
