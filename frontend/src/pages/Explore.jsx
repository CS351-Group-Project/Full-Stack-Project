import React, { useEffect, useState } from "react";
import { apiGet } from "../api";
import Calendar from "../components/Calendar";

export default function Explore() {
  const [selectedDates, setSelectedDates] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters for culture + location
  const [filters, setFilters] = useState({
    culture: "",
    location: "",
  });

  const toggleDate = (day) => {
    setSelectedDates((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const loadEvents = async (opts = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (opts.culture) params.append("culture", opts.culture);
      if (opts.location) params.append("location", opts.location);
      // If later you want to use date, you can add:
      // if (opts.date) params.append("date", opts.date);

      const query = params.toString();
      const url = "/events/explore/" + (query ? `?${query}` : "");

      const data = await apiGet(url);
      setEvents(data.events || []);
    } catch (e) {
      console.error("Failed to load explore events", e);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // initial load with no filters
  useEffect(() => {
    loadEvents({});
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    // for now we only use culture + location
    loadEvents({
      culture: filters.culture.trim() || undefined,
      location: filters.location.trim() || undefined,
    });
  };

  return (
    <div className="page">
      <h1 className="page-title">Explore</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "260px 1fr",
          gap: "1rem",
        }}
      >
        <div>
          <Calendar selectedDates={selectedDates} toggleDate={toggleDate} />

          {/* filter form */}
          <div style={{ marginTop: "1rem" }}>
            <div className="form-row">
              <label htmlFor="culture">Culture</label>
              <input
                id="culture"
                name="culture"
                placeholder="e.g. Korean, Latin American"
                value={filters.culture}
                onChange={handleFilterChange}
              />
            </div>
            <div className="form-row">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                name="location"
                placeholder="e.g. Chicago, IL"
                value={filters.location}
                onChange={handleFilterChange}
              />
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSearch}
            >
              Search events
            </button>
          </div>

          {/* tiles */}
          <div style={{ marginTop: "1rem" }} className="grid grid-3">
            <div className="tile">Music & Dance</div>
            <div className="tile">Arts & Crafts</div>
            <div className="tile">Cuisine</div>
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: "1.1rem" }}>
            Events from our app and other websites
          </h2>
          {loading ? (
            <p>Loading...</p>
          ) : events.length === 0 ? (
            <p>No events found.</p>
          ) : (
            events.map((ev, idx) => (
              <div key={idx} className="event-card">
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <strong>{ev.title}</strong>
                  <span
                    style={{
                      padding: "0.2rem 0.5rem",
                      borderRadius: "999px",
                      fontSize: "0.7rem",
                      backgroundColor:
                        ev.source === "internal" ? "#10b981" : "#e5e7eb",
                      color:
                        ev.source === "internal" ? "#065f46" : "#374151",
                    }}
                  >
                    {ev.source === "internal" ? "Our Event" : "External"}
                  </span>
                </div>
                <p style={{ margin: "0.15rem 0", color: "#4b5563" }}>
                  {ev.culture} • {ev.location}
                </p>
                <p style={{ margin: "0.15rem 0", color: "#6b7280" }}>
                  📅 {ev.start_date}
                  {ev.end_date && ev.end_date !== ev.start_date
                    ? ` – ${ev.end_date}`
                    : ""}
                </p>
                <p style={{ margin: "0.15rem 0", color: "#6b7280" }}>
                  📍 {ev.place || "Venue TBA"}
                </p>
                <p
                  style={{
                    margin: "0.3rem 0",
                    fontSize: "0.85rem",
                  }}
                >
                  {ev.description}
                </p>
                <p
                  style={{
                    margin: "0.15rem 0",
                    color: "#6b7280",
                    fontSize: "0.85rem",
                  }}
                >
                  👥 {ev.attendees} attending
                </p>
                {ev.source === "external" && ev.external_url && (
                  <a
                    href={ev.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost"
                  >
                    View on external site
                  </a>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
