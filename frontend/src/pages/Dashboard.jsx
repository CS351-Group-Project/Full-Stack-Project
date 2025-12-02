
// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { apiGet } from "../api";
import EventCard from "../components/EventCard";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // 1) Load user profile
        const userResp = await apiGet("/user/info/1/");
        const profileUser = userResp.user;
        setUser(profileUser);

        // 2) Build query from profile for Explore endpoint
        const params = new URLSearchParams();
        const profileCulture = (profileUser.culture || "").trim();
        const profileLocation = (profileUser.country || "").trim();

        if (profileCulture) params.append("culture", profileCulture);
        if (profileLocation) params.append("location", profileLocation);

        const query = params.toString();
        const url = "/events/explore/" + (query ? `?${query}` : "");

        // 3) Load events from Explore (internal + external)
        const data = await apiGet(url);
        setEvents(data.events || []);
      } catch (e) {
        console.error("Failed to load dashboard events", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="page">
      <h1 className="page-title">Dashboard</h1>
      <p style={{ marginBottom: "0.5rem" }}>
        Recommended events for you, based on your culture and location.
      </p>

      {user && (user.culture || user.country) && (
        <p
          style={{
            marginBottom: "1rem",
            fontSize: "0.9rem",
            color: "#4b5563",
          }}
        >
          Using your profile:{" "}
          <strong>{user.culture || "Any culture"}</strong>
          {" · "}
          <strong>{user.country || "Any location"}</strong>
        </p>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : events.length === 0 ? (
        <p>No events found for your culture or location.</p>
      ) : (
        events.map((ev) => (
          <EventCard
            key={ev.id || ev.title}
            event={ev}
            badge={ev.source === "external" ? "External" : "Our Event"}
          />
        ))
      )}
    </div>
  );
}
