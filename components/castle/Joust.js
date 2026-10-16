"use client";
// The tiltyard: the joust after a vote, and the practice joust you can play
// from the lobby (the waiting-room game).
import { useEffect, useRef, useState } from "react";
import { drawJoustScene, IMPACT } from "./draw";
import { castleSound as snd } from "../../lib/castle/sound";
import { randomLook, TABARDS } from "../../lib/castle/looks";

function useCanvasLoop(ref, draw, deps) {
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const g = cv.getContext("2d");
    let raf;
    const t0 = performance.now();
    const size = () => { const dpr = Math.min(2, window.devicePixelRatio || 1); cv.width = cv.clientWidth * dpr; cv.height = cv.clientHeight * dpr; };
    size();
    window.addEventListener("resize", size);
    const loop = (now) => { draw(g, cv.width, cv.height, (now - t0) / 1000); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", size); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

const T = {
  title: { fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic", color: "#f2e6c8", textShadow: "0 2px 12px rgba(0,0,0,0.7)" },
  sub: { color: "#e7dcc0", fontWeight: 600, textShadow: "0 2px 8px rgba(0,0,0,0.8)" },
  btn: { background: "linear-gradient(135deg, #f2dc9a, #c9a227)", color: "#1b1406", border: 0, borderRadius: 999, padding: "11px 22px", fontWeight: 700, fontSize: 15, cursor: "pointer" },
  ghostBtn: { background: "rgba(14,12,28,0.8)", color: "#f2e6c8", border: "1px solid #5a5390", borderRadius: 999, padding: "9px 18px", fontSize: 14, cursor: "pointer" },
};

// ---------- the prizes: a domino set for the winner, a fruitcake for the loser ----------
export function DominoSet({ size = 120 }) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 120 84" aria-label="A domino set">
      <rect x="4" y="30" width="112" height="50" rx="5" fill="#6b3a1e" stroke="#2a1608" strokeWidth="2" />
      <rect x="8" y="34" width="104" height="42" rx="3" fill="#8a5a2e" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i} transform={`translate(${14 + i * 16} ${i % 2 ? 6 : 12}) rotate(${i % 2 ? -8 : 6})`}>
          <rect width="13" height="26" rx="2.5" fill="#f4f1e8" stroke="#1b1406" strokeWidth="1.2" />
          <line x1="1.5" y1="13" x2="11.5" y2="13" stroke="#1b1406" strokeWidth="1" />
          {Array.from({ length: (i % 3) + 1 }).map((_, k) => <circle key={"a" + k} cx={4 + k * 2.6} cy={4 + k * 2.6} r="1.3" fill="#1b1406" />)}
          {Array.from({ length: ((i + 2) % 4) + 1 }).map((_, k) => <circle key={"b" + k} cx={4 + (k % 2) * 5} cy={17 + Math.floor(k / 2) * 5} r="1.3" fill="#1b1406" />)}
        </g>
      ))}
      <text x="60" y="62" textAnchor="middle" fontFamily="Georgia, serif" fontSize="11" fill="#f2dc9a">DOMINOES</text>
    </svg>
  );
}
export function Fruitcake({ size = 120 }) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 120 84" aria-label="A fruitcake">
      <ellipse cx="60" cy="74" rx="52" ry="7" fill="#d8d2c4" />
      <path d="M14 36 Q60 22 106 36 L104 68 Q60 80 16 68 Z" fill="#6b3a1e" stroke="#2a1608" strokeWidth="2" />
      <path d="M14 36 Q60 22 106 36 Q60 50 14 36 Z" fill="#8a4a22" />
      {[[30, 52, "#c0392b"], [48, 60, "#2e8b57"], [70, 50, "#e9c64a"], [86, 60, "#c0392b"], [58, 44, "#2e8b57"], [38, 64, "#e9c64a"], [78, 66, "#2e8b57"]].map(([x, y, c], i) => (
        <rect key={i} x={x} y={y} width="6" height="5" rx="1" fill={c} />
      ))}
      <path d="M40 30 Q60 18 80 30 Q70 36 60 33 Q50 36 40 30 Z" fill="#f4f1e8" opacity="0.9" />
      <circle cx="60" cy="26" r="4" fill="#c0392b" />
    </svg>
  );
}

