// The knights themselves: top-down (in the castle), side-on (in the joust)
// and front-on (in the crowd and the builder). Every drawing takes a look
// from lib/castle/looks.js.

export function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const f = (v) => Math.max(0, Math.min(255, Math.round(amt < 0 ? v * (1 + amt) : v + (255 - v) * amt)));
  return `rgb(${f(r)},${f(g)},${f(b)})`;
}

export function drawEmblem(g, emblem, color, cx, cy, s) {
  g.save();
  g.translate(cx, cy);
  g.fillStyle = color; g.strokeStyle = color;
  g.lineWidth = Math.max(1, s * 0.28);
  if (emblem === "cross") { g.fillRect(-s * 0.14, -s * 0.5, s * 0.28, s); g.fillRect(-s * 0.5, -s * 0.14, s, s * 0.28); }
  else if (emblem === "saltire") { g.beginPath(); g.moveTo(-s * 0.45, -s * 0.45); g.lineTo(s * 0.45, s * 0.45); g.moveTo(s * 0.45, -s * 0.45); g.lineTo(-s * 0.45, s * 0.45); g.stroke(); }
  else if (emblem === "chevron") { g.beginPath(); g.moveTo(-s * 0.5, s * 0.3); g.lineTo(0, -s * 0.25); g.lineTo(s * 0.5, s * 0.3); g.stroke(); }
  else if (emblem === "star") {
    g.beginPath();
    for (let i = 0; i < 10; i++) { const r = i % 2 ? s * 0.22 : s * 0.5, a = -Math.PI / 2 + (i * Math.PI) / 5; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
    g.closePath(); g.fill();
  } else if (emblem === "lion") {
    g.beginPath(); g.arc(0, s * 0.12, s * 0.26, 0, 7); g.fill();
    for (let i = -1; i <= 1; i++) { g.beginPath(); g.arc(i * s * 0.22, -s * 0.24, s * 0.11, 0, 7); g.fill(); }
  }
  g.restore();
}

function weaponTop(g, w, steel) {
  g.lineCap = "round";
  if (w === "longsword" || w === "shortsword") {
    const len = w === "longsword" ? 25 : 17;
    g.strokeStyle = "#5a3a1e"; g.lineWidth = 3; g.beginPath(); g.moveTo(2, 11); g.lineTo(6, 11); g.stroke();
    g.strokeStyle = "#d9b54a"; g.lineWidth = 2; g.beginPath(); g.moveTo(6, 7.5); g.lineTo(6, 14.5); g.stroke();
    g.strokeStyle = "#dde3ec"; g.lineWidth = 2.6; g.beginPath(); g.moveTo(6.5, 11); g.lineTo(len, 11); g.stroke();
    g.strokeStyle = "rgba(255,255,255,0.7)"; g.lineWidth = 0.8; g.beginPath(); g.moveTo(8, 10.6); g.lineTo(len - 2, 10.6); g.stroke();
  } else if (w === "axe") {
    g.strokeStyle = "#6b4a26"; g.lineWidth = 2.6; g.beginPath(); g.moveTo(1, 11); g.lineTo(21, 11); g.stroke();
    g.fillStyle = "#c9ced8"; g.beginPath(); g.moveTo(16, 11); g.quadraticCurveTo(19, 2, 24, 4); g.quadraticCurveTo(22, 11, 24, 18); g.quadraticCurveTo(19, 20, 16, 11); g.fill();
  } else if (w === "mace") {
    g.strokeStyle = "#6b4a26"; g.lineWidth = 2.6; g.beginPath(); g.moveTo(1, 11); g.lineTo(16, 11); g.stroke();
    g.fillStyle = steel; g.beginPath(); g.arc(19, 11, 4.5, 0, 7); g.fill();
    g.fillStyle = "#e9ecf2"; for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; g.beginPath(); g.arc(19 + Math.cos(a) * 5, 11 + Math.sin(a) * 5, 1.3, 0, 7); g.fill(); }
  } else if (w === "spear") {
    g.strokeStyle = "#7a5a32"; g.lineWidth = 2.2; g.beginPath(); g.moveTo(-10, 11); g.lineTo(28, 11); g.stroke();
    g.fillStyle = "#dde3ec"; g.beginPath(); g.moveTo(27, 8); g.lineTo(35, 11); g.lineTo(27, 14); g.closePath(); g.fill();
  } else if (w === "bow") {
    // slung across the back
    g.strokeStyle = "#7a5a32"; g.lineWidth = 2.4; g.beginPath(); g.arc(-7, 0, 13, -1.25, 1.25); g.stroke();
    g.strokeStyle = "rgba(230,225,210,0.8)"; g.lineWidth = 0.8;
    g.beginPath(); g.moveTo(-7 + Math.cos(-1.25) * 13, Math.sin(-1.25) * 13); g.lineTo(-7 + Math.cos(1.25) * 13, Math.sin(1.25) * 13); g.stroke();
    g.fillStyle = "#5a3a1e"; g.fillRect(-12, 4, 6, 3); // quiver strap
  }
}

