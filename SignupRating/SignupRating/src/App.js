import React from "react";
import SignupForm from "./components/SignupForm";
import StarRating from "./components/StarRating";

function App() {
  return (
    <div className="page">
      <div className="card">
        <h1 id="title" className="card-title">Club Registration</h1>
        <SignupForm />
        <StarRating />
      </div>
    </div>
  );
}

export default App;