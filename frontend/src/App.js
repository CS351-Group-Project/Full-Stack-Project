import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";

import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import Info from "./pages/Info";
import About from "./pages/About";
import Hub from "./pages/Hub";
import LoginPage from "./pages/LoginPage";

export const API_URL = "http://127.0.0.1:8000/api";

function App() {
  return (
    <div className="app-root">
      <NavBar />
      <div className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/hub" replace />} />
          <Route path="/hub" element={<Hub />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/events" element={<Events />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/info" element={<Info />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
