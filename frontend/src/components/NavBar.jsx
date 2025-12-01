// src/components/NavBar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const baseLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/explore", label: "Explore" },
];

export default function NavBar({ currentUser, setCurrentUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    setCurrentUser(null);
    navigate("/login");
  };

  const links = currentUser
    ? [...baseLinks, { to: "/profile", label: "Profile" }]
    : baseLinks;

  return (
    <header className="navbar">
      <div className="navbar-brand">CultureConnect</div>
      <nav className="navbar-links">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              "nav-link" + (isActive ? " active" : "")
            }
          >
            {link.label}
          </NavLink>
        ))}

        <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem" }}>
          {currentUser ? (
            <>
              <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                Signed in as <strong>{currentUser.username}</strong>
              </span>
              <button className="btn btn-secondary" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
