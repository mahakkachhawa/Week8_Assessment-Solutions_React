import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App";

// The starter code uses SECRET_NUMBER = 42 and MAX_ATTEMPTS = 5

const text = (container, selector) => container.querySelector(selector).textContent;

const guess = (container, value) => {
  fireEvent.change(container.querySelector("#guessInput"), { target: { value: String(value) } });
  fireEvent.click(container.querySelector("#guessBtn"));
};

const loseTheGame = (container) => {
  [10, 20, 30, 40, 50].forEach((n) => guess(container, n));
};

describe("Number Guessing Game App", () => {
  test("verify_guess_below_the_secret_number_shows_too_low", () => {
    const { container } = render(<App />);
    expect(container.querySelector("#hint")).not.toBeInTheDocument();
    guess(container, 10);
    expect(text(container, "#hint")).toBe("Too low");
  });

  test("verify_guess_above_the_secret_number_shows_too_high", () => {
    const { container } = render(<App />);
    guess(container, 90);
    expect(text(container, "#hint")).toBe("Too high");
  });

  test("verify_every_valid_guess_uses_one_attempt", () => {
    const { container } = render(<App />);
    expect(text(container, "#attemptsLeft")).toBe("5");
    guess(container, 10);
    expect(text(container, "#attemptsLeft")).toBe("4");
    guess(container, 90);
    expect(text(container, "#attemptsLeft")).toBe("3");
  });

  test("verify_input_is_cleared_after_a_valid_guess", () => {
    const { container } = render(<App />);
    guess(container, 10);
    expect(container.querySelector("#guessInput").value).toBe("");
  });

  test("verify_invalid_guesses_show_a_message_and_use_no_attempt", () => {
    const { container } = render(<App />);
    fireEvent.click(container.querySelector("#guessBtn")); // empty input
    expect(text(container, "#hint")).toBe("Enter a number between 1 and 100");

    guess(container, 0);
    expect(text(container, "#hint")).toBe("Enter a number between 1 and 100");

    guess(container, 101);
    expect(text(container, "#hint")).toBe("Enter a number between 1 and 100");

    expect(text(container, "#attemptsLeft")).toBe("5");
  });

  test("verify_correct_guess_shows_win_message_and_stops_the_game", () => {
    const { container } = render(<App />);
    guess(container, 42);
    expect(text(container, "#hint")).toBe("Correct! Attempts used: 1");
    expect(container.querySelector("#guessInput")).toBeDisabled();
    expect(container.querySelector("#guessBtn")).toBeDisabled();
    expect(container.querySelector("#playAgainBtn")).toBeInTheDocument();
  });

  test("verify_game_over_after_five_wrong_guesses", () => {
    const { container } = render(<App />);
    loseTheGame(container);
    expect(text(container, "#hint")).toBe("Game over! The number was 42");
    expect(text(container, "#attemptsLeft")).toBe("0");
    expect(container.querySelector("#guessInput")).toBeDisabled();
    expect(container.querySelector("#guessBtn")).toBeDisabled();
    expect(container.querySelector("#playAgainBtn")).toBeInTheDocument();
  });

  test("verify_no_guess_is_accepted_after_the_game_has_ended", () => {
    const { container } = render(<App />);
    loseTheGame(container);
    fireEvent.change(container.querySelector("#guessInput"), { target: { value: "42" } });
    fireEvent.click(container.querySelector("#guessBtn"));
    expect(text(container, "#hint")).toBe("Game over! The number was 42");
    expect(text(container, "#attemptsLeft")).toBe("0");
  });

  test("verify_winning_on_a_later_attempt_counts_attempts_correctly", () => {
    const { container } = render(<App />);
    guess(container, 10);
    guess(container, 90);
    guess(container, 42);
    expect(text(container, "#hint")).toBe("Correct! Attempts used: 3");
    expect(text(container, "#attemptsLeft")).toBe("2");
  });

  test("verify_play_again_starts_a_fresh_game", () => {
    const { container } = render(<App />);
    loseTheGame(container);
    fireEvent.click(container.querySelector("#playAgainBtn"));

    expect(text(container, "#attemptsLeft")).toBe("5");
    expect(container.querySelector("#hint")).not.toBeInTheDocument();
    expect(container.querySelector("#playAgainBtn")).not.toBeInTheDocument();
    expect(container.querySelector("#guessInput")).toBeEnabled();
    expect(container.querySelector("#guessBtn")).toBeEnabled();

    guess(container, 42);
    expect(text(container, "#hint")).toBe("Correct! Attempts used: 1");
  });
});
