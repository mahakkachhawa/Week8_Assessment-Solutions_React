import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App";

const text = (container, selector) => container.querySelector(selector).textContent;

const typeInto = (container, selector, value) => {
  fireEvent.change(container.querySelector(selector), { target: { value } });
};

const toggleWork = (container) => {
  fireEvent.click(container.querySelector("#openToWork"));
};

describe("Profile Card Builder App", () => {
  test("verify_full_name_updates_from_first_and_last_name", () => {
    const { container } = render(<App />);
    typeInto(container, "#firstName", "Asha");
    typeInto(container, "#lastName", "Kumar");
    expect(text(container, "#fullName")).toBe("Asha Kumar");
  });

  test("verify_default_name_and_single_name_cases", () => {
    const { container } = render(<App />);
    expect(text(container, "#fullName")).toBe("Your Name");

    typeInto(container, "#firstName", "Asha");
    expect(text(container, "#fullName")).toBe("Asha");

    typeInto(container, "#firstName", "");
    typeInto(container, "#lastName", "Kumar");
    expect(text(container, "#fullName")).toBe("Kumar");
  });

  test("verify_initials_are_uppercase_letters_of_both_names", () => {
    const { container } = render(<App />);
    expect(text(container, "#initials")).toBe("?");

    typeInto(container, "#firstName", "asha");
    expect(text(container, "#initials")).toBe("A");

    typeInto(container, "#lastName", "kumar");
    expect(text(container, "#initials")).toBe("AK");
  });

  test("verify_location_is_shown_only_when_city_has_text", () => {
    const { container } = render(<App />);
    expect(container.querySelector("#location")).not.toBeInTheDocument();

    typeInto(container, "#city", "Chennai");
    expect(text(container, "#location")).toBe("Lives in Chennai");

    typeInto(container, "#city", "   ");
    expect(container.querySelector("#location")).not.toBeInTheDocument();

    typeInto(container, "#city", "Salem");
    typeInto(container, "#city", "");
    expect(container.querySelector("#location")).not.toBeInTheDocument();
  });

  test("verify_open_to_work_badge_follows_the_checkbox", () => {
    const { container } = render(<App />);
    expect(container.querySelector("#workBadge")).not.toBeInTheDocument();

    toggleWork(container);
    expect(container.querySelector("#openToWork").checked).toBe(true);
    expect(text(container, "#workBadge")).toBe("Open to work");

    toggleWork(container);
    expect(container.querySelector("#openToWork").checked).toBe(false);
    expect(container.querySelector("#workBadge")).not.toBeInTheDocument();
  });

  test("verify_completion_percentage_grows_with_each_filled_item", () => {
    const { container } = render(<App />);
    expect(text(container, "#completion")).toBe("0");

    typeInto(container, "#firstName", "Asha");
    expect(text(container, "#completion")).toBe("25");

    typeInto(container, "#lastName", "Kumar");
    expect(text(container, "#completion")).toBe("50");

    typeInto(container, "#city", "Chennai");
    expect(text(container, "#completion")).toBe("75");

    toggleWork(container);
    expect(text(container, "#completion")).toBe("100");
  });

  test("verify_spaces_only_fields_do_not_count_as_filled", () => {
    const { container } = render(<App />);
    typeInto(container, "#firstName", "   ");
    typeInto(container, "#lastName", "  ");
    typeInto(container, "#city", "    ");
    expect(text(container, "#completion")).toBe("0");
    expect(text(container, "#fullName")).toBe("Your Name");
    expect(text(container, "#initials")).toBe("?");
    expect(container.querySelector("#location")).not.toBeInTheDocument();
  });

  test("verify_changing_one_field_keeps_the_other_fields", () => {
    const { container } = render(<App />);
    typeInto(container, "#firstName", "Asha");
    typeInto(container, "#lastName", "Kumar");
    typeInto(container, "#city", "Chennai");
    toggleWork(container);

    typeInto(container, "#firstName", "Meena");
    expect(container.querySelector("#lastName").value).toBe("Kumar");
    expect(container.querySelector("#city").value).toBe("Chennai");
    expect(container.querySelector("#openToWork").checked).toBe(true);
    expect(text(container, "#fullName")).toBe("Meena Kumar");
  });

  test("verify_clear_resets_every_field_and_the_preview", () => {
    const { container } = render(<App />);
    typeInto(container, "#firstName", "Asha");
    typeInto(container, "#lastName", "Kumar");
    typeInto(container, "#city", "Chennai");
    toggleWork(container);

    fireEvent.click(container.querySelector("#clearBtn"));
    expect(container.querySelector("#firstName").value).toBe("");
    expect(container.querySelector("#lastName").value).toBe("");
    expect(container.querySelector("#city").value).toBe("");
    expect(container.querySelector("#openToWork").checked).toBe(false);
    expect(text(container, "#fullName")).toBe("Your Name");
    expect(text(container, "#completion")).toBe("0");
    expect(container.querySelector("#location")).not.toBeInTheDocument();
    expect(container.querySelector("#workBadge")).not.toBeInTheDocument();
  });

  test("verify_unchecking_open_to_work_reduces_completion", () => {
    const { container } = render(<App />);
    typeInto(container, "#firstName", "Asha");
    typeInto(container, "#lastName", "Kumar");
    typeInto(container, "#city", "Chennai");
    toggleWork(container);
    expect(text(container, "#completion")).toBe("100");

    toggleWork(container);
    expect(text(container, "#completion")).toBe("75");
  });
});
