import React, { useEffect, useState } from "react";
import { apiGet } from "../api";
import Calendar from "../components/Calendar";
import EventCard from "../components/EventCard";

export default function Events() {
  const [selectedDates, setSelectedDates] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleDate = (day) => {
    setSelectedDates((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiGet("/events/");
        setEvents(data || []);
      } catch (e) {
        console.error("Failed to load events", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const favoriteEvents = events.filter((e) => e.is_favorite);
  const otherEvents = events.filter((e) => !e.is_favorite);

  return (
    <div className="page">
      <h1 className="page-title">Events</h1>

      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "1rem" }}>
        <div>
          <Calendar selectedDates={selectedDates} toggleDate={toggleDate} />
        </div>
        <div>
          <h2 style={{ fontSize: "1.1rem" }}>Favorite events</h2>
          {loading ? (
            <p>Loading...</p>
          ) : favoriteEvents.length === 0 ? (
            <p>No favorite events yet.</p>
          ) : (
            favoriteEvents.map((ev) => (
              <EventCard key={ev.id} event={ev} badge="Favorite" />
            ))
          )}

          <h2 style={{ fontSize: "1.1rem", marginTop: "1rem" }}>All events</h2>
          {loading ? (
            <p>Loading...</p>
          ) : otherEvents.length === 0 ? (
            <p>No other events found.</p>
          ) : (
            otherEvents.map((ev) => (
              <EventCard key={ev.id} event={ev} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