// ---------- the joust after a vote ----------
export function VoteJoust({ accused, crowd, onDone }) {
  const ref = useRef(null);
  const [t, setT] = useState(0);
  const fired = useRef({});
  const lastQ = useRef(-1);
  const guilty = accused.role === "blackknight";
  const jester = accused.role === "jester";
  const scene = { left: { look: accused.look }, right: { look: accused.look, black: true }, loser: guilty ? "left" : "right", unmask: guilty, crowd };
  useCanvasLoop(ref, (g, w, h, time) => {
    const f = fired.current;
    if (time > 1.0 && !f.gallop) { f.gallop = 1; snd.gallop(2.4); }
    if (time > IMPACT && !f.crash) { f.crash = 1; snd.crash(); }
    if (time > 4.6 && !f.end) { f.end = 1; if (guilty) { snd.cheer(); snd.fanfare(); } else if (jester) snd.honk(); else snd.groan(); }
    drawJoustScene(g, w, h, Math.min(time, 9), scene);
    const q = Math.floor(time * 4);
    if (q !== lastQ.current) { lastQ.current = q; setT(time); }
  }, []);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
      <div style={{ position: "absolute", top: "5%", left: 0, right: 0, textAlign: "center", padding: "0 16px" }}>
        {t < IMPACT ? (
          <>
            <div style={{ ...T.title, fontSize: "clamp(28px, 5vw, 48px)" }}>The Joust</div>
            <div style={{ ...T.sub, fontSize: "clamp(15px, 2.2vw, 21px)", marginTop: 6 }}>{accused.name} rides against the Black Knight</div>
            <div style={{ color: "#b9b1d6", fontSize: 15, marginTop: 6, textShadow: "0 2px 8px #000" }}>If they are the Black Knight, they&rsquo;ll be knocked from the saddle...</div>
          </>
        ) : t > IMPACT + 1.3 ? (
          <>
            <div style={{ ...T.title, fontSize: "clamp(28px, 5vw, 50px)", color: guilty ? "#ff8a70" : jester ? "#d18cff" : "#f2e6c8" }}>
              {guilty ? `${accused.name} WAS the Black Knight!` : `${accused.name} was not the Black Knight.`}
            </div>
            <div style={{ ...T.sub, fontSize: "clamp(14px, 2vw, 19px)", marginTop: 8 }}>
              {guilty ? `The castle is saved! ${accused.name} gets the fruitcake.` : jester ? `...but the cap and bells give them away: ${accused.name} was the Jester, in league with the Black Knight!` : `The shadow knight vanishes in smoke. ${accused.name} wins a domino set, and rides off into the night, out of the game.`}
            </div>
          </>
        ) : null}
      </div>
      {t > 7 && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: "5%", textAlign: "center" }}>
          {onDone ? <button style={T.btn} onClick={onDone}>{guilty ? "See who lifts the Cup" : "Back to the castle"}</button>
            : <div style={{ ...T.sub, fontSize: 15 }}>{guilty ? "To the ending..." : "Back to the castle in a moment..."}</div>}
        </div>
      )}
    </div>
  );
}

// ---------- the practice joust (lobby game) ----------
export const CHALLENGERS = [
  ["Sir Hamish", 0.55], ["Lady Marjorie", 0.65], ["Wee Rab", 0.35], ["Old Agnes", 0.75], ["Fergus", 0.5], ["Dame Winifred", 0.85],
];
const DUEL_KEY = "donaghy-duels-v1";
function readDuels() { try { return JSON.parse(localStorage.getItem(DUEL_KEY) || '{"won":0,"lost":0}'); } catch { return { won: 0, lost: 0 }; } }
function saveDuels(d) { try { localStorage.setItem(DUEL_KEY, JSON.stringify(d)); } catch { /* private window */ } }

// how well a lance landed: 3 unhorsed, 2 shield struck (lance breaks), 1 glancing, 0 miss
function strike(offset, zone) {
  const a = Math.abs(offset);
  if (a < zone * 0.4) return 3;
  if (a < zone) return 2;
  if (a < 0.55) return 1;
  return 0;
}
const STRIKE_WORDS = ["missed", "a glancing blow", "a square hit on the shield", "UNHORSED them"];

