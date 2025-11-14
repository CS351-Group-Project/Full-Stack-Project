import React from "react";
import { Link } from "react-router-dom";

export default function Hub() {
  return (
    <main className="grid hub">
      <Link className="tile" to="/about">about us</Link>
      <Link className="tile" to="/info">info</Link>
      <Link className="tile" to="/events">events</Link>
      <Link className="tile" to="/explore">explore</Link>
      <Link className="tile" to="/login">exit</Link>
    </main>
  );
}
