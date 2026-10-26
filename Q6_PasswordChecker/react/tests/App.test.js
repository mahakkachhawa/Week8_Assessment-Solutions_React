import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App";

const text = (container, selector) => container.querySelector(selector).textContent;

const typePassword = (container, value) => {
  fireEvent.change(container.querySelector("#passwordInput"), { target: { value } });
};

const typeConfirm = (container, value) => {
  fireEvent.change(container.querySelector("#confirmInput"), { target: { value } });
};

const fillBoth = (container, value) => {
  typePassword(container, value);
  typeConfirm(container, value);
};

describe("Password Match Checker App (class component)", () => {
  test("verify_app_is_a_class_component", () => {
    // Class components extend React.Component, so they carry isReactComponent
    expect(App.prototype && App.prototype.isReactComponent).toBeTruthy();
  });

  test("verify_length_rule_changes_at_eight_characters", () => {
    const { container } = render(<App />);
    expect(text(container, "#ruleLength")).toBe("Length: Not met");
    typePassword(container, "abcdefg"); // 7 characters
    expect(text(container, "#ruleLength")).toBe("Length: Not met");
    typePassword(container, "abcdefgh"); // 8 characters
    expect(text(container, "#ruleLength")).toBe("Length: Met");
  });

  test("verify_number_rule_needs_at_least_one_digit", () => {
    const { container } = render(<App />);
    typePassword(container, "abcdefgh");
    expect(text(container, "#ruleNumber")).toBe("Number: Not met");
    typePassword(container, "abcdefg1");
    expect(text(container, "#ruleNumber")).toBe("Number: Met");
  });

  test("verify_match_status_for_empty_matching_and_different_confirm", () => {
    const { container } = render(<App />);
    typePassword(container, "abc12345");
    expect(container.querySelector("#matchStatus")).not.toBeInTheDocument();

    typeConfirm(container, "abc");
    expect(text(container, "#matchStatus")).toBe("Passwords do not match");

    typeConfirm(container, "abc12345");
    expect(text(container, "#matchStatus")).toBe("Passwords match");

    typeConfirm(container, "");
    expect(container.querySelector("#matchStatus")).not.toBeInTheDocument();
  });

  test("verify_submit_is_disabled_until_every_rule_is_satisfied", () => {
    const { container } = render(<App />);
    expect(container.querySelector("#submitBtn")).toBeDisabled();

    typePassword(container, "secret123"); // valid, but no confirm yet
    expect(container.querySelector("#submitBtn")).toBeDisabled();

    typeConfirm(container, "secret12"); // does not match
    expect(container.querySelector("#submitBtn")).toBeDisabled();

    fillBoth(container, "abc1"); // matches but too short
    expect(container.querySelector("#submitBtn")).toBeDisabled();

    fillBoth(container, "abcdefgh"); // matches, long enough, but no digit
    expect(container.querySelector("#submitBtn")).toBeDisabled();
  });

  test("verify_submit_is_enabled_when_all_rules_are_met", () => {
    const { container } = render(<App />);
    fillBoth(container, "secret123");
    expect(container.querySelector("#submitBtn")).toBeEnabled();
  });

  test("verify_success_message_after_submit_and_hidden_after_typing", () => {
    const { container } = render(<App />);
    fillBoth(container, "secret123");
    expect(container.querySelector("#successMsg")).not.toBeInTheDocument();

    fireEvent.click(container.querySelector("#submitBtn"));
    expect(text(container, "#successMsg")).toBe("Account created successfully");

    typeConfirm(container, "secret1234");
    expect(container.querySelector("#successMsg")).not.toBeInTheDocument();
  });

  test("verify_toggle_shows_and_hides_both_passwords", () => {
    const { container } = render(<App />);
    const passwordInput = () => container.querySelector("#passwordInput");
    const confirmInput = () => container.querySelector("#confirmInput");

    expect(passwordInput()).toHaveAttribute("type", "password");
    expect(confirmInput()).toHaveAttribute("type", "password");
    expect(text(container, "#toggleVisibility")).toBe("Show Passwords");

    fireEvent.click(container.querySelector("#toggleVisibility"));
    expect(passwordInput()).toHaveAttribute("type", "text");
    expect(confirmInput()).toHaveAttribute("type", "text");
    expect(text(container, "#toggleVisibility")).toBe("Hide Passwords");

    fireEvent.click(container.querySelector("#toggleVisibility"));
    expect(passwordInput()).toHaveAttribute("type", "password");
    expect(confirmInput()).toHaveAttribute("type", "password");
    expect(text(container, "#toggleVisibility")).toBe("Show Passwords");
  });

  test("verify_changing_password_after_a_match_breaks_the_match", () => {
    const { container } = render(<App />);
    fillBoth(container, "secret123");
    expect(text(container, "#matchStatus")).toBe("Passwords match");
    expect(container.querySelector("#submitBtn")).toBeEnabled();

    typePassword(container, "secret1234");
    expect(text(container, "#matchStatus")).toBe("Passwords do not match");
    expect(container.querySelector("#submitBtn")).toBeDisabled();
  });

  test("verify_clicking_create_account_while_invalid_does_nothing", () => {
    const { container } = render(<App />);
    fillBoth(container, "abcdefgh"); // matches and long enough, but has no number
    fireEvent.click(container.querySelector("#submitBtn"));
    expect(container.querySelector("#successMsg")).not.toBeInTheDocument();

    fillBoth(container, "abc1"); // matches and has a number, but too short
    fireEvent.click(container.querySelector("#submitBtn"));
    expect(container.querySelector("#successMsg")).not.toBeInTheDocument();
  });
});
