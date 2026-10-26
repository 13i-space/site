// The Wish Engine's ambience (Update 6.19): something playing low inside the
// cabinet, a little creepy but not much. Made live with Web Audio, no files:
//   a drone       two low detuned voices through a slowly breathing filter
//   a music box   a slow tune in A harmonic minor, each note a little out of
//                 tune and wavering like an old cylinder, in a long reverb
//   the cabinet   now and then a soft breath of air, a faint creak
// While Varrow is awake and speaking the music box falls back and the drone
// tightens. Quiet by design; uses the artifacts' shared audio and their mute.
import { artifactAudio, isMuted } from "./alienSound";

const NOTES = [69, 72, 76, 71, 68, 74, 77, 76, 72, 69, 64, 71]; // A C E B G# D F E C A E B (A harmonic minor, wandering)
let A = null;

function impulse(c, secs = 3.4) {
  const n = Math.floor(c.sampleRate * secs), b = c.createBuffer(2, n, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) { const d = b.getChannelData(ch); for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2.6); }
  return b;
}

export function startAmbience() {
  if (A || isMuted()) return;
  const c = artifactAudio();
  if (!c) return;
  const out = c.createGain(); out.gain.value = 0; out.connect(c.destination);
  out.gain.setTargetAtTime(0.9, c.currentTime, 1.5);
  const rev = c.createConvolver(); rev.buffer = impulse(c); const wet = c.createGain(); wet.gain.value = 0.55; rev.connect(wet).connect(out);
  // the drone
  const dlp = c.createBiquadFilter(); dlp.type = "lowpass"; dlp.frequency.value = 260; dlp.Q.value = 3;
  const dg = c.createGain(); dg.gain.value = 0.05; dlp.connect(dg); dg.connect(out); dg.connect(rev);
  const voices = [[45, -7], [52, 6], [57, 3]].map(([mn, det], i) => { const o = c.createOscillator(); o.type = i === 2 ? "triangle" : "sawtooth"; o.frequency.value = 440 * Math.pow(2, (mn - 69) / 12); o.detune.value = det; const gg = c.createGain(); gg.gain.value = i === 2 ? 0.25 : 0.5; o.connect(gg).connect(dlp); o.start(); return o; });
  const lfo = c.createOscillator(); lfo.frequency.value = 0.06; const lg = c.createGain(); lg.gain.value = 120; lfo.connect(lg).connect(dlp.frequency); lfo.start();
  // the music box
  const mb = c.createGain(); mb.gain.value = 0.07; mb.connect(out); mb.connect(rev);
  let step = 0, timer = null, alive = true;
  const note = () => {
    if (!alive) return;
    const t = c.currentTime + 0.02;
    const mn = NOTES[step % NOTES.length] + (Math.random() < 0.15 ? 12 : 0);
    step += Math.random() < 0.8 ? 1 : 2;
    const f = 440 * Math.pow(2, (mn - 69) / 12) * (1 + (Math.random() - 0.5) * 0.012);
    const env = c.createGain(); env.gain.setValueAtTime(0.0001, t); env.gain.exponentialRampToValueAtTime(1, t + 0.005); env.gain.exponentialRampToValueAtTime(0.0001, t + 2.6);
    [[1, 1], [2.005, 0.32], [3.01, 0.12]].forEach(([mul, a]) => {
      const o = c.createOscillator(); o.type = "sine"; o.frequency.value = f * mul;
      const wob = c.createOscillator(); wob.frequency.value = 4.5 + Math.random(); const wg = c.createGain(); wg.gain.value = f * mul * 0.004; wob.connect(wg).connect(o.frequency);
      const g = c.createGain(); g.gain.value = a; o.connect(g).connect(env); o.start(t); o.stop(t + 2.7); wob.start(t); wob.stop(t + 2.7);
    });
    env.connect(mb);
    // now and then a second, lower note under it
    if (Math.random() < 0.3) { const o = c.createOscillator(); o.type = "sine"; o.frequency.value = f / 2; const e2 = c.createGain(); e2.gain.setValueAtTime(0.0001, t + 0.2); e2.gain.exponentialRampToValueAtTime(0.4, t + 0.21); e2.gain.exponentialRampToValueAtTime(0.0001, t + 2.8); o.connect(e2).connect(mb); o.start(t + 0.2); o.stop(t + 2.9); }
    timer = setTimeout(note, 1300 + Math.random() * 1900 + (Math.random() < 0.12 ? 2500 : 0));
  };
  timer = setTimeout(note, 900);
  // the cabinet breathing
  let breathT = null;
  const nb = c.createBuffer(1, c.sampleRate * 3, c.sampleRate); const nd = nb.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
  const breath = () => {
    if (!alive) return;
    const t = c.currentTime + 0.05;
    const s = c.createBufferSource(); s.buffer = nb;
    const bp = c.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = 1.4; bp.frequency.setValueAtTime(500, t); bp.frequency.linearRampToValueAtTime(900, t + 1.4); bp.frequency.linearRampToValueAtTime(400, t + 2.8);
    const g = c.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.025, t + 1.2); g.gain.exponentialRampToValueAtTime(0.0001, t + 2.9);
    s.connect(bp).connect(g); g.connect(out); g.connect(rev); s.start(t); s.stop(t + 3);
    breathT = setTimeout(breath, 14000 + Math.random() * 12000);
  };
  breathT = setTimeout(breath, 6000);
  A = {
    c, out, mb, dlp, dg,
    mood(awake) { const t = c.currentTime; mb.gain.setTargetAtTime(awake ? 0.025 : 0.07, t, 0.6); dg.gain.setTargetAtTime(awake ? 0.075 : 0.05, t, 0.8); dlp.Q.setTargetAtTime(awake ? 6 : 3, t, 0.8); },
    stop() {
      alive = false; clearTimeout(timer); clearTimeout(breathT);
      const t = c.currentTime; out.gain.setTargetAtTime(0, t, 0.4);
      setTimeout(() => { voices.forEach((o) => { try { o.stop(); } catch (e) { /* ignore */ } }); try { lfo.stop(); } catch (e) { /* ignore */ } out.disconnect(); }, 2000);
    },
  };
}
export function ambienceMood(awake) { if (A) A.mood(awake); }
export function stopAmbience() { if (A) { A.stop(); A = null; } }
