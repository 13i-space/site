// Helpers for Alien Lab portraits (Update 5.63).
//
// creatureOnly(svg): the portrait without its own backdrop. Portraits are
// drawn as a picture with a navy background (and often a sky gradient)
// filling the whole frame (its viewBox). Where the creature is placed
// into another scene - the lab's tank, the fourth side of the card (its own
// world) - those full-frame rectangles would show as a dark box, so they
// come out. Everything else (suns, horizon lines, the creature) stays.
//
// portraitSrc(svg): a data: URL for an <img>.

const RECT = /<rect\b[^>]*>/gi;

function frameOf(svg) {
  const vb = svg.match(/viewBox="\s*([-\d.]+)[\s,]+([-\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)\s*"/i);
  return vb ? { x: +vb[1], y: +vb[2], w: +vb[3], h: +vb[4] } : { x: 0, y: 0, w: 400, h: 400 };
}

function isFullFrame(tag, f) {
  const attr = (name) => {
    const m = tag.match(new RegExp(`\\s${name}="([^"]*)"`, "i"));
    return m ? m[1].trim() : null;
  };
  const w = attr("width"), h = attr("height");
  if (!w || !h) return false;
  const x = parseFloat(attr("x") || String(f.x)), y = parseFloat(attr("y") || String(f.y));
  const covers = (v, size) => v === "100%" || parseFloat(v) >= size * 0.97;
  return covers(w, f.w) && covers(h, f.h) && x <= f.x + f.w * 0.02 && y <= f.y + f.h * 0.02;
}

export function creatureOnly(svg) {
  if (!svg || typeof svg !== "string") return svg;
  const solo = creatureAlone(svg);
  if (solo) return solo;
  const f = frameOf(svg);
  return svg.replace(RECT, (tag) => (isFullFrame(tag, f) ? "" : tag));
}

// Update 5.64: portraits drawn (or repainted) since 5.63 keep the creature in
// <g id="creature">. Where it's there, take just that group (and the
// gradients it uses) - so on the card's fourth side the creature moves
// through its world, not the whole picture.
export function creatureAlone(svg) {
  if (!svg || typeof svg !== "string") return null;
  const m = svg.match(/<g\b[^>]*\bid=["']creature["'][^>]*>/i);
  if (!m) return null;
  const start = m.index;
  const re = /<\/?g\b[^>]*>/gi;
  re.lastIndex = start;
  let depth = 0, end = -1, t;
  while ((t = re.exec(svg))) {
    if (t[0][1] === "/") { depth--; if (depth === 0) { end = t.index + t[0].length; break; } }
    else if (!/\/>$/.test(t[0])) depth++;
  }
  if (end < 0) return null;
  const open = svg.match(/<svg\b[^>]*>/i);
  if (!open) return null;
  const defs = (svg.match(/<defs\b[\s\S]*?<\/defs>/gi) || []).join("");
  return `${open[0]}${defs}${svg.slice(start, end)}</svg>`;
}

export function portraitSrc(svg) {
  if (!svg) return null;
  const s = /xmlns=/.test(svg) ? svg : svg.replace(/<svg/i, '<svg xmlns="http://www.w3.org/2000/svg"');
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(s)}`;
}