export function PracticeJoust({ me, onExit }) {
  const [rival, setRival] = useState(null);
  const [record, setRecord] = useState({ won: 0, lost: 0 });
  useEffect(() => { setRecord(readDuels()); }, []);
  const looks = useRef(null);
  if (!looks.current) {
    const colors = TABARDS.filter((c) => c !== me.look.tabard);
    looks.current = CHALLENGERS.map(([name, skill], i) => ({ name, skill, look: randomLook(colors[i % colors.length]) }));
  }
  if (rival) return <Duel me={me} rival={rival} crowd={looks.current.filter((c) => c !== rival)} onExit={(won) => {
    if (won !== null) { const r = { ...record, [won ? "won" : "lost"]: record[won ? "won" : "lost"] + 1 }; saveDuels(r); setRecord(r); }
    setRival(null);
  }} />;
  return (
    <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse at 50% 0%, #1d1b3a 0%, #07070f 70%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 18, fontFamily: "Inter, system-ui, sans-serif" }}>
      <div style={{ background: "rgba(14,12,28,0.94)", border: "1px solid #3a3560", borderRadius: 10, padding: 26, maxWidth: 640, width: "100%", color: "#e7e1ff" }}>
        <div className="mono" style={{ fontSize: 10.5, letterSpacing: "1.5px", color: "#a9a3c4" }}>THE TILTYARD · WHILE EVERYONE GATHERS</div>
        <div style={{ ...T.title, fontSize: 34, color: "#f2dc9a", margin: "6px 0 8px" }}>Practice joust</div>
        <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "#d7d1ef", margin: "0 0 14px" }}>
          The winner takes home a domino set. The loser gets the fruitcake. Three passes. <b>Spam Space</b> to spur your horse: the faster rider hits harder. Move the mouse up and down (or ↑ ↓) to aim your lance at the green spot on
          their bobbing shield. A dead-centre hit at speed unhorses them and wins outright; a hit on the shield breaks your lance for 2 points; a glancing blow is 1.
        </p>
        <div className="mono" style={{ fontSize: 10.5, letterSpacing: "1.5px", color: "#a9a3c4", marginBottom: 8 }}>CHALLENGE SOMEONE</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 8 }}>
          {looks.current.map((c) => (
            <button key={c.name} onClick={() => { snd.unlock(); setRival(c); }} style={{ ...T.ghostBtn, borderRadius: 8, textAlign: "left", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 14, height: 14, borderRadius: 3, background: c.look.tabard, border: `2px solid ${c.look.trim}`, flexShrink: 0 }} />
              <span>{c.name}<span style={{ display: "block", fontSize: 11, color: "#8d87ad" }}>{c.skill > 0.7 ? "fearsome" : c.skill > 0.5 ? "steady" : "wobbly"}</span></span>
            </button>
          ))}
        </div>
        <p style={{ fontSize: 12, color: "#8d87ad", marginTop: 12 }}>
          Your tiltyard record: {record.won} won, {record.lost} lost. When the family version is live, you&rsquo;ll be able to challenge each other here while you wait for everyone to arrive.
        </p>
        <button style={{ ...T.ghostBtn, marginTop: 8 }} onClick={onExit}>Back to the castle gate</button>
      </div>
    </div>
  );
}

