import React from "react";
import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <main className="center">
      <h1>cultural event finder</h1>
      <div className="panel">
        <input placeholder="login" />
        <input placeholder="password" type="password" />
        <Link className="btn" to="/hub">done</Link>
        <button className="btn" type="button">register</button>
      </div>
    </main>
  );
}
