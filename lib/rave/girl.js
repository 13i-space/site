// The girl (Update 5.70): a creepy little alien girl who only comes to the
// Halloween remix. She flickers in when the voice in the track speaks and
// mouths its words, floating centre stage in a cold spotlight while the
// lights die and the dancers hold still. Huge black eyes with a red pinprick,
// long black hair, a torn old nightgown, bare feet that never touch the floor,
// and a stitched doll of Ilu dangling from one hand.
// Drawn feet at (0,0), about 100 units tall. on 0..1, mouth 0..1.
import { TAU, lerp, clamp, glow, radial, linear, hash, tube } from "./draw";

const PI = Math.PI;
const SKIN = { lite: "#DCD8E8", mid: "#A8A2BE", dark: "#5E5878", line: "#2A2638" };

export function drawGirl(ctx, m, on, mouth) {
  if (on <= 0.01) return;
  const t = m.t;
  // flicker in and out, and now and then a glitch
  const glitchSeed = Math.floor(t * 7);
  const glitch = (hash(glitchSeed, 3) < (on < 0.9 ? 0.5 : 0.07)) ? 1 : 0;
  const flick = on < 1 ? (hash(Math.floor(t * 20), 9) < on ? 1 : 0.25) : 1;
  const alpha = on * flick;
  const hover = -6 - Math.sin(t * 1.3) * 2.2;
  // the head: a slow tilt, and a sudden twitch every few seconds
  const twitch = hash(Math.floor(t / 2.7), 5) < 0.4 && (t % 2.7) < 0.12 ? (hash(Math.floor(t / 2.7), 6) - 0.5) * 0.6 : 0;
  const tilt = Math.sin(t * 0.4) * 0.22 + twitch + mouth * 0.05 * Math.sin(t * 9);
  const draw = (dx) => {
    ctx.save();
    ctx.translate(dx, hover);
    ctx.rotate(Math.sin(t * 0.7) * 0.03);
    body(ctx, m, t, mouth, tilt);
    ctx.restore();
  };
  // her shadow on the floor, faint because she isn't quite standing on it
  ctx.save(); ctx.scale(1, 0.25); ctx.fillStyle = `rgba(0,0,0,${0.35 * alpha})`; ctx.beginPath(); ctx.arc(0, 0, 16, 0, TAU); ctx.fill(); ctx.restore();
  glow(ctx, 0, -2, 26, "rgba(150,255,190,0.6)", alpha * 0.35);
  ctx.save();
  ctx.globalAlpha = alpha * 0.96;
  draw(0);
  if (glitch) {
    // a torn double of her, red and cyan, sliding apart
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = alpha * 0.28;
    draw(2.2 + hash(glitchSeed, 4) * 2);
    draw(-2.2 - hash(glitchSeed, 7) * 2);
    ctx.globalCompositeOperation = "source-over";
  }
  ctx.restore();
}

