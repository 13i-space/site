// Text helpers. Mono = the signal's voice; serif italic = titles.

export const MONO = "'JetBrains Mono', ui-monospace, monospace";
export const SERIF = "'Fraunces', Georgia, serif";

export function font(size, { weight = 400, family = MONO, italic = false } = {}) {
  return `${italic ? "italic " : ""}${weight} ${size}px ${family}`;
}

export function text(ctx, str, x, y, { size = 12, color = "#f3e3b5", align = "left", baseline = "alphabetic", alpha = 1, spacing = 0, weight = 400, family = MONO, italic = false, glow = 0 } = {}) {
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.font = font(size, { weight, family, italic });
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;
  if ("letterSpacing" in ctx) ctx.letterSpacing = `${spacing}px`;
  if (glow) { ctx.shadowColor = color; ctx.shadowBlur = glow; }
  ctx.fillText(str, x, y);
  ctx.restore();
}

export function wrap(ctx, str, maxWidth, size, opts = {}) {
  ctx.save();
  ctx.font = font(size, opts);
  if ("letterSpacing" in ctx) ctx.letterSpacing = `${opts.spacing || 0}px`;
  const words = str.split(" ");
  const lines = [];
  let line = "";
  words.forEach((w) => {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else line = test;
  });
  if (line) lines.push(line);
  ctx.restore();
  return lines;
}

// Scramble characters for HUD glitches
const GLYPHS = "▖▗▘▙▚▛▜▝▞▟░▒#/\\|=+-";
export function scramble(str, amount) {
  return str.split("").map((c) => (c !== " " && Math.random() < amount ? GLYPHS[Math.floor(Math.random() * GLYPHS.length)] : c)).join("");
}

// A simple clickable/keyboard menu list. Returns the rects for hit-testing.
export function menuList(ctx, items, selected, x, y, { size = 14, gap = 34, align = "center", alpha = 1 } = {}) {
  const rects = [];
  items.forEach((label, i) => {
    const yy = y + i * gap;
    const on = i === selected;
    text(ctx, label, x, yy, { size, align, color: on ? "#fff4d6" : "#7c7c84", spacing: 3, alpha, glow: on ? 12 : 0 });
    ctx.save();
    ctx.font = font(size);
    if ("letterSpacing" in ctx) ctx.letterSpacing = "3px";
    const w = ctx.measureText(label).width;
    ctx.restore();
    const left = align === "center" ? x - w / 2 : x;
    if (on) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = "#f3e3b5";
      ctx.beginPath();
      ctx.arc(left - 16, yy - size * 0.35, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    rects.push({ x: left - 24, y: yy - size - 8, w: w + 48, h: size + 16 });
  });
  return rects;
}

export function hitIndex(rects, px, py) {
  return rects.findIndex((r) => px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h);
}
