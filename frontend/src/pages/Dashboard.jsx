import React, { useEffect, useState } from "react";
import { apiGet } from "../api";
import EventCard from "../components/EventCard";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiGet("/events/recommended/");
        setEvents(data.events || []);
      } catch (e) {
        console.error("Failed to load recommended events", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="page">
      <h1 className="page-title">Dashboard</h1>
      <p style={{ marginBottom: "1rem" }}>
        Recommended events for you, computed with advanced algorithms
        (Bloom filter + priority queue) on the backend.
      </p>

      {loading ? (
        <p>Loading...</p>
      ) : events.length === 0 ? (
        <p>No recommended events yet.</p>
      ) : (
        events.map((ev) => (
          <EventCard
            key={ev.id}
            event={ev}
            badge={ev.is_favorite ? "Favorite" : "Recommended"}
          />
        ))
      )}
    </div>
  );
}
