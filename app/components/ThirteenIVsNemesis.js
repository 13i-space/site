"use client";

import { useState, useRef, useEffect, useCallback } from "react";

const ZONES = [
  { name: "Outer System", min: 81, max: 100 },
  { name: "Asteroid Belt", min: 56, max: 80 },
  { name: "Mars Orbit", min: 36, max: 55 },
  { name: "Cislunar Space", min: 16, max: 35 },
  { name: "Earth Orbit", min: 0, max: 15 },
];

function zoneForDistance(d) {
  return ZONES.find((z) => d >= z.min && d <= z.max) || ZONES[ZONES.length - 1];
}

function initMapState() {
  return {
    distance: 100,
    hull: 100,
    courseDeviation: 0,
    resource: 8,
  };
}

export default function ThirteenIVsNemesis() {
  const [phase, setPhase] = useState("map"); // map -> encounter -> ended
  const [map, setMap] = useState(initMapState);
  const [message, setMessage] = useState(null);
  const [endResult, setEndResult] = useState(null);
  const tickRef = useRef(null);

  const zone = zoneForDistance(map.distance);
  const inZone2 = zone.name === "Asteroid Belt";

  // Map-view distance ticking
  useEffect(() => {
    if (phase !== "map") return;
    tickRef.current = setInterval(() => {
      setMap((m) => {
        const nextDistance = Math.max(0, m.distance - 0.4);
        return { ...m, distance: nextDistance };
      });
    }, 200);
    return () => clearInterval(tickRef.current);
  }, [phase]);

  // End conditions
  useEffect(() => {
    if (phase === "ended") return;
    if (map.hull <= 0) {
      setEndResult({ type: "win", text: "Hull Integrity critical. 13i's approach has stalled — mission success for this encounter." });
      setPhase("ended");
    } else if (map.distance <= 0) {
      setEndResult({ type: "loss", text: "13i has reached Earth orbit. Zones 3–5 defenses aren't online yet in this build." });
      setPhase("ended");
    } else if (map.resource <= 0) {
      setEndResult({ type: "out", text: "Out of interceptors. 13i continues inbound — later zones' weapons arrive in a future update." });
      setPhase("ended");
    }
  }, [map, phase]);

  const startEncounter = () => {
    setMessage(null);
    setPhase("encounter");
  };

  const resolveEncounter = useCallback((hit) => {
    setMap((m) => {
      if (hit) {
        const dmg = 15 + Math.floor(Math.random() * 10);
        setMessage(`Direct hit. Hull Integrity -${dmg}.`);
        return { ...m, hull: Math.max(0, m.hull - dmg), resource: m.resource - 1 };
      } else {
        setMessage("Gravitic deflection held. Interceptor lost without effect.");
        return { ...m, courseDeviation: Math.min(100, m.courseDeviation + 3), resource: m.resource - 1 };
      }
    });
    setPhase("map");
  }, []);

  const restart = () => {
    setMap(initMapState());
    setMessage(null);
    setEndResult(null);
    setPhase("map");
  };

  return (
    <div className="panel">
      {phase !== "ended" && (
        <>
          <ZoneTrack distance={map.distance} zone={zone} />
          <Meters map={map} />
          {message && (
            <div className="mono" style={{ fontSize: 12, color: "#8A8FBF", margin: "10px 0" }}>
              {message}
            </div>
          )}
        </>
      )}

      {phase === "map" && (
        <div style={{ marginTop: 16, textAlign: "center" }}>
          {inZone2 ? (
            map.resource > 0 ? (
              <button style={btnStyle} onClick={startEncounter}>
                Launch Kinetic Interceptor
              </button>
            ) : (
              <p style={hintStyle}>Out of interceptors.</p>
            )
          ) : (
            <p style={hintStyle}>
              {zone.name === "Outer System"
                ? "13i is out of range for current weapons systems."
                : `${zone.name} defenses aren't built yet in this vertical slice — Asteroid Belt is the only active zone so far.`}
            </p>
          )}
        </div>
      )}

      {phase === "encounter" && <Encounter onResolve={resolveEncounter} />}

      {phase === "ended" && (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div
            className="mono"
            style={{
              fontSize: 14,
              color: endResult.type === "win" ? "#B9C0FF" : "#C97B6E",
              marginBottom: 16,
              lineHeight: 1.6,
            }}
          >
            {endResult.text}
          </div>
          <button style={btnStyle} onClick={restart}>
            Run it back
          </button>
        </div>
      )}
    </div>
  );
}

