// Lyra hears the music. Anything on the site that plays music hands its
// Web Audio analyser to this hub while it plays; Lyra (components/LyraOrb.js)
// listens to whatever is playing and dances to it. Nothing here touches the
// sound itself - an analyser only measures.
//
// Two sources today:
//   - the Signal Composer (components/MusicLab.js): its synth already ends
//     in an analyser, so it registers that one
//   - Paul's songs on the Music page: listenToElement() routes an <audio>
//     element through a shared AudioContext with an analyser on the way out
//
// See docs/LYRA-DANCE.md.

let current = null; // { id, analyser }
const listeners = new Set();
const notify = () => listeners.forEach((fn) => { try { fn(current ? current.analyser : null); } catch (e) { /* ignore */ } });

// Register an analyser as "what's playing now". Returns a release function.
export function hearAnalyser(analyser) {
  const id = Symbol("music");
  current = { id, analyser };
  notify();
  return () => {
    if (current && current.id === id) {
      current = null;
      notify();
    }
  };
}

// Lyra subscribes here; called with the analyser (or null when silence).
export function onMusic(fn) {
  listeners.add(fn);
  fn(current ? current.analyser : null);
  return () => listeners.delete(fn);
}

// ---------- <audio> elements (the Music page) ----------
let sharedCtx = null;
const wired = new WeakMap(); // element -> { analyser }

// Call from a click/tap (a user gesture), so the browser lets audio start.
export function primeAudio() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    if (!sharedCtx) sharedCtx = new AC();
    if (sharedCtx.state !== "running") sharedCtx.resume().catch(() => {});
  } catch (e) {
    // no Web Audio - the music still plays, Lyra just won't hear it
  }
}

// Route an <audio> element through Web Audio so Lyra can hear it. Only call
// this for an element whose source is same-address (or CORS-enabled) -
// otherwise the browser would play it silently. Returns a release function,
// or null if it can't (onRelease gets the release function if it joins in
// a moment later).
// Safe by design: an element is only ever routed through Web Audio once the
// audio context is actually running, so the song can never go silent
// because the browser held the context back.
export function listenToElement(el, onRelease) {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!sharedCtx) sharedCtx = new AC();
    if (sharedCtx.state !== "running") {
      if (!wired.get(el)) {
        // not running yet: try, and join in once it is (still playing)
        sharedCtx.resume().then(() => {
          if (sharedCtx.state === "running" && !el.paused && onRelease) onRelease(listenToElement(el));
        }).catch(() => {});
        return null;
      }
      sharedCtx.resume().catch(() => {});
    }
    let w = wired.get(el);
    if (!w) {
      // an element can only ever be given one source node - keep it
      const source = sharedCtx.createMediaElementSource(el);
      const analyser = sharedCtx.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.6;
      source.connect(analyser);
      analyser.connect(sharedCtx.destination);
      w = { analyser };
      wired.set(el, w);
    }
    return hearAnalyser(w.analyser);
  } catch (e) {
    return null;
  }
}

// ---------- reading the music ----------
// ?lyradebug in the address keeps a log in window.__lyraHear, for tuning
const DEBUG = typeof window !== "undefined" && /[?&]lyradebug/.test(window.location.search) ? (window.__lyraHear = []) : null;
// Turns the analyser's spectrum into the few numbers Lyra moves to:
//   level  0-1, overall loudness (smoothed)
//   bass   0-1, low end (kick, bassline)
//   high   0-1, shimmer (hats, arps, air)
//   beat   true on the frame a hit lands (the spectrum, low end weighted,
//          jumps well above its recent average); strength 0-1 says how hard
export function createListener(analyser) {
  const bins = new Uint8Array(analyser.frequencyBinCount);
  const mag = new Float32Array(bins.length);
  const prev = new Float32Array(bins.length);
  const hz = (analyser.context.sampleRate / 2) / bins.length;
  const bin = (f) => Math.max(1, Math.min(bins.length - 1, Math.round(f / hz)));
  const [b0, b1] = [bin(35), bin(160)];
  const [h0, h1] = [bin(4000), bin(12000)];
  const top = bin(9000);
  const minDb = analyser.minDecibels, spanDb = analyser.maxDecibels - analyser.minDecibels;
  const sum = (a, z) => { let t = 0; for (let i = a; i <= z; i++) t += mag[i]; return t / (z - a + 1); };
  // auto-gain: each measure is judged against its own recent average, so a
  // quiet ambient piece moves her as clearly as a loud one
  const gain = () => ({ m: 0 });
  const norm = (g, v) => {
    g.m = g.m ? g.m + (v - g.m) * 0.01 : v;
    return g.m > 1e-7 ? Math.min(1, Math.max(0, (v / g.m - 0.6) / 0.9)) : 0;
  };
  const gBass = gain(), gHigh = gain(), gAll = gain();
  let level = 0, fluxAvg = 0, lastBeat = 0;
  return {
    read(now) {
      analyser.getByteFrequencyData(bins);
      // bytes are decibels; turn them back into plain loudness
      for (let i = 0; i < bins.length; i++) mag[i] = Math.pow(10, (minDb + (bins[i] / 255) * spanDb) / 20);
      const bassRaw = sum(b0, b1), highRaw = sum(h0, h1), allRaw = sum(1, top);
      // onsets: how much louder the spectrum just got (low end weighted)
      let flux = 0;
      for (let i = 1; i <= top; i++) {
        const d = mag[i] - prev[i];
        if (d > 0) flux += d * (i <= b1 ? 3 : 1);
        prev[i] = mag[i];
      }
      const beat = flux > fluxAvg * 1.8 + 1e-5 && now - lastBeat > 250 && allRaw > 1e-4;
      // how hard it landed: a kick hits harder than a soft arpeggio note
      const strength = beat ? Math.min(1, 0.35 + (flux / (fluxAvg * 1.8 + 1e-5) - 1) * 0.6) : 0;
      if (beat) lastBeat = now;
      fluxAvg += (flux - fluxAvg) * 0.1;
      const bass = norm(gBass, bassRaw);
      const high = norm(gHigh, highRaw);
      const all = norm(gAll, allRaw);
      const absolute = Math.min(1, Math.sqrt(allRaw) * 8);
      level += (Math.min(1, all * 0.7 + absolute * 0.5) - level) * 0.15;
      if (DEBUG) DEBUG.push({ t: Math.round(now), level: +level.toFixed(3), bass: +bass.toFixed(3), flux: +(flux * 1000).toFixed(2), avg: +(fluxAvg * 1000).toFixed(2), high: +high.toFixed(3), abs: +absolute.toFixed(3), beat });
      return { level, bass, high, beat, strength };
    },
  };
}