function helmetTop(g, look, t) {
  const c = look.helmet, s = look.helmetStyle;
  const hi = shade(c, 0.35), lo = shade(c, -0.35);
  if (s === "kettle") {
    g.fillStyle = lo; g.beginPath(); g.arc(1, 0, 9.5, 0, 7); g.fill();
    g.fillStyle = c; g.beginPath(); g.arc(1, 0, 6, 0, 7); g.fill();
  } else if (s === "hood") {
    g.fillStyle = shade(look.tabard, -0.45); g.beginPath(); g.arc(0, 0, 7.8, 0, 7); g.fill();
    g.fillStyle = "#e3b98f"; g.beginPath(); g.arc(4, 0, 3.2, -1.2, 1.2); g.fill();
    g.fillStyle = shade(look.tabard, -0.25); g.beginPath(); g.arc(-1, 0, 5, 0, 7); g.fill();
    return;
  } else if (s === "greathelm") {
    g.fillStyle = c; g.beginPath(); g.roundRect ? g.roundRect(-5.5, -6.5, 12, 13, 3) : g.rect(-5.5, -6.5, 12, 13); g.fill();
    g.fillStyle = "#1b1b22"; g.fillRect(5, -4, 1.8, 8);
    g.fillStyle = lo; g.fillRect(-5.5, -1, 12, 2);
  } else {
    g.fillStyle = c; g.beginPath(); g.arc(1, 0, 6.5, 0, 7); g.fill();
  }
  if (s === "crown") {
    g.fillStyle = "#e9c64a";
    for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; g.beginPath(); g.moveTo(1 + Math.cos(a) * 5, Math.sin(a) * 5); g.lineTo(1 + Math.cos(a + 0.3) * 8.5, Math.sin(a + 0.3) * 8.5); g.lineTo(1 + Math.cos(a + 0.6) * 5, Math.sin(a + 0.6) * 5); g.fill(); }
    g.fillStyle = "#c0392b"; g.beginPath(); g.arc(1, 0, 1.6, 0, 7); g.fill();
  } else if (s === "horned") {
    g.strokeStyle = "#efe3c4"; g.lineWidth = 2.6; g.lineCap = "round";
    for (const d of [-1, 1]) { g.beginPath(); g.moveTo(0, d * 5); g.quadraticCurveTo(0, d * 12, -6, d * 13); g.stroke(); }
  } else if (s === "plumed") {
    const sway = Math.sin(t * 3) * 1.5;
    g.fillStyle = look.trim; g.beginPath(); g.ellipse(-8, sway, 8, 3, 0, 0, 7); g.fill();
    g.fillStyle = shade(look.trim, -0.2); g.beginPath(); g.ellipse(-12, sway * 1.4, 4, 2, 0, 0, 7); g.fill();
  }
  if (s !== "greathelm") { g.fillStyle = "#2a2d36"; g.fillRect(5, -2.5, 2, 5); }
  g.fillStyle = hi; g.beginPath(); g.arc(-1, -2.5, 1.8, 0, 7); g.fill();
}

