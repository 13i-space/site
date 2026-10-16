"use client";
// Murder in the Donaghy Castle - the family game.
// The rules live in lib/castle/engine.js, the drawing in draw.js, and the
// laptops talk through lib/castle/net.js (game) and voice.js (microphones).
// Whoever opens the castle gate is the host: their laptop runs the castle
// and shares it a few times a second. Everyone moves their own knight.
import { useCallback, useEffect, useRef, useState } from "react";
import {
  createGame, stepGame, moveSelf, humanAction, humanFinish, hudInfo, sayInMeeting, castVote as engineVote, markReady,
  directorTick, snapshot, applySnapshot, applyPosition, glide, ridePos, ROLES, GAME_SECONDS, MIN_PLAYERS, MAX_PLAYERS,
  humanContext, setHumanTarget,
} from "../../lib/castle/engine";
import { openRoom, newRoomCode, cleanCode } from "../../lib/castle/net";
import { STATIONS } from "../../lib/castle/map";
import { createVoice } from "../../lib/castle/voice";
import { castleSound as snd } from "../../lib/castle/sound";
import { castleMusic as music } from "../../lib/castle/music";
import { loadLook, DEFAULT_LOOK } from "../../lib/castle/looks";
import { paintCastle, drawFrame, drawMiniMap } from "./draw";
import { Lobby } from "./Lobby";
import { WaitingRoom, VoicePanel } from "./Room";
import { VoteJoust, PracticeJoust } from "./Joust";
import { HelpOwl } from "./HelpOwl";
import { Ending } from "./Ending";
import { ChoreGame } from "./ChoreGame";

const CUP_KEY = "donaghy-cup-v2"; // domino points (v1 was the old points)
const MINI_W = 280, MINI_H = 203;
const NAME_KEY = "donaghy-name-v1";
const SNAP_MS = 250, POS_MS = 250;

function clockText(t) {
  const mins = 20 * 60 + (t / GAME_SECONDS) * 240;
  const h = Math.floor(mins / 60), m = Math.floor(mins % 60);
  const hh = h > 12 ? h - 12 : h;
  return `${h >= 24 ? 12 : hh}:${String(m).padStart(2, "0")} ${h >= 24 ? "AM" : "PM"}`;
}
function readCup() { try { return JSON.parse(localStorage.getItem(CUP_KEY) || "[]"); } catch { return []; } }
function saveCup(list) { try { localStorage.setItem(CUP_KEY, JSON.stringify(list.slice(-60))); } catch { /* private window */ } }

// a sound from the host: play it if it's for me, or near me
function playSfx(w, myId, lastRef) {
  const me = w.entities[myId];
  let top = lastRef.current;
  for (const s of w.sfx || []) {
    if (s.seq <= lastRef.current) continue;
    top = Math.max(top, s.seq);
    if (s.to !== undefined && s.to !== myId) continue;
    let vol = 1;
    if (s.x !== undefined && me) {
      const d = Math.hypot(me.x - s.x, me.y - s.y);
      if (s.r && d > s.r) continue;
      if (s.scale && s.r) vol = Math.max(0.15, 1 - d / s.r);
    }
    const f = snd[s.n];
    if (!f) continue;
    if (s.n === "toot") f(vol, !!s.big);
    else if (s.n === "bark" || s.n === "growl") f(vol);
    else f();
  }
  lastRef.current = top;
}

