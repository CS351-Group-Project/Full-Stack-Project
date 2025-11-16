import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

export default function LoginPage() {
  return (
    <main className="page-container bg-main">
      <div className="content-box" style={{ maxWidth: "420px", textAlign: "center" }}>
        
        {/* TITLE */}
        <h1 className="page-title" style={{ marginBottom: "1rem" }}>
          Cultural Event Finder
        </h1>

        {/* LOGIN PANEL */}
        <div className="panel" style={{ gap: "1rem" }}>
          <input
            className="input"
            placeholder="Login"
            style={{ padding: "12px" }}
          />
          
          <input
            className="input"
            placeholder="Password"
            type="password"
            style={{ padding: "12px" }}
          />

          <Link className="btn" to="/hub">
            Login
          </Link>

          <button className="btn" type="button">
            Register
          </button>
        </div>
      </div>
    </main>
  );
}