// top-down; the figure faces +x before rotation
export function drawKnightTop(g, look, o = {}) {
  const { facing = 0, walk = 0, moving = false, torch = true, t = 0, costume = null } = o;
  const steel = o.steel || (costume === "bk" ? "#2a2a33" : "#9aa0ad");
  g.save();
  g.rotate(facing);
  // boots
  const st = moving ? Math.sin(walk) * 4 : 0;
  g.fillStyle = "#3a2a1c";
  g.beginPath(); g.ellipse(st, -4.5, 3.6, 2.6, 0, 0, 7); g.ellipse(-st, 4.5, 3.6, 2.6, 0, 0, 7); g.fill();
  // cloak edge and tabard
  g.fillStyle = shade(look.tabard, -0.45); g.beginPath(); g.ellipse(-1, 0, 9, 13, 0, 0, 7); g.fill();
  g.fillStyle = look.tabard; g.beginPath(); g.ellipse(0.5, 0, 7.5, 11, 0, 0, 7); g.fill();
  if (costume === "jester") {
    // motley: half purple, half gold
    g.fillStyle = "#e9c64a"; g.beginPath(); g.ellipse(0.5, 0, 7.5, 11, 0, Math.PI, Math.PI * 2); g.fill();
    g.fillStyle = "#7d3c98"; for (let i = -1; i <= 1; i++) { g.beginPath(); g.moveTo(-3, i * 6 - 2); g.lineTo(0, i * 6); g.lineTo(-3, i * 6 + 2); g.lineTo(-6, i * 6); g.fill(); }
  }
  g.strokeStyle = look.trim; g.lineWidth = 1; g.beginPath(); g.ellipse(0.5, 0, 7.5, 11, 0, 0, 7); g.stroke();
  drawEmblem(g, look.emblem, look.trim, 4, 0, 7);
  // weapon (right side) and torch (left)
  weaponTop(g, look.weapon, steel);
  g.fillStyle = "#6b4a26"; g.fillRect(4, -11, 10, 3);
  if (torch) {
    const f = 1 + Math.sin(t * 17) * 0.15;
    g.fillStyle = "rgba(255,170,60,0.9)"; g.beginPath(); g.arc(15, -9.5, 3.6 * f, 0, 7); g.fill();
    g.fillStyle = "rgba(255,240,170,0.95)"; g.beginPath(); g.arc(15, -9.5, 1.7 * f, 0, 7); g.fill();
  }
  // pauldrons and hands
  g.fillStyle = steel;
  g.beginPath(); g.arc(0, -10, 4, 0, 7); g.arc(0, 10, 4, 0, 7); g.fill();
  g.fillStyle = shade(steel, 0.3); g.beginPath(); g.arc(-1, -11, 1.5, 0, 7); g.arc(-1, 9, 1.5, 0, 7); g.fill();
  if (costume === "jester") {
    // a three-pointed cap with bells instead of a helmet
    const sway = Math.sin(t * 4) * 0.15;
    for (const [a, c] of [[Math.PI - 0.9 + sway, "#7d3c98"], [Math.PI + sway, "#e9c64a"], [Math.PI + 0.9 + sway, "#7d3c98"]]) {
      g.fillStyle = c;
      g.beginPath(); g.moveTo(1 + Math.cos(a - 0.5) * 5, Math.sin(a - 0.5) * 5); g.lineTo(1 + Math.cos(a) * 15, Math.sin(a) * 15); g.lineTo(1 + Math.cos(a + 0.5) * 5, Math.sin(a + 0.5) * 5); g.fill();
      g.fillStyle = "#ffe08a"; g.beginPath(); g.arc(1 + Math.cos(a) * 15, Math.sin(a) * 15, 2.2, 0, 7); g.fill();
    }
    g.fillStyle = "#e3b98f"; g.beginPath(); g.arc(1, 0, 5.5, 0, 7); g.fill();
    g.fillStyle = "#7d3c98"; g.beginPath(); g.arc(-1, 0, 5.5, Math.PI / 2, Math.PI * 1.5); g.fill();
    g.fillStyle = "#c0392b"; g.beginPath(); g.arc(6, 0, 1.4, 0, 7); g.fill();
  } else helmetTop(g, look, t);
  if (costume === "bk") {
    // glowing red eyes in the visor
    g.fillStyle = `rgba(255,50,40,${0.75 + Math.sin(t * 5) * 0.25})`;
    g.fillRect(5.5, -3, 2, 2); g.fillRect(5.5, 1, 2, 2);
  }
  g.restore();
}

