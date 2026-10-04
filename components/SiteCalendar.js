"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

// The 2027 calendar on Sentinel-X (Update 5.56): a month at a time, every
// day's events as colour-coded chips (one-time, weekly, monthly, seasonal),
// filters for each kind, and the totals per month so it's easy to see
// where the year is crowded and where there's room for something new.
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function SiteCalendar({ events, kinds, year }) {
  const [month, setMonth] = useState(0);
  const [on, setOn] = useState(() => Object.fromEntries(Object.keys(kinds).map((k) => [k, true])));
  const [picked, setPicked] = useState(null);
  const byDate = useMemo(() => {
    const m = {};
    events.forEach((e) => { if (on[e.kind]) (m[e.date] = m[e.date] || []).push(e); });
    return m;
  }, [events, on]);
  const perMonth = useMemo(() => MONTHS.map((_, i) => events.filter((e) => on[e.kind] && Number(e.date.slice(5, 7)) === i + 1).length), [events, on]);

  const first = new Date(Date.UTC(year, month, 1));
  const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const lead = first.getUTCDay();
  const cells = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);
  const key = (d) => `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const today = new Date().toISOString().slice(0, 10);
  const pickedEvents = picked ? byDate[picked] || [] : [];

  return (
    <div className="cal">
      <Link href="/sentinel-x" className="mono" style={{ fontSize: 12, color: "#6E76B8" }}>&larr; Sentinel-X</Link>
      <div className="page-title" style={{ marginTop: 12 }}>The {year} calendar</div>
      <div className="page-subtitle">every event on 13i, by rule &middot; use it to see where things bunch up, and where there&rsquo;s room</div>

      <div className="cal-legend">
        {Object.entries(kinds).map(([k, v]) => (
          <button key={k} className={`cal-key ${on[k] ? "" : "cal-key-off"}`} onClick={() => setOn((o) => ({ ...o, [k]: !o[k] }))} style={{ "--k": v.color }}>
            <span className="cal-swatch" /> {v.label}
          </button>
        ))}
      </div>

      <div className="cal-months">
        {MONTHS.map((m, i) => (
          <button key={m} className={`mono cal-month-btn ${i === month ? "cal-month-on" : ""}`} onClick={() => { setMonth(i); setPicked(null); }}>
            {m.slice(0, 3)} <span>{perMonth[i]}</span>
          </button>
        ))}
      </div>

      <div className="cal-head">
        <button className="cal-nav" onClick={() => { setMonth((x) => Math.max(0, x - 1)); setPicked(null); }} disabled={month === 0} aria-label="Previous month">&larr;</button>
        <div className="wordmark cal-title">{MONTHS[month]} {year}</div>
        <button className="cal-nav" onClick={() => { setMonth((x) => Math.min(11, x + 1)); setPicked(null); }} disabled={month === 11} aria-label="Next month">&rarr;</button>
      </div>

      <div className="cal-grid">
        {DOW.map((d) => <div key={d} className="mono cal-dow">{d}</div>)}
        {cells.map((d, i) => {
          if (!d) return <div key={i} className="cal-cell cal-empty" />;
          const k = key(d), ev = byDate[k] || [];
          const season = ev.find((e) => e.season)?.season;
          return (
            <button key={i} className={`cal-cell ${k === today ? "cal-today" : ""} ${picked === k ? "cal-picked" : ""}`} onClick={() => setPicked(k)}>
              <span className="mono cal-date">{d}</span>
              {season && <span className="mono cal-season">{season.replace("Season ", "S").replace(" · week ", " · W")}</span>}
              <span className="cal-chips">
                {ev.slice(0, 4).map((e, j) => (
                  <span key={j} className="cal-chip" style={{ "--k": kinds[e.kind].color }} title={`${e.title} — ${e.note}`}>{e.title}</span>
                ))}
                {ev.length > 4 && <span className="mono cal-more">+{ev.length - 4} more</span>}
              </span>
            </button>
          );
        })}
      </div>

      {picked && (
        <div className="panel cal-detail">
          <div className="mono" style={{ fontSize: 10.5, letterSpacing: "1.5px", color: "#C9B98F", marginBottom: 10 }}>
            {new Date(`${picked}T00:00:00Z`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).toUpperCase()}
          </div>
          {pickedEvents.length ? pickedEvents.map((e, j) => (
            <div key={j} className="cal-detail-row">
              <span className="cal-dot" style={{ background: kinds[e.kind].color }} />
              <div>
                <div style={{ color: "#DCDFFF" }}>{e.title} <span className="mono" style={{ fontSize: 10, color: kinds[e.kind].color }}>{kinds[e.kind].label.toUpperCase()}</span></div>
                <div style={{ fontSize: 12.5, color: "#8A8FBF" }}>{e.note}{e.season ? ` · ${e.season}` : ""}</div>
              </div>
            </div>
          )) : <p style={{ margin: 0, color: "#565B8F" }}>Nothing scheduled. Room for something new.</p>}
        </div>
      )}
    </div>
  );
}