function ZoneTrack({ distance, zone }) {
  const progress = 100 - distance;
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span className="mono" style={{ fontSize: 11, color: "#6E76B8" }}>EARTH</span>
        <span className="mono" style={{ fontSize: 11, color: "#8A8FBF" }}>
          {zone.name} &middot; distance {distance.toFixed(0)}
        </span>
        <span className="mono" style={{ fontSize: 11, color: "#6E76B8" }}>13i</span>
      </div>
      <div style={{ position: "relative", height: 8, background: "#161A42", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${progress}%`, background: "linear-gradient(90deg, #4C5192, #8B95F6)" }} />
      </div>
    </div>
  );
}

function Meters({ map }) {
  const items = [
    { label: "Hull Integrity", value: map.hull, color: "#8B95F6" },
    { label: "Course Deviation", value: map.courseDeviation, color: "#C9917A" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 8 }}>
      {items.map((it) => (
        <div key={it.label}>
          <div className="mono" style={{ fontSize: 10, color: "#565B8F", marginBottom: 4 }}>{it.label}</div>
          <div style={{ height: 6, background: "#161A42", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ width: `${it.value}%`, height: "100%", background: it.color }} />
          </div>
        </div>
      ))}
      <div className="mono" style={{ fontSize: 11, color: "#8A8FBF", gridColumn: "1 / -1" }}>
        Interceptors remaining: {map.resource}
      </div>
    </div>
  );
}

function Encounter({ onResolve }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    px: 30,
    py: 130,
    vx: 2.4,
    vy: 0,
    tx: 460,
    ty: 130,
    fuel: 260,
    steer: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf;
    let running = true;

    const handleKey = (e) => {
      if (e.key === "ArrowUp") stateRef.current.steer = -1;
      if (e.key === "ArrowDown") stateRef.current.steer = 1;
    };
    const handleKeyUp = () => { stateRef.current.steer = 0; };
    window.addEventListener("keydown", handleKey);
    window.addEventListener("keyup", handleKeyUp);

    const loop = (t) => {
      if (!running) return;
      const s = stateRef.current;

      s.ty = 130 + Math.sin(t / 900) * 45;

      const dx = s.tx - s.px;
      const dy = s.ty - s.py;
      const dist = Math.hypot(dx, dy) || 1;

      // Gravitic deflection: pushes the projectile perpendicular to its
      // direct line to 13i, growing stronger the closer it gets.
      const perpX = -dy / dist;
      const perpY = dx / dist;
      const deflectStrength = Math.min(0.35, 30 / dist);
      s.vy += perpY * deflectStrength;
      s.vy += s.steer * 0.15;

      s.px += s.vx;
      s.py += s.vy;
      s.fuel -= 1;

      ctx.fillStyle = "#0A0B1C";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // gravity well rings around 13i
      for (let r = 14; r <= 44; r += 15) {
        ctx.beginPath();
        ctx.arc(s.tx, s.ty, r, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(139,149,246,0.25)";
        ctx.stroke();
      }
      ctx.fillStyle = "#B9C0FF";
      ctx.beginPath();
      ctx.arc(s.tx, s.ty, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#E8CFC0";
      ctx.beginPath();
      ctx.arc(s.px, s.py, 4, 0, Math.PI * 2);
      ctx.fill();

      const hit = dist < 16;
      const missed = s.px > canvas.width || s.fuel <= 0 || s.py < 0 || s.py > canvas.height;

      if (hit) {
        running = false;
        onResolve(true);
        return;
      }
      if (missed) {
        running = false;
        onResolve(false);
        return;
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [onResolve]);

  const setSteer = (v) => { stateRef.current.steer = v; };

  return (
    <div style={{ textAlign: "center" }}>
      <canvas
        ref={canvasRef}
        width={500}
        height={260}
        style={{ width: "100%", maxWidth: 500, border: "1px solid #262A55", borderRadius: 4, background: "#0A0B1C" }}
      />
      <p style={{ fontSize: 12, color: "#565B8F", margin: "10px 0" }}>
        13i's gravity well bends your interceptor off course. Use ↑ / ↓, or
        the buttons below on mobile, to counter-steer into a hit.
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
        <button
          style={btnStyle}
          onTouchStart={(e) => { e.preventDefault(); setSteer(-1); }}
          onTouchEnd={(e) => { e.preventDefault(); setSteer(0); }}
          onMouseDown={() => setSteer(-1)}
          onMouseUp={() => setSteer(0)}
          onMouseLeave={() => setSteer(0)}
        >
          ↑ Up
        </button>
        <button
          style={btnStyle}
          onTouchStart={(e) => { e.preventDefault(); setSteer(1); }}
          onTouchEnd={(e) => { e.preventDefault(); setSteer(0); }}
          onMouseDown={() => setSteer(1)}
          onMouseUp={() => setSteer(0)}
          onMouseLeave={() => setSteer(0)}
        >
          ↓ Down
        </button>
      </div>
    </div>
  );
}

const btnStyle = {
  background: "none",
  border: "1px solid #3A3E75",
  borderRadius: 4,
  color: "#B9C0FF",
  padding: "10px 20px",
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 13,
  cursor: "pointer",
};

const hintStyle = {
  fontSize: 13,
  color: "#565B8F",
  fontStyle: "italic",
};
