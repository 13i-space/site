// The dancers react to the story (Update 6.17), on the extended remixes.
//   Halloween remix: when the girl comes they turn to look at her, flinch
//   away as she appears, and freeze watching (Varrow's eyes go wide, Qeth
//   stops smiling and leans back, Ilu curls its tentacles in and gasps,
//   Ixxen turns its side to her and stares).
//   Cicada remix: they lean in to watch the soil, flinch at the hit when it
//   claws out, flinch again on each crack of the first molt and at its chirps.
// react(key, pose, m, x, at) returns the pose, changed; x is the dancer's
// place on stage and at.x where the story is happening.
import { clamp, smooth } from "./draw";
import { chorusAt, LIFE } from "./cicada";

const dancerScale = { varrow: 3.4, qeth: 1, ilu: 1, ixxen: 0.48 };

// a flinch: sharp, then easing off over ~0.8 s after moment t0
const flinchAt = (s, t0) => (s >= t0 && s < t0 + 1.2 ? Math.exp(-(s - t0) * 4) * smooth(0, 0.05, s - t0) : 0);

export function react(key, pose, m, x, at, st) {
  const dir = Math.sign(at.x - x) || 1;       // which way the story is
  const s = m.s || 0;
  let watch = 0, flinch = 0, curl = 0;
  if (m.halloween) {
    watch = clamp(m.ghost || 0, 0, 1);
    // the moment she appears
    if (st) {
      if (watch > 0.05 && !(st.ghostOn)) { st.ghostOn = true; st.ghostT0 = s; }
      if (watch < 0.02) st.ghostOn = false;
      flinch = st.ghostT0 != null ? flinchAt(s, st.ghostT0) * watch : 0;
    }
    curl = watch;
  } else if (m.cicada) {
    // leaning in on the soil before it breaks, watching it come out
    watch = smooth(2, 6, s) * (1 - smooth(18, 24, s));
    flinch = flinchAt(s, LIFE.emerge);
    [172.5, 174.5, 176.5, 178.5].forEach((c) => { flinch = Math.max(flinch, flinchAt(s, c) * 0.6); });
    // its song startles them each time
    const ch = s > 100 ? chorusAt(s) : 0;
    if (ch > 0.05) { watch = Math.max(watch, ch * 0.7); flinch = Math.max(flinch, ch * 0.35 * (0.6 + 0.4 * Math.sin(s * 23))); }
    watch = Math.max(watch, smooth(LIFE.molt1[0] - 1, LIFE.molt1[0], s) * (1 - smooth(LIFE.molt1[1], LIFE.molt1[1] + 2, s)));
    watch = Math.max(watch, smooth(LIFE.molt2[0], LIFE.molt2[0] + 2, s) * (1 - smooth(LIFE.molt2[1], LIFE.molt2[1] + 2, s)) * 0.8);
  }
  if (watch < 0.01 && flinch < 0.01) return pose;
  const p = { ...pose };
  const k = dancerScale[key] || 1;
  const away = -dir;
  if (key === "varrow") {
    p.look = [lerpA(p.look, [dir * 6, 0.5], watch)[0], lerpA(p.look, [dir * 6, 0.5], watch)[1]];
    if (m.halloween) p.lids = [p.lids?.[0] * (1 - watch) + 0 * watch, p.lids?.[1] * (1 - watch) + 0 * watch];
    p.lean = (p.lean || 0) * (1 - watch) + away * 0.05 * flinch + dir * 0.04 * watch * (m.cicada ? 1 : 0);
    p.lift = (p.lift || 0) - flinch * 10 * k;
    p.head = (p.head || 0) * (1 - watch) + dir * 0.08 * watch;
  } else if (key === "qeth") {
    p.look = lerpA(p.look, [dir * 2, 0.4], watch);
    if (m.halloween) { p.happy = (p.happy || 0) * (1 - watch); p.crown = (p.crown || 0) * (1 - watch); }
    p.lean = (p.lean || 0) * (1 - watch) + away * (0.06 * flinch + (m.halloween ? 0.03 : -0.03) * watch);
    p.lift = (p.lift || 0) - flinch * 5;
    p.head = (p.head || 0) * (1 - watch) + dir * 0.12 * watch;
  } else if (key === "ilu") {
    p.look = lerpA(p.look, [dir * 4.5, 1.2], watch);
    if (curl > 0) { p.curl = (p.curl || []).map((c) => c * (1 - curl) + 0.85 * curl); p.tent = (p.tent || []).map((t, i) => t * (1 - curl) + (i - 3) * -0.12 * curl); p.mouth = Math.max(p.mouth || 0, 0.55 * curl); p.flare = (p.flare || 0) * (1 - curl); }
    p.rot = (p.rot || 0) * (1 - watch) + away * 0.12 * flinch;
    p.lift = (p.lift || 0) - flinch * 8;
    p.sticks = (p.sticks || 0) * (1 - watch);
  } else if (key === "ixxen") {
    p.face = (p.face || 0) * (1 - watch);
    p.look = lerpA(p.look || [40, 30], [40 + 8, 38], watch);
    p.tilt = (p.tilt || 0) * (1 - watch) + 0.15 * watch - 0.2 * flinch;
    p.lean = (p.lean || 0) - 0.08 * flinch;
    p.lift = (p.lift || 0) - flinch * 2.5;
  }
  return p;
}
function lerpA(a, b, k) { a = a || [0, 0]; return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]; }