export default function DonaghyCastle({ playerName = "You", backHref = "/account", pid: userId = "solo" }) {
  const [screen, setScreen] = useState("lobby"); // lobby, room, practice, game, over
  const [gphase, setGphase] = useState(null); // the castle's phase: intro, play, meeting, joust, ending
  const [total, setTotal] = useState(8);
  const [roleChoice, setRoleChoice] = useState("random");
  const [look, setLook] = useState(DEFAULT_LOOK);
  const [hud, setHud] = useState(null);
  const [muted, setMuted] = useState(false);
  const [musicOn, setMusicOn] = useState(true);
  const [helpOpen, setHelpOpen] = useState(false);
  const [cup, setCup] = useState([]);
  const [showChores, setShowChores] = useState(true);
  const [, setTick] = useState(0);
  const [name, setName] = useState(playerName);
  const [chore, setChore] = useState(null);
  const [myVote, setMyVote] = useState(undefined);
  const [people, setPeople] = useState([]);
  const [code, setCode] = useState("");
  const [settings, setSettingsState] = useState({ total: 8, meetingsOnly: false });
  const [notice, setNotice] = useState(null);
  const [voiceState, setVoiceState] = useState(null);
  const [hostLost, setHostLost] = useState(false);
  const [initialCode, setInitialCode] = useState("");
  const [practiceFrom, setPracticeFrom] = useState("lobby");
  const viewRef = useRef({ w: 0, h: 0, dpr: 1 });
  const mouseHeld = useRef(false);

  const worldRef = useRef(null);
  const myIdRef = useRef(0);
  const hostRef = useRef(true); // true when this laptop runs the castle (host, or alone)
  const netRef = useRef(null);
  const voiceRef = useRef(null);
  const pidRef = useRef(userId);
  const peopleRef = useRef([]);
  const goneRef = useRef({});
  const sfxSeq = useRef(0);
  const lastSnapAt = useRef(0);
  const savedGame = useRef(null);
  const choreRef = useRef(null);
  choreRef.current = chore;
  const canvasRef = useRef(null);
  const miniRef = useRef(null);
  const mapRef = useRef(null);
  const darkRef = useRef(null);
  const keys = useRef({});
  const screenRef = useRef(screen);
  screenRef.current = screen;
  const gphaseRef = useRef(gphase);
  gphaseRef.current = gphase;
  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const nameRef = useRef(name), lookRef = useRef(look);
  nameRef.current = name; lookRef.current = look;

  useEffect(() => {
    setCup(readCup()); setLook(loadLook()); setMusicOn(music.isEnabled());
    try { const n = localStorage.getItem(NAME_KEY); if (n) setName(n); } catch { /* private window */ }
    const q = new URLSearchParams(window.location.search);
    // ?local=1: several tabs on one computer play together (for testing), each its own player
    if (q.get("local")) {
      let tab = null;
      try { tab = sessionStorage.getItem("castle-tab"); if (!tab) { tab = Math.random().toString(36).slice(2, 7); sessionStorage.setItem("castle-tab", tab); } } catch { tab = Math.random().toString(36).slice(2, 7); }
      pidRef.current = `${userId}-${tab}`;
    }
    const room = cleanCode(q.get("room"));
    if (room.length === 4) setInitialCode(room);
  }, [userId]);
  // arriving by a shared link: straight to the gate (once name and look are loaded)
  const autoJoined = useRef(false);
  useEffect(() => {
    if (!initialCode || autoJoined.current) return;
    autoJoined.current = true;
    let wasHost = false;
    try { wasHost = sessionStorage.getItem(`castle-host-${initialCode}`) === "1"; } catch { /* private window */ }
    enterRoom(initialCode, wasHost);
  }, [initialCode]); // eslint-disable-line react-hooks/exhaustive-deps

  const changeName = (n) => { setName(n); try { localStorage.setItem(NAME_KEY, n); } catch { /* private window */ } };
  useEffect(() => () => { music.stop(); netRef.current?.close(); voiceRef.current?.leave(); }, []);

  const me = () => ({ pid: pidRef.current, name: (nameRef.current || playerName).trim().slice(0, 20) || playerName, look: lookRef.current });

  // ---------- starting a night ----------
  const enterGame = useCallback((w) => {
    if (!mapRef.current) mapRef.current = paintCastle();
    worldRef.current = w;
    sfxSeq.current = w.seq || 0;
    lastSnapAt.current = performance.now();
    keys.current = {};
    setChore(null); setMyVote(undefined); setHostLost(false); setNotice(null);
    setHud(hudInfo(w, myIdRef.current));
    setGphase(w.phase);
    setScreen("game");
    // handy for testing on a local dev server only; never in the live build
    if (process.env.NODE_ENV !== "production") { window.__castle = w; window.__castleDev = { STATIONS, myId: myIdRef.current, act: (a, x) => actRef.current(a, x) }; }
  }, []);

  // alone with the castle folk (no network at all)
  const startSolo = () => {
    snd.unlock();
    hostRef.current = true;
    const w = createGame({ players: [{ pid: pidRef.current, name: me().name, look, role: roleChoice }], total });
    myIdRef.current = 0;
    enterGame(w);
  };

  // the host starts the night for everyone at the gate
  const startHosted = () => {
    snd.unlock();
    let list = peopleRef.current.slice();
    if (!list.some((p) => p.pid === pidRef.current)) list.unshift({ ...me(), host: true, at: 0 });
    list = list.slice(0, MAX_PLAYERS);
    const seats = Math.max(MIN_PLAYERS, list.length, settingsRef.current.total || 0);
    const w = createGame({ players: list.map((p) => ({ pid: p.pid, name: p.name, look: p.look, role: "random" })), total: seats });
    myIdRef.current = w.entities.findIndex((e) => e.pid === pidRef.current);
    goneRef.current = {};
    enterGame(w);
    netRef.current?.send("snap", snapshot(w));
  };

  // ---------- the network ----------
  const onDown = useCallback((event, d) => {
    if (event.startsWith("v-")) { voiceRef.current?.handle(event, d); return; }
    if (hostRef.current) return; // the host only listens on the up lane
    if (event === "snap") {
      lastSnapAt.current = performance.now();
      setHostLost(false);
      const mine = d.entities.findIndex((e) => e.pid === pidRef.current);
      const cur = worldRef.current;
      if (cur && cur.gameId === d.gameId) {
        if (mine < 0) return;
        applySnapshot(cur, d, mine);
        return;
      }
      if (mine < 0) {
        if (screenRef.current === "room") setNotice("A night is already under way. You'll be in the next one: stay here at the gate.");
        return;
      }
      if (d.phase === "ending" && savedGame.current === d.gameId) return; // finished; waiting on the next
      myIdRef.current = mine;
      enterGame(applySnapshot(null, d, mine));
      return;
    }
    if (event === "lobby") {
      worldRef.current = null;
      setGphase(null); setNotice(null);
      if (screenRef.current === "game" || screenRef.current === "over") setScreen("room");
    }
  }, [enterGame]);

  const onUp = useCallback((event, d) => {
    const w = worldRef.current;
    if (event === "hi") { if (w) netRef.current?.send("snap", snapshot(w)); return; }
    if (!w || !d) return;
    const eid = w.entities.findIndex((e) => e.pid === d.pid);
    if (eid < 0) return;
    if (event === "pos") { applyPosition(w, eid, d); return; }
    if (event === "act") doAct(w, eid, d);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function doAct(w, eid, d) {
    if (d.a === "ready") markReady(w, eid);
    else if (d.a === "finish") humanFinish(w, eid, d.sid);
    else if (d.a === "say") sayInMeeting(w, eid, d.text);
    else if (d.a === "vote") engineVote(w, eid, d.target);
    else humanAction(w, eid, d.a);
  }
  // a key press or click: the host does it, everyone else asks the host
  const act = (a, extra = {}) => {
    const w = worldRef.current;
    if (!w) return;
    if (hostRef.current) doAct(w, myIdRef.current, { a, ...extra });
    else netRef.current?.sendUp("act", { pid: pidRef.current, a, ...extra });
  };

  const onPeople = useCallback((list) => {
    peopleRef.current = list;
    setPeople(list);
    const host = list.find((p) => p.host);
    if (!hostRef.current && host) setSettingsState({ total: host.total || 8, meetingsOnly: !!host.meetingsOnly });
    // the host notices who has dropped out (or come back) mid-game
    const w = worldRef.current;
    if (hostRef.current && w && netRef.current) {
      for (const e of w.entities) {
        if (!e.pid || e.pid === pidRef.current) continue;
        const here = list.some((p) => p.pid === e.pid);
        if (here) {
          delete goneRef.current[e.pid];
          if (!e.human) {
            e.human = true; e.path = []; e.goal = null; e.work = null; e.hunt = null; e.hpath = []; e.tp = (e.tp || 0) + 1;
            w.toasts.push({ text: `${e.name} is back in the castle.`, tone: "good", at: w.t, seq: w.seq++ });
          }
        } else if (e.human && !goneRef.current[e.pid]) goneRef.current[e.pid] = performance.now();
      }
    }
  }, []);

  const enterRoom = (roomCode, asHost) => {
    snd.unlock();
    netRef.current?.close();
    voiceRef.current?.leave();
    const local = new URLSearchParams(window.location.search).get("local");
    hostRef.current = asHost;
    worldRef.current = null;
    setCode(roomCode); setPeople([]); setNotice(null); setGphase(null);
    const s = { total: Math.max(MIN_PLAYERS, settingsRef.current.total || 8), meetingsOnly: !!settingsRef.current.meetingsOnly };
    setSettingsState(s);
    const net = openRoom(roomCode, {
      host: asHost, local: !!local,
      me: { ...me(), host: asHost, ...(asHost ? s : {}) },
      onDown, onUp, onPeople,
      onStatus: (st) => {
        if (st === "CHANNEL_ERROR" || st === "TIMED_OUT") setNotice("Can't reach the game server just now. Check the internet connection; it keeps trying.");
        if (st !== "SUBSCRIBED") return;
        setNotice(null);
        // a host coming back sends everyone to the gate; a player asks for the castle
        if (asHost) net.send("lobby", {});
        else net.sendUp("hi", { pid: pidRef.current });
      },
    });
    netRef.current = net;
    if (net.kind === "local") setTimeout(() => (asHost ? net.send("lobby", {}) : net.sendUp("hi", { pid: pidRef.current })), 200);
    voiceRef.current = createVoice({
      pid: pidRef.current,
      send: (event, payload) => net.send(event, payload),
      onChange: (st) => setVoiceState(st),
    });
    try {
      if (asHost) sessionStorage.setItem(`castle-host-${roomCode}`, "1");
      const q = new URLSearchParams(window.location.search);
      q.set("room", roomCode);
      window.history.replaceState(null, "", `${window.location.pathname}?${q}`);
    } catch { /* fine */ }
    setScreen("room");
  };
  const createRoom = () => enterRoom(newRoomCode(), true);
  const joinRoom = (c) => enterRoom(cleanCode(c), false);
  const leaveRoom = () => {
    netRef.current?.close(); netRef.current = null;
    voiceRef.current?.leave(); voiceRef.current = null;
    setVoiceState(null);
    worldRef.current = null;
    hostRef.current = true;
    try {
      sessionStorage.removeItem(`castle-host-${code}`);
      const q = new URLSearchParams(window.location.search);
      q.delete("room");
      window.history.replaceState(null, "", `${window.location.pathname}${q.toString() ? `?${q}` : ""}`);
    } catch { /* fine */ }
    setScreen("lobby");
  };
  const setSettings = (s) => {
    setSettingsState(s);
    netRef.current?.setMe({ total: s.total, meetingsOnly: s.meetingsOnly });
  };
  // keep the gate's list up to date with my name, look and voice
  useEffect(() => { netRef.current?.setMe({ name: me().name, look }); }, [name, look]); // eslint-disable-line react-hooks/exhaustive-deps
  const voiceOn = !!voiceState?.on;
  useEffect(() => { netRef.current?.setMe({ voice: voiceOn }); }, [voiceOn]);
  // "microphones only at meetings"
  useEffect(() => {
    voiceRef.current?.setAllowed(!(settings.meetingsOnly && screen === "game" && (gphase === "play" || gphase === "intro")));
  }, [settings.meetingsOnly, screen, gphase]);

  // music follows the phase
  useEffect(() => {
    if (screen !== "game") { if (screen === "lobby" || screen === "room") music.stop(); return; }
    if (gphase === "play") music.setMode("night");
    else if (gphase === "meeting") music.setMode("hall");
    else if (gphase === "joust") music.setMode("quiet");
  }, [gphase, screen]);

  // a new meeting: a fresh vote
  useEffect(() => { if (gphase === "meeting") setMyVote(undefined); }, [gphase]);

  const toggleMute = () => { const m = !muted; snd.setMuted(m); setMuted(m); };
  const toggleMusic = () => { const on = !music.isEnabled(); music.setEnabled(on); setMusicOn(on); };

  const openChore = (ctx) => {
    const w = worldRef.current;
    if (!w || w.phase !== "play") return;
    keys.current = {};
    const meE = w.entities[myIdRef.current];
    meE.hpath = [];
    // a ghost's chores count too; only being captured mid-chore stops it
    setChore({ station: ctx.station, fake: !!ctx.fake, aliveAtStart: meE.alive });
  };
  const closeChore = () => setChore(null);
  const doneChore = () => {
    if (chore) act("finish", { sid: chore.station.id });
    closeChore();
  };

  // ---- walking by mouse: click to walk there, or hold the button to steer ----
  const mouseToWorld = (e) => {
    const v = viewRef.current;
    const r = canvasRef.current.getBoundingClientRect();
    return { x: (e.clientX - r.left) / (v.z || 1) + (v.camX || 0), y: (e.clientY - r.top) / (v.z || 1) + (v.camY || 0) };
  };
  const steerAt = useRef(0);
  const onCanvasDown = (e) => {
    voiceRef.current?.resume();
    if (gphaseRef.current !== "play" || e.button !== 0) return;
    mouseHeld.current = true;
    const p = mouseToWorld(e);
    setHumanTarget(worldRef.current, myIdRef.current, p.x, p.y);
  };
  const onCanvasMove = (e) => {
    if (!mouseHeld.current || gphaseRef.current !== "play") return;
    const now = performance.now();
    if (now - steerAt.current < 120) return;
    steerAt.current = now;
    const p = mouseToWorld(e);
    setHumanTarget(worldRef.current, myIdRef.current, p.x, p.y);
  };
  useEffect(() => { const u = () => { mouseHeld.current = false; }; window.addEventListener("mouseup", u); return () => window.removeEventListener("mouseup", u); }, []);

  // ---- keys ----
  const actRef = useRef(act);
  actRef.current = act;
  const openChoreRef = useRef(openChore);
  openChoreRef.current = openChore;
  useEffect(() => {
    const map = { ArrowUp: "up", KeyW: "up", ArrowDown: "down", KeyS: "down", ArrowLeft: "left", KeyA: "left", ArrowRight: "right", KeyD: "right", KeyE: "use", Space: "use" };
    const one = { KeyR: "report", KeyB: "bell", KeyQ: "power", KeyF: "truth", Digit1: "sab1", Digit2: "sab2", Digit3: "disguise", Digit4: "smoke" };
    const down = (ev) => {
      if (ev.target && (ev.target.tagName === "INPUT" || ev.target.tagName === "TEXTAREA" || ev.target.tagName === "SELECT")) return;
      if (ev.code === "KeyV" && !ev.repeat && voiceRef.current) {
        const st = voiceRef.current.state();
        if (st.on) voiceRef.current.setMic(!st.micOn);
      }
      if (screenRef.current !== "game" || gphaseRef.current !== "play") return;
      if (choreRef.current) return;
      const w = worldRef.current;
      if ((ev.code === "KeyE" || ev.code === "Space") && !ev.repeat) {
        const ctx = humanContext(w, myIdRef.current);
        if (ctx.station && ctx.station.kind !== "passage") { ev.preventDefault(); openChoreRef.current(ctx); return; }
        if (!ctx.station && ctx.pet) { actRef.current("pet"); ev.preventDefault(); return; }
      }
      if (map[ev.code]) { keys.current[map[ev.code]] = true; ev.preventDefault(); }
      if (one[ev.code] && !ev.repeat) { actRef.current(one[ev.code]); ev.preventDefault(); }
      if (ev.code === "KeyM") { const m = !snd.isMuted(); snd.setMuted(m); setMuted(m); }
      if (ev.code === "KeyN") { const on = !music.isEnabled(); music.setEnabled(on); setMusicOn(on); }
      if (ev.code === "KeyH" && !ev.repeat) setHelpOpen((o) => !o);
    };
    const up = (ev) => { if (map[ev.code]) keys.current[map[ev.code]] = false; };
    const blur = () => { keys.current = {}; };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); window.removeEventListener("blur", blur); };
  }, []);

  // ---- the castle's clock: runs the whole time a night is on ----
  // (a timer rather than animation frames, so the host's castle keeps going
  // even if their tab is in the background)
  useEffect(() => {
    if (screen !== "game" && screen !== "over") return;
    let last = performance.now(), hudAt = 0, stepAt = 0, sendAt = 0, posAt = 0, lastPos = "";
    const iv = setInterval(() => {
      const now = performance.now();
      const dt = Math.min(1.5, (now - last) / 1000);
      last = now;
      const w = worldRef.current;
      if (!w) return;
      const myId = myIdRef.current;
      const meE = w.entities[myId];
      const busy = !!choreRef.current;
      if (hostRef.current) {
        // the host runs the castle
        const n = Math.max(1, Math.ceil(dt / 0.05));
        for (let i = 0; i < n; i++) {
          if (w.phase !== "play") break;
          const r = moveSelf(w, myId, keys.current, dt / n, { busy });
          if (r?.finish) humanFinish(w, myId, r.finish);
          stepGame(w, dt / n);
        }
        directorTick(w, now);
        // anyone gone for more than a few seconds: the castle folk steer their knight
        for (const [pid, at] of Object.entries(goneRef.current)) {
          if (now - at < 8000) continue;
          delete goneRef.current[pid];
          const e = w.entities.find((x) => x.pid === pid);
          if (e && e.human) {
            e.human = false; e.hpath = []; e.tp = (e.tp || 0) + 1;
            w.toasts.push({ text: `${e.name} lost their connection. The castle folk steer their knight until they're back.`, tone: "info", at: w.t, seq: w.seq++ });
          }
        }
        if (netRef.current && now - sendAt > SNAP_MS) { sendAt = now; netRef.current.send("snap", snapshot(w)); }
      } else if (meE) {
        // everyone else moves their own knight and tells the host where it is
        if (w.phase === "play") {
          w.t += dt;
          const n = Math.max(1, Math.ceil(dt / 0.05));
          for (let i = 0; i < n; i++) {
            const r = moveSelf(w, myId, keys.current, dt / n, { busy });
            if (r?.finish) { actRef.current("finish", { sid: r.finish }); break; }
          }
          if (meE.ride) { const p = ridePos(meE.ride, w.t); meE.x = p.x; meE.y = p.y; if (p.facing !== null) meE.facing = p.facing; }
        }
        glide(w, myId, dt);
        const pos = `${Math.round(meE.x)},${Math.round(meE.y)},${meE.facing.toFixed(1)},${meE.moving ? 1 : 0},${meE.tp}`;
        if (w.phase === "play" && now - posAt > POS_MS && (pos !== lastPos || now - posAt > 2000)) {
          posAt = now; lastPos = pos;
          netRef.current?.sendUp("pos", { pid: pidRef.current, x: Math.round(meE.x), y: Math.round(meE.y), f: +meE.facing.toFixed(2), m: meE.moving ? 1 : 0, w: +(meE.walk || 0).toFixed(1), tp: meE.tp || 0 });
        }
        if (now - lastSnapAt.current > 9000) setHostLost(true);
      }
      if (!meE) return;
      playSfx(w, myId, sfxSeq);
      if ((keys.current.up || keys.current.down || keys.current.left || keys.current.right) && meE.alive && w.phase === "play" && now - stepAt > 330) { stepAt = now; snd.step(); }
      // only being captured in the middle of a chore stops it (ghosts can do chores)
      const ch = choreRef.current;
      if (ch && (w.phase !== "play" || (ch.aliveAtStart && !meE.alive))) setChore(null);
      if (w.phase !== gphaseRef.current) { gphaseRef.current = w.phase; setGphase(w.phase); if (w.phase !== "play") keys.current = {}; }
      if (now - hudAt > 100 && screenRef.current === "game" && w.phase !== "ending") {
        hudAt = now;
        const h = hudInfo(w, myId);
        setHud(h);
        music.setTension(h.tension);
        music.setStage(h.captures);
        if (miniRef.current && w.phase === "play") drawMiniMap(miniRef.current.getContext("2d"), w, MINI_W, myId);
      }
    }, 33);
    return () => clearInterval(iv);
  }, [screen]);

  // ---- drawing: every animation frame while the castle is on screen ----
  useEffect(() => {
    if (screen !== "game" || (gphase !== "play" && gphase !== "meeting")) return;
    const cv = canvasRef.current;
    if (!cv) return;
    const g = cv.getContext("2d");
    if (!darkRef.current) darkRef.current = document.createElement("canvas").getContext("2d");
    let raf;
    const view = viewRef.current;
    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      view.w = cv.clientWidth; view.h = cv.clientHeight; view.dpr = dpr;
      cv.width = Math.round(view.w * dpr); cv.height = Math.round(view.h * dpr);
      darkRef.current.canvas.width = cv.width; darkRef.current.canvas.height = cv.height;
    };
    resize();
    window.addEventListener("resize", resize);
    const loop = (now) => {
      const w = worldRef.current;
      if (w && w.entities[myIdRef.current]) drawFrame(g, darkRef.current, mapRef.current, w, view, now / 1000, myIdRef.current);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [screen, gphase]);

  // the Donaghy Cup: each laptop keeps its own player's dominoes
  useEffect(() => {
    const w = worldRef.current;
    if (gphase !== "ending" || !w || savedGame.current === w.gameId) return;
    const res = w.results?.[myIdRef.current];
    if (!res) return;
    savedGame.current = w.gameId;
    const meE = w.entities[myIdRef.current];
    const entry = { at: new Date().toISOString(), role: meE.role, won: res.won, points: res.total, players: w.entities.length };
    const list = [...readCup(), entry];
    saveCup(list);
    setCup(list);
  }, [gphase, hud]);

  const say = (text) => { act("say", { text }); setTick((x) => x + 1); };
  const vote = (target) => { setMyVote(target); snd.click(); act("vote", { target }); };
  const lightTorch = () => { snd.unlock(); music.start(); voiceRef.current?.resume(); act("ready"); setTick((x) => x + 1); };
  const anotherNight = () => {
    if (!netRef.current) { worldRef.current = null; setScreen("lobby"); return; }
    if (!hostRef.current) return;
    netRef.current.send("lobby", {});
    worldRef.current = null;
    setGphase(null);
    setScreen("room");
  };

  const voiceBox = netRef.current && voiceRef.current ? (
    <VoicePanel voice={voiceRef.current} state={voiceState} people={people} me={{ pid: pidRef.current }} allowedNote="The host has microphones on only at meetings." />
  ) : null;

  // ---------- screens ----------
  if (screen === "lobby") return <Lobby {...{ playerName: name, setName: changeName, look, setLook, total, setTotal, roleChoice, setRoleChoice, start: startSolo, cup, backHref, createRoom, joinRoom, initialCode }} openPractice={() => { setPracticeFrom("lobby"); setScreen("practice"); }} />;
  if (screen === "practice") return <PracticeJoust me={{ name: name || playerName, look }} onExit={() => setScreen(practiceFrom)} />;
  if (screen === "room") {
    return (
      <WaitingRoom
        code={code} people={people} me={{ pid: pidRef.current }} isHost={hostRef.current}
        settings={settings} setSettings={setSettings} start={startHosted} leave={leaveRoom}
        openPractice={() => { setPracticeFrom("room"); setScreen("practice"); }}
        voice={voiceRef.current} voiceState={voiceState} notice={notice}
      />
    );
  }
  const w = worldRef.current;
  const myId = myIdRef.current;
  const meE = w?.entities[myId];
  if (!w || !meE) return null;

  if (gphase === "intro") {
    const r = ROLES[meE.role];
    const allies = hud?.ally || [];
    const lit = (w.ready || []).includes(myId);
    const others = w.entities.filter((e) => e.human);
    return (
      <div style={S.screen}>
        <div style={{ ...S.card, borderColor: r.side === "dark" ? "#8a1020" : "#c9a227", textAlign: "center", maxWidth: 560 }}>
          <div className="mono" style={S.kicker}>{meE.name.toUpperCase()}, TONIGHT YOU ARE</div>
          <div style={{ ...S.big, color: r.side === "dark" ? "#ff8a70" : "#f2dc9a" }}>the {r.name}</div>
          <p style={S.p}>{r.blurb}</p>
          {r.keys.length > 0 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", margin: "14px 0" }}>
              {r.keys.map(([k, l]) => <span key={k + l} style={S.keycap}><b>{k}</b> {l}</span>)}
            </div>
          )}
          {meE.role === "blackknight" && <p style={{ ...S.p, fontSize: 14 }}>To capture someone, walk right up to them (nearly touching) and press <b>Q</b>. Choose a moment when nobody else can see you.</p>}
          {allies.length > 0 && (
            <p style={{ ...S.p, color: "#ffb4a2" }}>
              Your secret partner: {allies.map((a) => `${a.name} (the ${a.role})`).join(", ")}.
            </p>
          )}
          <p style={{ ...S.p, fontSize: 13, color: "#a9a3c4" }}>
            {r.side === "dark" ? "The castle wins if they joust the Black Knight or finish every chore. You win if the castle runs out of honest folk, or the clock strikes midnight." : "Finish every chore, or find the Black Knight and send them to the joust, before midnight."}
          </p>
          {others.length > 1 && <p style={{ ...S.p, fontSize: 13, color: "#a9a3c4" }}>Keep your role secret, even on the voice chat!</p>}
          <p style={{ ...S.p, fontSize: 13, color: "#a9a3c4" }}>Stuck at any point? Click the owl in the corner, or press H.</p>
          {!lit ? (
            <button style={S.btn} onClick={lightTorch}>Light your torch</button>
          ) : (
            <div style={{ color: "#f2dc9a", fontSize: 14 }}>
              Waiting for the others to light their torches: {(w.ready || []).length} of {others.length}
              <div style={{ fontSize: 12, color: "#8d87ad", marginTop: 4 }}>{others.filter((e) => !(w.ready || []).includes(e.id)).map((e) => e.name).join(", ")}</div>
            </div>
          )}
          {voiceBox && <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>{voiceBox}</div>}
        </div>
      </div>
    );
  }

  if (screen === "over" || gphase === "ending") {
    const result = w.result;
    if (!result) return null;
    if (screen !== "over") {
      const crowd = w.entities.filter((e) => !["blackknight", "jester"].includes(e.role)).map((e) => ({ look: e.look, name: e.name }));
      return <Ending result={result} crowd={crowd} myId={myId} onDone={() => { music.setMode("hall"); setScreen("over"); }} />;
    }
    return <Over {...{ w, myId, result, mine: w.results?.[myId], cup, again: anotherNight, canAgain: hostRef.current, solo: !netRef.current, backHref, voiceBox }} />;
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "#05060d", overflow: "hidden", fontFamily: "Inter, system-ui, sans-serif" }}>
      <canvas ref={canvasRef} onMouseDown={onCanvasDown} onMouseMove={onCanvasMove} onContextMenu={(e) => e.preventDefault()} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: gphase === "joust" ? "none" : "block", cursor: "crosshair" }} />
      {gphase !== "joust" && hud && (
        <Hud hud={hud} openChore={() => { const ctx = humanContext(w, myId); if (ctx.station && ctx.station.kind !== "passage") openChore(ctx); }} pet={() => act("pet")} miniRef={miniRef} muted={muted} toggleMute={toggleMute} musicOn={musicOn} toggleMusic={toggleMusic} showChores={showChores} setShowChores={setShowChores} backHref={backHref} />
      )}
      {gphase === "play" && hud && <HelpOwl hud={hud} open={helpOpen} setOpen={setHelpOpen} />}
      {gphase === "play" && chore && <ChoreGame station={chore.station} fake={chore.fake} onDone={doneChore} onClose={closeChore} />}
      {gphase === "meeting" && w.meeting && (
        <Meeting w={w} myId={myId} m={w.meeting} myVote={myVote} castVote={vote} say={say} />
      )}
      {gphase === "joust" && w.joust && (
        <VoteJoust key={w.joust.startMs} accused={w.joust.accused} crowd={w.joust.crowd.map((c) => ({ ...c, name: c.id === myId ? `${c.name} (you)` : c.name }))} onDone={null} />
      )}
      {voiceBox && <div style={{ position: "absolute", right: 88, bottom: 16, zIndex: 20 }}>{voiceBox}</div>}
      {hostLost && (
        <div style={{ position: "absolute", top: "40%", left: "50%", transform: "translateX(-50%)", ...S.card, zIndex: 30, textAlign: "center", maxWidth: 420 }}>
          <div style={{ ...S.big, fontSize: 24 }}>The host&rsquo;s castle has gone quiet</div>
          <p style={S.p}>Their laptop may have gone to sleep or lost the internet. The game carries on as soon as it&rsquo;s back.</p>
          <button style={S.tiny} onClick={leaveRoom}>leave</button>
        </div>
      )}
    </div>
  );
}

