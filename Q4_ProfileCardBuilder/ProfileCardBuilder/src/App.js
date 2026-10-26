import React, { useState } from "react";

const initialForm = {
  firstName: "",
  lastName: "",
  city: "",
  openToWork: false,
};

function App() {
  // One state object holds every form field
  const [form, setForm] = useState(initialForm);

  // ONE shared handler for all fields: event.target.name tells us which field changed
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleClear = () => {
    setForm(initialForm);
  };

  // Derived values for the live preview
  const first = form.firstName.trim();
  const last = form.lastName.trim();
  const city = form.city.trim();

  const fullName = `${first} ${last}`.trim() || "Your Name";
  const initials = (first.charAt(0) + last.charAt(0)).toUpperCase() || "?";
  const filledItems = [first !== "", last !== "", city !== "", form.openToWork].filter(Boolean).length;
  const completion = filledItems * 25;

  return (
    <div className="page">
      <div className="card">
        <h1 id="title" className="title">Profile Card Builder</h1>

        <label className="field-label" htmlFor="firstName">First name</label>
        <input
          id="firstName"
          name="firstName"
          className="text-input"
          type="text"
          value={form.firstName}
          onChange={handleChange}
        />

        <label className="field-label" htmlFor="lastName">Last name</label>
        <input
          id="lastName"
          name="lastName"
          className="text-input"
          type="text"
          value={form.lastName}
          onChange={handleChange}
        />

        <label className="field-label" htmlFor="city">City</label>
        <input
          id="city"
          name="city"
          className="text-input"
          type="text"
          value={form.city}
          onChange={handleChange}
        />

        <label className="check-row" htmlFor="openToWork">
          <input
            id="openToWork"
            name="openToWork"
            type="checkbox"
            checked={form.openToWork}
            onChange={handleChange}
          />
          <span>Open to work</span>
        </label>

        <div className="profile-preview">
          <div id="initials" className="avatar">{initials}</div>
          <h2 id="fullName" className="full-name">{fullName}</h2>
          {city !== "" && <p id="location" className="location">{`Lives in ${city}`}</p>}
          {form.openToWork && <span id="workBadge" className="work-badge">Open to work</span>}
        </div>

        <p className="completion-line">
          Profile completion: <span id="completion">{completion}</span>%
        </p>

        <button id="clearBtn" className="btn btn-outline btn-block" onClick={handleClear}>Clear</button>
      </div>
    </div>
  );
}

export default App;
