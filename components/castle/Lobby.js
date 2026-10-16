"use client";
// The castle gate: build your knight, set up the night, or practise at the
// tiltyard while you wait.
import { useEffect, useRef } from "react";
import { ROLES } from "../../lib/castle/engine";
import {
  TABARDS, TABARD_NAMES, HELMET_COLORS, HELMET_STYLES, WEAPONS, EMBLEMS, TRIMS, randomLook, saveLook,
} from "../../lib/castle/looks";
import { drawKnightTop, drawKnightFront, drawKnightSide, drawHorse } from "./knight";

const ROLE_OPTIONS = [
  ["random", "Surprise me"], ["squire", "Squire"], ["knight", "Knight"], ["locksmith", "Locksmith"],
  ["blacksmith", "Blacksmith"], ["jester", "Jester"], ["blackknight", "Black Knight"],
];

export const L = {
  screen: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 18, background: "radial-gradient(ellipse at 50% 0%, #1d1b3a 0%, #07070f 70%)", fontFamily: "Inter, system-ui, sans-serif" },
  card: { background: "rgba(14,12,28,0.94)", border: "1px solid #3a3560", borderRadius: 10, padding: 26, boxShadow: "0 20px 60px rgba(0,0,0,0.5)", color: "#e7e1ff" },
  kicker: { fontSize: 10.5, letterSpacing: "1.5px", color: "#a9a3c4" },
  big: { fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic", fontSize: 38, color: "#f2dc9a", lineHeight: 1.15, margin: "6px 0 10px" },
  p: { fontSize: 15, lineHeight: 1.6, color: "#d7d1ef", margin: "8px 0" },
  btn: { background: "linear-gradient(135deg, #f2dc9a, #c9a227)", color: "#1b1406", border: 0, borderRadius: 999, padding: "11px 22px", fontWeight: 700, fontSize: 15, cursor: "pointer" },
  ghostBtn: { background: "transparent", color: "#f2e6c8", border: "1px solid #5a5390", borderRadius: 999, padding: "9px 18px", fontSize: 14, cursor: "pointer" },
  select: { width: "100%", marginTop: 6, background: "#14112a", color: "#f2e6c8", border: "1px solid #3a3560", borderRadius: 6, padding: "9px 10px", fontSize: 14 },
  mini: { border: "1px solid #3a3560", borderRadius: 8, padding: "10px 12px", background: "rgba(25,22,48,0.6)" },
  chip: { background: "#17142e", color: "#e7e1ff", border: "1px solid #3a3560", borderRadius: 999, padding: "5px 11px", fontSize: 12.5, cursor: "pointer" },
};

