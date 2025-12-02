// import React from "react";
// import { NavLink } from "react-router-dom";

// const links = [
//   { to: "/dashboard", label: "Dashboard" },
//   { to: "/explore", label: "Explore" },
//   { to: "/profile", label: "Profile" },
// ];

// export default function NavBar() {
//   return (
//     <header className="navbar">
//       <div className="navbar-brand">CultureConnect</div>
//       <nav className="navbar-links">
//         {links.map((link) => (
//           <NavLink
//             key={link.to}
//             to={link.to}
//             className={({ isActive }) =>
//               "nav-link" + (isActive ? " active" : "")
//             }
//           >
//             {link.label}
//           </NavLink>
//         ))}
//       </nav>
//     </header>
//   );
// }




import React from "react";
import { NavLink, Link } from "react-router-dom";

const mainLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/explore", label: "Explore" },
];

export default function NavBar({ authUser, onLogout }) {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="nav-brand-link">
          CultureConnect
        </Link>
      </div>

      <nav className="navbar-links">
        {mainLinks.map((link) => (
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

        {authUser ? (
          <>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                "nav-link" + (isActive ? " active" : "")
              }
            >
              {authUser.username}
            </NavLink>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ marginLeft: "0.75rem" }}
              onClick={onLogout}
            >
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
      </nav>
    </header>
  );
}
