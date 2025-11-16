import React, { useState } from "react";
import "../App.css";
import Calendar from "../components/Calendar";

export default function Explore() {
  const [selectedDates, setSelectedDates] = useState([]);

  const toggleDate = (day) => {
    setSelectedDates((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    );
  };

  const exploreItems = [
    { id: 1, label: "Music & Dance" },
    { id: 2, label: "Traditional Arts" },
    { id: 3, label: "Cuisine" },
  ];

  return (
    <main className="page-container bg-main">
      <div className="content-box">
        {/* PAGE TITLE */}
        <h1 className="page-title">Explore Culture</h1>

        {/* CALENDAR REPLACING TOP SQUARES */}
        <div style={{ marginBottom: "2rem" }}>
          <Calendar
            selectedDates={selectedDates}
            toggleDate={toggleDate}
          />
        </div>

        {/* EXPLORE SECTION */}
        <h2 className="page-title" style={{ fontSize: "1.5rem" }}>
          Explore Categories
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
