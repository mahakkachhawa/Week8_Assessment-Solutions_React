import React from "react";

// A React CLASS component (no useState anywhere)
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: "",
      direction: "CtoF", // "CtoF" = Celsius to Fahrenheit, "FtoC" = Fahrenheit to Celsius
    };

    // Bind class event handlers so `this` points to the component
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleSwap = this.handleSwap.bind(this);
    this.handleClear = this.handleClear.bind(this);
  }

  handleValueChange(event) {
    this.setState({ value: event.target.value });
  }

  // Functional form of setState: the new direction depends on the previous one
  handleSwap() {
    this.setState((prevState) => ({
      direction: prevState.direction === "CtoF" ? "FtoC" : "CtoF",
    }));
  }

  handleClear() {
    this.setState({ value: "", direction: "CtoF" });
  }

  render() {
    const { value, direction } = this.state;
    const isCtoF = direction === "CtoF";

    const typed = parseFloat(value);
    const hasValue = !isNaN(typed);

    let converted = null;
    let celsius = null;
    if (hasValue) {
      if (isCtoF) {
        converted = (typed * 9) / 5 + 32;
        celsius = typed;
      } else {
        converted = ((typed - 32) * 5) / 9;
        celsius = converted;
      }
    }

    let note = "";
    if (hasValue) {
      if (celsius < 15) note = "Cold";
      else if (celsius < 30) note = "Pleasant";
      else note = "Hot";
    }

    return (
      <div className="page">
        <div className="card">
          <h1 id="title" className="title">Temperature Converter</h1>

          <p className="direction-line">
            <span id="fromUnit" className="unit-pill">{isCtoF ? "Celsius" : "Fahrenheit"}</span>
            <span className="arrow">to</span>
            <span id="toUnit" className="unit-pill unit-pill-alt">{isCtoF ? "Fahrenheit" : "Celsius"}</span>
          </p>

          <input
            id="tempInput"
            className="text-input"
            type="number"
            placeholder="Enter temperature"
            value={value}
            onChange={this.handleValueChange}
          />

          <p className="result-line">
            <span id="result">{hasValue ? converted.toFixed(1) : "--"}</span>
            <span id="resultUnit" className="result-unit">
              {hasValue ? (isCtoF ? "\u00B0F" : "\u00B0C") : ""}
            </span>
          </p>

          {hasValue && <p id="weatherNote" className="msg msg-info note">{note}</p>}

          <div className="btn-row">
            <button id="swapBtn" className="btn btn-primary" onClick={this.handleSwap}>Swap Units</button>
            <button id="clearBtn" className="btn btn-outline" onClick={this.handleClear}>Clear</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
