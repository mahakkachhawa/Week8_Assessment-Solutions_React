import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App";

const text = (container, selector) => container.querySelector(selector).textContent;

const typeText = (container, value) => {
  fireEvent.change(container.querySelector("#textInput"), { target: { value } });
};

const click = (container, selector) => {
  fireEvent.click(container.querySelector(selector));
};

describe("Text Formatter App", () => {
  test("verify_typing_updates_output_and_counts", () => {
    const { container } = render(<App />);
    typeText(container, "Hello World");
    expect(container.querySelector("#textInput").value).toBe("Hello World");
    expect(text(container, "#output")).toBe("Hello World");
    expect(text(container, "#wordCount")).toBe("2");
    expect(text(container, "#charCount")).toBe("11");
  });

  test("verify_uppercase_mode", () => {
    const { container } = render(<App />);
    typeText(container, "Hello World");
    click(container, "#upperBtn");
    expect(text(container, "#output")).toBe("HELLO WORLD");
  });

  test("verify_lowercase_mode", () => {
    const { container } = render(<App />);
    typeText(container, "Hello World");
    click(container, "#lowerBtn");
    expect(text(container, "#output")).toBe("hello world");
  });

  test("verify_reverse_mode_reverses_all_characters", () => {
    const { container } = render(<App />);
    typeText(container, "Hello World");
    click(container, "#reverseBtn");
    expect(text(container, "#output")).toBe("dlroW olleH");
  });

  test("verify_selected_mode_stays_active_while_typing", () => {
    const { container } = render(<App />);
    click(container, "#upperBtn");
    typeText(container, "react");
    expect(text(container, "#output")).toBe("REACT");
    typeText(container, "react state");
    expect(text(container, "#output")).toBe("REACT STATE");
  });

  test("verify_normal_button_restores_exact_text", () => {
    const { container } = render(<App />);
    typeText(container, "Hello World");
    click(container, "#upperBtn");
    click(container, "#normalBtn");
    expect(text(container, "#output")).toBe("Hello World");
  });

  test("verify_word_count_ignores_extra_spaces", () => {
    const { container } = render(<App />);
    typeText(container, "  hello   world  ");
    expect(text(container, "#wordCount")).toBe("2");
    typeText(container, "one");
    expect(text(container, "#wordCount")).toBe("1");
    typeText(container, "one two three four");
    expect(text(container, "#wordCount")).toBe("4");
  });

  test("verify_word_count_is_zero_for_empty_or_spaces_only_text", () => {
    const { container } = render(<App />);
    expect(text(container, "#wordCount")).toBe("0");
    typeText(container, "     ");
    expect(text(container, "#wordCount")).toBe("0");
    expect(text(container, "#charCount")).toBe("5");
    typeText(container, "");
    expect(text(container, "#wordCount")).toBe("0");
    expect(text(container, "#charCount")).toBe("0");
  });

  test("verify_current_mode_label_updates_for_every_button", () => {
    const { container } = render(<App />);
    expect(text(container, "#currentMode")).toBe("Normal");
    click(container, "#upperBtn");
    expect(text(container, "#currentMode")).toBe("Uppercase");
    click(container, "#lowerBtn");
    expect(text(container, "#currentMode")).toBe("Lowercase");
    click(container, "#reverseBtn");
    expect(text(container, "#currentMode")).toBe("Reverse");
    click(container, "#normalBtn");
    expect(text(container, "#currentMode")).toBe("Normal");
  });

  test("verify_clear_empties_text_and_resets_mode", () => {
    const { container } = render(<App />);
    typeText(container, "Some Text");
    click(container, "#reverseBtn");
    click(container, "#clearBtn");
    expect(container.querySelector("#textInput").value).toBe("");
    expect(text(container, "#output")).toBe("");
    expect(text(container, "#currentMode")).toBe("Normal");
    expect(text(container, "#wordCount")).toBe("0");
    expect(text(container, "#charCount")).toBe("0");
  });
});
