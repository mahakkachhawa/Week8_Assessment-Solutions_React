import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App";

// Prices: Notebook = 50, Pen = 10, Bag = 400

const text = (container, selector) => container.querySelector(selector).textContent;

const click = (container, selector, times = 1) => {
  for (let i = 0; i < times; i++) {
    fireEvent.click(container.querySelector(selector));
  }
};

describe("Mini Shopping Cart App", () => {
  test("verify_add_button_updates_quantity_item_total_and_cart_count", () => {
    const { container } = render(<App />);
    click(container, "#addNotebook", 2);
    expect(text(container, "#qtyNotebook")).toBe("2");
    expect(text(container, "#lineTotalNotebook")).toBe("100");
    expect(text(container, "#cartCount")).toBe("2");
    expect(text(container, "#cartTotal")).toBe("100");
    expect(text(container, "#qtyPen")).toBe("0");
  });

  test("verify_remove_button_never_goes_below_zero", () => {
    const { container } = render(<App />);
    click(container, "#addNotebook", 2);
    click(container, "#removeNotebook");
    expect(text(container, "#qtyNotebook")).toBe("1");
    click(container, "#removeNotebook", 3);
    expect(text(container, "#qtyNotebook")).toBe("0");
    expect(text(container, "#cartCount")).toBe("0");
    expect(text(container, "#cartTotal")).toBe("0");
  });

  test("verify_maximum_of_ten_per_item", () => {
    const { container } = render(<App />);
    click(container, "#addPen", 12);
    expect(text(container, "#qtyPen")).toBe("10");
    expect(text(container, "#lineTotalPen")).toBe("100");
    expect(text(container, "#cartCount")).toBe("10");
  });

  test("verify_cart_total_and_count_add_up_across_items", () => {
    const { container } = render(<App />);
    click(container, "#addNotebook", 2); // 100
    click(container, "#addPen", 3); // 30
    click(container, "#addBag", 1); // 400
    expect(text(container, "#cartCount")).toBe("6");
    expect(text(container, "#cartTotal")).toBe("530");
  });

  test("verify_discount_starts_exactly_at_500", () => {
    const { container } = render(<App />);
    click(container, "#addBag"); // 400
    click(container, "#addPen", 9); // 490
    expect(text(container, "#cartTotal")).toBe("490");
    expect(container.querySelector("#discountMsg")).not.toBeInTheDocument();
    expect(text(container, "#payable")).toBe("490");

    click(container, "#addPen"); // 500
    expect(text(container, "#cartTotal")).toBe("500");
    expect(text(container, "#discountMsg")).toBe("10% discount applied");
    expect(text(container, "#payable")).toBe("450");
  });

  test("verify_discount_is_removed_when_total_drops_below_500", () => {
    const { container } = render(<App />);
    click(container, "#addBag");
    click(container, "#addPen", 10); // 500
    expect(text(container, "#payable")).toBe("450");

    click(container, "#removePen"); // 490
    expect(container.querySelector("#discountMsg")).not.toBeInTheDocument();
    expect(text(container, "#payable")).toBe("490");
  });

  test("verify_clear_cart_resets_everything", () => {
    const { container } = render(<App />);
    click(container, "#addBag");
    click(container, "#addNotebook", 3);
    click(container, "#clearCartBtn");
    expect(text(container, "#qtyBag")).toBe("0");
    expect(text(container, "#qtyNotebook")).toBe("0");
    expect(text(container, "#cartCount")).toBe("0");
    expect(text(container, "#cartTotal")).toBe("0");
    expect(text(container, "#payable")).toBe("0");
  });

  test("verify_checkout_with_empty_cart_shows_message", () => {
    const { container } = render(<App />);
    expect(container.querySelector("#orderMsg")).not.toBeInTheDocument();
    click(container, "#checkoutBtn");
    expect(text(container, "#orderMsg")).toBe("Your cart is empty");
  });

  test("verify_checkout_shows_amount_paid_and_empties_the_cart", () => {
    const { container } = render(<App />);
    click(container, "#addNotebook"); // 50, no discount
    click(container, "#checkoutBtn");
    expect(text(container, "#orderMsg")).toBe("Order placed! Amount paid: 50");
    expect(text(container, "#cartCount")).toBe("0");
    expect(text(container, "#qtyNotebook")).toBe("0");

    click(container, "#addBag");
    click(container, "#addNotebook", 2); // 500 -> discounted to 450
    click(container, "#checkoutBtn");
    expect(text(container, "#orderMsg")).toBe("Order placed! Amount paid: 450");
    expect(text(container, "#cartTotal")).toBe("0");
  });

  test("verify_changing_the_cart_hides_the_order_message", () => {
    const { container } = render(<App />);
    click(container, "#checkoutBtn");
    expect(container.querySelector("#orderMsg")).toBeInTheDocument();
    click(container, "#addPen");
    expect(container.querySelector("#orderMsg")).not.toBeInTheDocument();

    click(container, "#checkoutBtn");
    expect(container.querySelector("#orderMsg")).toBeInTheDocument();
    click(container, "#clearCartBtn");
    expect(container.querySelector("#orderMsg")).not.toBeInTheDocument();
  });
});