// side-on for the joust; faces +x (scale by dir). Feet at y = 0 on the horse.
export function drawKnightSide(g, look, o = {}) {
  const { black = false, unmasked = false, lance = true } = o;
  const armour = black ? "#17171d" : "#a7adb8";
  const tab = black ? "#0d0d12" : look.tabard;
  const trim = black ? "#5a1018" : look.trim;
  const helm = black ? "#1f1f27" : look.helmet;
  // leg in the stirrup
  g.fillStyle = armour; g.fillRect(-6, -40, 14, 32); g.fillRect(-2, -12, 16, 8);
  g.fillStyle = shade(armour, 0.25); g.beginPath(); g.arc(3, -38, 5, 0, 7); g.fill(); g.fillRect(-5, -30, 3, 18);
  g.fillStyle = "#c9a227"; g.fillRect(-2, -8, 16, 2);
  // body and tabard
  g.fillStyle = tab; g.fillRect(-12, -80, 26, 44);
  g.strokeStyle = trim; g.lineWidth = 2; g.strokeRect(-12, -80, 26, 44);
  if (!black) drawEmblem(g, look.emblem, look.trim, 1, -60, 16);
  g.fillStyle = "#6b4a26"; g.fillRect(-12, -46, 26, 4);
  // helmet
  const hy = -95;
  if (black || unmasked) {
    g.fillStyle = black ? helm : "#14141a"; g.beginPath(); g.arc(1, hy, 14, 0, 7); g.fill();
    g.fillStyle = "#ff3a2a"; g.fillRect(6, hy - 4, 6, 3); g.fillRect(-2, hy - 4, 5, 3);
    if (black) { g.fillStyle = "#8a1020"; g.beginPath(); g.moveTo(-4, hy - 12); g.quadraticCurveTo(-32, hy - 34, -38, hy - 2); g.quadraticCurveTo(-18, hy - 16, -2, hy - 6); g.fill(); }
  } else {
    const s = look.helmetStyle;
    if (s === "hood") {
      g.fillStyle = shade(look.tabard, -0.4); g.beginPath(); g.arc(0, hy, 15, 0, 7); g.fill();
      g.fillStyle = "#e3b98f"; g.beginPath(); g.arc(6, hy + 2, 8, -1.3, 1.3); g.fill();
      g.fillStyle = "#2a1c12"; g.fillRect(9, hy - 1, 2, 2);
    } else if (s === "greathelm") {
      g.fillStyle = helm; g.fillRect(-12, hy - 15, 27, 31);
      g.fillStyle = "#1b1b22"; g.fillRect(5, hy - 5, 10, 3); g.fillRect(9, hy + 4, 2, 2); g.fillRect(12, hy + 4, 2, 2);
      g.fillStyle = shade(helm, -0.3); g.fillRect(-12, hy - 15, 27, 3);
    } else {
      g.fillStyle = helm; g.beginPath(); g.arc(1, hy, 14, 0, 7); g.fill();
      g.fillStyle = "#2a2d36"; g.fillRect(4, hy - 3, 12, 3);
      if (s === "kettle") { g.fillStyle = shade(helm, -0.25); g.fillRect(-18, hy - 4, 38, 4); }
      if (s === "crown") { g.fillStyle = "#e9c64a"; g.fillRect(-12, hy - 16, 26, 5); for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(-12 + i * 8, hy - 16); g.lineTo(-8 + i * 8, hy - 26); g.lineTo(-4 + i * 8, hy - 16); g.fill(); } }
      if (s === "horned") { g.strokeStyle = "#efe3c4"; g.lineWidth = 5; g.lineCap = "round"; g.beginPath(); g.moveTo(-6, hy - 10); g.quadraticCurveTo(-14, hy - 34, -2, hy - 40); g.stroke(); }
      if (s === "plumed") { g.fillStyle = look.trim; g.beginPath(); g.moveTo(-2, hy - 12); g.quadraticCurveTo(-30, hy - 36, -40, hy - 4); g.quadraticCurveTo(-20, hy - 16, 0, hy - 6); g.fill(); }
    }
    g.fillStyle = "rgba(255,255,255,0.35)"; g.beginPath(); g.arc(-4, hy - 7, 3, 0, 7); g.fill();
  }
  // shield on the near arm
  g.fillStyle = tab;
  g.beginPath(); g.moveTo(-28, -78); g.lineTo(-4, -78); g.lineTo(-4, -50); g.quadraticCurveTo(-16, -34, -28, -50); g.closePath(); g.fill();
  g.strokeStyle = black ? "#444" : trim; g.lineWidth = 2.5; g.stroke();
  if (!black) drawEmblem(g, look.emblem, look.trim, -16, -62, 14);
  // lance, striped in the knight's colours
  if (lance) {
    g.save();
    g.translate(-6, -64); g.rotate(o.lanceAngle !== undefined ? o.lanceAngle : 0.06 + (o.lanceAim || 0) * 0.16);
    // a long tapering lance, striped in the knight's colours
    g.fillStyle = black ? "#2a2a33" : "#e8dcb8";
    g.beginPath(); g.moveTo(-14, -4); g.lineTo(150, -1.5); g.lineTo(162, 0); g.lineTo(150, 1.5); g.lineTo(-14, 4); g.closePath(); g.fill();
    if (!black) { g.fillStyle = look.tabard; for (let i = 0; i < 6; i++) { const x = 24 + i * 22, hw = 3.6 - i * 0.35; g.beginPath(); g.moveTo(x, -hw); g.lineTo(x + 10, -hw + 0.3); g.lineTo(x + 10, hw - 0.3); g.lineTo(x, hw); g.fill(); } }
    g.fillStyle = black ? "#3a3a44" : "#c9ced8"; g.beginPath(); g.arc(160, 0, 2.6, 0, 7); g.fill();
    // the vamplate (the steel guard over the hand)
    g.fillStyle = black ? "#2a2a33" : trim; g.beginPath(); g.moveTo(8, -13); g.quadraticCurveTo(30, 0, 8, 13); g.closePath(); g.fill();
    g.strokeStyle = "rgba(0,0,0,0.35)"; g.lineWidth = 1; g.stroke();
    g.restore();
    // the arm couching the lance
    g.fillStyle = armour; g.save(); g.translate(2, -74); g.rotate(0.5); g.fillRect(-4, 0, 9, 16); g.restore();
    g.fillStyle = shade(armour, -0.2); g.beginPath(); g.arc(-1, -63, 5, 0, 7); g.fill();
  }
}

