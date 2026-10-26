import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App";

const text = (container, selector) => container.querySelector(selector).textContent;

const click = (container, selector) => {
  fireEvent.click(container.querySelector(selector));
};

const typeName = (container, value) => {
  fireEvent.change(container.querySelector("#nameInput"), { target: { value } });
};

const typeEmail = (container, value) => {
  fireEvent.change(container.querySelector("#emailInput"), { target: { value } });
};

// Helpers that move the wizard forward with valid data
const goToStep2 = (container, name = "Asha") => {
  typeName(container, name);
  click(container, "#nextBtn");
};

const goToStep3 = (container, name = "Asha", email = "asha@example.com") => {
  goToStep2(container, name);
  typeEmail(container, email);
  click(container, "#nextBtn");
};

describe("Registration Wizard App", () => {
  test("verify_empty_name_shows_error_and_stays_on_step_one", () => {
    const { container } = render(<App />);
    expect(text(container, "#stepIndicator")).toBe("Step 1 of 3");
    click(container, "#nextBtn");
    expect(text(container, "#stepError")).toBe("Name is required");
    expect(text(container, "#stepIndicator")).toBe("Step 1 of 3");
    expect(container.querySelector("#nameInput")).toBeInTheDocument();
  });

  test("verify_spaces_only_name_is_rejected", () => {
    const { container } = render(<App />);
    typeName(container, "     ");
    click(container, "#nextBtn");
    expect(text(container, "#stepError")).toBe("Name is required");
    expect(text(container, "#stepIndicator")).toBe("Step 1 of 3");
  });

  test("verify_valid_name_moves_to_step_two", () => {
    const { container } = render(<App />);
    goToStep2(container);
    expect(text(container, "#stepIndicator")).toBe("Step 2 of 3");
    expect(container.querySelector("#nameInput")).not.toBeInTheDocument();
    expect(container.querySelector("#emailInput")).toBeInTheDocument();
    expect(container.querySelector("#stepError")).not.toBeInTheDocument();
  });

  test("verify_email_without_at_sign_shows_error_and_stays_on_step_two", () => {
    const { container } = render(<App />);
    goToStep2(container);
    typeEmail(container, "asha.example.com");
    click(container, "#nextBtn");
    expect(text(container, "#stepError")).toBe("Enter a valid email");
    expect(text(container, "#stepIndicator")).toBe("Step 2 of 3");
  });

  test("verify_valid_email_moves_to_review_step", () => {
    const { container } = render(<App />);
    goToStep3(container, "  Asha Kumar ", " asha@example.com ");
    expect(text(container, "#stepIndicator")).toBe("Step 3 of 3");
    expect(text(container, "#reviewName")).toBe("Name: Asha Kumar");
    expect(text(container, "#reviewEmail")).toBe("Email: asha@example.com");
    expect(container.querySelector("#submitBtn")).toBeInTheDocument();
    expect(container.querySelector("#nextBtn")).not.toBeInTheDocument();
  });

  test("verify_back_button_is_hidden_only_on_the_first_step", () => {
    const { container } = render(<App />);
    expect(container.querySelector("#backBtn")).not.toBeInTheDocument();
    goToStep2(container);
    expect(container.querySelector("#backBtn")).toBeInTheDocument();
    typeEmail(container, "asha@example.com");
    click(container, "#nextBtn");
    expect(container.querySelector("#backBtn")).toBeInTheDocument();
  });

  test("verify_back_keeps_the_entered_values", () => {
    const { container } = render(<App />);
    goToStep3(container, "Asha", "asha@example.com");

    click(container, "#backBtn");
    expect(text(container, "#stepIndicator")).toBe("Step 2 of 3");
    expect(container.querySelector("#emailInput").value).toBe("asha@example.com");

    click(container, "#backBtn");
    expect(text(container, "#stepIndicator")).toBe("Step 1 of 3");
    expect(container.querySelector("#nameInput").value).toBe("Asha");
  });

  test("verify_typing_clears_the_error_message", () => {
    const { container } = render(<App />);
    click(container, "#nextBtn");
    expect(container.querySelector("#stepError")).toBeInTheDocument();
    typeName(container, "A");
    expect(container.querySelector("#stepError")).not.toBeInTheDocument();

    typeName(container, "Asha");
    click(container, "#nextBtn");
    typeEmail(container, "wrong");
    click(container, "#nextBtn");
    expect(container.querySelector("#stepError")).toBeInTheDocument();
    typeEmail(container, "wrong@");
    expect(container.querySelector("#stepError")).not.toBeInTheDocument();
  });

  test("verify_submit_shows_success_message_and_hides_the_wizard", () => {
    const { container } = render(<App />);
    goToStep3(container, "Asha Kumar", "asha@example.com");
    click(container, "#submitBtn");
    expect(text(container, "#successMsg")).toBe("Registration complete for Asha Kumar!");
    expect(container.querySelector("#stepIndicator")).not.toBeInTheDocument();
    expect(container.querySelector("#submitBtn")).not.toBeInTheDocument();
    expect(container.querySelector("#backBtn")).not.toBeInTheDocument();
    expect(container.querySelector("#reviewName")).not.toBeInTheDocument();
  });

  test("verify_start_over_resets_the_whole_wizard", () => {
    const { container } = render(<App />);
    goToStep3(container, "Asha", "asha@example.com");
    click(container, "#submitBtn");
    click(container, "#restartBtn");

    expect(container.querySelector("#successMsg")).not.toBeInTheDocument();
    expect(text(container, "#stepIndicator")).toBe("Step 1 of 3");
    expect(container.querySelector("#nameInput").value).toBe("");

    goToStep2(container, "Ravi");
    expect(container.querySelector("#emailInput").value).toBe("");
  });
});
