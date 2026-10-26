import React, { useState } from "react";
import CartItem from "./components/CartItem";

const PRODUCTS = [
  { id: "Notebook", name: "Notebook", price: 50 },
  { id: "Pen", name: "Pen", price: 10 },
  { id: "Bag", name: "School Bag", price: 400 },
];

const MAX_PER_ITEM = 10;
const DISCOUNT_LIMIT = 500;
const DISCOUNT_PERCENT = 10;
const emptyCart = { Notebook: 0, Pen: 0, Bag: 0 };

function App() {
  const [cart, setCart] = useState(emptyCart);
  const [orderMsg, setOrderMsg] = useState("");

  const handleAdd = (id) => {
    setCart((prev) => ({ ...prev, [id]: Math.min(prev[id] + 1, MAX_PER_ITEM) }));
    setOrderMsg("");
  };

  const handleRemove = (id) => {
    setCart((prev) => ({ ...prev, [id]: Math.max(prev[id] - 1, 0) }));
    setOrderMsg("");
  };

  const handleClear = () => {
    setCart(emptyCart);
    setOrderMsg("");
  };

  // Derived values
  const cartCount = PRODUCTS.reduce((sum, p) => sum + cart[p.id], 0);
  const cartTotal = PRODUCTS.reduce((sum, p) => sum + p.price * cart[p.id], 0);
  const hasDiscount = cartTotal >= DISCOUNT_LIMIT;
  const discount = hasDiscount ? (cartTotal * DISCOUNT_PERCENT) / 100 : 0;
  const payable = cartTotal - discount;

  const handleCheckout = () => {
    if (cartCount === 0) {
      setOrderMsg("Your cart is empty");
    } else {
      setOrderMsg(`Order placed! Amount paid: ${payable}`);
      setCart(emptyCart);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h1 id="title" className="title">Mini Shopping Cart</h1>

        {PRODUCTS.map((product) => (
          <CartItem
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            quantity={cart[product.id]}
            onAdd={() => handleAdd(product.id)}
            onRemove={() => handleRemove(product.id)}
          />
        ))}

        <div className="summary">
          <p className="summary-line">
            Items in cart: <strong id="cartCount">{cartCount}</strong>
          </p>
          <p className="summary-line">
            Cart total: <strong id="cartTotal">{cartTotal}</strong>
          </p>
          {hasDiscount && (
            <p id="discountMsg" className="msg msg-ok">{`${DISCOUNT_PERCENT}% discount applied`}</p>
          )}
          <p className="summary-line payable-line">
            Amount to pay: <strong id="payable">{payable}</strong>
          </p>
        </div>

        {orderMsg && <p id="orderMsg" className="msg msg-info">{orderMsg}</p>}

        <div className="btn-row">
          <button id="checkoutBtn" className="btn btn-primary" onClick={handleCheckout}>Checkout</button>
          <button id="clearCartBtn" className="btn btn-outline" onClick={handleClear}>Clear Cart</button>
        </div>
      </div>
    </div>
  );
}

export default App;
