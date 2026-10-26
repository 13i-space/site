// The director's cut (Update 6.16): a camera that films the Rave like a music
// video instead of drifting. It plans a song's shots once, from what's known
// about it - the beat grid, the measured energy, the drops and the special
// character's moments - and then films every frame the same way, so a song
// always gets the same cut (and can be recorded).
//
//   intro        a wide establishing shot, easing in on the booth
//   the build    a push in on the DJ, faster and shakier to the drop
//   the drop     a hard cut wide with a punch of zoom, then quick cuts round
//                the dancers on the beat
//   high energy  two-bar shots: wides, pairs, close-ups, the DJ
//   the groove   four-bar shots with slow pushes and trucks across the stage
//   breakdowns   long glides instead of cuts
//   the girl     revealed, then close on her face, two-shots with the dancers
//                she's among, their faces as they watch; whispering, held
//                close and unsteady
//   the end      a slow pull back, and a fade to black
//
// direct(...) returns where to look (a point on the stage, in the Rave's
// units), how far in (1 = the whole stage), and the fade and letterbox.
import { clamp, smooth, hash } from "./draw";

const DANCERS = ["varrow", "qeth", "ilu", "ixxen"];
const FACE = { varrow: 0.7, qeth: 0.72, ilu: 0.62, ixxen: 0.75 };
const easeIO = (k) => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);
const easeIn3 = (k) => k * k * k;
const lerp = (a, b, k) => a + (b - a) * k;

