import React from "react";

export default function Calendar() {
  // static 7x6 grid with numbers 1..30
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const blanks = Array.from({ length: 7 }, () => "");
  return (
    <div className="cal">
      <div className="cal-head"><strong>calendar</strong></div>
      <div className="cal-grid">
        {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d)=>(
          <div key={d} className="cal-dow">{d}</div>
        ))}
        {blanks.map((_,i)=>(<div key={`b${i}`} className="cal-cell muted" />))}
        {days.map((d)=>(<div key={d} className="cal-cell">{d}</div>))}
      </div>
    </div>
  );
}
