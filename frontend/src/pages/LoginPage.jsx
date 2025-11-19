import React, { useState } from "react";
import { apiPost } from "../api.js";

export default function LoginPage() {
  const [mode, setMode] = useState("login"); // "login" or "register"
  const [form, setForm] = useState({ username: "", password: "" });
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setError("");

    const payload = {
      username: form.username.trim(),
      password: form.password,
    };

    if (!payload.username || !payload.password) {
      setError("Username and password are required.");
      return;
    }

    try {
      if (mode === "register") {
        const data = await apiPost("/auth/register", payload);
        if (data.success) {
          setStatus("Registration successful. You can now log in.");
          setMode("login");
        } else {
          setError(data.error || "Registration failed.");
        }
      } else {
        const data = await apiPost("/auth/login", payload);
        if (data.success) {
          setStatus(`Login successful. Welcome, ${data.user.username}.`);
          // Simple client-side session: store user in localStorage
          localStorage.setItem(
            "authUser",
            JSON.stringify({ id: data.user.id, username: data.user.username })
          );
        } else {
          setError(data.error || "Login failed.");
        }
      }
    } catch (err) {
      console.error("Auth request failed", err);
      setError("Network or server error.");
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">
        {mode === "login" ? "Login" : "Register"}
      </h1>

      <p style={{ fontSize: "0.9rem", color: "#4b5563" }}>
        This page talks directly to{" "}
        <code>/api/auth/login</code> and <code>/api/auth/register</code>{" "}
        on the Django backend.
      </p>

      <form onSubmit={handleSubmit} style={{ maxWidth: 320, marginTop: "1rem" }}>
        <div className="form-row">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            autoComplete="username"
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
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
          <small style={{ color: "#6b7280", marginTop: "0.25rem" }}>
            Password must be at least 6 characters.
          </small>
        </div>

        <button className="btn btn-primary" type="submit">
          {mode === "login" ? "Login" : "Register"}
        </button>
      </form>

      {error && (
        <p style={{ color: "red", marginTop: "0.75rem" }}>
          {error}
        </p>
      )}
      {status && (
        <p style={{ color: "green", marginTop: "0.75rem" }}>
          {status}
        </p>
      )}

      <div style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
        {mode === "login" ? (
          <>
            <span>Don&apos;t have an account? </span>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setMode("register");
                setStatus("");
                setError("");
              }}
            >
              Register
            </button>
          </>
        ) : (
          <>
            <span>Already registered? </span>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setMode("login");
                setStatus("");
                setError("");
              }}
            >
              Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
