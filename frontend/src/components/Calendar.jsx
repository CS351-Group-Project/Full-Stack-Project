import React from "react";

const days = Array.from({ length: 28 }, (_, i) => i + 1);

export default function Calendar({ selectedDates, toggleDate }) {
  return (
    <div className="calendar">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <strong>Calendar</strong>
        <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>
          Click days to select
        </span>
      </div>
      <div className="calendar-grid">
        {days.map((d) => {
          const selected = selectedDates.includes(d);
          return (
            <div
              key={d}
              className={
                "calendar-day" + (selected ? " selected" : "")
              }
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
