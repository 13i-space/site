"use client";

import { useEffect, useState } from "react";

const LAUNCH = new Date("2027-04-06T00:00:00");

function getRemaining() {
  const now = new Date();
  const diff = Math.max(0, LAUNCH.getTime() - now.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

export default function Countdown() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(getRemaining());
    const id = setInterval(() => setTime(getRemaining()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;

  const units = [
    { label: "days", value: time.days },
    { label: "hours", value: time.hours },
    { label: "min", value: time.minutes },
    { label: "sec", value: time.seconds },
  ];

  return (
    <div style={styles.row}>
      {units.map((u) => (
        <div key={u.label} style={styles.unit}>
          <div style={styles.value}>{String(u.value).padStart(2, "0")}</div>
          <div style={styles.label}>{u.label}</div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  row: {
    display: "flex",
    gap: 28,
    justifyContent: "center",
    margin: "36px 0",
  },
  unit: { textAlign: "center" },
  value: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 40,
    color: "#B9C0FF",
  },
  label: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    color: "#6E76B8",
    letterSpacing: "1px",
    marginTop: 4,
  },
};