// ── planning ──
// info: { len (s), period (s per beat), offset (s), energy: [0-9 per 2 s],
//         drops: [s], voice: [{ start, end, kind, fadeTo }] }
export function planShots(info) {
  const { len, period, offset, energy = [], drops = [], voice = [], ending = null } = info;
  const bar = period * 4;
  const eAt = (s) => energy[Math.min(energy.length - 1, Math.max(0, Math.floor(s / 2)))] ?? 5;
  const onBar = (s) => offset + Math.ceil((s - offset) / bar - 0.001) * bar;
  const builds = drops.map((d) => [d - period * 8, d]);
  const vwin = voice.map((v) => [v.start - 0.4, (v.fadeTo || v.end) + 0.4, v.kind]);
  const END = ending ? ending.at : len - 12;
  // the moments a shot mustn't run across
  const events = [...new Set([...builds.flat(), ...vwin.flatMap((v) => [v[0], v[1]]), END])].filter((x) => x > 0).sort((a, b) => a - b);
  const nextEvent = (s) => events.find((x) => x > s + 0.05) ?? len;
  const inVoice = (s) => vwin.find(([a, b]) => s >= a && s < b);
  const inBuild = (s) => builds.find(([a, b]) => s >= a && s < b);
  const firstLoud = (() => { for (let i = 0; i < energy.length; i++) if (energy[i] >= 4) return i * 2; return 8; })();

  const shots = [];
  // too-short shots fold into the one before; the same shot twice running becomes a close-up
  const push = (sh) => {
    if (sh.t1 - sh.t0 <= 0.05) return;
    const prev = shots[shots.length - 1];
    if (prev && sh.t1 - sh.t0 < 1.2 && sh.punch == null && !sh.forced && !prev.fadeEnd) { prev.t1 = sh.t1; return; }
    if (prev && prev.a === sh.a && prev.b === sh.b && sh.punch == null && !sh.forced && sh.trans === "cut") {
      const d = DANCERS[Math.floor(hash(shots.length, 23) * 4)];
      sh.a = d; sh.b = d; sh.z0 = 2.7; sh.z1 = 3.0;
    }
    shots.push(sh);
  };
  let s = 0, n = 0, lastDancer = -1;
  const pickDancer = (salt) => { let i = Math.floor(hash(n, salt, 17) * 4); if (i === lastDancer) i = (i + 1) % 4; lastDancer = i; return DANCERS[i]; };

  // the intro: wide, easing in on the booth
  const introEnd = Math.min(firstLoud, nextEvent(0), END);
  push({ t0: 0, t1: introEnd, a: "stage", b: "dj", z0: 1.0, z1: 1.35, ease: "io", trans: "cut", shake: 0 });
  s = introEnd;
  while (s < len - 0.05 && n < 2000) {
    n++;
    if (s >= END && ending) { // the ending moment (Update 6.17): in on what's left behind
      push({ t0: s, t1: len, a: ending.focus === "doll" ? "girlBody" : ending.focus, b: ending.focus, z0: 1.6, z1: 2.7, ease: "io", trans: "cut", forced: true, shake: 0.04, fadeEnd: true });
      break;
    }
    if (s >= END) { // the end: a slow pull back
      push({ t0: s, t1: len, a: shots.length ? shots[shots.length - 1].b : "stage", b: "stage", z0: 1.9, z1: 1.0, ease: "io", trans: "glide", glide: 2.5, shake: 0, fadeEnd: true });
      break;
    }
    const bd = inBuild(s);
    if (bd) { // the build: in on the DJ, faster to the drop
      push({ t0: s, t1: bd[1], a: "dj", b: "dj", z0: 1.5, z1: 3.1, ease: "in3", trans: "cut", shake: 0.15, shakeUp: 0.8, forced: true });
      s = bd[1];
      // the drop: a hard cut wide, with a punch
      const t1 = Math.min(s + bar, nextEvent(s));
      push({ t0: s, t1, a: "stage", b: "stage", z0: 1.0, z1: 1.06, ease: "io", trans: "cut", shake: 0.35, punch: s });
      s = t1;
      continue;
    }
    const vw = inVoice(s);
    const t1max = nextEvent(s);
    if (vw) { // the girl
      const [va, vb, kind] = vw;
      const first = s - va < 0.5;
      const whisper = kind === "whisper";
      let sh;
      if (first) sh = { a: "girlBody", b: "girlBody", z0: 1.15, z1: 2.0, len: bar * 2, ease: "io", shake: 0 };
      else {
        const r = hash(n, Math.floor(va), 5);
        const d = pickDancer(3);
        if (whisper) sh = r < 0.6 ? { a: "girl", b: "girl", z0: 3.2, z1: 3.9, len: bar * 3, shake: 0.55 } : { a: "two:" + d, b: "two:" + d, z0: 1.7, z1: 1.9, len: bar * 2, shake: 0.35 };
        else if (r < 0.38) sh = { a: "girl", b: "girl", z0: 3.0, z1: 3.5, len: bar * 2, shake: 0.12 };
        else if (r < 0.62) sh = { a: "two:" + d, b: "two:" + d, z0: 1.9, z1: 2.15, len: bar * 2, shake: 0.08, truck: hash(n, 9) < 0.5 ? -1 : 1 };
        else if (r < 0.82) sh = { a: d, b: d, z0: 2.9, z1: 3.1, len: bar, shake: 0.08 };
        else sh = { a: "girlBody", b: "girlBody", z0: 1.2, z1: 1.35, len: bar * 2, shake: 0.05 };
        sh.ease = "io";
      }
      const t1 = Math.min(s + sh.len, t1max, vb);
      push({ t0: s, t1, trans: "cut", forced: first, ...sh });
      s = t1;
      continue;
    }
    const e = eAt(s);
    const inDrop = drops.some((d) => s >= d && s < d + period * 32);
    let sh;
    if (inDrop || e >= 8) { // quick cuts round the dancers
      const r = hash(n, 11, 3);
      const d = pickDancer(7);
      const L = inDrop ? bar : bar * 2;
      if (r < 0.45) sh = { a: d, b: d, z0: 2.7, z1: 3.0, len: L, shake: 0.12 };
      else if (r < 0.65) sh = { a: r < 0.55 ? "pairL" : "pairR", b: r < 0.55 ? "pairL" : "pairR", z0: 1.9, z1: 2.05, len: L, shake: 0.1, truck: r < 0.55 ? 1 : -1 };
      else if (r < 0.82) sh = { a: "dj", b: "dj", z0: 2.4, z1: 2.7, len: L, shake: 0.1 };
      else sh = { a: "stage", b: "stage", z0: 1.0, z1: 1.08, len: L, shake: 0.15 };
      sh.trans = "cut";
    } else if (e >= 4) { // the groove: slower, pushes and trucks
      const r = hash(n, 13, 1);
      const d = pickDancer(9);
      if (r < 0.3) sh = { a: "stage", b: "dj", z0: 1.1, z1: 1.6, len: bar * 4 };
      else if (r < 0.55) sh = { a: "pairL", b: "pairR", z0: 1.7, z1: 1.7, len: bar * 4 };
      else if (r < 0.8) sh = { a: d + "+body", b: d, z0: 2.0, z1: 2.8, len: bar * 4 };
      else sh = { a: "dj", b: "dj", z0: 2.2, z1: 2.6, len: bar * 4 };
      sh.trans = "cut"; sh.shake = 0.06;
    } else { // breakdowns: long glides
      const r = hash(n, 15, 2);
      const d = pickDancer(5);
      sh = r < 0.5 ? { a: "stage", b: d + "+body", z0: 1.05, z1: 1.8, len: bar * 8 } : { a: "dj", b: "stage", z0: 2.2, z1: 1.15, len: bar * 8 };
      sh.trans = "glide"; sh.glide = 3; sh.shake = 0.03;
    }
    sh.ease = "io";
    const t1 = Math.min(onBar(s + sh.len - 0.01), t1max);
    push({ t0: s, ...sh, t1: Math.max(t1, s + 0.1) });
    s = Math.max(t1, s + 0.1);
  }
  return shots;
}

