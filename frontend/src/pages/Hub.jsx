import React from "react";
import { Info, User, Calendar, CalendarDays, LogOut, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function Hub() {
  const navigate = useNavigate();

  const menuItems = [
    {
      id: "about",
      title: "About Us",
      description: "Learn more about our application",
      icon: Info,
      route: "/about"
    },
    {
      id: "account",
      title: "Account Info",
      description: "View and manage your account",
      icon: User,
      route: "/info"
    },
    {
      id: "events",
      title: "Upcoming Events",
      description: "Browse upcoming events",
      icon: Calendar,
      route: "/Dashboard"
    },
    {
      id: "calendar",
      title: "Events Calendar",
      description: "View full calendar",
      icon: CalendarDays,
      route: "/explore" 
    }
  ];

  const handleExit = () => {
    navigate("/login");
  };

  return (
    <div className="menu-container bg-main">
      <div className="menu-content">
        <div className="menu-header">
          <h1 className="menu-title">Welcome</h1>
          <p className="menu-subtitle">Navigate to your desired section</p>
        </div>

        {/* MENU BUTTONS */}
        <div className="menu-grid">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.route)}
                className={`menu-item menu-item-${item.id}`}
              >
                <Icon size={40} className="menu-item-icon" />
                <div className="menu-item-content">
                  <h2 className="menu-item-title">{item.title}</h2>
                  <p className="menu-item-description">{item.description}</p>
                </div>
                <ArrowRight size={24} className="menu-item-arrow" />
              </button>
            );
          })}
        </div>

        {/* EXIT BUTTON */}
        <button onClick={handleExit} className="exit-button">
          <LogOut size={32} />
          <span className="exit-button-text">Exit Application</span>
       </button>

      </div>
    </div>
  );
}
