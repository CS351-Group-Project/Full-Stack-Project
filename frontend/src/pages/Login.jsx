// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiLogin } from "../api";

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
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
    try {
      const data = await apiLogin(form.username, form.password);
      if (!data.success) {
        setError(data.error || "Login failed.");
      } else {
        // data.user is { id, username, profile: {...} }
        onLogin(data.user);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError("Network or server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">Login</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: 320 }}>
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

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && (
          <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>
        )}

        <p style={{ marginTop: "0.75rem", fontSize: "0.9rem" }}>
          No account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}
