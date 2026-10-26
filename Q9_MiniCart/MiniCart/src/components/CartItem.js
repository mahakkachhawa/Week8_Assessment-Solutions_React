import React from "react";

// Presentational component: it only shows the data it receives through props.
// The cart state itself lives in App.js.
function CartItem({ id, name, price, quantity, onAdd, onRemove }) {
  return (
    <div className="cart-item">
      <div className="item-info">
        <span className="item-name">{name}</span>
        <span className="item-price">Price: {price}</span>
      </div>

      <div className="item-controls">
        <button id={`remove${id}`} className="round-btn" onClick={onRemove}>-</button>
        <span id={`qty${id}`} className="item-qty">{quantity}</span>
        <button id={`add${id}`} className="round-btn" onClick={onAdd}>+</button>
      </div>

      <p className="line-total">
        Item total: <span id={`lineTotal${id}`}>{price * quantity}</span>
      </p>
    </div>
  );
}

export default CartItem;