function body(ctx, m, t, mouth, tilt) {
  // her long hair, behind everything
  ctx.save(); ctx.translate(0, -66); ctx.rotate(tilt); ctx.translate(0, 66);
  ctx.fillStyle = "#0A080E";
  ctx.beginPath(); ctx.moveTo(-15, -84);
  ctx.quadraticCurveTo(-19, -66, -16 + Math.sin(t * 0.9) * 1.4, -47);
  ctx.lineTo(16 + Math.sin(t * 0.9 + 1) * 1.4, -47);
  ctx.quadraticCurveTo(19, -66, 15, -84); ctx.closePath(); ctx.fill();
  ctx.restore();
  // legs: thin, bare, toes pointing down
  [[-4.6, 1], [4.6, -1]].forEach(([x, s], i) => {
    const sw = Math.sin(t * 1.1 + i * 2) * 1.2;
    tube(ctx, [x, -33], [x + s * 0.6, -22], [x + sw, -12], [x + sw * 1.4, -3], 3.4, 2, SKIN.mid, SKIN.line);
    ctx.fillStyle = SKIN.mid; ctx.beginPath(); ctx.ellipse(x + sw * 1.4, -1.6, 1.8, 2.8, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = SKIN.line; ctx.lineWidth = 0.3; ctx.stroke();
    [-1, 0, 1].forEach((k) => { ctx.strokeStyle = SKIN.mid; ctx.lineWidth = 0.8; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x + sw * 1.4 + k * 0.8, 0); ctx.lineTo(x + sw * 1.5 + k * 1.1, 2.4); ctx.stroke(); });
  });
  // the nightgown, torn at the hem, drifting
  const dr = Math.sin(t * 0.9) * 1.6;
  const gown = new Path2D();
  gown.moveTo(-9, -63);
  gown.quadraticCurveTo(-13, -48, -19 + dr, -32);
  for (let k = 0; k <= 10; k++) {
    const x = lerp(-19 + dr, 19 + dr, k / 10);
    const y = -32 + (k % 2 ? 3.6 + hash(k, 2) * 3 : -0.6) + Math.sin(t * 2 + k) * 0.6;
    gown.lineTo(x, y);
  }
  gown.quadraticCurveTo(13, -48, 9, -63);
  gown.closePath();
  ctx.fillStyle = linear(ctx, -19, -63, 19, -28, [[0, "#E4DED2"], [0.5, "#BDB6A8"], [1, "#7E776C"]]);
  ctx.fill(gown);
  ctx.save(); ctx.clip(gown);
  ctx.strokeStyle = "rgba(60,54,46,0.35)"; ctx.lineWidth = 0.5;
  for (let k = 0; k < 5; k++) { const x = -8 + k * 4; ctx.beginPath(); ctx.moveTo(x * 0.7, -58); ctx.quadraticCurveTo(x * 1.1, -45, x * 1.6 + dr, -30); ctx.stroke(); }
  // old stains
  ctx.fillStyle = "rgba(90,70,50,0.22)"; ctx.beginPath(); ctx.ellipse(6, -38, 4, 2.6, 0.4, 0, TAU); ctx.ellipse(-8, -44, 2.4, 3.2, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = "rgba(0,0,0,0.25)"; ctx.fillRect(-20, -40, 40, 12);
  ctx.restore();
  ctx.strokeStyle = "rgba(40,36,30,0.7)"; ctx.lineWidth = 0.4; ctx.stroke(gown);
  // lace collar and a dark ribbon
  ctx.fillStyle = "#F2EEE6";
  for (let k = -3; k <= 3; k++) { ctx.beginPath(); ctx.arc(k * 2.6, -61.5, 1.6, 0, PI); ctx.fill(); }
  ctx.fillStyle = "#3A0E18"; ctx.beginPath(); ctx.moveTo(-1.8, -60.5); ctx.lineTo(0, -59); ctx.lineTo(1.8, -60.5); ctx.lineTo(1.2, -57); ctx.lineTo(0, -58.4); ctx.lineTo(-1.2, -57); ctx.closePath(); ctx.fill();
  // arms: long and thin; one dangles, one holds the doll by a tentacle
  const swing = Math.sin(t * 0.8) * 1.5;
  tube(ctx, [-9, -60], [-12, -50], [-13 + swing * 0.5, -42], [-13 + swing, -34], 2.8, 1.8, SKIN.mid, SKIN.line);
  [-1, 0, 1].forEach((k) => { ctx.strokeStyle = SKIN.mid; ctx.lineWidth = 0.7; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-13 + swing, -34); ctx.quadraticCurveTo(-13 + swing + k * 0.8, -31.5, -13 + swing + k * 1.2, -29); ctx.stroke(); });
  tube(ctx, [9, -60], [13, -51], [14, -44], [13.5, -38], 2.8, 1.8, SKIN.mid, SKIN.line);
  doll(ctx, 13.5, -38, t);
  ctx.save(); ctx.translate(0, -66); ctx.rotate(tilt); ctx.translate(0, 66);
  // the head: a big pale alien skull, veined
  const head = new Path2D();
  head.moveTo(0, -101); head.bezierCurveTo(13, -101, 17, -90, 16, -81); head.bezierCurveTo(15, -71, 7, -63, 0, -62); head.bezierCurveTo(-7, -63, -15, -71, -16, -81); head.bezierCurveTo(-17, -90, -13, -101, 0, -101); head.closePath();
  ctx.fillStyle = radial(ctx, -4, -88, 22, [[0, SKIN.lite], [0.6, SKIN.mid], [1, SKIN.dark]], -6, -92); ctx.fill(head);
  ctx.save(); ctx.clip(head);
  ctx.strokeStyle = "rgba(80,90,160,0.35)"; ctx.lineWidth = 0.3;
  [[-9, -96, -5, -88, -9, -82], [8, -97, 4, -90, 9, -84], [0, -100, 1, -94, -1, -90]].forEach(([a, b, c, d, e, f]) => { ctx.beginPath(); ctx.moveTo(a, b); ctx.quadraticCurveTo(c, d, e, f); ctx.stroke(); });
  ctx.fillStyle = "rgba(40,30,60,0.35)"; ctx.beginPath(); ctx.ellipse(-7, -76, 6, 4, 0.3, 0, TAU); ctx.ellipse(7, -76, 6, 4, -0.3, 0, TAU); ctx.fill();
  ctx.restore();
  ctx.strokeStyle = SKIN.line; ctx.lineWidth = 0.4; ctx.stroke(head);
  // the eyes: huge, black, glossy, a red pinprick in each; wider when she speaks
  const wide = 1 + mouth * 0.12;
  [[-6.6, 1], [6.6, -1]].forEach(([ex, s]) => {
    ctx.save(); ctx.translate(ex, -82); ctx.rotate(s * -0.45); ctx.scale(wide, wide);
    ctx.fillStyle = "#030205"; ctx.beginPath(); ctx.ellipse(0, 0, 4.6, 7.4, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = radial(ctx, -1, -2, 6, [[0, "rgba(120,110,160,0.5)"], [1, "rgba(0,0,0,0)"]]); ctx.beginPath(); ctx.ellipse(0, 0, 4.6, 7.4, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#FF2A2A"; ctx.beginPath(); ctx.arc(0.4 * s, 1.2, 0.55, 0, TAU); ctx.fill();
    glow(ctx, 0.4 * s, 1.2, 2.2, "rgba(255,40,40,0.9)", 0.6);
    ctx.fillStyle = "rgba(255,255,255,0.85)"; ctx.beginPath(); ctx.ellipse(-1.6, -3.4, 1.2, 1.8, -0.3, 0, TAU); ctx.fill();
    ctx.restore();
  });
  // no nose: two slits
  ctx.strokeStyle = SKIN.line; ctx.lineWidth = 0.4;
  ctx.beginPath(); ctx.moveTo(-0.9, -73); ctx.lineTo(-0.6, -71.6); ctx.moveTo(0.9, -73); ctx.lineTo(0.6, -71.6); ctx.stroke();
  // the mouth: a small dark mouth that opens with the words, tiny sharp teeth
  const mo = clamp(mouth, 0, 1);
  const mh = 0.5 + mo * 3.6, mw = 2.6 + mo * 1.2;
  ctx.fillStyle = "#12060C"; ctx.beginPath(); ctx.ellipse(0, -67.4 + mh * 0.25, mw, mh, 0, 0, TAU); ctx.fill();
  if (mo > 0.25) {
    ctx.fillStyle = "#EDE6DA";
    for (let k = -2; k <= 2; k++) { const x = k * (mw * 0.36); ctx.beginPath(); ctx.moveTo(x - 0.4, -67.4 - mh * 0.7); ctx.lineTo(x, -67.4 - mh * 0.7 + 1.1); ctx.lineTo(x + 0.4, -67.4 - mh * 0.7); ctx.closePath(); ctx.fill(); }
  }
  ctx.strokeStyle = "rgba(30,20,30,0.5)"; ctx.lineWidth = 0.3; ctx.beginPath(); ctx.ellipse(0, -67.4 + mh * 0.25, mw, mh, 0, 0, TAU); ctx.stroke();
  // hair over the front: a parted fringe, strands hanging down past the face
  ctx.fillStyle = "#0A080E";
  ctx.beginPath(); ctx.moveTo(-15.4, -84); ctx.quadraticCurveTo(-14, -100, 0, -101.4); ctx.quadraticCurveTo(-6, -95, -11, -88); ctx.quadraticCurveTo(-13.6, -80, -13, -68); ctx.lineTo(-15.6, -70); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(15.4, -84); ctx.quadraticCurveTo(14, -100, 0, -101.4); ctx.quadraticCurveTo(7, -96, 11.6, -88); ctx.quadraticCurveTo(14, -80, 13.4, -66); ctx.lineTo(15.8, -70); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = "rgba(10,8,14,0.9)"; ctx.lineWidth = 0.8;
  for (let k = 0; k < 6; k++) {
    const s = k < 3 ? -1 : 1, x = s * (12.6 + (k % 3) * 1.2);
    ctx.beginPath(); ctx.moveTo(x, -70); ctx.quadraticCurveTo(x + Math.sin(t + k) * 1.2, -60, x + Math.sin(t * 0.8 + k) * 2, -48 - (k % 3) * 2); ctx.stroke();
  }
  ctx.strokeStyle = "rgba(160,150,190,0.18)"; ctx.lineWidth = 0.3;
  ctx.beginPath(); ctx.moveTo(-8, -98); ctx.quadraticCurveTo(-11, -92, -12.6, -84); ctx.stroke();
  ctx.restore(); // head tilt
}

// a stitched rag doll of Ilu, X for an eye, dangling by one tentacle
function doll(ctx, x, y, t) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 1.2) * 0.25);
  ctx.strokeStyle = "#8A4A6A"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 4); ctx.stroke();
  ctx.fillStyle = radial(ctx, -1, 7, 5, [[0, "#D88AAE"], [1, "#6E3050"]]); ctx.beginPath(); ctx.arc(0, 8, 4.4, 0, TAU); ctx.fill();
  ctx.strokeStyle = "#3A1428"; ctx.lineWidth = 0.35; ctx.stroke();
  ctx.strokeStyle = "#1A0810"; ctx.lineWidth = 0.6; ctx.beginPath(); ctx.moveTo(-1.6, 6.4); ctx.lineTo(1.2, 9.2); ctx.moveTo(1.2, 6.4); ctx.lineTo(-1.6, 9.2); ctx.stroke();
  ctx.strokeStyle = "#F0E6D8"; ctx.lineWidth = 0.25; for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.moveTo(-3 + k * 1.6, 11); ctx.lineTo(-2.6 + k * 1.6, 12); ctx.stroke(); }
  ctx.strokeStyle = "#8A4A6A"; ctx.lineWidth = 0.8;
  [-2.4, -0.8, 0.8, 2.4].forEach((k, i) => { ctx.beginPath(); ctx.moveTo(k, 11.6); ctx.quadraticCurveTo(k + Math.sin(t * 2 + i) * 0.8, 14, k * 1.2, 16); ctx.stroke(); });
  ctx.restore();
}
