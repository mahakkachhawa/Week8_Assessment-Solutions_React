import React from "react";

// A React CLASS component (no useState anywhere)
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      password: "",
      confirm: "",
      visible: false,
      created: false,
    };

    // Bind class event handlers so `this` points to the component
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleConfirmChange = this.handleConfirmChange.bind(this);
    this.handleToggleVisibility = this.handleToggleVisibility.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Typing in either field hides an old success message
  handlePasswordChange(event) {
    this.setState({ password: event.target.value, created: false });
  }

  handleConfirmChange(event) {
    this.setState({ confirm: event.target.value, created: false });
  }

  // Functional form of setState: the new value depends on the previous one
  handleToggleVisibility() {
    this.setState((prevState) => ({ visible: !prevState.visible }));
  }

  handleSubmit() {
    const { password, confirm } = this.state;
    const isValid = password.length >= 8 && /\d/.test(password) && password === confirm;
    if (isValid) {
      this.setState({ created: true });
    }
  }

  render() {
    const { password, confirm, visible, created } = this.state;

    const lengthOk = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const matches = confirm !== "" && password === confirm;
    const canSubmit = lengthOk && hasNumber && matches;
    const inputType = visible ? "text" : "password";

    return (
      <div className="page">
        <div className="card">
          <h1 id="title" className="title">Password Match Checker</h1>

          <label className="field-label" htmlFor="passwordInput">Password</label>
          <input
            id="passwordInput"
            className="text-input"
            type={inputType}
            value={password}
            onChange={this.handlePasswordChange}
          />

          <label className="field-label" htmlFor="confirmInput">Confirm password</label>
          <input
            id="confirmInput"
            className="text-input"
            type={inputType}
            value={confirm}
            onChange={this.handleConfirmChange}
          />

          <button
            id="toggleVisibility"
            className="btn btn-outline btn-block toggle-btn"
            onClick={this.handleToggleVisibility}
          >
            {visible ? "Hide Passwords" : "Show Passwords"}
          </button>

          <ul className="rules">
            <li id="ruleLength" className={lengthOk ? "rule rule-met" : "rule"}>
              {lengthOk ? "Length: Met" : "Length: Not met"}
            </li>
            <li id="ruleNumber" className={hasNumber ? "rule rule-met" : "rule"}>
              {hasNumber ? "Number: Met" : "Number: Not met"}
            </li>
          </ul>

          {confirm !== "" && (
            <p id="matchStatus" className={matches ? "msg msg-ok" : "msg msg-error"}>
              {matches ? "Passwords match" : "Passwords do not match"}
            </p>
          )}

          <button
            id="submitBtn"
            className="btn btn-primary btn-block submit-btn"
            disabled={!canSubmit}
            onClick={this.handleSubmit}
          >
            Create Account
          </button>

          {created && <p id="successMsg" className="msg msg-ok">Account created successfully</p>}
        </div>
      </div>
    );
  }
}

export default App;
