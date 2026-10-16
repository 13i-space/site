// Murder in the Donaghy Castle: talking to each other.
//
// Each laptop connects straight to every other laptop that has its
// microphone switched on (WebRTC, the same thing video-call sites use).
// The game room only carries the "here's how to reach me" notes; the voices
// themselves go laptop to laptop. A free Google server (STUN) helps the
// laptops find each other through home routers.
//
// send(event, payload) posts to everybody in the room; feed every "v-*"
// message that arrives into voice.handle(event, payload).
import { audioContext } from "./sound";

const ICE = [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }];

export function createVoice({ pid, send, onChange }) {
  let stream = null, micOn = false, allowed = true;
  const peers = new Map(); // pid -> { pc, audio, analyser, level, muted }
  const mutedPids = new Set();
  let meLevel = 0, meAnalyser = null, raf = 0;
  const changed = () => onChange?.(state());

  function state() {
    const levels = {};
    for (const [k, p] of peers) levels[k] = { connected: p.connected, level: p.level || 0, muted: mutedPids.has(k) };
    return { on: !!stream, micOn: micOn && allowed, allowed, me: meLevel, peers: levels };
  }

  function meter(srcStream) {
    const a = audioContext();
    if (!a) return null;
    try {
      const an = a.createAnalyser();
      an.fftSize = 512;
      a.createMediaStreamSource(srcStream).connect(an);
      return an;
    } catch { return null; }
  }
  const levelOf = (an) => {
    if (!an) return 0;
    const buf = new Uint8Array(an.fftSize);
    an.getByteTimeDomainData(buf);
    let s = 0;
    for (const v of buf) s += (v - 128) * (v - 128);
    return Math.sqrt(s / buf.length) / 128;
  };
  let lastPush = 0;
  function tick(now) {
    meLevel = micOn && allowed ? levelOf(meAnalyser) : 0;
    for (const p of peers.values()) p.level = levelOf(p.analyser);
    if (now - lastPush > 150) { lastPush = now; changed(); }
    raf = requestAnimationFrame(tick);
  }

  function peer(other) {
    let p = peers.get(other);
    if (p) return p;
    const pc = new RTCPeerConnection({ iceServers: ICE });
    p = { pc, audio: null, analyser: null, level: 0, connected: false };
    peers.set(other, p);
    if (stream) for (const t of stream.getTracks()) pc.addTrack(t, stream);
    pc.onicecandidate = (ev) => { if (ev.candidate) send("v-ice", { from: pid, to: other, c: ev.candidate.toJSON() }); };
    pc.ontrack = (ev) => {
      const s = ev.streams[0] || new MediaStream([ev.track]);
      if (!p.audio) {
        p.audio = new Audio();
        p.audio.autoplay = true;
      }
      p.audio.srcObject = s;
      p.audio.muted = mutedPids.has(other);
      p.audio.play().catch(() => { /* starts on the next click */ });
      p.analyser = meter(s);
      changed();
    };
    pc.onconnectionstatechange = () => {
      p.connected = pc.connectionState === "connected";
      if (["failed", "closed"].includes(pc.connectionState)) drop(other);
      changed();
    };
    return p;
  }
  function drop(other) {
    const p = peers.get(other);
    if (!p) return;
    peers.delete(other);
    try { p.pc.close(); } catch { /* already */ }
    if (p.audio) { p.audio.srcObject = null; }
    changed();
  }
  async function call(other) {
    const p = peer(other);
    const offer = await p.pc.createOffer();
    await p.pc.setLocalDescription(offer);
    send("v-offer", { from: pid, to: other, sdp: p.pc.localDescription.toJSON() });
  }

  async function flush(p) {
    const list = p.pending || [];
    p.pending = [];
    for (const c of list) await p.pc.addIceCandidate(c).catch(() => {});
  }

  const applyMic = () => { if (stream) for (const t of stream.getAudioTracks()) t.enabled = micOn && allowed; };

  return {
    // switch voice on: asks the browser for the microphone
    async join() {
      if (stream) return true;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }, video: false });
      } catch {
        return false;
      }
      micOn = true;
      applyMic();
      meAnalyser = meter(stream);
      raf = requestAnimationFrame(tick);
      send("v-hello", { from: pid });
      changed();
      return true;
    },
    leave() {
      if (!stream) return;
      send("v-bye", { from: pid });
      for (const k of [...peers.keys()]) drop(k);
      for (const t of stream.getTracks()) t.stop();
      stream = null; meAnalyser = null; micOn = false;
      cancelAnimationFrame(raf);
      changed();
    },
    setMic(on) { micOn = on; applyMic(); changed(); },
    // the host's "talk only at meetings": the game turns the mic off and on
    setAllowed(a) { if (allowed === a) return; allowed = a; applyMic(); changed(); },
    mute(other, m) {
      if (m) mutedPids.add(other); else mutedPids.delete(other);
      const p = peers.get(other);
      if (p?.audio) p.audio.muted = m;
      changed();
    },
    // browsers only play sound after a click; call this from any click
    resume() { for (const p of peers.values()) p.audio?.play().catch(() => {}); },
    async handle(event, d) {
      if (!d || d.from === pid) return;
      if (d.to && d.to !== pid) return;
      if (event === "v-bye") return drop(d.from);
      if (!stream) return; // not in the voice chat ourselves
      try {
        if (event === "v-hello") {
          send("v-here", { from: pid, to: d.from });
          if (pid < d.from && !peers.has(d.from)) await call(d.from);
        } else if (event === "v-here") {
          if (pid < d.from && !peers.has(d.from)) await call(d.from);
        } else if (event === "v-offer") {
          const p = peer(d.from);
          await p.pc.setRemoteDescription(d.sdp);
          await flush(p);
          const ans = await p.pc.createAnswer();
          await p.pc.setLocalDescription(ans);
          send("v-answer", { from: pid, to: d.from, sdp: p.pc.localDescription.toJSON() });
        } else if (event === "v-answer") {
          const p = peers.get(d.from);
          if (p && p.pc.signalingState === "have-local-offer") { await p.pc.setRemoteDescription(d.sdp); await flush(p); }
        } else if (event === "v-ice") {
          // notes can overtake each other: hold them until the call is set up
          const p = peer(d.from);
          if (p.pc.remoteDescription) await p.pc.addIceCandidate(d.c).catch(() => {});
          else (p.pending = p.pending || []).push(d.c);
        }
      } catch { /* a garbled note; the next hello will retry */ }
    },
    state,
  };
}
