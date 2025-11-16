import React, { useState } from "react";
import "../App.css";

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState("culture");

  const categories = [
    { id: "culture", label: "Culture" },
    { id: "location", label: "Location" },
    { id: "place", label: "Place" },
  ];

  const exploreItems = [
    { id: 1, label: "Music & Dance" },
    { id: 2, label: "Traditional Arts" },
    { id: 3, label: "Cuisine" },
  ];

  const events = [
    { id: 1, date: 20, title: "Traditional Music Festival", location: "Downtown Cultural Center", attendees: 234 },
    { id: 2, date: 25, title: "Art Exhibition Opening", location: "National Gallery", attendees: 156 },
    { id: 3, date: 20, title: "Folk Dance Performance", location: "City Theater", attendees: 189 },
    { id: 4, date: 25, title: "Culinary Heritage Tour", location: "Historic District", attendees: 78 },
  ];

  return (
    <main className="page-container bg-main">
      <div className="content-box">
        {/* PAGE TITLE */}
        <h1 className="page-title">Dashboard</h1>

        {/* CATEGORY BUTTONS */}
        <div className="toolbar" style={{ marginBottom: "2rem" }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                backgroundColor: selectedCategory === cat.id ? "#a1845f" : "#fff9f3",
                color: selectedCategory === cat.id ? "#fff" : "#4b3d33",
                border: "1px solid #d8c4a3",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* EVENTS SECTION */}
        <div style={{ marginBottom: "2rem" }}>
          <h2 className="page-title" style={{ fontSize: "1.5rem" }}>
            Upcoming Events
          </h2>

          <div className="stack" style={{ marginTop: "1rem" }}>
            {events.map((event) => (
              <div key={event.id} className="card" style={{ padding: "1rem" }}>
                <h4 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>
                  {event.title}
                </h4>
                <p style={{ marginBottom: "0.25rem" }}>📅 Day {event.date}</p>
                <p style={{ marginBottom: "0.25rem" }}>📍 {event.location}</p>
                <p>👥 {event.attendees} attending</p>
              </div>
            ))}
          </div>
        </div>

        {/* EXPLORE SECTION */}
        <h2 className="page-title" style={{ fontSize: "1.5rem" }}>
          Explore Culture
        </h2>

        <div className="grid hub" style={{ marginTop: "1rem" }}>
          {exploreItems.map((item) => (
            <div key={item.id} className="tile" style={{ height: "100px" }}>
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
