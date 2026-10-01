"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getStoryBrowserClient, storyConfigured } from "../../../lib/story/storySupabase";
import { TIMELINE_ID, GOAL_MOMENTS, MAX_MOMENTS, STAGES, livedStages, cleanTimeline } from "../../../lib/story/timeline";

// The interactive Life Timeline (Story Guide pp. 20-23). Good moments go above
// the line, hard ones below; the further from the line, the bigger it felt.
// The curve through every moment is their story arc so far.

const W = 1000, H = 480, L = 46, R = 36, AX = 240, UNIT = 34, TOP = 48, BOT = H - 34;
const POS = "#C25B34", NEG = "#256abf";

// Aaron's own example timeline from the Story Guide (pp. 20-21). Heights are approximate.
export const AARON_EXAMPLE = {
  age: 50,
  moments: [
    { id: "a1", age: 5, v: -3, text: "Kindergarten: teacher wouldn't let me go to the bathroom" },
    { id: "a2", age: 9, v: 3, text: "Traveled to England by myself to visit family" },
    { id: "a3", age: 12, v: -3, text: "Girls made fun of the clothes I wore" },
    { id: "a4", age: 13, v: 3, text: "Made the select travel soccer team" },
    { id: "a5", age: 16, v: 4, text: "Working, and met my best friend Dave" },
    { id: "a6", age: 17, v: -3, text: "Didn't get into the college I wanted" },
    { id: "a7", age: 19, v: 3, text: "Decided to go into teaching" },
    { id: "a8", age: 23, v: 3, text: "Moved to teach in Vegas" },
    { id: "a9", age: 28, v: -4, text: "Strange and difficult health issues" },
    { id: "a10", age: 32, v: 4, text: "Got married" },
    { id: "a11", age: 34.5, v: 5, text: "Birth of my two sons" },
    { id: "a12", age: 38, v: 4, text: "Traveled to Africa" },
    { id: "a13", age: 45, v: -3, text: "Began to lose my passion for teaching" },
    { id: "a14", age: 47, v: -5, text: "Lost my job teaching, in an ugly way" },
    { id: "a15", age: 49, v: 4, text: "Began a new life and career in Texas" },
  ],
};

const STAGE_SEEDS = [
  { key: "stage_0_5_memory", age: 3 },
  { key: "stage_5_12_memory", age: 8 },
  { key: "stage_12_18_memory", age: 15 },
  { key: "stage_18_26_memory", age: 18 },
];

function seedsFrom(by) {
  const s1 = (by["unit1-lesson1"]?.five_events || []).filter(Boolean).map((t) => ({ text: String(t), from: "Lesson 1" }));
  const s2 = STAGE_SEEDS.filter((x) => by["unit1-lesson2"]?.[x.key]).map((x) => ({ text: String(by["unit1-lesson2"][x.key]), age: x.age, from: "Your stages" }));
  return [...s1, ...s2];
}

const newId = () => Math.random().toString(36).slice(2, 9);
const short = (t, n = 26) => (t.length > n ? t.slice(0, n - 1).trimEnd() + "…" : t);

// A smooth curve through the points that never overshoots them
// (monotone cubic interpolation, Fritsch-Carlson), drawn as cubic Béziers.
function arcPath(pts) {
  if (pts.length < 2) return "";
  const n = pts.length, dx = [], m = [], t = [];
  for (let i = 0; i < n - 1; i++) { dx[i] = pts[i + 1].x - pts[i].x; m[i] = dx[i] ? (pts[i + 1].y - pts[i].y) / dx[i] : 0; }
  t[0] = m[0]; t[n - 1] = m[n - 2];
  for (let i = 1; i < n - 1; i++) t[i] = m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (!m[i]) { t[i] = 0; t[i + 1] = 0; continue; }
    const a = t[i] / m[i], b = t[i + 1] / m[i], h = a * a + b * b;
    if (h > 9) { const k = 3 / Math.sqrt(h); t[i] = k * a * m[i]; t[i + 1] = k * b * m[i]; }
  }
  let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += ` C${(pts[i].x + h).toFixed(1)},${(pts[i].y + t[i] * h).toFixed(1)} ${(pts[i + 1].x - h).toFixed(1)},${(pts[i + 1].y - t[i + 1] * h).toFixed(1)} ${pts[i + 1].x.toFixed(1)},${pts[i + 1].y.toFixed(1)}`;
  }
  return d;
}