// front-on, for the crowd and the builder preview. Origin at the waist.
export function drawKnightFront(g, look, o = {}) {
  const { cheer = 0, costume = null } = o;
  if (costume === "bk") look = { tabard: "#16161c", trim: "#b01020", helmet: "#24242c", helmetStyle: "greathelm", emblem: "plain", weapon: "longsword" };
  if (costume === "jester") look = { tabard: "#7d3c98", trim: "#e9c64a", helmet: "#e9c64a", helmetStyle: "hood", emblem: "plain", weapon: "mace" };
  const arm = -0.3 - cheer * 1.9;
  g.strokeStyle = look.tabard; g.lineWidth = 6; g.lineCap = "round";
  for (const d of [-1, 1]) {
    g.beginPath(); g.moveTo(d * 11, -22); g.lineTo(d * (11 + Math.cos(arm) * 0) + d * 6, -22 + Math.sin(arm) * 14 * (cheer ? 1.4 : -0.6)); g.stroke();
  }
  g.fillStyle = look.tabard;
  g.beginPath(); g.moveTo(-12, -26); g.lineTo(12, -26); g.lineTo(14, 6); g.lineTo(-14, 6); g.closePath(); g.fill();
  g.strokeStyle = look.trim; g.lineWidth = 1.5; g.stroke();
  drawEmblem(g, look.emblem, look.trim, 0, -12, 12);
  g.fillStyle = "#9aa0ad"; g.beginPath(); g.arc(-12, -25, 5, 0, 7); g.arc(12, -25, 5, 0, 7); g.fill();
  if (costume === "jester") {
    g.fillStyle = "#e9c64a"; g.beginPath(); g.moveTo(0, -26); g.lineTo(12, -26); g.lineTo(14, 6); g.lineTo(0, 6); g.closePath(); g.fill();
    g.fillStyle = "#e3b98f"; g.beginPath(); g.arc(0, -38, 9, 0, 7); g.fill();
    g.fillStyle = "#1b1406"; g.fillRect(-4, -40, 2, 2); g.fillRect(2, -40, 2, 2);
    g.strokeStyle = "#8a1020"; g.lineWidth = 1.5; g.beginPath(); g.arc(0, -36, 4, 0.2, Math.PI - 0.2); g.stroke();
    for (const [x, y, c] of [[-14, -54, "#7d3c98"], [0, -60, "#e9c64a"], [14, -54, "#7d3c98"]]) {
      g.fillStyle = c; g.beginPath(); g.moveTo(-8, -44); g.quadraticCurveTo(x * 0.6, y + 6, x, y); g.quadraticCurveTo(x * 0.3, -46, 8, -44); g.closePath(); g.fill();
      g.fillStyle = "#ffe08a"; g.beginPath(); g.arc(x, y, 3, 0, 7); g.fill();
    }
    return;
  }
  const s = look.helmetStyle, hy = -38, c = look.helmet;
  if (s === "hood") {
    g.fillStyle = shade(look.tabard, -0.4); g.beginPath(); g.arc(0, hy, 11, 0, 7); g.fill();
    g.fillStyle = "#e3b98f"; g.beginPath(); g.arc(0, hy + 2, 6.5, 0, 7); g.fill();
    g.fillStyle = "#2a1c12"; g.fillRect(-3, hy, 2, 2); g.fillRect(2, hy, 2, 2);
    return;
  }
  if (s === "greathelm") { g.fillStyle = c; g.fillRect(-10, hy - 11, 20, 23); g.fillStyle = "#1b1b22"; g.fillRect(-8, hy - 2, 16, 3); g.fillRect(-1, hy + 1, 2, 8); }
  else {
    g.fillStyle = c; g.beginPath(); g.arc(0, hy, 10, 0, 7); g.fill();
    g.fillStyle = "#2a2d36"; g.fillRect(-7, hy - 1, 14, 3);
  }
  if (s === "kettle") { g.fillStyle = shade(c, -0.25); g.fillRect(-16, hy - 4, 32, 4); }
  if (s === "crown") { g.fillStyle = "#e9c64a"; g.fillRect(-9, hy - 12, 18, 4); for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(-9 + i * 6, hy - 12); g.lineTo(-6 + i * 6, hy - 20); g.lineTo(-3 + i * 6, hy - 12); g.fill(); } }
  if (s === "horned") { g.strokeStyle = "#efe3c4"; g.lineWidth = 4; for (const d of [-1, 1]) { g.beginPath(); g.moveTo(d * 8, hy - 4); g.quadraticCurveTo(d * 20, hy - 6, d * 20, hy - 20); g.stroke(); } }
  if (s === "plumed") { g.fillStyle = look.trim; g.beginPath(); g.ellipse(0, hy - 16, 4, 9, 0, 0, 7); g.fill(); }
  if (costume === "bk") {
    g.fillStyle = "#ff3a2a"; g.fillRect(-6, hy - 2, 4, 3); g.fillRect(2, hy - 2, 4, 3);
    g.fillStyle = "#b01020"; g.beginPath(); g.ellipse(0, hy - 18, 4, 9, 0, 0, 7); g.fill();
  }
}

