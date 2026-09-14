"use client";

import { useRef, useState, useCallback, useMemo } from "react";

function spiralPoints(startAngle, turns, startR, endR, steps, jitter = 0) {
  const points = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = startAngle + t * turns * Math.PI * 2;
    const r = startR + t * (endR - startR);
    const jx = (Math.random() - 0.5) * jitter;
    const jy = (Math.random() - 0.5) * jitter;
    points.push([r * Math.cos(angle) + jx, r * Math.sin(angle) + jy]);
  }
  return points;
}

export default function GalaxyMapPage() {
  const [rotX, setRotX] = useState(55);
  const [rotY, setRotY] = useState(0);
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  const armStars = useMemo(() => {
    const stars = [];
    [0, Math.PI].forEach((offset) => {
      spiralPoints(offset, 1.4, 15, 185, 140).forEach(([x, y]) => {
        stars.push({ x, y, r: Math.random() * 1.4 + 0.5 });
      });
    });
    [0.9, Math.PI + 0.9].forEach((offset) => {
      spiralPoints(offset, 1.2, 25, 150, 100).forEach(([x, y]) => {
        stars.push({ x, y, r: Math.random() * 1.2 + 0.4 });
      });
    });
    for (let i = 0; i < 120; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * 180;
      stars.push({ x: r * Math.cos(a), y: r * Math.sin(a), r: Math.random() * 0.8 + 0.3 });
    }
    return stars;
  }, []);

  const onPointerDown = useCallback((e) => {
    dragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };
  }, []);
  const onPointerMove = useCallback((e) => {
    if (!dragging.current) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY };
    setRotY((r) => r + dx * 0.4);
    setRotX((r) => Math.max(5, Math.min(85, r - dy * 0.4)));
  }, []);
  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  const resetView = () => {
    setRotX(55);
    setRotY(0);
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <div className="page-title">The Galaxy Map</div>
      <div className="page-subtitle">drag to rotate &middot; a simplified model</div>

      <div
        className="panel"
        style={{ textAlign: "center", padding: 20, userSelect: "none" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <div
          style={{
            perspective: 900,
            height: 420,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: dragging.current ? "grabbing" : "grab",
          }}
        >
          <div
            style={{
              width: 400,
              height: 400,
              position: "relative",
              transformStyle: "preserve-3d",
              transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
              transition: dragging.current ? "none" : "transform 0.3s ease-out",
            }}
          >
            <svg
              viewBox="-200 -200 400 400"
              width="400"
              height="400"
              style={{ position: "absolute", top: 0, left: 0, overflow: "visible" }}
            >
              <circle cx="0" cy="0" r="190" fill="#0A0B1C" opacity="0.4" />
              {armStars.map((s, i) => (
                <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#B9C0FF" opacity="0.8" />
              ))}
              <circle cx="0" cy="0" r="10" fill="#E8CFC0" opacity="0.9" />
              <circle cx="0" cy="0" r="22" fill="none" stroke="#E8CFC0" opacity="0.15" />

              {/* Earth marker, in the Orion Arm */}
              <circle cx="140" cy="55" r="3.5" fill="#8B95F6">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="2.2s" repeatCount="indefinite" />
              </circle>
              <line x1="140" y1="55" x2="170" y2="80" stroke="#6E76B8" strokeWidth="1" />
              <text x="174" y="84" fontFamily="'JetBrains Mono', monospace" fontSize="12" fill="#B9C0FF">
                Earth
              </text>
            </svg>
          </div>
        </div>

        <button
          onClick={resetView}
          style={{
            marginTop: 12,
            background: "none",
            border: "1px solid #3A3E75",
            borderRadius: 4,
            color: "#B9C0FF",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            padding: "8px 18px",
            cursor: "pointer",
          }}
        >
          Reset view
        </button>
        <div className="mono" style={{ fontSize: 11, color: "#565B8F", marginTop: 10 }}>
          click and drag &middot; a simplified model, not astronomically exact
        </div>
      </div>

      <div className="panel" style={{ marginTop: 20 }}>
        <p style={{ margin: 0 }}>
          Earth sits roughly two-thirds of the way out from the galactic
          center, in a minor spur called the Orion Arm — not one of the
          galaxy's two major spiral arms, just a smaller passage between
          them.
        </p>
      </div>
    </div>
  );
}
