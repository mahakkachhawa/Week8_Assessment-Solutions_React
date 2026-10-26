import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App";

const text = (container, selector) => container.querySelector(selector).textContent;

const clickNext = (container, times = 1) => {
  for (let i = 0; i < times; i++) {
    fireEvent.click(container.querySelector("#nextBtn"));
  }
};

const isActive = (container, selector) =>
  container.querySelector(selector).classList.contains("active");

describe("Traffic Light Controller App", () => {
  test("verify_initial_light_is_red_with_stop_message", () => {
    const { container } = render(<App />);
    expect(text(container, "#lightName")).toBe("Red");
    expect(text(container, "#lightMessage")).toBe("Stop");
    expect(text(container, "#changeCount")).toBe("0");
    expect(text(container, "#cycleCount")).toBe("0");
  });

  test("verify_next_light_moves_red_to_green", () => {
    const { container } = render(<App />);
    clickNext(container);
    expect(text(container, "#lightName")).toBe("Green");
  });

  test("verify_full_light_sequence_red_green_yellow_red", () => {
    const { container } = render(<App />);
    const seen = [];
    for (let i = 0; i < 3; i++) {
      clickNext(container);
      seen.push(text(container, "#lightName"));
    }
    expect(seen).toEqual(["Green", "Yellow", "Red"]);
  });

  test("verify_message_matches_each_light", () => {
    const { container } = render(<App />);
    expect(text(container, "#lightMessage")).toBe("Stop");
    clickNext(container);
    expect(text(container, "#lightMessage")).toBe("Go");
    clickNext(container);
    expect(text(container, "#lightMessage")).toBe("Get ready to stop");
    clickNext(container);
    expect(text(container, "#lightMessage")).toBe("Stop");
  });

  test("verify_only_the_current_lamp_is_active", () => {
    const { container } = render(<App />);
    expect(isActive(container, "#redLamp")).toBe(true);
    expect(isActive(container, "#greenLamp")).toBe(false);
    expect(isActive(container, "#yellowLamp")).toBe(false);

    clickNext(container);
    expect(isActive(container, "#redLamp")).toBe(false);
    expect(isActive(container, "#greenLamp")).toBe(true);
    expect(isActive(container, "#yellowLamp")).toBe(false);

    clickNext(container);
    expect(isActive(container, "#redLamp")).toBe(false);
    expect(isActive(container, "#greenLamp")).toBe(false);
    expect(isActive(container, "#yellowLamp")).toBe(true);
  });

  test("verify_change_count_increases_on_every_click", () => {
    const { container } = render(<App />);
    clickNext(container, 4);
    expect(text(container, "#changeCount")).toBe("4");
  });

  test("verify_cycle_count_increases_only_when_yellow_returns_to_red", () => {
    const { container } = render(<App />);
    clickNext(container, 2); // Red -> Green -> Yellow
    expect(text(container, "#cycleCount")).toBe("0");
    clickNext(container); // Yellow -> Red
    expect(text(container, "#cycleCount")).toBe("1");
    clickNext(container); // Red -> Green
    expect(text(container, "#cycleCount")).toBe("1");
  });

  test("verify_multiple_cycles_after_nine_clicks", () => {
    const { container } = render(<App />);
    clickNext(container, 9);
    expect(text(container, "#lightName")).toBe("Red");
    expect(text(container, "#changeCount")).toBe("9");
    expect(text(container, "#cycleCount")).toBe("3");
  });

  test("verify_reset_restores_light_and_both_counters", () => {
    const { container } = render(<App />);
    clickNext(container, 5);
    fireEvent.click(container.querySelector("#resetBtn"));
    expect(text(container, "#lightName")).toBe("Red");
    expect(text(container, "#lightMessage")).toBe("Stop");
    expect(text(container, "#changeCount")).toBe("0");
    expect(text(container, "#cycleCount")).toBe("0");
    expect(isActive(container, "#redLamp")).toBe(true);
  });

  test("verify_sequence_restarts_from_red_after_reset", () => {
    const { container } = render(<App />);
    clickNext(container, 2); // Yellow
    fireEvent.click(container.querySelector("#resetBtn"));
    clickNext(container);
    expect(text(container, "#lightName")).toBe("Green");
    expect(text(container, "#changeCount")).toBe("1");
    expect(text(container, "#cycleCount")).toBe("0");
  });
});