// ── filming ──
function focusOf(key, L) {
  const [gx, gy, gh] = L.girl;
  const D = L.dancers;
  if (key === "stage") return [L.VW / 2, L.VH * 0.46];
  if (key === "dj") return [L.booth.x, L.booth.y - 17 * (L.booth.s / 0.29)];
  if (key === "girl") return [gx, gy - gh * 0.86];
  if (key === "girlBody") return [gx, gy - gh * 0.55];
  // the endings: the doll she leaves (Halloween), the shell left glowing (Cicada)
  if (key === "doll") return [gx + gh * 0.16, gy - gh * 0.12];
  if (key === "shell") return [gx + (L.portrait ? 9 : 13), gy - gh * 0.62];
  if (key === "pairL" || key === "pairR") {
    const [a, b] = key === "pairL" ? ["varrow", "qeth"] : ["ilu", "ixxen"];
    return [(D[a][0] + D[b][0]) / 2, (D[a][1] - D[a][2] * 0.5 + D[b][1] - D[b][2] * 0.5) / 2];
  }
  if (key.startsWith("two:")) {
    const d = D[key.slice(4)], [fx, fy] = [d[0], d[1] - d[2] * 0.6];
    return [(gx * 0.55 + fx * 0.45), (gy - gh * 0.62) * 0.55 + fy * 0.45];
  }
  const body = key.endsWith("+body"), k = body ? key.slice(0, -5) : key;
  const d = D[k];
  if (!d) return [L.VW / 2, L.VH * 0.46];
  return [d[0], d[1] - d[2] * (body ? 0.45 : FACE[k])];
}
function sample(sh, s, L) {
  const k0 = clamp((s - sh.t0) / Math.max(0.01, sh.t1 - sh.t0), 0, 1);
  const k = sh.ease === "in3" ? easeIn3(k0) : easeIO(k0);
  const A = focusOf(sh.a, L), B = focusOf(sh.b, L);
  let x = lerp(A[0], B[0], k), y = lerp(A[1], B[1], k);
  if (sh.truck) x += (k0 - 0.5) * sh.truck * L.VW * 0.06;
  return { x, y, z: lerp(sh.z0, sh.z1, k) };
}

