

// src/components/EventCard.jsx
import React from "react";

export default function EventCard({ event, badge }) {
  const isExternal = event.source === "external" && event.external_url;

  return (
    <div className="event-card">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <strong>{event.title}</strong>
        {badge && (
          <span
            style={{
              padding: "0.2rem 0.5rem",
              borderRadius: "999px",
              fontSize: "0.7rem",
              backgroundColor: isExternal ? "#e5e7eb" : "#10b981",
              color: isExternal ? "#374151" : "#065f46",
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

      <p
        style={{
          margin: "0.3rem 0",
          fontSize: "0.85rem",
        }}
      >
        {event.description}
      </p>

      {typeof event.attendees !== "undefined" && (
        <p
          style={{
            margin: "0.15rem 0",
            color: "#6b7280",
            fontSize: "0.85rem",
          }}
        >
          👥 {event.attendees} attending
        </p>
      )}

      {isExternal && (
        <a
          href={event.external_url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost"
        >
          View on external site
        </a>
      )}
    </div>
  );
}
