import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App";
import StarRating from "../components/StarRating";
import SignupForm from "../components/SignupForm";

const text = (container, selector) => container.querySelector(selector).textContent;

const type = (container, selector, value) => {
  fireEvent.change(container.querySelector(selector), { target: { value } });
};

const click = (container, selector) => {
  fireEvent.click(container.querySelector(selector));
};

const fillValid = (container) => {
  type(container, "#usernameInput", "  Asha  ");
  type(container, "#emailInput", "asha@example.com");
  type(container, "#passwordInput", "secret123");
  type(container, "#roleSelect", "mentor");
  click(container, "#agreeCheckbox");
};

const submit = (container) => click(container, "#submitBtn");

describe("Club Registration App", () => {
  test("verify_heading_labels_and_initial_values", () => {
    const { container } = render(<App />);
    expect(container.querySelector("h1#title")).toHaveTextContent("Club Registration");
    expect(container.querySelector("p#functionalLabel")).toHaveTextContent(
      "Functional Component (useState)"
    );
    expect(container.querySelector("p#classLabel")).toHaveTextContent(
      "Class Component (this.state)"
    );

    expect(container.querySelector("#usernameInput").value).toBe("");
    expect(container.querySelector("#emailInput").value).toBe("");
    expect(container.querySelector("#passwordInput").value).toBe("");
    expect(container.querySelector("#passwordInput").type).toBe("password");
    expect(container.querySelector("#roleSelect").value).toBe("student");
    expect(container.querySelector("#agreeCheckbox").checked).toBe(false);
    expect(container.querySelector("button#submitBtn").textContent.trim()).toBe("Register");
    expect(container.querySelector("button#resetFormBtn").textContent.trim()).toBe("Reset");
    expect(container.querySelector("#strength")).not.toBeInTheDocument();
    expect(container.querySelector("#usernameError")).not.toBeInTheDocument();
    expect(container.querySelector("#emailError")).not.toBeInTheDocument();
    expect(container.querySelector("#passwordError")).not.toBeInTheDocument();
    expect(container.querySelector("#agreeError")).not.toBeInTheDocument();
    expect(container.querySelector("#successMessage")).not.toBeInTheDocument();

    expect(text(container, "#ratingText")).toBe("You rated: 0 / 5");
    expect(container.querySelector("#ratingError")).not.toBeInTheDocument();
    expect(container.querySelector("#thanksMessage")).not.toBeInTheDocument();
  });

  test("verify_text_fields_select_and_checkbox_are_controlled_inputs", () => {
    const { container } = render(<App />);
    type(container, "#usernameInput", "Asha");
    type(container, "#emailInput", "asha@example.com");
    type(container, "#passwordInput", "secret");
    expect(container.querySelector("#usernameInput").value).toBe("Asha");
    expect(container.querySelector("#emailInput").value).toBe("asha@example.com");
    expect(container.querySelector("#passwordInput").value).toBe("secret");

    type(container, "#roleSelect", "volunteer");
    expect(container.querySelector("#roleSelect").value).toBe("volunteer");

    click(container, "#agreeCheckbox");
    expect(container.querySelector("#agreeCheckbox").checked).toBe(true);
    click(container, "#agreeCheckbox");
    expect(container.querySelector("#agreeCheckbox").checked).toBe(false);

    // Changing one field must not change the others
    expect(container.querySelector("#usernameInput").value).toBe("Asha");
    expect(container.querySelector("#roleSelect").value).toBe("volunteer");
  });

  test("verify_show_and_hide_password_toggle", () => {
    const { container } = render(<App />);
    type(container, "#passwordInput", "secret123");
    expect(container.querySelector("#togglePasswordBtn").textContent.trim()).toBe("Show");
    expect(container.querySelector("#passwordInput").type).toBe("password");

    click(container, "#togglePasswordBtn");
    expect(container.querySelector("#togglePasswordBtn").textContent.trim()).toBe("Hide");
    expect(container.querySelector("#passwordInput").type).toBe("text");
    expect(container.querySelector("#passwordInput").value).toBe("secret123");

    click(container, "#togglePasswordBtn");
    expect(container.querySelector("#togglePasswordBtn").textContent.trim()).toBe("Show");
    expect(container.querySelector("#passwordInput").type).toBe("password");
  });

  test("verify_password_strength_label_changes_with_length", () => {
    const { container } = render(<App />);

    type(container, "#passwordInput", "abc");
    expect(container.querySelector("p#strength").textContent).toBe("Password strength: Weak");

    type(container, "#passwordInput", "abcdef");
    expect(text(container, "#strength")).toBe("Password strength: Medium");

    type(container, "#passwordInput", "abcdefghi");
    expect(text(container, "#strength")).toBe("Password strength: Medium");

    type(container, "#passwordInput", "abcdefghij");
    expect(text(container, "#strength")).toBe("Password strength: Strong");

    type(container, "#passwordInput", "");
    expect(container.querySelector("#strength")).not.toBeInTheDocument();
  });

  test("verify_submitting_empty_form_shows_all_validation_errors", () => {
    const { container } = render(<App />);
    submit(container);
    expect(container.querySelector("p#usernameError").textContent).toBe("Username is required");
    expect(container.querySelector("p#emailError").textContent).toBe("Enter a valid email");
    expect(container.querySelector("p#passwordError").textContent).toBe(
      "Password must be at least 6 characters"
    );
    expect(container.querySelector("p#agreeError").textContent).toBe(
      "You must accept the terms"
    );
    expect(container.querySelector("#successMessage")).not.toBeInTheDocument();

    // A whitespace-only username is still invalid
    type(container, "#usernameInput", "     ");
    submit(container);
    expect(text(container, "#usernameError")).toBe("Username is required");
  });

  test("verify_only_the_remaining_invalid_fields_show_errors", () => {
    const { container } = render(<App />);
    type(container, "#usernameInput", "Asha");
    type(container, "#emailInput", "asha");
    type(container, "#passwordInput", "abcdef");
    submit(container);
    expect(container.querySelector("#usernameError")).not.toBeInTheDocument();
    expect(text(container, "#emailError")).toBe("Enter a valid email");
    expect(container.querySelector("#passwordError")).not.toBeInTheDocument();
    expect(text(container, "#agreeError")).toBe("You must accept the terms");

    type(container, "#emailInput", "asha@example.com");
    submit(container);
    expect(container.querySelector("#emailError")).not.toBeInTheDocument();
    expect(text(container, "#agreeError")).toBe("You must accept the terms");
    expect(container.querySelector("#successMessage")).not.toBeInTheDocument();

    type(container, "#passwordInput", "abc");
    submit(container);
    expect(text(container, "#passwordError")).toBe("Password must be at least 6 characters");
  });

  test("verify_valid_submit_shows_success_and_clears_the_form", () => {
    const { container } = render(<App />);
    fillValid(container);
    submit(container);

    expect(container.querySelector("p#successMessage").textContent).toBe(
      "Registered: Asha (mentor)"
    );
    expect(container.querySelector("#usernameInput").value).toBe("");
    expect(container.querySelector("#emailInput").value).toBe("");
    expect(container.querySelector("#passwordInput").value).toBe("");
    expect(container.querySelector("#roleSelect").value).toBe("student");
    expect(container.querySelector("#agreeCheckbox").checked).toBe(false);
    expect(container.querySelector("#strength")).not.toBeInTheDocument();
    expect(container.querySelector("#usernameError")).not.toBeInTheDocument();
    expect(container.querySelector("#agreeError")).not.toBeInTheDocument();

    // A later invalid submit hides the success message
    submit(container);
    expect(container.querySelector("#successMessage")).not.toBeInTheDocument();
    expect(container.querySelector("#usernameError")).toBeInTheDocument();
  });

  test("verify_reset_button_clears_values_errors_and_success_message", () => {
    const { container } = render(<App />);
    type(container, "#usernameInput", "Asha");
    type(container, "#roleSelect", "volunteer");
    click(container, "#togglePasswordBtn");
    submit(container);
    expect(container.querySelector("#emailError")).toBeInTheDocument();

    click(container, "#resetFormBtn");
    expect(container.querySelector("#usernameInput").value).toBe("");
    expect(container.querySelector("#roleSelect").value).toBe("student");
    expect(container.querySelector("#passwordInput").type).toBe("password");
    expect(container.querySelector("#emailError")).not.toBeInTheDocument();
    expect(container.querySelector("#passwordError")).not.toBeInTheDocument();
    expect(container.querySelector("#agreeError")).not.toBeInTheDocument();

    fillValid(container);
    submit(container);
    expect(container.querySelector("#successMessage")).toBeInTheDocument();
    click(container, "#resetFormBtn");
    expect(container.querySelector("#successMessage")).not.toBeInTheDocument();
  });

  test("verify_star_rating_is_a_class_component_and_stars_set_the_rating", () => {
    // Class components extend React.Component, so they carry isReactComponent
    expect(StarRating.prototype && StarRating.prototype.isReactComponent).toBeTruthy();
    expect(SignupForm.prototype && SignupForm.prototype.isReactComponent).toBeFalsy();

    const { container } = render(<App />);
    expect(container.querySelectorAll("button[id^='star']").length).toBe(5);

    click(container, "#star4");
    expect(container.querySelector("p#ratingText").textContent).toBe("You rated: 4 / 5");

    click(container, "#star2");
    expect(text(container, "#ratingText")).toBe("You rated: 2 / 5");

    click(container, "#star5");
    expect(text(container, "#ratingText")).toBe("You rated: 5 / 5");
  });

  test("verify_rating_submit_error_thanks_message_and_clear", () => {
    const { container } = render(<App />);

    // No rating selected -> error
    click(container, "#submitRatingBtn");
    expect(container.querySelector("p#ratingError").textContent).toBe(
      "Please select a rating"
    );
    expect(container.querySelector("#thanksMessage")).not.toBeInTheDocument();

    // Selecting a star removes the error; submitting shows the thanks message
    click(container, "#star3");
    expect(container.querySelector("#ratingError")).not.toBeInTheDocument();
    click(container, "#submitRatingBtn");
    expect(container.querySelector("p#thanksMessage").textContent).toBe(
      "Thanks for rating 3 stars!"
    );

    // Choosing another star hides the old thanks message; singular for 1 star
    click(container, "#star1");
    expect(container.querySelector("#thanksMessage")).not.toBeInTheDocument();
    click(container, "#submitRatingBtn");
    expect(text(container, "#thanksMessage")).toBe("Thanks for rating 1 star!");

    // Clear resets everything
    click(container, "#clearRatingBtn");
    expect(text(container, "#ratingText")).toBe("You rated: 0 / 5");
    expect(container.querySelector("#thanksMessage")).not.toBeInTheDocument();
    expect(container.querySelector("#ratingError")).not.toBeInTheDocument();
  });
});