const NAMES = { doll: "THE DOLL", shell: "THE SHELL", stage: "THE STAGE", dj: "THE DJ", girl: "THE GIRL", girlBody: "THE GIRL", pairL: "VARROW AND QETH", pairR: "ILU AND IXXEN", varrow: "VARROW", qeth: "QETH", ilu: "ILU", ixxen: "IXXEN" };
function labelOf(sh) {
  const nm = (k) => k.startsWith("two:") ? "THE GIRL AND " + NAMES[k.slice(4)] : NAMES[k.replace("+body", "")] || k;
  const what = sh.a === sh.b ? nm(sh.a) : nm(sh.a) + " TO " + nm(sh.b);
  const size = sh.z1 >= 2.6 ? "CLOSE" : sh.z1 >= 1.6 ? "MEDIUM" : "WIDE";
  const move = sh.punch != null ? "THE DROP" : sh.fadeEnd && sh.z1 > sh.z0 ? "THE ENDING" : sh.fadeEnd ? "PULL BACK" : sh.trans === "glide" ? "GLIDE" : sh.ease === "in3" ? "PUSH IN" : sh.z1 > sh.z0 + 0.2 ? "PUSH" : sh.z1 < sh.z0 - 0.2 ? "PULL" : sh.truck ? "TRUCK" : "HOLD";
  return size + " · " + what + " · " + move;
}
// where the camera is at song second s
export function direct(shots, s, L, m) {
  if (!shots || !shots.length) return null;
  let i = shots.length - 1;
  for (let j = 0; j < shots.length; j++) if (s < shots[j].t1) { i = j; break; }
  const sh = shots[i];
  let c = sample(sh, s, L);
  // a glide eases over from where the last shot ended
  if (sh.trans === "glide" && i > 0) {
    const g = sh.glide || 2, kk = clamp((s - sh.t0) / g, 0, 1);
    if (kk < 1) { const p = sample(shots[i - 1], shots[i - 1].t1, L); const e = easeIO(kk); c = { x: lerp(p.x, c.x, e), y: lerp(p.y, c.y, e), z: lerp(p.z, c.z, e) }; }
  }
  const portrait = L.VW / L.VH < 1.15;
  let z = 1 + (c.z - 1) * (portrait ? 0.7 : 1);
  // the drop's punch, and a pulse on the kick when it's loud
  if (sh.punch != null) z *= 1 + 0.09 * Math.exp(-(s - sh.punch) * 2.5);
  if (m && (m.drop > 0 || m.e > 0.8)) z *= 1 + 0.012 * Math.exp(-m.ph * 7);
  // a hand-held camera: a little drift and shake
  const shk = (sh.shake || 0) + (sh.shakeUp ? sh.shakeUp * smooth(sh.t0, sh.t1, s) : 0);
  const nz = (a, b) => Math.sin(s * a + b) * 0.6 + Math.sin(s * a * 2.3 + b * 1.7) * 0.4;
  let x = c.x + (nz(0.9, 1) * 1.2 + nz(7, 3) * 0.35 * shk) * shk / z * 2;
  let y = c.y + (nz(0.7, 5) * 1.2 + nz(8, 9) * 0.35 * shk) * shk / z * 2;
  // keep the frame on the stage
  const hw = L.VW / (2 * z);
  x = clamp(x, hw, L.VW - hw);
  y = clamp(y, (L.VH * 0.46) / z, L.VH - (L.VH * 0.54) / z);
  const fade = sh.fadeEnd ? smooth(sh.t1 - 3.5, sh.t1 - 0.2, s) : 0;
  return { x, y, z, fade, shot: i, label: labelOf(sh) };
}

// a song's plan, from what the Rave knows about it
export function planFor(grid, drops, special, len) {
  if (!grid) return null;
  const dropS = (drops || []).map((b) => grid.offset + b * grid.period);
  return planShots({ len: len || grid.energy.length * 2, period: grid.period, offset: grid.offset, energy: grid.energy, drops: dropS, voice: (special && special.voice) || [], ending: (special && special.ending) || null });
}
