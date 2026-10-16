// The Donaghy arms, drawn rather than copied: a gold shield, a green mount
// rising from the base with a white boar upon it, and two red lions
// walking across the top. drawCrest draws the shield alone; drawCrestFull
// adds the steel helm, the green-and-gold mantling and the name scroll.

function shieldPath(g, w, h) {
  g.beginPath();
  g.moveTo(-w / 2, -h / 2);
  g.lineTo(w / 2, -h / 2);
  g.lineTo(w / 2, h * 0.05);
  g.quadraticCurveTo(w / 2, h * 0.38, 0, h / 2);
  g.quadraticCurveTo(-w / 2, h * 0.38, -w / 2, h * 0.05);
  g.closePath();
}

function lion(g, x, y, s) {
  g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = "#c8102e"; g.strokeStyle = "#2a0a0a"; g.lineWidth = 0.6;
  // body, walking to the viewer's left
  g.beginPath(); g.ellipse(0, 0, 9, 4.2, 0, 0, 7); g.fill(); g.stroke();
  // legs (one raised, passant)
  for (const [lx, up] of [[-6, 1], [-3.5, 0], [4, 0], [6.5, 0]]) {
    g.beginPath(); g.moveTo(lx, 2); g.lineTo(lx - (up ? 3 : 0.5), up ? 5 : 7); g.lineTo(lx - (up ? 5 : 2), up ? 4.5 : 7.5); g.lineTo(lx + 1.5, 2); g.closePath(); g.fill(); g.stroke();
  }
  // head with a mane, face turned out at you (guardant)
  g.beginPath(); g.arc(-9.5, -3.5, 4.4, 0, 7); g.fill(); g.stroke();
  for (let i = 0; i < 7; i++) { const a = (i / 7) * Math.PI * 2; g.beginPath(); g.arc(-9.5 + Math.cos(a) * 4.5, -3.5 + Math.sin(a) * 4.5, 1.4, 0, 7); g.fill(); }
  g.fillStyle = "#2a0a0a"; g.fillRect(-11.3, -4.6, 1.1, 1.1); g.fillRect(-8.9, -4.6, 1.1, 1.1);
  g.fillStyle = "#c8102e";
  // tail curling up over the back, with a tuft
  g.strokeStyle = "#c8102e"; g.lineWidth = 1.3; g.beginPath(); g.moveTo(8.5, -1); g.quadraticCurveTo(13, -6, 9, -9); g.stroke();
  g.beginPath(); g.arc(9, -9.5, 1.8, 0, 7); g.fill();
  g.restore();
}

function boar(g, x, y, s) {
  g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = "#f4f2ea"; g.strokeStyle = "#2a2a2a"; g.lineWidth = 0.7;
  g.beginPath(); g.ellipse(0, 0, 11, 6, 0, 0, 7); g.fill(); g.stroke();
  // bristly back
  g.beginPath(); for (let i = 0; i < 6; i++) { g.moveTo(-6 + i * 2.6, -5.2); g.lineTo(-5 + i * 2.6, -7.6); } g.stroke();
  // head and snout to the left, with a tusk
  g.beginPath(); g.moveTo(-9, -3); g.lineTo(-17, -1); g.lineTo(-17.5, 2.5); g.lineTo(-9, 3.5); g.closePath(); g.fill(); g.stroke();
  g.beginPath(); g.moveTo(-15, 2.4); g.quadraticCurveTo(-17, -1.5, -14.5, -2.5); g.stroke();
  g.fillStyle = "#2a2a2a"; g.beginPath(); g.arc(-12.5, -1, 0.8, 0, 7); g.fill();
  g.fillStyle = "#f4f2ea";
  g.beginPath(); g.moveTo(-9.5, -3.5); g.lineTo(-8, -7); g.lineTo(-7, -3.5); g.fill(); g.stroke();
  for (const lx of [-6, -3, 4, 7]) { g.beginPath(); g.rect(lx - 1.2, 4.5, 2.4, 5.5); g.fill(); g.stroke(); }
  g.beginPath(); g.moveTo(10.5, -1); g.quadraticCurveTo(14, -3, 12.5, 1); g.stroke();
  g.restore();
}

