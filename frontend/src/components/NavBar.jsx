import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function NavBar() {
  const { pathname } = useLocation();
  const Tab = ({ to, label }) => (
    <Link className={`nav-link ${pathname === to ? "active" : ""}`} to={to}>
      {label}
    </Link>
  );
  return (
    <nav className="nav">
      <div className="grow">
        <Tab to="/hub" label="hub" />
        <Tab to="/dashboard" label="events" />
        <Tab to="/explore" label="explore" />
        <Tab to="/Info" label="profile" />
      </div>
      <Tab to="/login" label="exit/login" />
    </nav>
  );
}
