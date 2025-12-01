// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [age, setAge] = useState("");
  const [country, setCountry] = useState("");
  const [culture, setCulture] = useState("");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setStatus("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        username,
        password,
        age: age ? Number(age) : undefined,
        country: country.trim() || undefined,
        culture: culture.trim() || undefined,
      };

      const data = await register(payload.username, payload.password, payload);

      if (!data.success) {
        setError(data.error || "Registration failed.");
      } else {
        setStatus("Registration successful. You can now log in.");
        navigate("/login");
      }
    } catch (err) {
      console.error("Register error", err);
      setError("Network or server error.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">Register</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: 360,
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}
      >
        <div className="form-row">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </div>
        <div className="form-row">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            autoComplete="new-password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-row">
          <label htmlFor="confirm">Confirm password</label>
          <input
            id="confirm"
            type="password"
            value={confirm}
            autoComplete="new-password"
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>

        <div className="form-row">
          <label htmlFor="age">Age (optional)</label>
          <input
            id="age"
            type="number"
            min="0"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>

        <div className="form-row">
          <label htmlFor="country">Country (optional)</label>
          <input
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>

        <div className="form-row">
          <label htmlFor="culture">Culture (optional)</label>
          <input
            id="culture"
            value={culture}
            onChange={(e) => setCulture(e.target.value)}
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {status && <p style={{ color: "green" }}>{status}</p>}

        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
