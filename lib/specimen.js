// The specimen (Update 5.55): an Alien Lab species drawn in code from its
// answers, so every species has a body before (or without) a portrait.
// Used in the Lab's containment vat, where it takes shape question by
// question, and on the fourth side of the card when there's no portrait.
//
// specimenTraits(get) takes a getter: get("limbs") -> the answer text (or
// undefined while it isn't answered yet). drawSpecimen() draws it, alive.

const pick = (v, pairs, fallback) => {
  const s = String(v || "");
  for (const [re, out] of pairs) if (re.test(s)) return out;
  return fallback;
};

export function specimenTraits(get) {
  const has = (id) => get(id) !== undefined && get(id) !== null && get(id) !== "";
  return {
    known: {
      body: has("size") || has("symmetry"),
      limbs: has("limbs"),
      move: has("locomotion"),
      skin: has("exterior"),
      sense: has("primary_sense"),
      mind: has("temperament"),
    },
    size: pick(get("size"), [[/^Insect/, 0.45], [/^Small/, 0.62], [/^About human/, 0.78], [/^Large/, 0.92], [/^Massive/, 1.05]], 0.78),
    symmetry: pick(get("symmetry"), [[/^Radial/, "radial"], [/^Asym/, "asym"]], "bilateral"),
    limbs: pick(get("limbs"), [[/^None/, 0], [/^Two/, 2], [/^Three/, 3], [/^Four/, 4], [/^Six/, 6], [/^Eight/, 8]], 4),
    move: pick(get("locomotion"), [[/^Walking/, "walk"], [/^Slither/, "slither"], [/^Flying/, "fly"], [/^Swim/, "swim"], [/^Float/, "float"], [/^They don't move/, "rooted"]], "walk"),
    skin: pick(get("exterior"), [[/^Skin/, "skin"], [/^Scales/, "scales"], [/^Fur/, "fur"], [/exoskeleton/i, "shell"], [/bioluminescent/i, "glow"], [/glass/i, "glass"]], "skin"),
    sense: pick(get("primary_sense"), [[/^Sight/, "sight"], [/^Hearing/, "hearing"], [/^Smell/, "smell"], [/^Vibration/, "vibration"], [/electromagnetic/i, "field"]], "sight"),
    mood: pick(get("temperament"), [[/^Curious/, "curious"], [/^Cautious/, "cautious"], [/^Aggressive/, "aggressive"], [/^Detached/, "detached"]], "curious"),
    sky: pick(get("star_type"), [[/yellow/, "yellow"], [/binary/, "binary"], [/red dwarf/, "red"], [/blue giant/, "blue"], [/No true daylight/, "dark"]], "yellow"),
    terrain: pick(get("terrain"), [[/^Ocean/, "ocean"], [/^Desert/, "desert"], [/^Ice/, "ice"], [/forest|fungus/i, "forest"], [/caverns/i, "caves"]], "desert"),
  };
}

const SKINS = {
  skin: { fill: "rgba(232,180,200,0.22)", line: "#E8B4C8", glow: "rgba(232,180,200,0.5)" },
  scales: { fill: "rgba(111,195,168,0.22)", line: "#6FC3A8", glow: "rgba(111,195,168,0.5)" },
  fur: { fill: "rgba(224,170,110,0.24)", line: "#E0AA6E", glow: "rgba(224,170,110,0.45)" },
  shell: { fill: "rgba(150,130,100,0.3)", line: "#C9B98F", glow: "rgba(201,185,143,0.4)" },
  glow: { fill: "rgba(120,220,255,0.18)", line: "#8FE6FF", glow: "rgba(120,220,255,0.75)" },
  glass: { fill: "rgba(244,246,255,0.16)", line: "#F4F6FF", glow: "rgba(255,241,214,0.6)" },
};
const GHOST = { fill: "rgba(185,192,255,0.08)", line: "rgba(185,192,255,0.55)", glow: "rgba(139,149,246,0.35)" };

function soft(ctx, x, y, r, color, a) {
  if (r <= 0 || a <= 0) return;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color); g.addColorStop(1, "rgba(0,0,0,0)");
  const prev = ctx.globalAlpha;
  ctx.globalAlpha = prev * Math.min(1, a);
  ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
  ctx.globalAlpha = prev;
}

// Draws the specimen centred at (cx, cy) in a box about `S` px tall.
// t: seconds (for breathing, swaying, blinking). seed: varies small details.
export function drawSpecimen(ctx, cx, cy, S, t, tr, { seed = 1, mirror = false } = {}) {
  const k = tr.known;
  const pal = k.skin ? SKINS[tr.skin] : GHOST;
  const size = (k.body ? tr.size : 0.75) * S * 0.5;
  const breathe = 1 + Math.sin(t * 1.6 + seed) * 0.025;
  const bob = tr.move === "float" || tr.move === "fly" || tr.move === "swim" ? Math.sin(t * 1.2 + seed) * size * 0.08 : 0;
  ctx.save();
  ctx.translate(cx, cy + bob);
  if (mirror) ctx.scale(-1, 1);
  ctx.lineCap = "round"; ctx.lineJoin = "round";
  soft(ctx, 0, 0, size * 2.2, pal.glow, 0.35 + (tr.skin === "glow" ? 0.3 : 0));

  const bw = size * (tr.symmetry === "radial" ? 0.62 : 0.48) * breathe;
  const bh = size * (tr.symmetry === "radial" ? 0.62 : 0.72) * breathe;
  const limbCount = k.limbs ? tr.limbs : 0;

  // ── limbs / locomotion, drawn behind the body ──
  ctx.strokeStyle = pal.line; ctx.lineWidth = Math.max(1.2, size * 0.05);
  if (k.move && tr.move === "fly") {
    const flap = Math.sin(t * 6 + seed) * 0.35;
    [-1, 1].forEach((side) => {
      ctx.save(); ctx.scale(side, 1); ctx.rotate(-0.2 + flap * 0.6);
      ctx.beginPath(); ctx.moveTo(bw * 0.4, -bh * 0.2);
      ctx.quadraticCurveTo(bw * 2.4, -bh * 1.6, bw * 2.9, -bh * 0.1);
      ctx.quadraticCurveTo(bw * 1.8, -bh * 0.3, bw * 0.5, bh * 0.15);
      ctx.fillStyle = pal.fill; ctx.fill(); ctx.stroke(); ctx.restore();
    });
  }
  if (k.move && tr.move === "swim") {
    const sw = Math.sin(t * 3 + seed) * 0.4;
    ctx.beginPath(); ctx.moveTo(0, bh * 0.8);
    ctx.quadraticCurveTo(Math.sin(t * 3) * bw * 0.6, bh * 1.5, sw * bw, bh * 1.9);
    ctx.stroke();
    ctx.beginPath(); ctx.moveTo(sw * bw - bw * 0.5, bh * 2.1); ctx.lineTo(sw * bw, bh * 1.85); ctx.lineTo(sw * bw + bw * 0.5, bh * 2.1); ctx.stroke();
  }
  if (k.move && tr.move === "slither") {
    ctx.beginPath(); ctx.moveTo(0, bh * 0.7);
    for (let i = 1; i <= 12; i++) ctx.lineTo(Math.sin(i * 0.9 + t * 3) * bw * 0.5 * (1 - i / 16), bh * 0.7 + i * bh * 0.14);
    ctx.lineWidth = Math.max(2, size * 0.14); ctx.stroke(); ctx.lineWidth = Math.max(1.2, size * 0.05);
  }
  if (k.move && tr.move === "float") {
    for (let i = 0; i < 7; i++) {
      const x0 = (i / 6 - 0.5) * bw * 1.6;
      ctx.beginPath(); ctx.moveTo(x0, bh * 0.5);
      for (let j = 1; j <= 8; j++) ctx.lineTo(x0 + Math.sin(t * 2 + i + j * 0.6) * size * 0.05, bh * 0.5 + j * size * 0.12);
      ctx.globalAlpha = 0.7; ctx.stroke(); ctx.globalAlpha = 1;
    }
  }
  if (k.move && tr.move === "rooted") {
    for (let i = 0; i < 6; i++) {
      const a = (i / 5 - 0.5) * 1.6;
      ctx.beginPath(); ctx.moveTo(0, bh * 0.7);
      ctx.quadraticCurveTo(Math.sin(a) * size * 0.6, bh * 1.2, Math.sin(a) * size * 1.1, bh * 1.55 + Math.cos(i) * size * 0.1);
      ctx.stroke();
    }
  }
  // legs / arms (or radial arms)
  if (limbCount > 0) {
    for (let i = 0; i < limbCount; i++) {
      let ax, ay, a;
      if (tr.symmetry === "radial") {
        a = (i / limbCount) * Math.PI * 2 + t * 0.15;
        ax = Math.cos(a) * bw * 0.9; ay = Math.sin(a) * bh * 0.9;
        const L = size * 0.85, sway = Math.sin(t * 2 + i) * 0.25;
        ctx.beginPath(); ctx.moveTo(ax, ay);
        ctx.quadraticCurveTo(Math.cos(a + sway) * (bw + L * 0.6), Math.sin(a + sway) * (bh + L * 0.6), Math.cos(a + sway * 1.6) * (bw + L), Math.sin(a + sway * 1.6) * (bh + L));
        ctx.stroke();
      } else {
        const side = i % 2 ? 1 : -1;
        const row = Math.floor(i / 2), rows = Math.ceil(limbCount / 2);
        const yy = -bh * 0.3 + (rows > 1 ? (row / (rows - 1)) * bh * 0.9 : bh * 0.4);
        const asymJ = tr.symmetry === "asym" ? (i * 0.37) % 0.5 : 0;
        const walk = tr.move === "walk" ? Math.sin(t * 4 + i * 1.7) * 0.18 : Math.sin(t * 1.5 + i) * 0.1;
        const L = size * (0.9 + asymJ) * (row === 0 && limbCount >= 4 ? 0.8 : 1);
        ctx.beginPath(); ctx.moveTo(side * bw * 0.85, yy);
        const kx = side * (bw + L * 0.55), ky = yy + L * (0.15 + walk);
        ctx.quadraticCurveTo(kx, ky - L * 0.35, side * (bw + L * 0.75), yy + L * (0.85 - walk));
        ctx.stroke();
        ctx.beginPath(); ctx.arc(side * (bw + L * 0.75), yy + L * (0.85 - walk), size * 0.05, 0, Math.PI * 2); ctx.fillStyle = pal.line; ctx.fill();
      }
    }
  }

  // ── the body ──
  ctx.beginPath();
  if (tr.symmetry === "asym") {
    for (let i = 0; i <= 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      const r = 1 + 0.18 * Math.sin(a * 3 + seed) + 0.1 * Math.sin(a * 5);
      const x = Math.cos(a) * bw * r, y = Math.sin(a) * bh * r;
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
  } else {
    ctx.ellipse(0, 0, bw, bh, 0, 0, Math.PI * 2);
  }
  ctx.fillStyle = pal.fill; ctx.fill();
  ctx.strokeStyle = pal.line; ctx.lineWidth = Math.max(1.4, size * 0.055); ctx.stroke();
  // skin texture
  ctx.save(); ctx.clip();
  ctx.globalAlpha = 0.45; ctx.lineWidth = Math.max(0.8, size * 0.02);
  if (tr.skin === "scales" && k.skin) for (let y = -bh; y < bh; y += size * 0.16) for (let x = -bw; x < bw; x += size * 0.18) { ctx.beginPath(); ctx.arc(x + ((y / (size * 0.16)) % 2) * size * 0.09, y, size * 0.08, 0, Math.PI); ctx.stroke(); }
  if (tr.skin === "shell" && k.skin) for (let y = -bh; y < bh; y += size * 0.22) { ctx.beginPath(); ctx.moveTo(-bw, y); ctx.quadraticCurveTo(0, y - size * 0.12, bw, y); ctx.stroke(); }
  if (tr.skin === "fur" && k.skin) for (let i = 0; i < 70; i++) { const a = i * 2.4, r = (i % 7) / 7; ctx.beginPath(); ctx.moveTo(Math.cos(a) * bw * r, Math.sin(a) * bh * r); ctx.lineTo(Math.cos(a) * bw * r + size * 0.05, Math.sin(a) * bh * r + size * 0.07); ctx.stroke(); }
  if ((tr.skin === "glow" || tr.skin === "glass") && k.skin) for (let i = 1; i < 5; i++) { ctx.beginPath(); ctx.ellipse(0, 0, bw * (i / 5), bh * (i / 5), 0, 0, Math.PI * 2); ctx.stroke(); }
  ctx.restore();
  ctx.globalAlpha = 1;
  // heart-light
  soft(ctx, 0, bh * 0.15, size * 0.35, pal.glow, 0.5 + 0.3 * Math.sin(t * 2.2 + seed));

  // ── senses ──
  if (k.sense) {
    const blink = Math.sin(t * 0.7 + seed * 3) > 0.985 ? 0.15 : 1;
    const eye = (x, y, r) => {
      ctx.fillStyle = "#0A0B1C"; ctx.beginPath(); ctx.ellipse(x, y, r, r * blink, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = pal.line; ctx.lineWidth = Math.max(1, size * 0.025); ctx.stroke();
      ctx.fillStyle = tr.mood === "aggressive" ? "#E06A50" : "#FFF4DC";
      ctx.beginPath(); ctx.ellipse(x + Math.sin(t * 0.6 + seed) * r * 0.25, y, r * 0.42, r * 0.42 * blink, 0, 0, Math.PI * 2); ctx.fill();
    };
    if (tr.sense === "sight") {
      if (tr.symmetry === "radial") for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2 - Math.PI / 2; eye(Math.cos(a) * bw * 0.45, Math.sin(a) * bh * 0.45, size * 0.1); }
      else { eye(-bw * 0.38, -bh * 0.35, size * 0.15); eye(bw * 0.38, -bh * 0.35, size * 0.15); if (tr.symmetry === "asym") eye(bw * 0.05, -bh * 0.62, size * 0.08); }
    } else if (tr.sense === "hearing") {
      eye(-bw * 0.25, -bh * 0.3, size * 0.07); eye(bw * 0.25, -bh * 0.3, size * 0.07);
      [-1, 1].forEach((sd) => { ctx.beginPath(); ctx.moveTo(sd * bw * 0.7, -bh * 0.5); ctx.quadraticCurveTo(sd * bw * 1.6, -bh * 1.3, sd * bw * 1.1, -bh * 0.2); ctx.fillStyle = pal.fill; ctx.fill(); ctx.strokeStyle = pal.line; ctx.stroke(); });
    } else if (tr.sense === "smell") {
      eye(-bw * 0.3, -bh * 0.25, size * 0.08); eye(bw * 0.3, -bh * 0.25, size * 0.08);
      [-1, 1].forEach((sd) => { const w = Math.sin(t * 2 + sd) * 0.2; ctx.beginPath(); ctx.moveTo(sd * bw * 0.2, -bh * 0.9); ctx.quadraticCurveTo(sd * bw * (0.6 + w), -bh * 1.7, sd * bw * (0.9 + w), -bh * 1.9); ctx.strokeStyle = pal.line; ctx.stroke(); soft(ctx, sd * bw * (0.9 + w), -bh * 1.9, size * 0.12, pal.glow, 0.9); });
    } else if (tr.sense === "vibration") {
      for (let i = 0; i < 7; i++) { const x = (i / 6 - 0.5) * bw * 1.3; ctx.fillStyle = "#0A0B1C"; ctx.beginPath(); ctx.arc(x, -bh * 0.2 + Math.abs(x) * 0.25, size * 0.035, 0, Math.PI * 2); ctx.fill(); }
      ctx.strokeStyle = pal.line; ctx.globalAlpha = 0.4 + 0.3 * Math.sin(t * 5);
      for (let r = 1; r <= 2; r++) { ctx.beginPath(); ctx.ellipse(0, bh * 1.05, bw * r * 0.7, bh * r * 0.12, 0, 0, Math.PI * 2); ctx.stroke(); }
      ctx.globalAlpha = 1;
    } else if (tr.sense === "field") {
      for (let i = 0; i < 9; i++) { const a = -Math.PI / 2 + (i / 8 - 0.5) * 1.6; ctx.strokeStyle = pal.line; ctx.beginPath(); ctx.moveTo(Math.cos(a) * bw * 0.9, Math.sin(a) * bh * 0.9); ctx.lineTo(Math.cos(a) * bw * 1.5, Math.sin(a) * bh * 1.5); ctx.stroke(); soft(ctx, Math.cos(a) * bw * 1.55, Math.sin(a) * bh * 1.55, size * 0.1, "rgba(233,210,154,0.9)", 0.5 + 0.5 * Math.sin(t * 3 + i)); }
      eye(0, -bh * 0.2, size * 0.13);
    }
  }
  ctx.restore();
}

// What the lab knows so far, as a sentence for the readout under the vat
export function specimenReadout(tr) {
  const k = tr.known;
  const parts = [];
  if (k.body) parts.push(`${tr.symmetry} body`);
  if (k.limbs) parts.push(tr.limbs ? `${tr.limbs} limbs` : "no limbs");
  if (k.move) parts.push({ walk: "walks", slither: "slithers", fly: "flies", swim: "swims", float: "drifts", rooted: "rooted" }[tr.move]);
  if (k.skin) parts.push({ skin: "skin", scales: "scales", fur: "fur", shell: "plated shell", glow: "living light", glass: "glass" }[tr.skin]);
  if (k.sense) parts.push({ sight: "sees", hearing: "hears", smell: "scents", vibration: "feels vibration", field: "senses fields" }[tr.sense]);
  return parts.length ? parts.join(" · ") : "awaiting parameters";
}
