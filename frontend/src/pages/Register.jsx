// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiRegister } from "../api";

export default function Register({ onRegister }) {
  const [form, setForm] = useState({
    username: "",
    password: "",
    age: "",
    country: "",
    culture: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    const payload = {
      username: form.username.trim(),
      password: form.password,
      age: form.age ? Number(form.age) : undefined,
      country: form.country.trim() || undefined,
      culture: form.culture.trim() || undefined,
    };
  
    try {
      const data = await apiRegister(payload); // uses apiPost("/auth/register", ...)
  
      if (!data.success) {
        // This will now show the backend error (400) instead of generic “network error”
        setError(data.error || "Registration failed.");
        return;
      }
  
      // On success, backend returns: { success: true, user: {...}, message: ... }
      onRegister(data.user);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Network or server error.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="page">
      <h1 className="page-title">Register</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: 360 }}>
        <div className="form-row">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label htmlFor="age">Age (optional)</label>
          <input
            id="age"
            name="age"
            type="number"
            min="0"
            value={form.age}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label htmlFor="country">Country (optional)</label>
          <input
            id="country"
            name="country"
            value={form.country}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label htmlFor="culture">Culture (optional)</label>
          <input
            id="culture"
            name="culture"
            value={form.culture}
            onChange={handleChange}
          />
        </div>

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        {error && (
          <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>
        )}

        <p style={{ marginTop: "0.75rem", fontSize: "0.9rem" }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
