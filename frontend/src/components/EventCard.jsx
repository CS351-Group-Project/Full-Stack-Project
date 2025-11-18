import React from "react";

export default function EventCard({ event, badge }) {
  return (
    <div className="event-card">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3 style={{ margin: 0, fontSize: "1rem" }}>{event.title}</h3>
        {badge && (
          <span
            style={{
              padding: "0.2rem 0.5rem",
              borderRadius: "999px",
              fontSize: "0.7rem",
              backgroundColor: "#f59e0b",
              color: "#111827",
            }}
          >
            {badge}
          </span>
        )}
      </div>
      <p style={{ margin: "0.15rem 0", color: "#4b5563" }}>
        {event.culture} • {event.location}
      </p>
      <p style={{ margin: "0.15rem 0", color: "#6b7280" }}>
        📅 {event.start_date}
        {event.end_date && event.end_date !== event.start_date
          ? ` – ${event.end_date}`
          : ""}
      </p>
      <p style={{ margin: "0.15rem 0", color: "#6b7280" }}>
        📍 {event.place || "Venue TBA"}
      </p>
      {event.description && (
        <p style={{ margin: "0.3rem 0", fontSize: "0.85rem" }}>
          {event.description}
        </p>
      )}
      <p style={{ margin: "0.15rem 0", color: "#6b7280", fontSize: "0.85rem" }}>
        👥 {event.attendees} attending
      </p>
    </div>
  );
}
