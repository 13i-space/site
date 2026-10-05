// The Alien Lab embryo (Update 5.59). What grows in the vat is NOT the
// species: it's an ambiguous proto-organism that could become almost
// anything. The answers nudge it - how it moves, its light, its membrane,
// how many cells and buds and eye-spots - subtly and cumulatively, and the
// whole combination is seeded from every answer so far, so no two runs grow
// alike. Only at the very end, after the anomaly and the cocoon, is the
// species revealed (the portrait, or the drawn specimen).
//
//   embryoState(get, progress)  -> a description of the organism right now
//   drawEmbryo(ctx, cx, cy, S, t, st, opts) -> draws it, alive
//
// Stages, by progress (0..1 of the questions):
//   I   origin       (< 0.3)  one strange cell, a flagellum, barely there
//   II  development  (< 0.65) dividing, structures appear, behaviour emerges
//   III unknown      (>= 0.65) unusual: ghosts of itself, light inside, a wrong shape for a moment
//   IV  transformation  (the anomaly, then a cocoon) - set by the Lab, not progress
//   V   revealed        - the Lab draws the species instead

function hash(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
const has = (re, v) => re.test(String(v || ""));

export const STAGE_NAMES = ["I · ORIGIN", "II · DEVELOPMENT", "III · UNKNOWN", "IV · TRANSFORMATION", "V · REVEALED"];

export function embryoState(get, progress = 0) {
  const ids = ["star_type", "gravity", "atmosphere", "terrain", "size", "symmetry", "limbs", "locomotion", "manipulation", "exterior", "primary_sense", "unique_sense", "temperament", "social_structure", "core_value", "tech_basis", "tech_level"];
  const answered = ids.filter((id) => get(id) !== undefined && get(id) !== "");
  const seed = hash(answered.map((id) => id + "=" + get(id)).join("|") || "origin");
  const r = (k) => ((Math.imul(seed ^ (k * 2654435761), 1597334677) >>> 0) % 1000) / 1000; // stable per seed

  const stage = progress < 0.3 ? 0 : progress < 0.65 ? 1 : 2;
  const v = (id) => get(id);

  // each answer shifts something, never shows the answer outright
  const limbsN = has(/^None/, v("limbs")) ? 0 : has(/^Two/, v("limbs")) ? 2 : has(/^Three/, v("limbs")) ? 3 : has(/^Six/, v("limbs")) ? 6 : has(/^Eight/, v("limbs")) ? 8 : v("limbs") ? 4 : 0;
  const social = has(/collective|hive/i, v("social_structure")) ? 3 : has(/family/i, v("social_structure")) ? 2 : v("social_structure") ? 1 : 0;
  return {
    seed,
    stage,
    progress,
    // light in the tank: its star
    hue: has(/red dwarf/, v("star_type")) ? 8 : has(/blue giant/, v("star_type")) ? 205 : has(/binary/, v("star_type")) ? 32 : has(/No true daylight/, v("star_type")) ? 265 : v("star_type") ? 48 : 230,
    // gravity: squat or stretched
    squash: has(/^Crushing|heavier/i, v("gravity")) ? 0.78 : has(/lighter/i, v("gravity")) ? 1.18 : 1,
    // what drifts in the tank with it
    env: has(/^Ocean/, v("terrain")) ? "bubbles" : has(/^Desert/, v("terrain")) ? "grains" : has(/^Ice/, v("terrain")) ? "crystals" : has(/forest|fungus/i, v("terrain")) ? "spores" : has(/caverns|Underground/i, v("terrain")) ? "dark" : "motes",
    toxic: has(/toxic|No atmosphere/i, v("atmosphere")),
    // growth: how big it's getting (size answer, but scrambled with the seed)
    growth: Math.min(1, progress * (has(/^Massive|^Large/, v("size")) ? 1.15 : has(/^Insect|^Small/, v("size")) ? 0.8 : 1) * (0.9 + r(1) * 0.2)),
    arrangement: has(/^Radial/, v("symmetry")) ? "ring" : has(/^Asym/, v("symmetry")) ? "scatter" : v("symmetry") ? "pair" : r(2) < 0.5 ? "pair" : "scatter",
    // buds that might be limbs, or might not
    buds: stage === 0 ? 0 : Math.max(0, Math.min(9, Math.round(limbsN * (0.6 + r(3) * 0.8)) + (r(4) < 0.3 ? 1 : 0))),
    motion: has(/^Flying|^Float/, v("locomotion")) ? "drift" : has(/^Swim/, v("locomotion")) ? "wriggle" : has(/^Slither/, v("locomotion")) ? "wriggle" : has(/rooted|don't move/i, v("locomotion")) ? "still" : v("locomotion") ? "pulse" : "pulse",
    tendrils: has(/Tentacle/i, v("manipulation")) ? 5 : has(/finger|thumb|claw/i, v("manipulation")) ? 3 : 1 + Math.floor(r(5) * 2),
    membrane: has(/exoskeleton|Scales/i, v("exterior")) ? "plate" : has(/^Fur/, v("exterior")) ? "cilia" : has(/bioluminescent/i, v("exterior")) ? "glow" : has(/glass/i, v("exterior")) ? "glass" : v("exterior") ? "smooth" : r(6) < 0.5 ? "smooth" : "cilia",
    spots: (v("primary_sense") ? (has(/^Sight/, v("primary_sense")) ? 3 : 1) : 0) + (v("unique_sense") ? 1 + Math.floor(r(7) * 2) : 0),
    activity: has(/^Aggressive/, v("temperament")) ? 0.95 : has(/^Curious/, v("temperament")) ? 0.75 : has(/^Cautious/, v("temperament")) ? 0.35 : has(/^Detached/, v("temperament")) ? 0.15 : 0.5,
    cells: 1 + Math.min(8, Math.floor(progress * 6 * (0.7 + r(8) * 0.6)) + social),
    pulseLight: has(/^Knowledge|^Harmony/, v("core_value")) ? 1 : 0,
    energy: has(/^(Energy|Gravitational)/, v("tech_basis")) ? 1 : has(/spacefaring|beyond/, v("tech_level")) ? 0.7 : 0,
    strange: stage === 2 ? 0.5 + r(9) * 0.5 : 0,
  };
}

const TAU = Math.PI * 2;

// opts: { look: {x, y} (where the viewer is, in canvas px) | null,
//         freeze: bool, stare: 0..1 (all eye-spots turn to the viewer),
//         wrong: 0..1 (it folds into a shape no body should take),
//         cocoon: 0..1 }
export function drawEmbryo(ctx, cx, cy, S, t, st, opts = {}) {
  const { look = null, freeze = false, stare = 0, wrong = 0, cocoon = 0 } = opts;
  const T = freeze ? opts.frozenAt ?? t : t;
  const rnd = (k) => ((Math.imul(st.seed ^ (k * 2654435761), 1597334677) >>> 0) % 1000) / 1000;
  const col = (l, a) => `hsla(${st.hue},70%,${l}%,${a})`;
  const R = S * (0.07 + 0.2 * st.growth);
  const act = st.activity;

  // movement
  let ox = 0, oy = 0, rot = 0, sc = 1;
  if (!freeze) {
    if (st.motion === "drift") { ox = Math.sin(T * 0.4 + rnd(1) * 6) * S * 0.05; oy = Math.cos(T * 0.53) * S * 0.04; }
    if (st.motion === "wriggle") rot = Math.sin(T * (1.2 + act * 2)) * 0.25;
    if (st.motion === "pulse") sc = 1 + Math.sin(T * (1 + act * 2)) * 0.05;
    if (st.motion !== "still") rot += T * 0.05 * (rnd(2) - 0.5);
    // the twitch: sudden small jumps, more often for restless things
    const tw = Math.sin(T * 7.3 + rnd(3) * 9) > 0.995 - act * 0.01 ? 1 : 0;
    ox += tw * S * 0.015 * (rnd(4) - 0.5) * 4;
  }
  ctx.save();
  ctx.translate(cx + ox, cy + oy);
  ctx.rotate(rot);
  ctx.scale(sc, sc * st.squash);

  // a soft light around it
  const halo = ctx.createRadialGradient(0, 0, R * 0.3, 0, 0, R * 2.6);
  halo.addColorStop(0, col(70, 0.22 + (st.membrane === "glow" ? 0.25 : 0)));
  halo.addColorStop(1, col(50, 0));
  ctx.fillStyle = halo; ctx.fillRect(-R * 2.6, -R * 2.6, R * 5.2, R * 5.2);

  // stage III: a ghost of itself, slightly out of step
  if (st.strange > 0 && !freeze) {
    const g = Math.max(0, Math.sin(T * 0.9 + rnd(5) * 5)) * st.strange;
    if (g > 0.3) {
      ctx.save(); ctx.globalAlpha = (g - 0.3) * 0.5; ctx.translate(Math.sin(T * 3) * R * 0.25, -R * 0.1);
      blob(ctx, R * 1.04, T + 0.7, st, 0, col, true);
      ctx.restore();
    }
  }

  // tendrils / flagella (behind)
  ctx.strokeStyle = col(72, 0.7); ctx.lineCap = "round";
  for (let i = 0; i < st.tendrils; i++) {
    const a = (i / st.tendrils) * TAU + rnd(10 + i) * 1.2 + Math.PI * 0.5;
    ctx.lineWidth = Math.max(1, R * 0.05);
    ctx.beginPath();
    let px = Math.cos(a) * R * 0.95, py = Math.sin(a) * R * 0.95;
    ctx.moveTo(px, py);
    for (let k = 1; k <= 8; k++) {
      const w = Math.sin(T * (2 + act * 3) - k * 0.8 + i) * R * 0.12 * (freeze ? 0 : 1);
      px += Math.cos(a) * R * 0.14 - Math.sin(a) * w * 0.4;
      py += Math.sin(a) * R * 0.14 + Math.cos(a) * w * 0.4;
      ctx.lineTo(px, py);
    }
    ctx.stroke();
  }

  // buds
  for (let i = 0; i < st.buds; i++) {
    const a = (i / Math.max(1, st.buds)) * TAU + rnd(20 + i) * 0.6;
    const b = R * (0.22 + 0.12 * rnd(30 + i)) * (0.6 + st.growth * 0.6);
    ctx.fillStyle = col(55, 0.35); ctx.strokeStyle = col(75, 0.6); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.ellipse(Math.cos(a) * R * 0.98, Math.sin(a) * R * 0.98, b, b * 0.75, a, 0, TAU); ctx.fill(); ctx.stroke();
  }

  // the body
  blob(ctx, R, T, st, wrong, col, false);

  // inside: cells / organelles
  const n = st.cells;
  for (let i = 0; i < n; i++) {
    let a, d;
    if (st.arrangement === "ring") { a = (i / n) * TAU + T * 0.1; d = n > 1 ? 0.5 : 0; }
    else if (st.arrangement === "pair") { a = (i % 2 ? 0 : Math.PI) + Math.floor(i / 2) * 0.6 - 0.3 + Math.sin(T * 0.3 + i) * 0.1; d = n > 1 ? 0.25 + Math.floor(i / 2) * 0.15 : 0; }
    else { a = rnd(40 + i) * TAU + Math.sin(T * 0.2 + i) * 0.4; d = n > 1 ? 0.2 + rnd(50 + i) * 0.45 : 0; }
    const cr = R * (n > 1 ? 0.18 + rnd(60 + i) * 0.1 : 0.32);
    const x = Math.cos(a) * d * R, y = Math.sin(a) * d * R;
    ctx.fillStyle = col(62, 0.25); ctx.strokeStyle = col(80, 0.5); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(x, y, cr, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.fillStyle = col(30, 0.7);
    ctx.beginPath(); ctx.arc(x + cr * 0.15, y - cr * 0.1, cr * 0.35, 0, TAU); ctx.fill();
  }

  // a light inside that comes and goes (knowledge, harmony, energy)
  const inner = (st.pulseLight * 0.5 + st.energy * 0.6) * (0.5 + 0.5 * Math.sin(T * 1.7));
  if (inner > 0.05) {
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 0.8);
    g.addColorStop(0, `rgba(255,240,210,${0.5 * inner})`); g.addColorStop(1, "rgba(255,240,210,0)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, R * 0.8, 0, TAU); ctx.fill();
  }

  // eye-spots: they wander, and sometimes they find you
  for (let i = 0; i < st.spots; i++) {
    const a0 = rnd(70 + i) * TAU;
    const base = { x: Math.cos(a0) * R * 0.55, y: Math.sin(a0) * R * 0.5 };
    const front = { x: (i - (st.spots - 1) / 2) * R * 0.28, y: -R * 0.1 };
    const x = base.x + (front.x - base.x) * stare, y = base.y + (front.y - base.y) * stare;
    const er = R * (0.07 + stare * 0.06);
    ctx.fillStyle = "rgba(4,3,12,0.9)";
    ctx.beginPath(); ctx.arc(x, y, er, 0, TAU); ctx.fill();
    // the glint leans toward the viewer
    let gx = 0, gy = 0;
    if (look || stare) {
      const lx = look ? look.x - cx : 0, ly = look ? look.y - cy : R * 3;
      const d = Math.hypot(lx, ly) || 1;
      gx = (lx / d) * er * 0.4; gy = (ly / d) * er * 0.4;
    }
    ctx.fillStyle = stare > 0.5 ? "rgba(255,225,150,0.95)" : "rgba(220,230,255,0.85)";
    ctx.beginPath(); ctx.arc(x + gx, y + gy, er * 0.32, 0, TAU); ctx.fill();
  }

  // the cocoon closing over it
  if (cocoon > 0) {
    ctx.globalAlpha = Math.min(1, cocoon);
    const cr = R * 1.5;
    const g = ctx.createRadialGradient(-cr * 0.3, -cr * 0.4, cr * 0.1, 0, 0, cr);
    g.addColorStop(0, col(40, 0.95)); g.addColorStop(1, col(12, 0.98));
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.ellipse(0, 0, cr * 0.85, cr * 1.15, 0, 0, TAU); ctx.fill();
    // glowing seams, breathing
    const glowA = 0.35 + 0.35 * Math.sin(t * 2.2);
    ctx.strokeStyle = `rgba(255,220,160,${glowA})`; ctx.lineWidth = Math.max(1, R * 0.04);
    for (let k = 0; k < 5; k++) {
      ctx.beginPath();
      ctx.ellipse(0, 0, cr * (0.85 - k * 0.04), cr * 1.15, 0, -1.2 + k * 0.5, -0.6 + k * 0.5);
      ctx.stroke();
    }
    // something moving inside
    const sx = Math.sin(t * 0.8) * cr * 0.3, sy = Math.cos(t * 0.6) * cr * 0.4;
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.beginPath(); ctx.ellipse(sx, sy, cr * 0.25, cr * 0.4, t * 0.3, 0, TAU); ctx.fill();
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}

// the membrane: a living edge, of whatever kind the answers made it
function blob(ctx, R, T, st, wrong, col, ghost) {
  const N = 64;
  const pts = [];
  for (let i = 0; i < N; i++) {
    const a = (i / N) * TAU;
    let r = R * (1 + 0.06 * Math.sin(3 * a + T * (0.8 + st.activity)) + 0.04 * Math.sin(5 * a - T * 1.1) + st.strange * 0.08 * Math.sin(7 * a + T * 2.3));
    if (wrong > 0) {
      // a triangle: a shape no living body should hold
      const tri = R * 1.1 / Math.cos(((a + Math.PI / 6) % (TAU / 3)) - Math.PI / 3);
      r = r + (Math.min(R * 1.6, tri) - r) * wrong;
    }
    pts.push([Math.cos(a) * r, Math.sin(a) * r]);
  }
  const g = ctx.createRadialGradient(-R * 0.3, -R * 0.3, R * 0.1, 0, 0, R * 1.1);
  g.addColorStop(0, col(78, ghost ? 0.15 : 0.32)); g.addColorStop(1, col(35, ghost ? 0.1 : 0.22));
  ctx.fillStyle = g;
  ctx.strokeStyle = col(80, ghost ? 0.4 : st.membrane === "glow" ? 0.95 : 0.75);
  ctx.lineWidth = Math.max(1, R * (st.membrane === "plate" ? 0.06 : 0.035));
  if (st.membrane === "glow" && !ghost) { ctx.shadowColor = col(70, 0.9); ctx.shadowBlur = R * 0.5; }
  ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.shadowBlur = 0;
  if (ghost) return;
  if (st.membrane === "cilia") {
    ctx.lineWidth = 1; ctx.strokeStyle = col(80, 0.5);
    pts.forEach(([x, y], i) => {
      if (i % 2) return;
      const a = Math.atan2(y, x) + Math.sin(T * 4 + i) * 0.3;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * R * 0.12, y + Math.sin(a) * R * 0.12); ctx.stroke();
    });
  }
  if (st.membrane === "plate") {
    ctx.strokeStyle = col(85, 0.45); ctx.lineWidth = 1;
    for (let k = 0; k < 6; k++) { ctx.beginPath(); ctx.arc(0, 0, R * 0.92, (k / 6) * TAU + 0.1, ((k + 1) / 6) * TAU - 0.1); ctx.stroke(); }
  }
  if (st.membrane === "glass") {
    ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = Math.max(1, R * 0.04);
    ctx.beginPath(); ctx.arc(-R * 0.25, -R * 0.25, R * 0.45, Math.PI * 1.1, Math.PI * 1.5); ctx.stroke();
  }
}