function Duel({ me, rival, crowd, onExit }) {
  const ref = useRef(null);
  const blank = () => ({ start: performance.now(), pL: 0, pR: 0, energy: 0, aim: 0, shieldY: 0, impact: false, impactAt: 0, meetL: 0, resolved: false, fired: {}, keys: {} });
  const st = useRef({ pass: 1, myPts: 0, theirPts: 0, run: blank() });
  const [view, setView] = useState({ pass: 1, msg: null, myPts: 0, theirPts: 0, over: null, energy: 0, phase: "ready" });
  const scene = useRef({ left: { look: me.look, aim: 0 }, right: { look: rival.look }, loser: null, broken: false, crowd, reticle: { y: 0, zone: 0.22, zoneY: 0 }, pos: { pL: 0, pR: 0, impact: false } });

  const newPass = () => {
    st.current.run = blank();
    const sc = scene.current;
    sc.loser = null; sc.broken = false; sc.pos = { pL: 0, pR: 0, impact: false }; sc.reticle = { y: 0, zone: 0.24 - st.current.pass * 0.02, zoneY: 0 };
    setView((v) => ({ ...v, pass: st.current.pass, msg: null, phase: "ready" }));
  };

  // spur with Space; aim with the mouse (up and down) or the arrow keys
  useEffect(() => {
    const kd = (e) => {
      const r = st.current.run;
      if (e.code === "Space") { e.preventDefault(); if (!e.repeat && !r.impact) { r.energy = Math.min(1, r.energy + 0.14); if (Math.random() < 0.5) snd.thud(); } }
      if (e.code === "ArrowUp" || e.code === "KeyW") { e.preventDefault(); r.keys.up = true; }
      if (e.code === "ArrowDown" || e.code === "KeyS") { e.preventDefault(); r.keys.down = true; }
    };
    const ku = (e) => { const r = st.current.run; if (e.code === "ArrowUp" || e.code === "KeyW") r.keys.up = false; if (e.code === "ArrowDown" || e.code === "KeyS") r.keys.down = false; };
    const mm = (e) => { const r = st.current.run; if (r.impact) return; r.aim = Math.max(-1, Math.min(1, (e.clientY / window.innerHeight - 0.5) / 0.3)); };
    window.addEventListener("keydown", kd); window.addEventListener("keyup", ku); window.addEventListener("mousemove", mm);
    return () => { window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); window.removeEventListener("mousemove", mm); };
  }, []);

  useCanvasLoop(ref, (g, w, h) => {
    const S0 = st.current, r = S0.run, sc = scene.current;
    const now = performance.now();
    const t = (now - r.start) / 1000;
    const dt = Math.min(0.05, (now - (r.last || now)) / 1000); r.last = now;
    if (!r.impact && t > 1.2) {
      if (!r.fired.go) { r.fired.go = 1; setView((v) => ({ ...v, phase: "charge" })); }
      r.energy = Math.max(0, r.energy - dt * 0.75);
      if (r.keys.up) r.aim = Math.max(-1, r.aim - dt * 2.2);
      if (r.keys.down) r.aim = Math.min(1, r.aim + dt * 2.2);
      const vL = 0.06 + r.energy * 0.34;
      const vR = 0.1 + rival.skill * 0.17 + Math.sin(t * 1.7) * 0.02;
      r.vL = vL; r.vR = vR;
      r.pL += vL * dt; r.pR += vR * dt;
      r.shieldY = Math.sin(t * (2.2 + vR * 9)) * 0.6;
      if (Math.floor(t * 3) !== r.gal) { r.gal = Math.floor(t * 3); snd.gallop(0.35); }
      if (r.pL + r.pR >= 1) { r.impact = true; r.impactAt = now; r.meetL = r.pL / (r.pL + r.pR); }
    }
    sc.left.aim = r.aim;
    sc.reticle.y = r.aim; sc.reticle.zoneY = r.shieldY;
    sc.pos = { pL: r.pL, pR: r.pR, impact: r.impact, after: r.impact ? (now - r.impactAt) / 1000 : 0, meetL: r.meetL };
    if (r.impact && !r.resolved) {
      r.resolved = true;
      const zone = sc.reticle.zone;
      const share = r.vL / (r.vL + r.vR);
      const err = Math.abs(r.aim - r.shieldY);
      let mine = err < zone * 0.5 ? (share >= 0.42 ? 3 : 2) : err < zone ? 2 : err < 0.5 ? 1 : 0;
      const theirErr = Math.random() * (1.2 - rival.skill);
      let theirs = theirErr < 0.12 ? (share <= 0.58 ? 3 : 2) : theirErr < 0.25 ? 2 : theirErr < 0.5 ? 1 : 0;
      S0.myPts += mine; S0.theirPts += theirs;
      if (mine === 3 && theirs < 3) sc.loser = "right";
      else if (theirs === 3 && mine < 3) sc.loser = "left";
      else if (mine >= 2 || theirs >= 2) sc.broken = true;
      if (sc.loser || sc.broken) snd.crash(); else snd.click();
      let over = null;
      if (sc.loser) over = sc.loser === "right" ? "won" : "lost";
      else if (S0.pass >= 3) over = S0.myPts > S0.theirPts ? "won" : S0.myPts < S0.theirPts ? "lost" : "draw";
      const speedWord = share > 0.55 ? "You charged faster" : share < 0.45 ? `${rival.name} charged faster` : "Neck and neck";
      const msg = `${speedWord}. You: ${STRIKE_WORDS[mine]}. ${rival.name}: ${theirs === 3 ? "UNHORSED you" : STRIKE_WORDS[theirs]}.`;
      setTimeout(() => {
        if (over === "won") { snd.cheer(); snd.fanfare(); } else if (over === "lost") snd.groan();
        setView((v) => ({ ...v, msg, myPts: S0.myPts, theirPts: S0.theirPts, over, phase: "done" }));
      }, 1300);
    }
    if (Math.floor(now / 100) !== r.tick) { r.tick = Math.floor(now / 100); setView((v) => (v.phase === "done" ? v : { ...v, energy: r.energy })); }
    drawJoustScene(g, w, h, t, sc);
  }, []);

  const next = () => { st.current.pass++; newPass(); };
  const again = () => { Object.assign(st.current, { pass: 1, myPts: 0, theirPts: 0 }); setView({ pass: 1, msg: null, myPts: 0, theirPts: 0, over: null, energy: 0, phase: "ready" }); newPass(); };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000", fontFamily: "Inter, system-ui, sans-serif", cursor: "ns-resize" }}>
      <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
      <div style={{ position: "absolute", top: "3%", left: 0, right: 0, textAlign: "center", pointerEvents: "none", padding: "0 16px" }}>
        <div style={{ ...T.title, fontSize: "clamp(24px, 4vw, 40px)" }}>{me.name} vs {rival.name}</div>
        <div style={{ ...T.sub, fontSize: 16, marginTop: 4 }}>Pass {view.pass} of 3 · {view.myPts} – {view.theirPts}</div>
        {view.phase === "ready" && <div style={{ ...T.title, fontSize: 30, marginTop: 8, color: "#ffe08a" }}>Ready...</div>}
        {view.phase === "charge" && (
          <div style={{ marginTop: 8 }}>
            <div style={{ color: "#ffe08a", fontSize: 17, fontWeight: 700, textShadow: "0 2px 8px #000" }}>SPAM SPACE to spur your horse! Move the mouse up and down (or ↑ ↓) to aim your lance at the green.</div>
            <div style={{ width: 260, height: 12, margin: "8px auto 0", background: "rgba(0,0,0,0.6)", border: "1px solid #c9a227", borderRadius: 6, overflow: "hidden" }}>
              <div style={{ width: `${view.energy * 100}%`, height: "100%", background: "linear-gradient(90deg,#c9a227,#ff8a3a)" }} />
            </div>
            <div className="mono" style={{ fontSize: 10, color: "#e7dcc0", marginTop: 3, letterSpacing: "1.5px" }}>YOUR SPEED</div>
          </div>
        )}
        {view.msg && <div style={{ ...T.sub, fontSize: 17, marginTop: 10 }}>{view.msg}</div>}
        {view.over && (
          <div style={{ ...T.title, fontSize: "clamp(26px, 4.5vw, 44px)", marginTop: 10, color: view.over === "won" ? "#f2dc9a" : view.over === "lost" ? "#ff9a85" : "#e7dcc0" }}>
            {view.over === "won" ? "Victory! The crowd roars." : view.over === "lost" ? `${rival.name} takes the day.` : "A draw. Honour is satisfied."}
          </div>
        )}
        {view.over && view.over !== "draw" && (
          <div style={{ display: "inline-flex", gap: 22, marginTop: 10, background: "rgba(10,8,20,0.75)", border: "1px solid #c9a227", borderRadius: 12, padding: "10px 18px", alignItems: "center" }}>
            <div style={{ textAlign: "center" }}><DominoSet size={110} /><div style={{ color: "#f2dc9a", fontSize: 13, fontWeight: 600 }}>{view.over === "won" ? me.name : rival.name} wins a domino set</div></div>
            <div style={{ textAlign: "center" }}><Fruitcake size={110} /><div style={{ color: "#e7dcc0", fontSize: 13, fontWeight: 600 }}>{view.over === "won" ? rival.name : me.name} gets the fruitcake</div></div>
          </div>
        )}
      </div>
      {view.phase === "done" && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: "5%", display: "flex", gap: 10, justifyContent: "center" }}>
          {!view.over && <button style={T.btn} onClick={next}>Next pass</button>}
          {view.over && <button style={T.btn} onClick={again}>Rematch</button>}
          <button style={T.ghostBtn} onClick={() => onExit(view.over === "won" ? true : view.over === "lost" ? false : null)}>Leave the tiltyard</button>
        </div>
      )}
    </div>
  );
}