function KnightPreview({ look }) {
  const ref = useRef(null);
  const lookRef = useRef(look);
  lookRef.current = look;
  useEffect(() => {
    const cv = ref.current;
    const g = cv.getContext("2d");
    let raf;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = cv.clientWidth * dpr; cv.height = cv.clientHeight * dpr;
    const loop = (now) => {
      const t = now / 1000, lk = lookRef.current;
      const W0 = cv.clientWidth, H0 = cv.clientHeight;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      const bg = g.createLinearGradient(0, 0, 0, H0); bg.addColorStop(0, "#1a1733"); bg.addColorStop(1, "#0d0b1c");
      g.fillStyle = bg; g.fillRect(0, 0, W0, H0);
      // castle flagstones under the top-down view
      for (let y = 0; y < 5; y++) for (let x = 0; x < 4; x++) { g.fillStyle = (x + y) % 2 ? "#6b4524" : "#633f20"; g.fillRect(14 + x * 30, 26 + y * 30, 30, 30); }
      g.save(); g.translate(74, 100); g.scale(2.5, 2.5);
      drawKnightTop(g, lk, { facing: t * 0.6, walk: t * 8, moving: true, torch: true, t });
      g.restore();
      g.save(); g.translate(205, 156); g.scale(2.1, 2.1); drawKnightFront(g, lk, { cheer: (Math.sin(t * 2) + 1) / 2 > 0.85 ? 1 : 0 }); g.restore();
      g.save(); g.translate(335, 140); g.scale(0.58, 0.58); drawHorse(g, t * 9, lk); g.translate(0, -18); drawKnightSide(g, lk, {}); g.restore();
      g.fillStyle = "rgba(220,214,240,0.55)"; g.font = "10px Inter, system-ui, sans-serif"; g.textAlign = "center";
      g.fillText("IN THE CASTLE", 74, 192); g.fillText("IN THE CROWD", 205, 192); g.fillText("AT THE JOUST", 345, 192);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={ref} style={{ width: "100%", maxWidth: 440, height: 200, display: "block", borderRadius: 8, border: "1px solid #2e2850" }} />;
}

function Row({ label, children }) {
  return (
    <div style={{ marginTop: 12 }}>
      <div className="mono" style={{ ...L.kicker, marginBottom: 6 }}>{label}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{children}</div>
    </div>
  );
}
const swatch = (c, on) => ({ width: 26, height: 26, borderRadius: 6, background: c, cursor: "pointer", border: on ? "3px solid #fff" : "2px solid rgba(255,255,255,0.15)", boxShadow: on ? "0 0 0 2px #c9a227" : "none" });

export function KnightBuilder({ look, setLook }) {
  const set = (k, v) => { const l = { ...look, [k]: v }; setLook(l); saveLook(l); };
  return (
    <div>
      <KnightPreview look={look} />
      <Row label={`TABARD · ${TABARD_NAMES[look.tabard] || ""}`}>
        {TABARDS.map((c) => <button key={c} aria-label={TABARD_NAMES[c]} title={TABARD_NAMES[c]} onClick={() => set("tabard", c)} style={swatch(c, look.tabard === c)} />)}
      </Row>
      <Row label="TRIM AND EMBLEM COLOUR">
        {TRIMS.map((c) => <button key={c} aria-label={c} onClick={() => set("trim", c)} style={swatch(c, look.trim === c)} />)}
      </Row>
      <Row label="EMBLEM">
        {EMBLEMS.map(([k, n]) => <button key={k} onClick={() => set("emblem", k)} style={{ ...L.chip, borderColor: look.emblem === k ? "#c9a227" : "#3a3560", color: look.emblem === k ? "#f2dc9a" : "#e7e1ff" }}>{n}</button>)}
      </Row>
      <Row label="HELMET">
        {HELMET_STYLES.map(([k, n]) => <button key={k} onClick={() => set("helmetStyle", k)} style={{ ...L.chip, borderColor: look.helmetStyle === k ? "#c9a227" : "#3a3560", color: look.helmetStyle === k ? "#f2dc9a" : "#e7e1ff" }}>{n}</button>)}
      </Row>
      <Row label="HELMET METAL">
        {HELMET_COLORS.map(([c, n]) => <button key={c} title={n} aria-label={n} onClick={() => set("helmet", c)} style={swatch(c, look.helmet === c)} />)}
      </Row>
      <Row label="WEAPON">
        {WEAPONS.map(([k, n]) => <button key={k} onClick={() => set("weapon", k)} style={{ ...L.chip, borderColor: look.weapon === k ? "#c9a227" : "#3a3560", color: look.weapon === k ? "#f2dc9a" : "#e7e1ff" }}>{n}</button>)}
      </Row>
      <button style={{ ...L.chip, marginTop: 14 }} onClick={() => { const l = randomLook(TABARDS[Math.floor(Math.random() * TABARDS.length)]); setLook(l); saveLook(l); }}>Surprise me</button>
    </div>
  );
}

export function Lobby({ playerName, setName, look, setLook, total, setTotal, roleChoice, setRoleChoice, start, cup, backHref, openPractice }) {
  const pts = cup.reduce((s, x) => s + x.points, 0);
  return (
    <div style={L.screen}>
      <div style={{ ...L.card, maxWidth: 1060, width: "100%" }}>
        <div className="mono" style={L.kicker}>THE DONAGHY FAMILY GAME · TEST NIGHT</div>
        <div style={L.big}>Lights Out at Donaghy Castle</div>
        <p style={L.p}>
          Night has fallen on Donaghy Castle and the Black Knight walks the halls. Do your chores by torchlight,
          find the dropped helmets of the captured, ring the Great Bell, and send your suspect to the joust.
          If they&rsquo;re the Black Knight, they&rsquo;ll be knocked clean off their horse.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1fr)", gap: 26, marginTop: 14 }} className="castle-lobby-grid">
          <div>
            <div className="mono" style={{ ...L.kicker, color: "#f2dc9a" }}>1 · BUILD YOUR KNIGHT</div>
            <label style={{ display: "block", marginTop: 10 }}>
              <span className="mono" style={L.kicker}>YOUR NAME IN THE CASTLE</span>
              <input value={playerName} onChange={(e) => setName(e.target.value.slice(0, 20))} maxLength={20} placeholder="Sir Paul the Bold" style={{ ...L.select, marginTop: 6 }} />
            </label>
            <div style={{ marginTop: 8 }}><KnightBuilder look={look} setLook={setLook} /></div>
          </div>
          <div>
            <div className="mono" style={{ ...L.kicker, color: "#f2dc9a" }}>2 · SET UP THE NIGHT</div>
            <p style={{ ...L.p, color: "#a9a3c4", fontSize: 13 }}>
              Tonight it&rsquo;s you against the castle folk, who are all computer players. The family version, with everyone on their own laptop, comes next.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "10px 0 14px" }}>
              <label>
                <span className="mono" style={L.kicker}>PEOPLE IN THE CASTLE</span>
                <select value={total} onChange={(e) => setTotal(+e.target.value)} style={L.select}>
                  {[8, 9, 10, 11, 12].map((n) => <option key={n} value={n}>{n} (you + {n - 1})</option>)}
                </select>
              </label>
              <label>
                <span className="mono" style={L.kicker}>YOUR ROLE (FOR TESTING)</span>
                <select value={roleChoice} onChange={(e) => setRoleChoice(e.target.value)} style={L.select}>
                  {ROLE_OPTIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </label>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {Object.entries(ROLES).map(([k, r]) => (
                <div key={k} style={{ ...L.mini, borderColor: r.side === "dark" ? "#5a1520" : "#3a3560", padding: "8px 10px" }}>
                  <div style={{ fontWeight: 600, color: r.side === "dark" ? "#ff9a85" : "#f2dc9a", fontSize: 13 }}>{r.name}</div>
                  <div style={{ fontSize: 11.5, color: "#b9b3d6", marginTop: 3, lineHeight: 1.4 }}>{r.blurb}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12.5, color: "#c9c3e6", lineHeight: 1.7, margin: "14px 0" }}>
              <b style={{ color: "#f2dc9a" }}>Moving:</b> click where you want to go (or hold the mouse and steer), or arrows/WASD · <b>E</b> starts a chore · <b>R</b> report a helmet · <b>B</b> Great Bell ·
              <b> Q F 1 2 3</b> role powers · <b>H</b> the owl (help) · <b>N</b> music · <b>M</b> sound effects
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <button style={L.btn} onClick={start}>Enter the castle{playerName ? `, ${playerName}` : ""}</button>
              <button style={L.ghostBtn} onClick={openPractice}>Practice joust</button>
              <a href={backHref} style={{ color: "#8b95f6", fontSize: 13 }}>back to 13i.space</a>
            </div>
            {cup.length > 0 && <div className="mono" style={{ marginTop: 12, fontSize: 11, color: "#c9a227" }}>DONAGHY CUP: {pts} PTS FROM {cup.length} NIGHT{cup.length === 1 ? "" : "S"}</div>}
          </div>
        </div>
      </div>
      <style>{`@media (max-width: 860px){.castle-lobby-grid{grid-template-columns:1fr !important}}`}</style>
    </div>
  );
}
