import React from "react";
import Calendar from "../components/Calendar";

export default function Events() {
  return (
    <main className="events">
      <header className="wallpaper">[wallpaper (collage of culture)]</header>

      <div className="toolbar">
        <button>culture</button>
        <button>location</button>
        <button>place</button>
      </div>

      <section className="layout">
        <aside className="filters">
          <Calendar />
        </aside>

        <div className="stack">
          <h3>favorite events pinned</h3>
          <div className="card" />
          <h3>events nearby</h3>
          <div className="card tall" />
        </div>
      </section>
    </main>
  );
}
