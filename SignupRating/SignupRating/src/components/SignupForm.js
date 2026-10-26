import React, { useState } from "react";

const INITIAL_FORM = {
  username: "",
  email: "",
  password: "",
  role: "student",
  agree: false,
};

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

// Derived from the password length (not stored in state)
const getStrength = (password) => {
  if (password.length >= 10) return "Strong";
  if (password.length >= 6) return "Medium";
  return "Weak";
};

// FUNCTIONAL COMPONENT: state is managed with the useState hook
function SignupForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // One handler for every field: uses event.target.name, value, type and checked
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const validate = () => {
    const newErrors = {};
    if (form.username.trim() === "") {
      newErrors.username = "Username is required";
    }
    if (!EMAIL_PATTERN.test(form.email.trim())) {
      newErrors.email = "Enter a valid email";
    }
    if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!form.agree) {
      newErrors.agree = "You must accept the terms";
    }
    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSuccess("");
      return;
    }

    setErrors({});
    setSuccess(`Registered: ${form.username.trim()} (${form.role})`);
    setForm(INITIAL_FORM);
    setShowPassword(false);
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setSuccess("");
    setShowPassword(false);
  };

  const strength = getStrength(form.password);

  return (
    <section className="section">
      <p id="functionalLabel" className="badge badge-functional">
        Functional Component (useState)
      </p>

      <form noValidate onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="usernameInput">Username</label>
          <input
            id="usernameInput"
            className="text-input"
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
          />
          {errors.username && (
            <p id="usernameError" className="message message-error">{errors.username}</p>
          )}
        </div>

        <div className="field">
          <label htmlFor="emailInput">Email</label>
          <input
            id="emailInput"
            className="text-input"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p id="emailError" className="message message-error">{errors.email}</p>
          )}
        </div>

        <div className="field">
          <label htmlFor="passwordInput">Password</label>
          <div className="password-row">
            <input
              id="passwordInput"
              className="text-input"
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
            />
            <button
              id="togglePasswordBtn"
              type="button"
              className="secondary-btn"
              onClick={handleTogglePassword}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {form.password !== "" && (
            <p id="strength" className={`strength strength-${strength.toLowerCase()}`}>
              {`Password strength: ${strength}`}
            </p>
          )}
          {errors.password && (
            <p id="passwordError" className="message message-error">{errors.password}</p>
          )}
        </div>

        <div className="field">
          <label htmlFor="roleSelect">Role</label>
          <select
            id="roleSelect"
            className="text-input"
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="student">student</option>
            <option value="mentor">mentor</option>
            <option value="volunteer">volunteer</option>
          </select>
        </div>

        <div className="field checkbox-row">
          <input
            id="agreeCheckbox"
            type="checkbox"
            name="agree"
            checked={form.agree}
            onChange={handleChange}
          />
          <label htmlFor="agreeCheckbox">I accept the terms</label>
        </div>
        {errors.agree && (
          <p id="agreeError" className="message message-error">{errors.agree}</p>
        )}

        <div className="button-row">
          <button id="submitBtn" type="submit" className="primary-btn">Register</button>
          <button id="resetFormBtn" type="button" className="secondary-btn" onClick={handleReset}>
            Reset
          </button>
        </div>
      </form>

      {success && <p id="successMessage" className="message message-ok">{success}</p>}
    </section>
  );
}

export default SignupForm;