// ---------- HUD ----------
function Hud({ hud, openChore, pet, miniRef, muted, toggleMute, musicOn, toggleMusic, showChores, setShowChores, backHref }) {
  const [mapOpen, setMapOpen] = useState(true);
  const r = ROLES[hud.me.role];
  const cdRow = (label, key, extra) => {
    const v = hud.me.cd[key];
    return <div key={label} style={{ fontSize: 12, color: v > 0 ? "#8d87ad" : "#f2dc9a" }}>{label}: {extra ?? (v > 0 ? `${Math.ceil(v)}s` : "ready")}</div>;
  };
  const left = hud.me.chores.filter((c) => !c.done).length;
  return (
    <>
      {/* role */}
      <div style={{ ...S.hudBox, top: 12, left: 12, minWidth: 210 }}>
        <div className="mono" style={S.kicker}>{hud.me.name.toUpperCase()} · {hud.me.alive ? "ALIVE" : "GHOST"}</div>
        <div style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic", fontSize: 22, color: r.side === "dark" ? "#ff9a85" : "#f2dc9a" }}>{r.name}</div>
        {hud.me.role === "knight" && cdRow("[F] Torch of Truth", "truth")}
        {hud.me.role === "blackknight" && (
          <>
            {cdRow("[Q] Capture", "capture")}
            {cdRow("[1] Lights Out · [2] Portcullis", "sabotage")}
            {cdRow("[3] Disguise", "disguise", hud.me.disguisedAs ? `as ${hud.me.disguisedAs}` : undefined)}
          </>
        )}
        {hud.me.role === "jester" && (
          <>
            <div style={{ fontSize: 12, color: hud.me.swapUsed ? "#8d87ad" : "#f2dc9a" }}>[Q] Swap places: {hud.me.swapUsed ? "used this round" : "ready"}</div>
            <div style={{ fontSize: 12, color: "#8d87ad" }}>Next hop in {Math.ceil(hud.me.cd.hop)}s</div>
          </>
        )}
        {hud.me.role === "locksmith" && <div style={{ fontSize: 12, color: hud.freeUsed ? "#8d87ad" : "#f2dc9a" }}>Free a prisoner: {hud.freeUsed ? "used" : hud.prisoners ? `${hud.prisoners} in the cell` : "nobody in the cell"}</div>}
        {hud.me.role === "blacksmith" && <div style={{ fontSize: 12, color: "#f2dc9a" }}>Your torch never goes out</div>}
        {hud.ally.length > 0 && <div style={{ fontSize: 12, color: "#ffb4a2", marginTop: 4 }}>Partner: {hud.ally.map((a) => a.name).join(", ")}</div>}
        <div style={{ fontSize: 12, color: hud.me.bellUsed ? "#8d87ad" : "#c9c3e6", marginTop: 4 }}>[B] Great Bell: {hud.me.bellUsed ? "rung" : "once tonight"}</div>
      </div>

      {/* clock and chores bar */}
      <div style={{ ...S.hudBox, top: 12, left: "50%", transform: "translateX(-50%)", textAlign: "center", minWidth: 260 }}>
        <div style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic", fontSize: 22, color: hud.left < 60 ? "#ff8a70" : "#f2e6c8" }}>{clockText(hud.t)}</div>
        <div className="mono" style={{ ...S.kicker, marginBottom: 4 }}>MIDNIGHT IN {Math.floor(hud.left / 60)}:{String(Math.floor(hud.left % 60)).padStart(2, "0")} · {hud.alive} OF {hud.total} FREE</div>
        <div style={{ height: 8, background: "#1c1a30", borderRadius: 4, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${hud.secured * 100}%`, background: "linear-gradient(90deg,#c9a227,#f2dc9a)" }} />
        </div>
        <div className="mono" style={{ fontSize: 10, color: "#a9a3c4", marginTop: 3 }}>CASTLE CHORES {Math.round(hud.secured * 100)}%</div>
        {hud.job && hud.me.alive && <div style={{ fontSize: 12, color: hud.job.urgent ? "#ff9a85" : "#f2dc9a", marginTop: 4 }}>Next: {hud.job.label} · {hud.job.room}</div>}
      </div>

      {/* minimap */}
      <div style={{ ...S.hudBox, top: 12, right: 12, padding: 8 }}>
        <canvas ref={miniRef} width={MINI_W * 2} height={MINI_H * 2} style={{ display: mapOpen ? "block" : "none", width: MINI_W, height: MINI_H }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginTop: mapOpen ? 6 : 0 }}>
          <span className="mono" style={{ fontSize: 11, color: "#f2e6c8" }}>{hud.room.toUpperCase()}</span>
          <button onClick={() => setMapOpen(!mapOpen)} style={S.tiny} title="Show or hide the map">{mapOpen ? "hide map ▴" : "map ▾"}</button>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 6, marginTop: 6 }}>
          <button onClick={toggleMusic} style={{ ...S.tiny, color: musicOn ? "#f2dc9a" : "#8d87ad" }} title="Music (N)">{musicOn ? "♪ music on" : "♪ music off"}</button>
          <button onClick={toggleMute} style={{ ...S.tiny, color: muted ? "#8d87ad" : "#f2dc9a" }} title="Sound effects (M)">{muted ? "effects off" : "effects on"}</button>
          <a href={backHref} style={{ ...S.tiny, textDecoration: "none" }}>leave</a>
        </div>
      </div>

      {/* the Black Knight's capture clock */}
      {hud.me.role === "blackknight" && hud.me.alive && (
        <div style={{ ...S.hudBox, top: 128, left: "50%", transform: "translateX(-50%)", textAlign: "center", padding: "6px 16px", borderColor: hud.me.cd.capture > 0 ? "#5a1520" : "#ff5a4a", boxShadow: hud.me.cd.capture > 0 ? "none" : "0 0 18px rgba(255,80,60,0.45)" }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: "1.5px", color: "#ffb4a2" }}>{hud.me.cd.capture > 0 ? "NEXT CAPTURE IN" : "CAPTURE READY: GET CLOSE, PRESS Q"}</div>
          {hud.me.cd.capture > 0 && <div style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic", fontSize: 30, color: "#ff8a70", lineHeight: 1.1 }}>{Math.ceil(hud.me.cd.capture)}</div>}
        </div>
      )}
      {hud.frozen && <div style={{ position: "absolute", top: "42%", left: 0, right: 0, textAlign: "center", fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic", fontSize: 30, color: "#ffe08a", textShadow: "0 2px 10px #000" }}>Whoops! Marbles!</div>}

      {/* chores list, and for the Black Knight and Jester their schemes */}
      <div style={{ ...S.hudBox, bottom: 12, left: 12, maxWidth: 290, maxHeight: "52vh", overflow: "auto" }}>
        {hud.schemes.length > 0 && (
          <div style={{ marginBottom: 8 }}>
            <div className="mono" style={{ fontSize: 10.5, letterSpacing: "1.5px", color: "#ff9a85" }}>YOUR SCHEMES</div>
            {hud.schemes.map((sc, i) => (
              <div key={i} style={{ fontSize: 12, marginTop: 3, color: sc.goal ? "#ffb4a2" : sc.ready ? "#f2dc9a" : "#8d87ad" }}>
                {sc.key && <b style={{ ...S.k, marginRight: 5 }}>{sc.key}</b>}{sc.label}
                {!sc.goal && sc.key && <span style={{ color: sc.ready ? "#8ef0a8" : "#8d87ad" }}> · {sc.note || (sc.ready ? "ready" : `${sc.left}s`)}</span>}
                {!sc.key && sc.note && <span style={{ color: "#8d87ad" }}> · {sc.note}</span>}
              </div>
            ))}
          </div>
        )}
        <button onClick={() => setShowChores(!showChores)} className="mono" style={{ ...S.tiny, border: 0, padding: 0, color: "#c9a227" }}>
          {hud.me.role === "blackknight" || hud.me.role === "jester" ? "PRETEND CHORES (DON'T COUNT)" : "YOUR CHORES"} · {left} LEFT {showChores ? "▾" : "▸"}
        </button>
        {showChores && <div style={{ fontSize: 11, color: "#8d87ad", margin: "3px 0 2px" }}>Gold dots on the map. Walk there and press E</div>}
        {showChores && hud.me.chores.map((c) => (
          <div key={c.id} style={{ fontSize: 12, color: c.done ? "#6d6890" : "#e7e1ff", textDecoration: c.done ? "line-through" : "none", marginTop: 3 }}>
            {c.label} <span style={{ color: "#8d87ad" }}>· {c.room}</span>
          </div>
        ))}
      </div>

      {/* what you can do right here */}
      {(hud.ctx.station || hud.ctx.marker || hud.ctx.bell || hud.ctx.power || hud.ctx.pet) && (
        <div style={{ ...S.hudBox, bottom: 24, left: "50%", transform: "translateX(-50%)", textAlign: "center", minWidth: 280 }}>
          {hud.ctx.power && <div style={{ color: hud.ctx.power.hot ? "#ff9a85" : "#a9a3c4", fontWeight: 600, marginBottom: 4 }}>Press <b style={S.k}>{hud.ctx.power.key}</b>: {hud.ctx.power.label}</div>}
          {hud.ctx.marker && <div style={{ color: "#ff9a85", fontWeight: 600 }}>A dropped helmet! Press <b style={S.k}>R</b> to report it</div>}
          {hud.ctx.bell && !hud.ctx.marker && <div style={{ color: "#f2dc9a" }}>Press <b style={S.k}>B</b> to ring the Great Bell</div>}
          {hud.ctx.pet && !hud.ctx.station && <div style={{ color: "#f2e6c8", cursor: "pointer" }} onClick={pet}>Press <b style={S.k}>E</b>: pet Sheba</div>}
          {hud.ctx.station && hud.ctx.station.kind !== "passage" && (
            <button onClick={openChore} style={{ background: "transparent", border: 0, color: "#f2e6c8", fontSize: 14, cursor: "pointer", padding: 0 }}>
              Press <b style={S.k}>E</b> (or click): {hud.ctx.label}{hud.ctx.fake ? " (pretend)" : ""}
            </button>
          )}
          {hud.ctx.station && hud.ctx.station.kind === "passage" && (
            <>
              <div style={{ color: "#f2e6c8" }}>Hold <b style={S.k}>E</b>: {hud.ctx.label}</div>
              <div style={{ height: 6, background: "#1c1a30", borderRadius: 3, marginTop: 6, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${hud.work ? Math.min(100, (hud.work.p / hud.work.need) * 100) : 0}%`, background: "#f2dc9a" }} />
              </div>
            </>
          )}
        </div>
      )}

      {/* news */}
      <div style={{ position: "absolute", top: 196, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", gap: 6, alignItems: "center", pointerEvents: "none", width: "min(560px, 90vw)" }}>
        {hud.lightsOut && <div style={{ ...S.toast, background: "rgba(80,10,10,0.85)", color: "#ffd0c4" }}>LIGHTS OUT · relight the torches at the Forge</div>}
        {hud.gate && <div style={{ ...S.toast, background: "rgba(60,40,10,0.85)", color: "#ffe2a8" }}>The portcullis is jammed · free it in the Gatehouse</div>}
        {!hud.me.alive && <div style={{ ...S.toast, background: "rgba(40,40,70,0.8)" }}>You&rsquo;re a ghost: you can&rsquo;t vote, but your chores still count</div>}
        {hud.toasts.map((t, i) => (
          <div key={i + t.text} style={{ ...S.toast, color: t.tone === "bad" ? "#ffb4a2" : t.tone === "good" ? "#bff5c9" : "#efe9ff" }}>{t.text}</div>
        ))}
      </div>
    </>
  );
}

