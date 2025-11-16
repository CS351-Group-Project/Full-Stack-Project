import React from "react";
import "../App.css";

export default function Calendar({ selectedDates, toggleDate }) {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div>
      <h3 className="page-title" style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
        Calendar
      </h3>

      <div className="calendar-container">
        <div className="calendar-grid">
          {days.map((day) => {
            const isSelected = selectedDates.includes(day);

            return (
              <div
                key={day}
                onClick={() => toggleDate(day)}
                className={`calendar-cell ${
                  isSelected ? "calendar-cell-event" : "calendar-cell-normal"
                }`}
                style={{
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                <div className="calendar-cell-text">{day}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}