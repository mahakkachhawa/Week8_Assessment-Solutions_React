import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App";

const text = (container, selector) => container.querySelector(selector).textContent;

const typeTemp = (container, value) => {
  fireEvent.change(container.querySelector("#tempInput"), { target: { value } });
};

const click = (container, selector) => {
  fireEvent.click(container.querySelector(selector));
};

describe("Temperature Converter App (class component)", () => {
  test("verify_app_is_a_class_component", () => {
    // Class components extend React.Component, so they carry isReactComponent
    expect(App.prototype && App.prototype.isReactComponent).toBeTruthy();
  });

  test("verify_default_direction_and_empty_result", () => {
    const { container } = render(<App />);
    expect(text(container, "#fromUnit")).toBe("Celsius");
    expect(text(container, "#toUnit")).toBe("Fahrenheit");
    expect(text(container, "#result")).toBe("--");
    expect(container.querySelector("#weatherNote")).not.toBeInTheDocument();
  });

  test("verify_celsius_to_fahrenheit_conversion", () => {
    const { container } = render(<App />);
    typeTemp(container, "100");
    expect(text(container, "#result")).toBe("212.0");
    expect(text(container, "#resultUnit")).toBe("\u00B0F");
    typeTemp(container, "0");
    expect(text(container, "#result")).toBe("32.0");
    typeTemp(container, "37");
    expect(text(container, "#result")).toBe("98.6");
  });

  test("verify_negative_temperature_conversion", () => {
    const { container } = render(<App />);
    typeTemp(container, "-40");
    expect(text(container, "#result")).toBe("-40.0");
    typeTemp(container, "-10");
    expect(text(container, "#result")).toBe("14.0");
  });

  test("verify_swap_changes_units_and_converts_fahrenheit_to_celsius", () => {
    const { container } = render(<App />);
    typeTemp(container, "100");
    click(container, "#swapBtn");
    expect(text(container, "#fromUnit")).toBe("Fahrenheit");
    expect(text(container, "#toUnit")).toBe("Celsius");
    expect(text(container, "#result")).toBe("37.8");
    expect(text(container, "#resultUnit")).toBe("\u00B0C");
  });

  test("verify_swap_twice_returns_to_original_direction_and_keeps_input", () => {
    const { container } = render(<App />);
    typeTemp(container, "100");
    click(container, "#swapBtn");
    click(container, "#swapBtn");
    expect(container.querySelector("#tempInput").value).toBe("100");
    expect(text(container, "#fromUnit")).toBe("Celsius");
    expect(text(container, "#result")).toBe("212.0");
  });

  test("verify_weather_note_for_celsius_input", () => {
    const { container } = render(<App />);
    const cases = [
      ["10", "Cold"],
      ["14.9", "Cold"],
      ["15", "Pleasant"],
      ["22", "Pleasant"],
      ["29.9", "Pleasant"],
      ["30", "Hot"],
      ["38", "Hot"],
    ];
    cases.forEach(([input, note]) => {
      typeTemp(container, input);
      expect(text(container, "#weatherNote")).toBe(note);
    });
  });

  test("verify_weather_note_for_fahrenheit_input", () => {
    const { container } = render(<App />);
    click(container, "#swapBtn");
    typeTemp(container, "50"); // 10 C
    expect(text(container, "#weatherNote")).toBe("Cold");
    typeTemp(container, "68"); // 20 C
    expect(text(container, "#weatherNote")).toBe("Pleasant");
    typeTemp(container, "86"); // 30 C
    expect(text(container, "#weatherNote")).toBe("Hot");
  });

  test("verify_clear_resets_input_and_direction", () => {
    const { container } = render(<App />);
    click(container, "#swapBtn");
    typeTemp(container, "98");
    click(container, "#clearBtn");
    expect(container.querySelector("#tempInput").value).toBe("");
    expect(text(container, "#fromUnit")).toBe("Celsius");
    expect(text(container, "#result")).toBe("--");
    expect(container.querySelector("#weatherNote")).not.toBeInTheDocument();
  });

  test("verify_emptying_the_input_hides_result_and_note", () => {
    const { container } = render(<App />);
    typeTemp(container, "25");
    expect(text(container, "#result")).toBe("77.0");
    expect(container.querySelector("#weatherNote")).toBeInTheDocument();
    typeTemp(container, "");
    expect(text(container, "#result")).toBe("--");
    expect(text(container, "#resultUnit")).toBe("");
    expect(container.querySelector("#weatherNote")).not.toBeInTheDocument();
  });
});