// Place each label above (good) or below (hard) its dot, nudging it further out
// when it would collide with one already placed. Long labels shorten when crowded.
function layoutLabels(moments, x, selected) {
  const boxes = [], out = {};
  const dense = moments.length > 12;
  const order = [...moments].sort((a, b) => (a.id === selected ? -1 : b.id === selected ? 1 : a.age - b.age));
  for (const m of order) {
    const on = m.id === selected;
    const label = short(m.text, on ? 44 : dense ? 18 : 26);
    const tw = label.length * 6.9 + 8;
    const cx = Math.min(W - R - tw / 2, Math.max(L + tw / 2, x(m.age)));
    const cy = AX - m.v * UNIT, up = m.v > 0;
    const tries = up ? [cy - 15, cy - 30, cy - 45, cy + 26] : [cy + 24, cy + 39, cy + 54, cy - 14];
    let best = tries[0], bestHit = Infinity;
    for (const ty of tries) {
      const b = { x1: cx - tw / 2, x2: cx + tw / 2, y1: ty - 11, y2: ty + 3 };
      if (b.y1 < TOP || b.y2 > BOT) continue;
      const hit = boxes.reduce((n, o) => n + (b.x1 < o.x2 && b.x2 > o.x1 && b.y1 < o.y2 && b.y2 > o.y1 ? 1 : 0), 0);
      if (hit < bestHit) { best = ty; bestHit = hit; }
      if (!hit) break;
    }
    boxes.push({ x1: cx - tw / 2, x2: cx + tw / 2, y1: best - 11, y2: best + 3 });
    out[m.id] = { x: cx, y: best, label, faded: bestHit > 0 && !on };
  }
  return out;
}

