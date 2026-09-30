// The city: one district of Nerath's energy network, seen from above.
// You are anchored at the core junction; towers stand on two rings, joined
// by conduits; supply chambers sit at the edges.

import { CENTER } from "./config.js";

export function buildCity() {
  const nodes = [];
  const add = (x, y, kind, ring) => {
    const n = { id: nodes.length, x, y, kind, ring, light: 1, pulse: Math.random() * 6 };
    nodes.push(n);
    return n;
  };
  const core = add(CENTER.x, CENTER.y, "core", 0);
  const inner = [];
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2 + Math.PI / 6;
    inner.push(add(CENTER.x + Math.cos(a) * 175, CENTER.y + Math.sin(a) * 128, "tower", 1));
  }
  const outer = [];
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
    outer.push(add(CENTER.x + Math.cos(a) * 355, CENTER.y + Math.sin(a) * 228, "tower", 2));
  }

  const links = [];
  const link = (a, b) => links.push({ id: links.length, a, b, mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2, flow: Math.random() });
  inner.forEach((n) => link(core, n));
  inner.forEach((n, i) => link(n, inner[(i + 1) % 6]));
  outer.forEach((n) => {
    let best = inner[0], bd = Infinity;
    inner.forEach((m) => { const d = Math.hypot(m.x - n.x, m.y - n.y); if (d < bd) { bd = d; best = m; } });
    link(best, n);
  });
  outer.forEach((n, i) => link(n, outer[(i + 1) % 10]));

  const chambers = [
    { x: 70, y: CENTER.y },
    { x: 930, y: CENTER.y },
  ];

  return { nodes, links, core, inner, outer, chambers, towers: [...inner, ...outer] };
}

// Where a fault on a site sits, and what it dims.
export function sitePos(city, site) {
  if (site.type === "node") return city.nodes[site.id];
  const l = city.links[site.id];
  return { x: l.mx, y: l.my };
}

export function siteKey(site) {
  return `${site.type}:${site.id}`;
}
