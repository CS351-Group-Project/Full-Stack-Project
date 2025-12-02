// // import React from "react";
// // import { Routes, Route, Navigate } from "react-router-dom";
// // import NavBar from "./components/NavBar";

// // import Dashboard from "./pages/Dashboard";
// // import Explore from "./pages/Explore";
// // import Profile from "./pages/Profile";


// // export const API_URL = "http://127.0.0.1:8000/api";

// // function App() {
// //   return (
// //     <div className="app-root">
// //       <NavBar />
// //       <div className="app-main">
// //         <Routes>
// //           <Route path="/" element={<Navigate to="/dashboard" replace />} />
// //           <Route path="/dashboard" element={<Dashboard />} />
// //           <Route path="/explore" element={<Explore />} />
// //           <Route path="/profile" element={<Profile />} />
         
// //         </Routes>
// //       </div>
// //     </div>
// //   );
// // }

// // export default App;



// // src/App.js
// import React, { useState, useEffect } from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import NavBar from "./components/NavBar";

// import Dashboard from "./pages/Dashboard";
// import Explore from "./pages/Explore";
// import Profile from "./pages/Profile";
// import Login from "./pages/Login";
// import Register from "./pages/Register";

// export const API_URL = "http://127.0.0.1:8000/api";

// function App() {
//   const [authUser, setAuthUser] = useState(null);

//   useEffect(() => {
//     const stored = localStorage.getItem("authUser");
//     if (stored) {
//       try {
//         setAuthUser(JSON.parse(stored));
//       } catch {
//         // ignore
//       }
//     }
//   }, []);

//   const handleLogin = (user) => {
//     setAuthUser(user);
//     localStorage.setItem("authUser", JSON.stringify(user));
//   };

//   const handleLogout = () => {
//     setAuthUser(null);
//     localStorage.removeItem("authUser");
//   };

//   const RequireAuth = ({ children }) => {
//     if (!authUser) {
//       return <Navigate to="/login" replace />;
//     }
//     return children;
//   };

//   return (
//     <div className="app-root">
//       <NavBar authUser={authUser} onLogout={handleLogout} />
//       <div className="app-main">
//         <Routes>
//           <Route path="/" element={<Navigate to="/dashboard" replace />} />

//           <Route
//             path="/dashboard"
//             element={
//               <RequireAuth>
//                 <Dashboard authUser={authUser} />
//               </RequireAuth>
//             }
//           />

//           <Route
//             path="/profile"
//             element={
//               <RequireAuth>
//                 <Profile authUser={authUser} />
//               </RequireAuth>
//             }
//           />

//           <Route
//             path="/explore"
//             element={
//               <RequireAuth>
//                 <Explore />
//               </RequireAuth>
//             }
//           />

//           <Route path="/login" element={<Login onLogin={handleLogin} />} />
//           <Route path="/register" element={<Register onRegister={handleLogin} />} />

//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </div>
//     </div>
//   );
// }

// export default App;
// src/App.js
import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";

import Dashboard from "./pages/Dashboard";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";

const prodApi = "https://full-stack-project-backend-9xys.onrender.com/api";
const devApi = "http://127.0.0.1:8000/api";

export const API_URL =
  process.env.NODE_ENV === "production" ? prodApi : devApi;

console.log("API_URL:", API_URL);

function App() {
  // Initialize from localStorage synchronously
  const [authUser, setAuthUser] = useState(() => {
    const stored = localStorage.getItem("authUser");
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  });

  const handleLogin = (user) => {
    setAuthUser(user);
    localStorage.setItem("authUser", JSON.stringify(user));
  };

  const handleLogout = () => {
    setAuthUser(null);
    localStorage.removeItem("authUser");
  };

  const RequireAuth = ({ children }) => {
    if (!authUser) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <div className="app-root">
      <NavBar authUser={authUser} onLogout={handleLogout} />
      <div className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard authUser={authUser} />
              </RequireAuth>
            }
          />

          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile authUser={authUser} />
              </RequireAuth>
            }
          />

          <Route
            path="/explore"
            element={
              <RequireAuth>
                <Explore />
              </RequireAuth>
            }
          />

          <Route
            path="/login"
            element={<Login onLogin={handleLogin} />}
          />
          <Route
            path="/register"
            element={<Register onRegister={handleLogin} />}
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
