import React, { useState } from "react";

const TOTAL_STEPS = 3;

function App() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Typing clears the current error
  const handleNameChange = (event) => {
    setName(event.target.value);
    setError("");
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setError("");
  };

  const handleNext = () => {
    // Validate the current step before moving ahead
    if (step === 1 && name.trim() === "") {
      setError("Name is required");
      return;
    }
    if (step === 2 && !email.trim().includes("@")) {
      setError("Enter a valid email");
      return;
    }
    setError("");
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setError("");
    setStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleRestart = () => {
    setStep(1);
    setName("");
    setEmail("");
    setError("");
    setSubmitted(false);
  };

  return (
    <div className="page">
      <div className="card">
        <h1 id="title" className="title">Registration Wizard</h1>

        {submitted ? (
          <div>
            <p id="successMsg" className="msg msg-ok success">
              {`Registration complete for ${name.trim()}!`}
            </p>
            <button id="restartBtn" className="btn btn-primary btn-block restart" onClick={handleRestart}>
              Start Over
            </button>
          </div>
        ) : (
          <div>
            <p id="stepIndicator" className="step-indicator">{`Step ${step} of ${TOTAL_STEPS}`}</p>
            <div className="step-track">
              <div className="step-fill" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
            </div>

            {step === 1 && (
              <div>
                <label className="field-label" htmlFor="nameInput">Your name</label>
                <input
                  id="nameInput"
                  className="text-input"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={handleNameChange}
                />
              </div>
            )}

            {step === 2 && (
              <div>
                <label className="field-label" htmlFor="emailInput">Your email</label>
                <input
                  id="emailInput"
                  className="text-input"
                  type="text"
                  placeholder="you@example.com"
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>
            )}

            {step === 3 && (
              <div className="review">
                <p id="reviewName" className="review-line">{`Name: ${name.trim()}`}</p>
                <p id="reviewEmail" className="review-line">{`Email: ${email.trim()}`}</p>
              </div>
            )}

            {error && <p id="stepError" className="msg msg-error">{error}</p>}

            <div className="btn-row">
              {step > 1 && (
                <button id="backBtn" className="btn btn-outline" onClick={handleBack}>Back</button>
              )}
              {step < TOTAL_STEPS && (
                <button id="nextBtn" className="btn btn-primary" onClick={handleNext}>Next</button>
              )}
              {step === TOTAL_STEPS && (
                <button id="submitBtn" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
