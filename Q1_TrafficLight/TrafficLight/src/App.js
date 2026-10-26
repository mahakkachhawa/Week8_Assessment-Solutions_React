import React, { useState } from "react";

const LIGHTS = [
  { name: "Red", message: "Stop" },
  { name: "Green", message: "Go" },
  { name: "Yellow", message: "Get ready to stop" },
];

function App() {
  const [lightIndex, setLightIndex] = useState(0);
  const [changes, setChanges] = useState(0);
  const [cycles, setCycles] = useState(0);

  const handleNext = () => {
    // A cycle is completed when the light moves from Yellow (last) back to Red (first)
    if (lightIndex === LIGHTS.length - 1) {
      setCycles((prev) => prev + 1);
    }
    setLightIndex((prev) => (prev + 1) % LIGHTS.length);
    setChanges((prev) => prev + 1);
  };

  const handleReset = () => {
    setLightIndex(0);
    setChanges(0);
    setCycles(0);
  };

  const current = LIGHTS[lightIndex];

  return (
    <div className="page">
      <div className="card">
        <h1 id="title" className="title">Traffic Light Controller</h1>

        <div className="lights">
          <div id="redLamp" className={lightIndex === 0 ? "lamp lamp-red active" : "lamp lamp-red"} />
          <div id="yellowLamp" className={lightIndex === 2 ? "lamp lamp-yellow active" : "lamp lamp-yellow"} />
          <div id="greenLamp" className={lightIndex === 1 ? "lamp lamp-green active" : "lamp lamp-green"} />
        </div>

        <p className="current-light">
          Current light: <span id="lightName">{current.name}</span>
        </p>
        <p id="lightMessage" className="msg msg-info light-message">{current.message}</p>

        <div className="stat-row">
          <div className="stat-box">
            <span className="stat-label">Light changes</span>
            <span id="changeCount" className="stat-value">{changes}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Cycles completed</span>
            <span id="cycleCount" className="stat-value">{cycles}</span>
          </div>
        </div>

        <div className="btn-row">
          <button id="nextBtn" className="btn btn-primary" onClick={handleNext}>Next Light</button>
          <button id="resetBtn" className="btn btn-outline" onClick={handleReset}>Reset</button>
        </div>
      </div>
    </div>
  );
}

export default App;