// shield only, centred on the origin, `h` tall
export function drawCrest(g, h) {
  const w = h * 0.84;
  g.save();
  shieldPath(g, w, h);
  g.fillStyle = "#e9c32a"; g.fill();
  g.save(); g.clip();
  // the green mount, rising in a stepped curve to a peak
  g.fillStyle = "#1f8a3a";
  g.beginPath();
  g.moveTo(-w / 2, h / 2);
  g.lineTo(-w / 2, h * 0.08);
  const steps = 7;
  for (let i = 0; i <= steps; i++) {
    const x = -w / 2 + (i / steps) * w;
    const peak = 1 - Math.abs(x) / (w / 2);
    const y = h * 0.1 - peak * h * 0.28;
    g.quadraticCurveTo(x - w / steps / 2, y - h * 0.035, x, y);
  }
  g.lineTo(w / 2, h / 2);
  g.closePath(); g.fill();
  g.restore();
  lion(g, -w * 0.24, -h * 0.3, h / 95);
  lion(g, w * 0.24, -h * 0.3, h / 95);
  boar(g, w * 0.02, h * 0.17, h / 80);
  shieldPath(g, w, h);
  g.strokeStyle = "#1b1406"; g.lineWidth = Math.max(1, h / 60); g.stroke();
  g.restore();
}

// the full achievement for the lobby: helm, mantling and the name scroll
export function drawCrestFull(g, h) {
  const sh = h * 0.42;
  g.save();
  // mantling: green and gold leaves sweeping out either side
  for (const d of [-1, 1]) {
    for (let i = 0; i < 4; i++) {
      g.fillStyle = i % 2 ? "#e9c32a" : "#1f8a3a";
      g.beginPath();
      const y0 = -h * 0.28 + i * h * 0.12;
      g.moveTo(d * sh * 0.2, y0);
      g.bezierCurveTo(d * sh * 0.9, y0 - h * 0.08, d * sh * 1.25, y0 + h * 0.05, d * sh * 1.05, y0 + h * 0.16);
      g.bezierCurveTo(d * sh * 0.85, y0 + h * 0.08, d * sh * 0.6, y0 + h * 0.12, d * sh * 0.3, y0 + h * 0.08);
      g.closePath(); g.fill();
      g.strokeStyle = "rgba(0,0,0,0.35)"; g.lineWidth = 1; g.stroke();
    }
  }
  // the steel helm
  g.save(); g.translate(0, -h * 0.3);
  g.fillStyle = "#c9ced8"; g.beginPath(); g.ellipse(0, 0, sh * 0.3, sh * 0.34, 0, 0, 7); g.fill();
  g.strokeStyle = "#5a5f6b"; g.lineWidth = 1.5; g.stroke();
  g.fillStyle = "#3a3e48"; for (let i = 0; i < 5; i++) g.fillRect(-sh * 0.18, -sh * 0.12 + i * sh * 0.06, sh * 0.36, sh * 0.025);
  g.fillStyle = "#e9c32a"; g.beginPath(); g.ellipse(0, -sh * 0.38, sh * 0.32, sh * 0.06, 0, 0, 7); g.fill();
  // the crest feathers
  for (const [a, c] of [[-0.5, "#e9c32a"], [0, "#1f8a3a"], [0.5, "#e9c32a"]]) {
    g.save(); g.translate(0, -sh * 0.42); g.rotate(a);
    g.fillStyle = c; g.beginPath(); g.ellipse(0, -sh * 0.18, sh * 0.07, sh * 0.2, 0, 0, 7); g.fill();
    g.restore();
  }
  g.restore();
  g.save(); g.translate(0, h * 0.05); drawCrest(g, sh * 1.1); g.restore();
  // the scroll
  g.fillStyle = "#f2efe6"; g.strokeStyle = "#5a5040"; g.lineWidth = 1.2;
  g.beginPath(); g.moveTo(-sh * 0.9, h * 0.36); g.quadraticCurveTo(0, h * 0.3, sh * 0.9, h * 0.36); g.lineTo(sh * 0.85, h * 0.46); g.quadraticCurveTo(0, h * 0.4, -sh * 0.85, h * 0.46); g.closePath(); g.fill(); g.stroke();
  g.fillStyle = "#1b1406"; g.font = `700 ${Math.round(h * 0.07)}px Georgia, serif`; g.textAlign = "center"; g.textBaseline = "middle";
  g.fillText("Donaghy", 0, h * 0.4);
  g.restore();
}