// ---------- the meeting in the Great Hall ----------
// The host runs it: lines appear one by one, the vote closes when every
// real player has voted (or the time runs out), then the tally shows and
// everyone is taken to the tiltyard together.
function Meeting({ w, myId, m, myVote, castVote, say }) {
  const [draft, setDraft] = useState("");
  const [showAll, setShowAll] = useState(false);
  const me = w.entities[myId];
  const voted = m.voted || Object.keys(m.humanVotes || {}).map(Number);
  const shown = showAll ? m.lines.length : Math.min(m.lines.length, m.shown || 0);
  const lines = m.lines.slice(0, shown);
  const done = shown >= m.lines.length;
  const left = Math.ceil((m.leftMs ?? 0) / 1000);
  const alive = w.entities.filter((e) => e.alive);
  const name = (id) => (id === myId ? `${w.entities[id].name} (you)` : w.entities[id].name);
  const notebook = (m.notebooks && m.notebooks[myId]) || [];
  const waitingOn = w.entities.filter((e) => e.human && e.alive && !voted.includes(e.id));
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ block: "end", behavior: "smooth" }); }, [shown]);
  const iVoted = myVote !== undefined || voted.includes(myId);

  return (
    <div style={{ position: "absolute", inset: 0, background: "rgba(6,5,14,0.82)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ ...S.card, maxWidth: 1040, width: "100%", maxHeight: "94vh", overflow: "auto", padding: 22 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
          <div style={{ ...S.big, fontSize: 30 }}>The Great Bell tolls</div>
          <div className="mono" style={S.kicker}>MEETING IN THE GREAT HALL · ROUND {w.round}</div>
          {!m.resolved && <div className="mono" style={{ marginLeft: "auto", fontSize: 13, letterSpacing: "1px", color: left <= 10 ? "#ff8a70" : "#f2dc9a" }}>VOTE CLOSES IN {left}s</div>}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.5fr) minmax(0, 1fr)", gap: 18, marginTop: 14 }} className="castle-meet-grid">
          <div style={{ minHeight: 220 }}>
            {lines.map((l, i) => {
              const e = l.who === null ? null : w.entities[l.who];
              return (
                <div key={i} style={{ display: "flex", gap: 10, padding: "7px 0", borderBottom: "1px solid #24203e", animation: "castleIn .35s ease" }}>
                  {e ? <Shield color={e.color} /> : <span style={{ width: 22, fontSize: 18, textAlign: "center" }}>{l.evidence ? "🔍" : "🔔"}</span>}
                  <div style={{ fontSize: 14, lineHeight: 1.5, color: l.who === null ? (l.evidence ? "#f2dc9a" : "#ffd0c4") : "#e7e1ff" }}>
                    {e && <b style={{ color: e.color === "#E8E4D8" ? "#fff" : e.color, marginRight: 6 }}>{name(e.id)}:</b>}
                    {l.text}
                  </div>
                </div>
              );
            })}
            {!done && <button style={{ ...S.tiny, marginTop: 10 }} onClick={() => setShowAll(true)}>show everything</button>}
            {me.alive && !m.resolved && (
              <form onSubmit={(e) => { e.preventDefault(); if (draft.trim()) { say(draft); setDraft(""); setShowAll(true); } }} style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type to the hall: “I saw Hamish in the Forge!” or “Agnes is innocent”"
                  maxLength={240}
                  aria-label="Say something to the hall"
                  style={{ flex: 1, minWidth: 0, background: "#14112a", color: "#f2e6c8", border: "1px solid #3a3560", borderRadius: 999, padding: "9px 14px", fontSize: 14 }}
                />
                <button type="submit" style={{ ...S.voteBtn, background: "#2a2450" }}>Say it</button>
              </form>
            )}
            <div ref={bottomRef} />
          </div>
          <div>
            <div className="mono" style={S.kicker}>CASE NOTES (ALL NIGHT)</div>
            {w.caseNotes.length ? w.caseNotes.map((c, i) => (
              <div key={i} style={{ fontSize: 12.5, color: "#e3d7b4", marginTop: 6, lineHeight: 1.45 }}>
                <b>Round {c.round}:</b> {c.victim} taken in the {c.room}. {c.text}
              </div>
            )) : <div style={{ fontSize: 12.5, color: "#8d87ad", marginTop: 6 }}>No captures yet.</div>}
            <div className="mono" style={{ ...S.kicker, marginTop: 16 }}>WHAT YOU SAW (LAST TWO MINUTES)</div>
            {notebook.length ? notebook.map((n, i) => (
              <div key={i} style={{ fontSize: 12.5, color: n.saw || n.growl ? "#ff9a85" : "#c9c3e6", marginTop: 5 }}>
                {n.saw ? `You saw ${n.name} capture someone in the ${n.room}!` : n.growl ? `Sheba growled at ${n.name} in the ${n.room} (${n.ago}s ago)` : `${n.name} · ${n.room} · ${n.ago}s ago`}
              </div>
            )) : <div style={{ fontSize: 12.5, color: "#8d87ad", marginTop: 6 }}>You didn&rsquo;t see anyone.</div>}
          </div>
        </div>

        <div style={{ marginTop: 18, borderTop: "1px solid #2e2850", paddingTop: 14 }}>
          {!m.resolved ? (
            me.alive ? (
              <>
                <div className="mono" style={S.kicker}>WHO RIDES IN THE JOUST? {iVoted ? "YOUR VOTE IS IN (YOU CAN CHANGE IT)" : "CAST YOUR VOTE"}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                  {alive.filter((e) => e !== me).map((e) => (
                    <button key={e.id} onClick={() => castVote(e.id)} style={{ ...S.voteBtn, borderColor: myVote === e.id ? "#c9a227" : "#3a3560", background: myVote === e.id ? "#3a2f10" : "#17142e" }}><Shield color={e.color} small /> {e.name}</button>
                  ))}
                  <button onClick={() => castVote(null)} style={{ ...S.voteBtn, borderStyle: "dashed", borderColor: myVote === null ? "#c9a227" : "#3a3560" }}>Skip the vote</button>
                </div>
              </>
            ) : (
              <div style={{ color: "#c9c3e6", fontSize: 14 }}>You&rsquo;re a ghost: you can&rsquo;t vote, but you can watch (and your chores still count).</div>
            )
          ) : (
            <>
              <div className="mono" style={S.kicker}>THE VOTE</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                {[...Object.entries(m.counts || {}).sort((a, b) => b[1] - a[1]), ...(m.skip ? [["skip", m.skip]] : [])].map(([id, n]) => (
                  <div key={id} style={{ ...S.voteBtn, cursor: "default", borderColor: +id === m.accused ? "#c9a227" : "#3a3560" }}>
                    {id === "skip" ? "Skipped" : name(+id)}: <b style={{ marginLeft: 4 }}>{n}</b>
                    <span style={{ fontSize: 11, color: "#8d87ad", marginLeft: 6 }}>
                      ({(m.votes || []).filter((v) => String(v.target === null ? "skip" : v.target) === id).map((v) => (v.voter === myId ? "you" : w.entities[v.voter].name.split(" ").slice(-1)[0])).join(", ")})
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14, color: "#f2e6c8" }}>
                {m.accused !== null && m.accused !== undefined ? `${name(m.accused)} must ride against the Black Knight. To the tiltyard...` : "No one has enough votes. Nobody rides tonight. Back to the castle..."}
              </div>
            </>
          )}
          {!m.resolved && (
            <div style={{ fontSize: 12, color: "#8d87ad", marginTop: 8 }}>
              {waitingOn.length ? `Still to vote: ${waitingOn.map((e) => (e.id === myId ? "you" : e.name)).join(", ")}. ` : ""}
              The castle folk vote when the family has. Anyone who hasn&rsquo;t voted when the time runs out skips.
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes castleIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
      @media (max-width: 760px){.castle-meet-grid{grid-template-columns:1fr !important}}`}</style>
    </div>
  );
}

function Shield({ color, small }) {
  const s = small ? 14 : 22;
  return (
    <svg width={s} height={s * 1.15} viewBox="0 0 20 23" style={{ flexShrink: 0, verticalAlign: "middle" }} aria-hidden="true">
      <path d="M1 1h18v9c0 6-5 10-9 12C6 20 1 16 1 10z" fill={color} stroke="#e8dcb8" strokeWidth="1.2" />
    </svg>
  );
}

// ---------- end of the night ----------
function Domino({ a, b, title }) {
  const pip = (n, ox) => {
    const P = { 1: [[1, 1]], 2: [[0, 0], [2, 2]], 3: [[0, 0], [1, 1], [2, 2]], 4: [[0, 0], [2, 0], [0, 2], [2, 2]], 5: [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]], 6: [[0, 0], [0, 1], [0, 2], [2, 0], [2, 1], [2, 2]] }[n] || [];
    return P.map(([x, y], i) => <circle key={ox + "-" + i} cx={ox + 5 + x * 6} cy={5 + y * 6} r="1.7" fill="#1b1406" />);
  };
  return (
    <svg width="46" height="24" viewBox="0 0 46 24" role="img" aria-label={`${a}-${b} domino: ${title}`}>
      <title>{title}</title>
      <rect x="0.5" y="0.5" width="45" height="23" rx="4" fill="#f4f1e8" stroke="#1b1406" />
      <line x1="23" y1="3" x2="23" y2="21" stroke="#1b1406" />
      <g transform="translate(2 1)">{pip(a, 0)}</g>
      <g transform="translate(25 1)">{pip(b, 0)}</g>
    </svg>
  );
}

function Over({ w, myId, result, mine, cup, again, canAgain, solo, backHref, voiceBox }) {
  mine = mine || { won: false, tiles: [], points: [], total: 0 };
  const why = {
    joust: "The Black Knight was knocked from the saddle in the joust!",
    chores: "Every chore is done and the castle is secure. The Black Knight slinks away.",
    overrun: "Too few honest folk are left free. The Black Knight rules the night.",
    midnight: "The clock struck midnight and the Black Knight escaped into the dark.",
  }[result.reason];
  const castleWon = result.winner === "castle";
  const pts = cup.reduce((s, x) => s + x.points, 0);
  const wins = cup.filter((x) => x.won).length;
  const best = Math.max(0, ...cup.map((x) => x.points));
  return (
    <div style={S.screen}>
      <div style={{ ...S.card, maxWidth: 760, borderColor: castleWon ? "#c9a227" : "#8a1020" }}>
        <div className="mono" style={S.kicker}>{mine.won ? "YOU WIN" : "YOU LOSE"} · THE NIGHT IS OVER</div>
        <div style={{ ...S.big, color: castleWon ? "#f2dc9a" : "#ff8a70" }}>{castleWon ? "The castle is saved" : "The Black Knight triumphs"}</div>
        <p style={S.p}>{why}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 8, margin: "16px 0" }}>
          {w.entities.map((e) => (
            <div key={e.id} style={{ ...S.mini, display: "flex", gap: 8, alignItems: "center", borderColor: ROLES[e.role].side === "dark" ? "#5a1520" : "#3a3560" }}>
              <Shield color={e.color} small />
              <div>
                <div style={{ fontSize: 13, color: "#f2e6c8" }}>{e.id === myId ? `${e.name} (you)` : e.name}{!e.pid && <span style={{ fontSize: 11, color: "#8d87ad" }}> (castle folk)</span>}</div>
                <div style={{ fontSize: 11.5, color: ROLES[e.role].side === "dark" ? "#ff9a85" : "#b9b3d6" }}>
                  {ROLES[e.role].name} · {e.alive ? "free" : e.out ? "jousted" : "captured"}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 16 }} className="castle-meet-grid">
          <div>
            <div className="mono" style={S.kicker}>YOUR DOMINOES TONIGHT</div>
            {mine.tiles.length ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "8px 0" }}>
                {mine.tiles.map((d, i) => <Domino key={i} a={d.a} b={d.b} title={d.label} />)}
              </div>
            ) : <div style={{ fontSize: 13, color: "#8d87ad", margin: "6px 0" }}>No dominoes this time.</div>}
            {mine.points.map(([l, p]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "#c9c3e6", padding: "3px 0", borderBottom: "1px solid #24203e" }}><span>{l[0].toUpperCase() + l.slice(1)}</span><b>{p} pips</b></div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, color: "#f2dc9a", padding: "8px 0" }}><span>Domino points</span><b>{mine.total}</b></div>
          </div>
          <div style={{ ...S.mini, borderColor: "#c9a227", textAlign: "center" }}>
            <div style={{ fontSize: 30 }}>🏆</div>
            <div style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic", fontSize: 20, color: "#f2dc9a" }}>The Donaghy Cup</div>
            <div style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic", fontSize: 16, color: "#e9c64a", margin: "6px 0" }}>&ldquo;The Cup stays in the family!&rdquo;</div>
            <div style={{ fontSize: 13, color: "#c9c3e6", marginTop: 6, lineHeight: 1.6 }}>
              {pts} domino points from {cup.length} night{cup.length === 1 ? "" : "s"}<br />
              {wins} won · best night {best}
            </div>
            <div style={{ fontSize: 11.5, color: "#a9a3c4", marginTop: 6 }}>Most domino points at the end of the evening lifts the Cup.</div>
            <div style={{ fontSize: 11, color: "#8d87ad", marginTop: 6 }}>Your own total is kept on this laptop.</div>
          </div>
        </div>
        {w.log.length > 0 && (
          <details style={{ marginTop: 14 }} open>
            <summary className="mono" style={{ ...S.kicker, cursor: "pointer" }}>THE STORY OF THE NIGHT (WHAT REALLY HAPPENED)</summary>
            <div style={{ marginTop: 6, maxHeight: 200, overflow: "auto" }}>
              {w.log.map((l, i) => (
                <div key={i} style={{ fontSize: 12.5, color: "#d7d1ef", padding: "3px 0", borderBottom: "1px solid #1f1b38" }}>
                  <span className="mono" style={{ color: "#8d87ad", marginRight: 8 }}>{clockText(l.t)}</span>{l.text}
                </div>
              ))}
            </div>
          </details>
        )}
        {Object.keys(w.results || {}).length > 1 && (
          <div style={{ marginTop: 16 }}>
            <div className="mono" style={S.kicker}>TONIGHT&rsquo;S DOMINOES, ALL THE FAMILY</div>
            {Object.entries(w.results).sort((a, b) => b[1].total - a[1].total).map(([id, r], i) => (
              <div key={id} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: i === 0 ? "#f2dc9a" : "#d7d1ef", padding: "5px 0", borderBottom: "1px solid #24203e" }}>
                <span>{i === 0 ? "🏆 " : ""}{r.name}{+id === myId ? " (you)" : ""} <span style={{ fontSize: 12, color: "#8d87ad" }}>· the {ROLES[w.entities[id].role].name} · {r.won ? "won" : "lost"}</span></span>
                <b>{r.total}</b>
              </div>
            ))}
          </div>
        )}
        {voiceBox && <div style={{ marginTop: 14 }}>{voiceBox}</div>}
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 16, flexWrap: "wrap" }}>
          {solo || canAgain ? <button style={S.btn} onClick={again}>{solo ? "Another night" : "Another night: back to the gate"}</button>
            : <span style={{ color: "#c9c3e6", fontSize: 14 }}>Waiting for the host to start another night...</span>}
          <a href={backHref} style={{ color: "#8b95f6", fontSize: 13 }}>back to 13i.space</a>
        </div>
      </div>
    </div>
  );
}

const S = {
  screen: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 18, background: "radial-gradient(ellipse at 50% 0%, #1d1b3a 0%, #07070f 70%)", fontFamily: "Inter, system-ui, sans-serif" },
  card: { background: "rgba(14,12,28,0.94)", border: "1px solid #3a3560", borderRadius: 10, padding: 28, boxShadow: "0 20px 60px rgba(0,0,0,0.5)", color: "#e7e1ff" },
  kicker: { fontSize: 10.5, letterSpacing: "1.5px", color: "#a9a3c4" },
  big: { fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic", fontSize: 38, color: "#f2dc9a", lineHeight: 1.15, margin: "6px 0 10px" },
  p: { fontSize: 15, lineHeight: 1.6, color: "#d7d1ef", margin: "8px 0" },
  btn: { background: "linear-gradient(135deg, #f2dc9a, #c9a227)", color: "#1b1406", border: 0, borderRadius: 999, padding: "11px 22px", fontWeight: 700, fontSize: 15, cursor: "pointer" },
  tiny: { background: "transparent", border: "1px solid #3a3560", color: "#c9c3e6", borderRadius: 999, padding: "3px 10px", fontSize: 11, cursor: "pointer" },
  select: { width: "100%", marginTop: 6, background: "#14112a", color: "#f2e6c8", border: "1px solid #3a3560", borderRadius: 6, padding: "9px 10px", fontSize: 14 },
  label: { display: "block" },
  mini: { border: "1px solid #3a3560", borderRadius: 8, padding: "10px 12px", background: "rgba(25,22,48,0.6)" },
  keycap: { border: "1px solid #5a5390", borderRadius: 6, padding: "4px 10px", fontSize: 13, color: "#e7e1ff", background: "#1a1735" },
  hudBox: { position: "absolute", background: "rgba(10,9,22,0.78)", border: "1px solid #2e2850", borderRadius: 8, padding: "10px 12px", color: "#e7e1ff", backdropFilter: "blur(4px)" },
  toast: { background: "rgba(14,12,28,0.88)", border: "1px solid #3a3560", borderRadius: 999, padding: "6px 14px", fontSize: 13, color: "#efe9ff", textAlign: "center" },
  k: { border: "1px solid #8a83c0", borderRadius: 4, padding: "0 5px" },
  voteBtn: { display: "inline-flex", alignItems: "center", gap: 6, background: "#17142e", color: "#f2e6c8", border: "1px solid #3a3560", borderRadius: 999, padding: "7px 12px", fontSize: 13.5, cursor: "pointer" },
};