export default function LifeTimeline({ compact = false, example = null, refresh = null }) {
  const readOnly = Boolean(example);
  const [status, setStatus] = useState(readOnly ? "ready" : "loading");
  const [data, setData] = useState(example || { age: 18, moments: [] });
  const [seeds, setSeeds] = useState([]);
  const [selected, setSelected] = useState(null);
  const [draft, setDraft] = useState(null);
  const [save, setSave] = useState("");
  const [ageInput, setAgeInput] = useState(null);
  const userRef = useRef(null);
  const svgRef = useRef(null);
  const dragRef = useRef(null);
  const dirtyRef = useRef(false);
  const textRef = useRef(null);

  useEffect(() => { if (example) setData(example); }, [example]);

  // Load their timeline plus the moments they've already named in the lessons.
  useEffect(() => {
    if (readOnly) return;
    if (!storyConfigured) { setStatus("not_configured"); return; }
    const sb = getStoryBrowserClient();
    (async () => {
      const { data: s } = await sb.auth.getSession();
      if (!s.session) { setStatus("signed_out"); return; }
      userRef.current = s.session.user.id;
      const { data: rows } = await sb.from("story_progress").select("lesson, captured").in("lesson", [TIMELINE_ID, "unit1-lesson1", "unit1-lesson2"]);
      const by = Object.fromEntries((rows || []).map((r) => [r.lesson, r.captured || {}]));
      if (by[TIMELINE_ID]) setData(cleanTimeline(by[TIMELINE_ID]));
      setSeeds(seedsFrom(by));
      setStatus("ready");
    })();
  }, [readOnly]);

  // As the lesson goes on, offer the new moments they've just named.
  useEffect(() => {
    if (readOnly || refresh === null || !userRef.current) return;
    const sb = getStoryBrowserClient();
    sb.from("story_progress").select("lesson, captured").in("lesson", ["unit1-lesson1", "unit1-lesson2"]).then(({ data: rows }) => {
      setSeeds(seedsFrom(Object.fromEntries((rows || []).map((r) => [r.lesson, r.captured || {}]))));
    });
  }, [refresh, readOnly]);

  // Save a moment after they stop changing things.
  useEffect(() => {
    if (readOnly || status !== "ready" || !dirtyRef.current) return;
    setSave("Saving…");
    const t = setTimeout(async () => {
      const sb = getStoryBrowserClient();
      const { error } = await sb.from("story_progress").upsert(
        { user_id: userRef.current, lesson: TIMELINE_ID, step: "draft", captured: cleanTimeline(data), updated_at: new Date().toISOString() },
        { onConflict: "user_id,lesson" }
      );
      setSave(error ? "Couldn't save just now" : "Saved");
      if (!error) dirtyRef.current = false;
    }, 900);
    return () => clearTimeout(t);
  }, [data, status, readOnly]);

  const change = useCallback((fn) => { if (readOnly) return; dirtyRef.current = true; setData((d) => fn(d)); }, [readOnly]);

  const maxAge = Math.max(26, data.age + (data.age >= 26 ? 3 : 0));
  const x = useCallback((a) => L + (a / maxAge) * (W - L - R), [maxAge]);
  const ageAt = (px) => ((px - L) / (W - L - R)) * maxAge;

  const sorted = useMemo(() => [...data.moments].sort((a, b) => a.age - b.age), [data.moments]);
  const arc = useMemo(() => arcPath([{ x: x(0), y: AX }, ...sorted.map((m) => ({ x: x(m.age), y: AX - m.v * UNIT })), { x: x(data.age), y: AX }]), [sorted, x, data.age]);

  const placedTexts = new Set(data.moments.map((m) => m.text.trim().toLowerCase()));
  const openSeeds = seeds.filter((s) => !placedTexts.has(s.text.trim().toLowerCase()));
  const stages = livedStages(data.age).filter((s) => s.from < 26 || data.age > 26);
  const stageHas = (s) => data.moments.some((m) => m.age >= s.from && m.age < Math.min(s.to, data.age + 0.01));
  const sel = data.moments.find((m) => m.id === selected) || null;
  const labels = useMemo(() => layoutLabels(data.moments, x, selected), [data.moments, x, selected]);

  function toSvg(e) {
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }
  const snap = (p, prevV = 1) => {
    const age = Math.min(data.age, Math.max(0, Math.round(ageAt(p.x) * 2) / 2));
    let v = Math.max(-5, Math.min(5, Math.round((AX - p.y) / UNIT)));
    if (v === 0) v = prevV > 0 ? 1 : -1;
    return { age, v };
  };

  function onDotDown(e, m) {
    e.stopPropagation();
    setSelected(m.id); setDraft(null);
    if (readOnly) return;
    dragRef.current = { id: m.id };
    svgRef.current.setPointerCapture?.(e.pointerId);
  }
  function onMove(e) {
    if (!dragRef.current) return;
    const p = toSvg(e);
    change((d) => ({ ...d, moments: d.moments.map((m) => (m.id === dragRef.current.id ? { ...m, ...snap(p, m.v) } : m)) }));
  }
  function onUp() { dragRef.current = null; }
  function onBackground(e) {
    if (readOnly || data.moments.length >= MAX_MOMENTS) { setSelected(null); return; }
    const p = toSvg(e);
    if (p.y < TOP || p.y > BOT) return;
    const s = snap(p, AX - p.y >= 0 ? 1 : -1);
    setSelected(null);
    setDraft({ text: "", ...s });
    setTimeout(() => textRef.current?.focus(), 30);
  }
  function onKey(e, m) {
    if (readOnly) return;
    const k = { ArrowLeft: [-0.5, 0], ArrowRight: [0.5, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }[e.key];
    if (!k) return;
    e.preventDefault();
    change((d) => ({ ...d, moments: d.moments.map((o) => {
      if (o.id !== m.id) return o;
      let v = Math.max(-5, Math.min(5, o.v + k[1]));
      if (v === 0) v = k[1] > 0 ? 1 : -1;
      return { ...o, age: Math.min(d.age, Math.max(0, o.age + k[0])), v };
    }) }));
  }

  function commitAge() {
    if (ageInput === null) return;
    const age = Math.min(80, Math.max(13, Math.round(Number(ageInput) || data.age)));
    setAgeInput(null);
    if (age !== data.age) change((d) => ({ ...d, age, moments: d.moments.map((m) => ({ ...m, age: Math.min(age, m.age) })) }));
  }

  function addDraft() {
    if (!draft?.text.trim()) return;
    const m = { id: newId(), text: draft.text.trim().slice(0, 120), age: draft.age, v: draft.v || 1 };
    change((d) => ({ ...d, moments: [...d.moments, m] }));
    setDraft(null); setSelected(m.id);
  }
  function placeSeed(s) {
    setSelected(null);
    setDraft({ text: s.text.slice(0, 120), age: Math.min(data.age, s.age ?? Math.round(data.age / 2)), v: 3 });
    setTimeout(() => textRef.current?.focus(), 30);
  }
  const editSel = (patch) => change((d) => ({ ...d, moments: d.moments.map((m) => (m.id === selected ? { ...m, ...patch } : m)) }));
  const removeSel = () => { change((d) => ({ ...d, moments: d.moments.filter((m) => m.id !== selected) })); setSelected(null); };

  function downloadPng() {
    const svg = svgRef.current.cloneNode(true);
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("width", W); svg.setAttribute("height", H);
    svg.querySelectorAll(".lt-hit").forEach((n) => n.remove());
    const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
    style.textContent = "text{font-family:Georgia,'Times New Roman',serif} .lt-sans{font-family:Helvetica,Arial,sans-serif}";
    svg.insertBefore(style, svg.firstChild);
    const blob = new Blob([new XMLSerializer().serializeToString(svg)], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const s = 2, c = document.createElement("canvas");
      c.width = W * s; c.height = (H + 70) * s;
      const g = c.getContext("2d");
      g.scale(s, s);
      g.fillStyle = "#F7F1E8"; g.fillRect(0, 0, W, H + 70);
      g.fillStyle = "#C25B34"; g.font = "bold 15px Helvetica, Arial, sans-serif";
      g.fillText("STORY OF SELF · MY LIFE TIMELINE", L, 36);
      g.drawImage(img, 0, 50, W, H);
      URL.revokeObjectURL(url);
      const a = document.createElement("a");
      a.download = "my-life-timeline.png";
      a.href = c.toDataURL("image/png");
      a.click();
    };
    img.src = url;
  }

  if (status === "loading") return <div className="lt lt-wait">Opening your timeline…</div>;
  if (status === "not_configured") return <div className="lt lt-wait">Accounts aren't switched on yet.</div>;
  if (status === "signed_out") {
    return (
      <div className="lt lt-wait">
        <p>Sign in so your timeline can be saved.</p>
        <a className="sos-btn" href="/story/start?next=/story/timeline">Sign in / create account</a>
      </div>
    );
  }

  const count = data.moments.length;
  const editing = draft || sel;

  return (
    <div className={`lt ${compact ? "lt-compact" : ""}`}>
      <div className="lt-head">
        <div>
          <div className="sos-eyebrow" style={{ marginBottom: 4 }}>{readOnly ? "Example" : "Your"} Life Timeline</div>
          <h3>{readOnly ? "Aaron's timeline, from the Story Guide" : "Plot the moments that made your story"}</h3>
          {!readOnly && <p>Good moments go above the line, hard ones below. The further from the line, the bigger it felt. Tap the timeline to add a moment, then drag it into place.</p>}
        </div>
        {!readOnly && (
          <label className="lt-age">
            I'm
            <input type="number" min={13} max={80} value={ageInput ?? data.age}
              onChange={(e) => setAgeInput(e.target.value)}
              onBlur={commitAge} onKeyDown={(e) => { if (e.key === "Enter") commitAge(); }} aria-label="Your age" />
            years old
          </label>
        )}
      </div>

      <div className="lt-scroll">
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="lt-svg" role="img"
          aria-label={`Life timeline with ${count} moments`}
          onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
          <defs>
            <linearGradient id="lt-arc" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={POS} /><stop offset="50%" stopColor="#8C7F74" /><stop offset="100%" stopColor={NEG} />
            </linearGradient>
            <pattern id="lt-hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="10" stroke="#E2D6C5" strokeWidth="2" />
            </pattern>
          </defs>
          <rect x="0" y="0" width={W} height={H} fill="transparent" onPointerDown={onBackground} />
          {STAGES.filter((s) => s.from < maxAge).map((s, i) => {
            const x1 = x(s.from), x2 = x(Math.min(s.to, maxAge));
            return (
              <g key={s.label} pointerEvents="none">
                <rect x={x1} y={TOP} width={x2 - x1} height={BOT - TOP} fill={i % 2 ? "#FFFCF7" : "#F3EADF"} opacity=".85" />
                <text x={(x1 + x2) / 2} y={18} textAnchor="middle" className="lt-sans" fontSize="13" fontWeight="700" fill="#2A2420">{s.label}</text>
                <text x={(x1 + x2) / 2} y={35} textAnchor="middle" fontSize="12.5" fontStyle="italic" fill="#8C7F74">{x2 - x1 > 110 ? s.name : ""}</text>
              </g>
            );
          })}
          {data.age < maxAge && (
            <g pointerEvents="none">
              <rect x={x(data.age)} y={TOP} width={x(maxAge) - x(data.age)} height={BOT - TOP} fill="url(#lt-hatch)" opacity=".7" />
              <text x={(x(data.age) + x(maxAge)) / 2} y={AX - 10} textAnchor="middle" fontSize={x(maxAge) - x(data.age) > 120 ? 14 : 0} fontStyle="italic" fill="#8C7F74">still being written</text>
            </g>
          )}
          <g pointerEvents="none">
            <text x={L + 8} y={TOP + 16} className="lt-sans" fontSize="11" fontWeight="700" letterSpacing="1.2" fill={POS}>POSITIVE ↑</text>
            <text x={L + 8} y={BOT - 8} className="lt-sans" fontSize="11" fontWeight="700" letterSpacing="1.2" fill={NEG}>NEGATIVE ↓</text>
            <line x1={L - 10} x2={W - R + 6} y1={AX} y2={AX} stroke="#2A2420" strokeWidth="2" />
            {Array.from({ length: Math.floor(maxAge / 2) + 1 }, (_, i) => i * 2).map((a) => (
              <g key={a}>
                <line x1={x(a)} x2={x(a)} y1={AX - 4} y2={AX + 4} stroke="#2A2420" strokeWidth="1" />
                <text x={x(a)} y={AX + 17} textAnchor="middle" className="lt-sans" fontSize="10" fill="#8C7F74">{a}</text>
              </g>
            ))}
            <line x1={x(data.age)} x2={x(data.age)} y1={TOP} y2={BOT + 4} stroke="#C99A3B" strokeWidth="2" strokeDasharray="5 5" />
            <text x={Math.min(W - R - 40, x(data.age))} y={H - 10} textAnchor="middle" className="lt-sans" fontSize="11" fontWeight="700" letterSpacing="1.2" fill="#A07A28">YOU ARE HERE</text>
            {count > 0 && <path d={arc} fill="none" stroke="url(#lt-arc)" strokeWidth="3.5" strokeLinecap="round" opacity=".55" />}
          </g>
          {sorted.map((m) => {
            const cx = x(m.age), cy = AX - m.v * UNIT, up = m.v > 0, c = up ? POS : NEG, on = m.id === selected;
            return (
              <g key={m.id} className="lt-moment" style={{ touchAction: "none", cursor: readOnly ? "pointer" : "grab" }}
                tabIndex={0} role="button" aria-label={`${m.text}, age ${m.age}, ${up ? "positive" : "negative"} ${Math.abs(m.v)} of 5`}
                onPointerDown={(e) => onDotDown(e, m)} onKeyDown={(e) => onKey(e, m)} onFocus={() => { setSelected(m.id); setDraft(null); }}>
                <line x1={cx} x2={cx} y1={AX} y2={cy} stroke={c} strokeWidth={on ? 3 : 2} opacity=".8" />
                <circle className="lt-hit" cx={cx} cy={cy} r="20" fill="transparent" />
                {on && <circle cx={cx} cy={cy} r="15" fill="none" stroke={c} strokeWidth="2" opacity=".45" />}
                <circle cx={cx} cy={cy} r={on ? 9.5 : 8} fill={c} stroke="#FFFCF7" strokeWidth="2.5" />
                {labels[m.id] && <text x={labels[m.id].x} y={labels[m.id].y} textAnchor="middle" fontSize="12.5" fill="#2A2420" opacity={labels[m.id].faded ? 0.35 : 1} fontWeight={on ? 600 : 400}>{labels[m.id].label}</text>}
              </g>
            );
          })}
          {draft && (
            <g pointerEvents="none">
              <line x1={x(draft.age)} x2={x(draft.age)} y1={AX} y2={AX - draft.v * UNIT} stroke="#8C7F74" strokeDasharray="3 3" strokeWidth="2" />
              <circle cx={x(draft.age)} cy={AX - draft.v * UNIT} r="8" fill="#FFFCF7" stroke="#8C7F74" strokeWidth="2.5" strokeDasharray="3 2" />
            </g>
          )}
        </svg>
      </div>

      <p className="lt-swipe">Swipe sideways to see your whole timeline.</p>
      {!readOnly && (
        <div className="lt-goals">
          <div className="lt-meter"><span style={{ width: `${Math.min(100, (count / GOAL_MOMENTS) * 100)}%` }} /></div>
          <b>{count >= GOAL_MOMENTS ? `${count} moments. That's a story.` : `${count} of ${GOAL_MOMENTS} moments`}</b>
          <div className="lt-stagepills">
            {stages.map((s) => <span key={s.label} className={stageHas(s) ? "on" : ""}>{stageHas(s) ? "✓ " : ""}{s.label}</span>)}
          </div>
          <small>Aaron's guide: aim for at least 10 moments, with at least one in every stage you've lived.</small>
        </div>
      )}

      {editing && !readOnly ? (
        <div className="lt-editor">
          <div className="lt-field lt-grow">
            <label htmlFor="lt-text">{draft ? "New moment" : "This moment"}</label>
            <input id="lt-text" ref={textRef} value={draft ? draft.text : sel.text} maxLength={120}
              placeholder="A few words are enough, e.g. Made the soccer team"
              onChange={(e) => (draft ? setDraft({ ...draft, text: e.target.value }) : editSel({ text: e.target.value }))}
              onKeyDown={(e) => { if (e.key === "Enter" && draft) addDraft(); }} />
          </div>
          <div className="lt-field lt-agef">
            <label htmlFor="lt-age">Age</label>
            <input id="lt-age" type="number" min={0} max={data.age} step={0.5} value={draft ? draft.age : sel.age}
              onChange={(e) => { const a = Math.min(data.age, Math.max(0, Number(e.target.value) || 0)); draft ? setDraft({ ...draft, age: a }) : editSel({ age: a }); }} />
          </div>
          <div className="lt-field lt-feel">
            <label htmlFor="lt-v">How it felt: <b style={{ color: (draft ? draft.v : sel.v) > 0 ? POS : NEG }}>{(draft ? draft.v : sel.v) > 0 ? "good" : "hard"}, {Math.abs(draft ? draft.v : sel.v)} of 5</b></label>
            <input id="lt-v" type="range" min={-5} max={5} step={1} value={draft ? draft.v : sel.v}
              onChange={(e) => { let v = Number(e.target.value); if (v === 0) v = (draft ? draft.v : sel.v) > 0 ? -1 : 1; draft ? setDraft({ ...draft, v }) : editSel({ v }); }} />
            <div className="lt-range-labels"><span>Hard</span><span>Good</span></div>
          </div>
          <div className="lt-editor-actions">
            {draft ? (
              <>
                <button className="sos-btn" onClick={addDraft} disabled={!draft.text.trim()}>Add to timeline</button>
                <button className="sos-btn ghost" onClick={() => setDraft(null)}>Cancel</button>
              </>
            ) : (
              <>
                <button className="sos-btn" onClick={() => setSelected(null)}>Done</button>
                <button className="sos-btn ghost lt-del" onClick={removeSel}>Remove</button>
              </>
            )}
          </div>
        </div>
      ) : sel && readOnly ? (
        <div className="lt-editor lt-readsel"><b>Age {sel.age}</b> {sel.text}</div>
      ) : !readOnly ? (
        <div className="lt-bar">
          <button className="sos-btn" disabled={count >= MAX_MOMENTS}
            onClick={() => { setDraft({ text: "", age: Math.round(data.age / 2), v: 2 }); setTimeout(() => textRef.current?.focus(), 30); }}>+ Add a moment</button>
          {openSeeds.length > 0 && (
            <div className="lt-seeds">
              <small>Moments you've already named. Tap one to place it:</small>
              <div>{openSeeds.map((s, i) => <button key={i} className="lt-seed" onClick={() => placeSeed(s)} title={s.from}>{short(s.text, 40)}</button>)}</div>
            </div>
          )}
        </div>
      ) : null}

      <div className="lt-foot">
        {!readOnly && <span className="lt-save">{save}</span>}
        <button className="lt-link" onClick={downloadPng} disabled={!count}>Download as an image</button>
        {compact && <a className="lt-link" href="/story/timeline">Open full screen →</a>}
      </div>
    </div>
  );
}