// a horse in caparison, side-on, facing +x (scale by dir)
export function drawHorse(g, ph, look, o = {}) {
  const { black = false } = o;
  const coat = black ? "#16161b" : o.coat || "#5a3a22";
  const cloth = black ? "#0f0f14" : look.tabard;
  const trim = black ? "#5a1018" : look.trim;
  g.save();
  g.translate(0, Math.sin(ph) * 3);
  g.strokeStyle = coat; g.lineWidth = 9; g.lineCap = "round";
  for (const [lx, off] of [[-38, 0], [-26, 1.6], [30, 3.1], [42, 4.7]]) {
    const a = Math.sin(ph + off) * 0.6;
    g.beginPath(); g.moveTo(lx, 10); g.lineTo(lx + Math.sin(a) * 26, 10 + Math.cos(a) * 26); g.lineTo(lx + Math.sin(a) * 26 + Math.sin(a * 1.6) * 20, 10 + Math.cos(a) * 26 + 20); g.stroke();
    g.fillStyle = "#222"; g.fillRect(lx + Math.sin(a) * 26 + Math.sin(a * 1.6) * 20 - 5, 10 + Math.cos(a) * 26 + 18, 10, 5);
  }
  const body = g.createLinearGradient(0, -26, 0, 26);
  body.addColorStop(0, shade(coat, 0.18)); body.addColorStop(1, shade(coat, -0.3));
  g.fillStyle = body;
  g.beginPath(); g.ellipse(0, 0, 58, 26, 0, 0, 7); g.fill();
  g.fillStyle = coat;
  g.beginPath(); g.moveTo(40, -10); g.lineTo(62, -50); g.lineTo(78, -56); g.lineTo(98, -32); g.lineTo(90, -22); g.lineTo(70, -34); g.lineTo(58, 6); g.closePath(); g.fill();
  // mane, eye, tail
  g.fillStyle = shade(coat, -0.4); g.beginPath(); g.moveTo(44, -14); g.lineTo(62, -52); g.lineTo(58, -50); g.lineTo(40, -12); g.fill();
  g.fillStyle = "#000"; g.beginPath(); g.arc(80, -44, 2, 0, 7); g.fill();
  g.strokeStyle = shade(coat, -0.3); g.lineWidth = 6; g.beginPath(); g.moveTo(-56, -8); g.quadraticCurveTo(-82, Math.sin(ph) * 8, -76, 32); g.stroke();
  // chanfron (armour on the face) with a plume, and an ear
  g.fillStyle = shade(coat, -0.2); g.beginPath(); g.moveTo(70, -54); g.lineTo(74, -66); g.lineTo(78, -55); g.fill();
  g.fillStyle = black ? "#2a2a33" : "#b9bec9"; g.beginPath(); g.moveTo(66, -48); g.lineTo(80, -54); g.lineTo(96, -32); g.lineTo(88, -26); g.closePath(); g.fill();
  g.strokeStyle = "rgba(255,255,255,0.35)"; g.lineWidth = 1; g.beginPath(); g.moveTo(70, -48); g.lineTo(90, -32); g.stroke();
  g.fillStyle = black ? "#8a1020" : look.tabard;
  g.beginPath(); g.moveTo(74, -54); g.quadraticCurveTo(70 + Math.sin(ph) * 3, -78, 60, -82); g.quadraticCurveTo(70, -70, 78, -54); g.fill();
  // nostril and the reins back to the rider's hand
  g.fillStyle = "#000"; g.beginPath(); g.arc(94, -31, 1.5, 0, 7); g.fill();
  g.strokeStyle = "#3a2210"; g.lineWidth = 1.8; g.beginPath(); g.moveTo(90, -28); g.quadraticCurveTo(50, -10 + Math.sin(ph) * 2, 14, -40); g.stroke();
  g.fillStyle = "#c9a227"; g.beginPath(); g.arc(90, -28, 2.2, 0, 7); g.fill();
  // caparison in the rider's colours, with the emblem
  g.fillStyle = cloth;
  g.beginPath(); g.moveTo(-52, -16); g.lineTo(48, -16); g.lineTo(54, 22); g.lineTo(38, 32); g.lineTo(20, 22); g.lineTo(2, 32); g.lineTo(-16, 22); g.lineTo(-34, 32); g.lineTo(-56, 20); g.closePath(); g.fill();
  g.strokeStyle = trim; g.lineWidth = 2.5; g.stroke();
  if (!black) drawEmblem(g, look.emblem, look.trim, 0, 4, 20);
  // saddle
  g.fillStyle = "#4a2e14"; g.fillRect(-12, -24, 30, 9);
  g.restore();
}
