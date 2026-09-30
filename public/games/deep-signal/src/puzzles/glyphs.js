// Eight alien glyphs, drawn from strokes in a unit box (-1..1). Used on
// glyph stones in the world and in the Symbol Sequence puzzle.

const G = [
  [["arc", 0, 0, 0.7], ["line", 0, -1, 0, 1]],
  [["line", -0.8, 0.7, 0, -0.8], ["line", 0, -0.8, 0.8, 0.7], ["line", -0.8, 0.7, 0.8, 0.7]],
  [["dot", -0.6, 0], ["dot", 0, 0], ["dot", 0.6, 0], ["line", -0.8, 0.6, 0.8, 0.6]],
  [["arc", 0, 0.9, 0.9, Math.PI, Math.PI * 2], ["line", 0, -0.9, 0, 0.2]],
  [["line", -0.8, -0.8, 0.8, 0.8], ["line", -0.8, 0.8, 0.8, -0.8], ["arc", 0, 0, 0.35]],
  [["line", -0.7, -0.8, -0.7, 0.8], ["line", 0.7, -0.8, 0.7, 0.8], ["line", -0.7, 0, 0.7, 0]],
  [["arc", -0.4, 0, 0.45], ["arc", 0.4, 0, 0.45], ["dot", 0, -0.8]],
  [["line", 0, -0.9, 0.8, 0], ["line", 0.8, 0, 0, 0.9], ["line", 0, 0.9, -0.8, 0], ["line", -0.8, 0, 0, -0.9], ["dot", 0, 0]],
];

export const GLYPH_COUNT = G.length;

export function drawGlyph(ctx, index, x, y, size, color = "#f3e3b5", alpha = 1, width = 1.6) {
  const s = size / 2;
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  G[index].forEach((st) => {
    ctx.beginPath();
    if (st[0] === "line") {
      ctx.moveTo(x + st[1] * s, y + st[2] * s);
      ctx.lineTo(x + st[3] * s, y + st[4] * s);
      ctx.stroke();
    } else if (st[0] === "arc") {
      ctx.arc(x + st[1] * s, y + st[2] * s, st[3] * s, st[4] || 0, st[5] || Math.PI * 2);
      ctx.stroke();
    } else if (st[0] === "dot") {
      ctx.arc(x + st[1] * s, y + st[2] * s, Math.max(1.5, s * 0.12), 0, Math.PI * 2);
      ctx.fill();
    }
  });
  ctx.restore();
}
