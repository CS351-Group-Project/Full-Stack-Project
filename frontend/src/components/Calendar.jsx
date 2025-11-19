// src/components/Calendar.jsx
import React, { useState } from "react";

const weekdayLabels = ["S", "M", "T", "W", "T", "F", "S"];

export default function Calendar({ selectedDates, toggleDate }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const monthIndex = currentDate.getMonth(); // 0-11
  const monthName = currentDate.toLocaleString("default", { month: "long" });

  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstWeekday = new Date(year, monthIndex, 1).getDay(); // 0 (Sun) - 6 (Sat)

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const leadingBlanks = Array.from({ length: firstWeekday }, (_, i) => i);

  const goToPrevMonth = () => {
    const prev = new Date(year, monthIndex - 1, 1);
    setCurrentDate(prev);
  };

  const goToNextMonth = () => {
    const next = new Date(year, monthIndex + 1, 1);
    setCurrentDate(next);
  };

  return (
    <div className="calendar">
      {/* Header with month / year and arrows */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.25rem",
        }}
      >
        <button
          type="button"
          onClick={goToPrevMonth}
          className="btn btn-ghost"
          style={{ padding: "0.15rem 0.4rem", fontSize: "0.75rem" }}
        >
          ‹
        </button>

        <div style={{ textAlign: "center", flex: 1 }}>
          <strong>{monthName}</strong>{" "}
          <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>{year}</span>
        </div>

        <button
          type="button"
          onClick={goToNextMonth}
          className="btn btn-ghost"
          style={{ padding: "0.15rem 0.4rem", fontSize: "0.75rem" }}
        >
          ›
        </button>
      </div>

      <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.15rem" }}>
        Click days to select
      </div>

      {/* Weekday headers */}
      <div className="calendar-grid">
        {weekdayLabels.map((label) => (
          <div
            key={label}
            style={{
              textAlign: "center",
              fontSize: "0.7rem",
              fontWeight: 500,
              color: "#6b7280",
            }}
          >
            {label}
          </div>
        ))}

        {/* Leading blanks to align first day correctly */}
        {leadingBlanks.map((i) => (
          <div key={`blank-${i}`} />
        ))}

        {/* Days of the month */}
        {days.map((d) => {
          const selected = selectedDates.includes(d); // same contract as before
          return (
            <div
              key={d}
              className={"calendar-day" + (selected ? " selected" : "")}
              onClick={() => toggleDate(d)}
            >
              {d}
            </div>
          );
        })}
      </div>
    </div>
  );
}
