// WardenAI - a state machine driven by Awareness. The Warden is not an
// enemy with a health bar; it is attention. What it does changes the world
// around the player, and never states its intent.
//
// DORMANT -> OBSERVING -> INTERFERING -> DEFENDING -> CONFRONTING

import { AWARENESS } from "../config.js";
import { WARDEN_LINES } from "../lore/lore.js";
import { spawnConstruct } from "../entities/constructs.js";

export const STATES = ["DORMANT", "OBSERVING", "INTERFERING", "DEFENDING", "CONFRONTING"];

export function stateFor(awareness) {
  if (awareness >= AWARENESS.confronting) return "CONFRONTING";
  if (awareness >= AWARENESS.defending) return "DEFENDING";
  if (awareness >= AWARENESS.interfering) return "INTERFERING";
  if (awareness >= AWARENESS.observing) return "OBSERVING";
  return "DORMANT";
}

export function createWarden() {
  return {
    state: "DORMANT",
    timer: 20,
    lineTimer: 30,
    effects: { mapDistort: 0, falseReading: 0, scanSuppressed: 0 },
    falseObjective: null, // room key
    maxConstructs: 0,
  };
}

// The events the Warden can choose from, by minimum state.
const EVENTS = [
  { id: "lights", min: 1, run: lights },
  { id: "door", min: 2, run: sealDoor },
  { id: "energy", min: 2, run: redirectEnergy },
  { id: "distort", min: 2, run: distortMap },
  { id: "reading", min: 2, run: falseReading },
  { id: "suppress", min: 3, run: suppressScan },
  { id: "objective", min: 3, run: falseObjective },
  { id: "construct", min: 3, run: construct },
];

export function updateWarden(w, run, api, dt) {
  const prev = w.state;
  w.state = stateFor(run.stats.awareness);
  const level = STATES.indexOf(w.state);
  if (w.state !== prev && level > STATES.indexOf(prev)) {
    api.audio.warden();
    if (w.state === "OBSERVING") api.msg("SOMETHING SHIFTED.");
    if (w.state === "INTERFERING") { api.msg("THE WORLD IS RESPONDING."); api.discover("wd-watching"); }
    if (w.state === "DEFENDING") { api.msg("THE WARDEN IS LISTENING."); api.discover("wd-listens"); }
    if (w.state === "CONFRONTING") api.msg("IT KNOWS WHERE YOU ARE.");
    w.timer = Math.min(w.timer, 4);
  }
  w.maxConstructs = level >= 4 ? 3 : level >= 3 ? 2 : 0;

  Object.keys(w.effects).forEach((k) => { w.effects[k] = Math.max(0, w.effects[k] - dt); });

  if (level === 0) return;
  w.timer -= dt;
  if (w.timer <= 0) {
    trigger(w, run, api);
    // more attention, more often - but never constant
    w.timer = [0, 30, 24, 18, 13][level] * (0.7 + api.rng.next() * 0.6);
  }
  w.lineTimer -= dt;
  if (w.lineTimer <= 0 && WARDEN_LINES[w.state]) {
    if (api.rng.chance(0.5)) api.msg(api.rng.pick(WARDEN_LINES[w.state]), { dim: true });
    w.lineTimer = 35 + api.rng.next() * 30;
  }
}

// Fire one event appropriate to the current state (also used by debug + CONNECT).
export function trigger(w, run, api, forceId) {
  const level = STATES.indexOf(stateFor(run.stats.awareness));
  const options = EVENTS.filter((e) => (forceId ? e.id === forceId : e.min <= Math.max(1, level)));
  let shuffled = api.rng.shuffle(options);
  // once it is defending, it usually sends something to look
  if (!forceId && level >= 3 && api.rng.chance(0.45)) shuffled = [...shuffled.filter((e) => e.id === "construct"), ...shuffled.filter((e) => e.id !== "construct")];
  for (const e of shuffled) {
    if (e.run(w, run, api) !== false) return e.id;
  }
  return null;
}

function lights(w, run, api) {
  const room = run.world.roomAt(run.player.x, run.player.y);
  const lamps = room ? room.objects.filter((o) => o.type === "lamp" && !o.on) : [];
  if (!lamps.length) return false;
  lamps.forEach((l) => { l.on = true; });
  api.msg("A LIGHT, WHERE THERE WAS NONE.");
  api.discover("wd-lights");
  api.audio.energy();
}

function sealDoor(w, run, api) {
  const room = run.world.roomAt(run.player.x, run.player.y);
  if (!room) return false;
  const open = Object.values(room.doors).filter((d) => d.state === "open" && !(run.playerOverlaps && run.playerOverlaps(d.tiles)));
  if (open.length < 2) return false; // never trap the player
  const door = api.rng.pick(open);
  door.state = "sealed";
  door.sealTimer = 14;
  api.msg("A DOOR SEALS.");
  api.discover("wd-door");
  api.audio.warning();
}

function redirectEnergy(w, run, api) {
  const room = run.world.roomAt(run.player.x, run.player.y);
  if (!room) return false;
  const near = [];
  Object.values(room.doors).forEach((d) => {
    const other = run.world.rooms.get(d.a === room.key ? d.b : d.a);
    other.objects.forEach((o) => { if (o.type === "energy" && o.charge > 0) near.push(o); });
  });
  // never take the last energy the player could reach cheaply when they're low
  if (!near.length || run.stats.energy < 25) return false;
  const o = api.rng.pick(near);
  o.charge = 0;
  o.redirected = true;
  api.msg("POWER IS MOVING ELSEWHERE.");
  api.discover("wd-energy");
}

function distortMap(w) {
  w.effects.mapDistort = 3;
  return true;
}

function falseReading(w, run, api) {
  w.effects.falseReading = 4;
  api.msg("INTERFERENCE. YOUR INSTRUMENTS ARE BEING READ.", { dim: true });
  api.discover("an-double");
}

function suppressScan(w, run, api) {
  w.effects.scanSuppressed = 8;
  api.msg("SCAN SUPPRESSED.");
  api.discover("wd-scan");
  api.audio.warning();
}

function falseObjective(w, run, api) {
  const candidates = [...run.world.rooms.values()].filter((r) => r.type !== "node" && !r.explored && r.part !== "dot");
  if (!candidates.length) return false;
  w.falseObjective = api.rng.pick(candidates).key;
  api.msg("A STRONG SOURCE. MARKED.");
}

function construct(w, run, api) {
  if (run.constructs.filter((c) => c.alive).length >= w.maxConstructs) return false;
  return spawnConstruct(run, api) ? true : false;
}
