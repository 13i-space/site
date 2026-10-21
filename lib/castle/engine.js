// Murder in the Donaghy Castle - the game rules and the computer players.
//
// One world object holds everything. It runs on ONE computer (the host:
// whoever started the game, or you alone on a test night). Real players are
// entities with `human: true`; each moves their own knight on their own
// laptop (moveSelf) and sends the result, plus one-shot actions, to the host,
// which runs everything else: stepGame() every frame, directorTick() for the
// meeting/joust clock, and snapshot() to share the castle with everyone.
// Sounds and messages go into world.sfx / world.toasts, addressed to a seat
// or a place, so each laptop plays and shows only what that player should.
import {
  GATHER_R, KITCHEN_BOWL, TILE, AREAS, ROOMS, STATIONS, CHORES, CELL_AREA, HALL_CENTRE, PORTCULLIS,
  areaAt, areaById, canWalkTile, hasLOS, findPath, randomTileIn, stationById, passageExit, W, H,
} from "./map";
import { TABARDS, randomLook, DEFAULT_LOOK } from "./looks";
import { WEAPONS, MARKS, weaponById, placeOf, GALLERIES, CLAYMORE_SPOTS, POWERUPS } from "./clues";
export { WEAPONS, weaponById, CRIME_PLACES, GALLERIES, POWERUPS } from "./clues";

export const ROLES = {
  squire: {
    name: "Squire", side: "castle",
    blurb: "Do your chores: each one shows you a clue card about its room and a weapon. Work out WHO did it, WITH WHAT and WHERE, and send the Black Knight to the joust.",
    keys: [],
  },
  knight: {
    name: "Knight", side: "castle",
    blurb: "Your Torch of Truth (F) shows who someone really is, even through a disguise. Long cooldown, so choose well.",
    keys: [["F", "Torch of Truth"]],
  },
  locksmith: {
    name: "Locksmith", side: "castle",
    blurb: "You can walk through the castle's locked doors, and once per night you can free a prisoner from the dungeon cell.",
    keys: [["E", "Unlock the cell (in the Dungeon)"]],
  },
  blacksmith: {
    name: "Blacksmith", side: "castle",
    blurb: "Your torch never goes out, and you mend the Black Knight's sabotage fast: relight the torches at the Forge, free the portcullis in the Gatehouse.",
    keys: [["E", "Repair (fast)"]],
  },
  jester: {
    name: "Jester", side: "dark",
    blurb: "You're secretly helping the Black Knight. You pop up all over the castle at random. Q swaps places with someone nearby, 1 fakes a scream somewhere to send everyone running the wrong way, 2 drops marbles that send people sprawling. Spread mischief at the meetings!",
    keys: [["Q", "Swap places"], ["1", "False alarm"], ["2", "Marbles"]],
  },
  blackknight: {
    name: "Black Knight", side: "dark",
    blurb: "Capture everyone without being caught. Each round you carry one weapon (its stand stands empty). You have every power: locked doors, Lights Out, jamming the portcullis, disguise, and a smoke bomb nobody can see through. Pretend to do chores. You alone can't lift the Donaghy Claymore.",
    keys: [["Q", "Capture"], ["1", "Lights Out"], ["2", "Jam the portcullis"], ["3", "Disguise"], ["4", "Smoke bomb"]],
  },
};

const NPC_NAMES = [
  "Sir Hamish", "Lady Marjorie", "Brother Cuthbert", "Old Agnes", "Wee Rab", "Fergus",
  "Morag", "Ned the Ostler", "Lady Pemberton", "Tam o' the Glen", "Dame Winifred",
];
export const COLORS = TABARDS;

export const GAME_SECONDS = 8 * 60;
export const MIN_PLAYERS = 6, MAX_PLAYERS = 12;
export const VOTE_SECONDS = 60;
// the accusations are unsealed one by one, then the case cards are turned over
export const TALLY_MS = 12500;
const JOUST_MS = 9800, LINE_MS = 1400;
const CHORES_EACH = 8;
const CAPTURE_CD = 28, FIRST_CAPTURE_CD = 18, TRUTH_CD = 45, SABOTAGE_CD = 45;
const DISGUISE_CD = 40, DISGUISE_TIME = 30, LIGHTS_TIME = 45, GATE_TIME = 60;
const CAPTURE_RANGE = 34, SPEED_HUMAN = 150, SPEED_GHOST = 165, SPEED_NPC = 112;
const BOOTS = 1.25, LANTERN = 1.4;
const FIX_FAST = 1.5, FIX_SLOW = 6, CELL_TIME = 2.5, PASSAGE_HOLD = 0.6;

const rnd = Math.random;
const pick = (a) => a[Math.floor(rnd() * a.length)];
const shuffle = (a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
export const isDark = (e) => ROLES[e.role].side === "dark";
const roomName = (id) => areaById(id)?.name || "castle";
const isCorridor = (id) => areaById(id)?.floor === "corridor";

// players: [{ pid, name, look, role }] - the real people, in seat order.
// total: seats in all (the rest are castle folk). role "random" (or none) means dealt.
export function createGame({ players, total = 8 }) {
  if (!players || !players.length) players = [{ pid: "solo", name: "You", look: DEFAULT_LOOK, role: "random" }];
  total = Math.max(MIN_PLAYERS, Math.min(MAX_PLAYERS, Math.max(total | 0, players.length)));
  // the Jester joins from 7 people up; with 6 the Black Knight works alone
  let deck = ["blackknight", "knight", "locksmith", "blacksmith", ...(total >= 7 ? ["jester"] : [])];
  while (deck.length < total) deck.push("squire");
  // honour asked-for roles (for testing), deal the rest at random
  const seatRoles = new Array(total).fill(null);
  players.forEach((p, i) => {
    if (p.role && p.role !== "random" && deck.includes(p.role)) { seatRoles[i] = p.role; deck.splice(deck.indexOf(p.role), 1); }
  });
  deck = shuffle(deck);
  for (let i = 0; i < total; i++) if (!seatRoles[i]) seatRoles[i] = deck.pop();
  // everyone's tabard colour is unique: a later player who picked a taken colour gets the next free one
  const used = new Set();
  // two people with the same name get told apart
  const seenNames = {};
  players = players.map((p) => {
    let name = String(p.name || "Guest").trim().slice(0, 20) || "Guest";
    const k = name.toLowerCase();
    seenNames[k] = (seenNames[k] || 0) + 1;
    if (seenNames[k] > 1) name = `${name} ${["", "", "II", "III", "IV", "V"][seenNames[k]] || seenNames[k]}`;
    return { ...p, name };
  });
  const humanLooks = players.map((p) => {
    const look = { ...DEFAULT_LOOK, ...(p.look || {}) };
    if (used.has(look.tabard)) look.tabard = TABARDS.find((c) => !used.has(c));
    used.add(look.tabard);
    return look;
  });
  const freeColors = shuffle(TABARDS.filter((c) => !used.has(c)));
  const npcNames = shuffle(NPC_NAMES.filter((n) => !players.some((p) => p.name === n)));
  const entities = [];
  for (let id = 0; id < total; id++) {
    const p = players[id];
    const look = p ? humanLooks[id] : randomLook(freeColors.pop());
    const role = seatRoles[id];
    entities.push({
      id, role, human: !!p, pid: p ? p.pid : null,
      name: p ? p.name : npcNames.pop() || `Guest ${id}`,
      color: look.tabard, look,
      walk: 0, moving: false,
      alive: true, ghost: false, out: false,
      x: 0, y: 0, facing: Math.PI / 2, tp: 0,
      path: [], work: null, goal: null, repath: 0,
      chores: shuffle(CHORES).slice(0, CHORES_EACH).map((s) => s.id),
      done: [],
      canUnlock: role === "locksmith" || role === "blackknight",
      roomLog: [], seen: [],
      cd: { capture: FIRST_CAPTURE_CD, truth: 40, sabotage: 30, disguise: 20, hop: 30 + rnd() * 20, smoke: 25, alarm: 25, marbles: 20 },
      frozenUntil: 0,
      swapUsed: false, bellUsed: false,
      trust: 0.45 + rnd() * 0.75, // how much a computer player believes what others say
      disguiseAs: null, disguiseUntil: 0,
      truth: {}, witnessed: null, reportAt: null, hunt: null,
      ride: null, reveal: null,
      stats: { chores: 0, reports: 0, captures: 0, truthCatch: 0, rightVotes: 0, weaponRight: 0, roomRight: 0, solved: 0, claymoreBK: 0 },
      cards: [], powerups: {}, clayT: 0,
    });
  }
  const world = {
    t: 0, entities, phase: "intro", round: 1, gameId: Math.random().toString(36).slice(2, 10), ready: [], introMs: null,
    markers: [], caseNotes: [], toasts: [], sfx: [], seq: 1,
    lightsOut: false, lightsUntil: 0, lightsFixer: null,
    portcullisJammed: false, gateUntil: 0, gateFixer: null,
    freeUsed: false, lastCaptureT: -99, sightTick: 0,
    meeting: null, joust: null, result: null, results: {}, lastJoust: null,
    nextMarker: 1,
    // fewer people, fewer to spare: the Black Knight recharges more slowly in a small castle
    captureCd: total >= 8 ? CAPTURE_CD : total === 7 ? 48 : 32,
    sheba: makeSheba(), nana: makeNana(),
    smoke: [], marbles: [], alarm: null, log: [], growls: [],
    // the Clue side: this round's weapon, past rounds' answers, the Claymore
    weapon: pick(WEAPONS).id, usedWeapons: [], caseLog: [], stumbleTick: 0,
    claymore: hideClaymore(),
  };
  world.usedWeapons.push(world.weapon);
  gatherInHall(world);
  return world;
}

// ---------- small helpers ----------
export const apparentId = (e) => (e.disguiseAs !== null ? e.disguiseAs : e.id);
export const look = (world, e) => world.entities[apparentId(e)];
export const humans = (world) => world.entities.filter((e) => e.human);
// a message for one seat (to: id) or everybody (to: undefined)
function toast(world, text, tone = "info", to) {
  world.toasts.push({ text, tone, at: world.t, to, seq: world.seq++ });
  if (world.toasts.length > 40) world.toasts.splice(0, world.toasts.length - 40);
}
// a sound for one seat (to), for anyone near a spot (x, y within r), or for everyone
function sfx(world, n, o = {}) {
  world.sfx.push({ n, seq: world.seq++, ...o });
  if (world.sfx.length > 60) world.sfx.splice(0, world.sfx.length - 60);
}
const near = (world, x, y, r) => humans(world).filter((h) => Math.hypot(h.x - x, h.y - y) < r);
function sightRange(world, observer) {
  const lantern = observer.powerups?.lantern;
  if (world.lightsOut && !lantern && observer.role !== "blacksmith" && observer.role !== "blackknight") return 2.5 * TILE;
  return (lantern ? 8.5 : 7) * TILE;
}
const canSee = (world, o, e, range = sightRange(world, o)) => dist(o, e) <= range && hasLOS(o.x, o.y, e.x, e.y) && !smokeBlocks(world, o.x, o.y, e.x, e.y);
// does a smoke cloud sit across the line between two points?
export function smokeBlocks(world, x1, y1, x2, y2) {
  for (const c of world.smoke || []) {
    if (world.t > c.until) continue;
    const dx = x2 - x1, dy = y2 - y1, L2 = dx * dx + dy * dy || 1;
    const k = Math.max(0, Math.min(1, ((c.x - x1) * dx + (c.y - y1) * dy) / L2));
    if (Math.hypot(x1 + dx * k - c.x, y1 + dy * k - c.y) < c.r) return true;
  }
  return false;
}
const logEvent = (world, text) => world.log.push({ t: world.t, text });
const castleChoreStats = (world) => {
  let need = 0, done = 0;
  for (const e of world.entities) if (!isDark(e)) { need += e.chores.length; done += e.done.length; }
  return { need, done, frac: need ? done / need : 0 };
};
const teleport = (e, x, y) => { e.x = x; e.y = y; e.tp = (e.tp || 0) + 1; e.hpath = []; };

function gatherInHall(world) {
  world.gatherT = world.t;
  const alive = world.entities.filter((e) => e.alive);
  alive.forEach((e, i) => {
    // a seat around the Round Table
    const a = (i / alive.length) * Math.PI * 2 - Math.PI / 2;
    teleport(e, HALL_CENTRE.x + Math.cos(a) * GATHER_R, HALL_CENTRE.y + Math.sin(a) * GATHER_R);
    e.facing = a + Math.PI;
    e.path = []; e.work = null; e.goal = null; e.hunt = null; e.ride = null;
  });
}

function placeInCell(e) {
  teleport(e, (CELL_AREA.tx + rnd() * CELL_AREA.w) * TILE, (CELL_AREA.ty + rnd() * CELL_AREA.h) * TILE);
  e.path = []; e.work = null; e.goal = null; e.hunt = null;
}

function moveCircle(world, e, dx, dy) {
  // ghosts drift straight through walls (but stay inside the castle grounds)
  if (!e.alive) {
    e.x = Math.max(TILE * 1.5, Math.min((W - 1.5) * TILE, e.x + dx));
    e.y = Math.max(TILE * 1.5, Math.min((H - 2.5) * TILE, e.y + dy));
    return;
  }
  const r = 10;
  const blocked = (px, py) => {
    const pts = [[px - r, py - r], [px + r, py - r], [px - r, py + r], [px + r, py + r]];
    return pts.some(([x, y]) => !canWalkTile(Math.floor(x / TILE), Math.floor(y / TILE), e, world));
  };
  if (!blocked(e.x + dx, e.y)) e.x += dx;
  if (!blocked(e.x, e.y + dy)) e.y += dy;
}

// ---------- a real player moving their own knight (runs on their laptop) ----------
// input: { up, down, left, right, use }. Returns { finish: stationId } when a
// hold-E trapdoor completes, so the caller can tell the host.
export function moveSelf(world, eid, input, dt, opts = {}) {
  const me = world.entities[eid];
  if (!me || world.phase !== "play") return null;
  dt = Math.min(dt, 0.05);
  me.moving = false;
  if (me.ride || opts.busy || world.t < me.frozenUntil) { me.hwork = null; return null; }
  let mx = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  let my = (input.down ? 1 : 0) - (input.up ? 1 : 0);
  if (!me.hpath) me.hpath = [];
  if (mx || my) me.hpath = [];
  else if (me.hpath.length) {
    // walking to where the mouse pointed
    const n = me.hpath[0];
    const dx = n.x - me.x, dy = n.y - me.y, d = Math.hypot(dx, dy);
    if (me.alive && d > TILE * 2 && passageExit(Math.floor(me.x / TILE), Math.floor(me.y / TILE))) {
      // the path goes through a trapdoor: take the boat
      const s = STATIONS.find((st) => st.kind === "passage" && st.tx === Math.floor(me.x / TILE) && st.ty === Math.floor(me.y / TILE));
      me.hpath = [];
      return s ? { finish: s.id } : null;
    }
    if (d < 5) me.hpath.shift();
    else { mx = dx / d; my = dy / d; }
  }
  if (mx || my) {
    const len = Math.hypot(mx, my);
    const sp = (me.alive ? SPEED_HUMAN * (me.powerups?.boots ? BOOTS : 1) : SPEED_GHOST) * dt;
    moveCircle(world, me, (mx / len) * sp, (my / len) * sp);
    me.walk += sp * 0.12;
    me.moving = true;
    const target = Math.atan2(my, mx);
    let d = target - me.facing;
    while (d > Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    me.facing += d * Math.min(1, dt * 12);
  }
  // holding E on a trapdoor
  const ctx = humanContext(world, eid);
  if (input.use && ctx.station && ctx.station.kind === "passage") {
    if (!me.hwork || me.hwork.sid !== ctx.station.id) me.hwork = { sid: ctx.station.id, p: 0, need: PASSAGE_HOLD };
    me.hwork.p += dt;
    if (me.hwork.p >= PASSAGE_HOLD) { me.hwork = null; return { finish: ctx.station.id }; }
  } else me.hwork = null;
  return null;
}

// the host hears where a remote player has moved their knight
export function applyPosition(world, eid, p) {
  const e = world.entities[eid];
  if (!e || !e.human || world.phase !== "play" || e.ride) return;
  if ((p.tp || 0) !== (e.tp || 0)) return; // they haven't caught up with a jump yet
  e.x = p.x; e.y = p.y;
  e.facing = p.f; e.moving = !!p.m; e.walk = p.w || 0;
}

// a mouse click: plan a path for that player's knight
export function setHumanTarget(world, eid, px, py) {
  const me = world.entities[eid];
  if (!me || world.phase !== "play" || me.ride) return;
  let tx = Math.floor(px / TILE), ty = Math.floor(py / TILE);
  if (!me.alive) { me.hpath = [{ x: px, y: py }]; return; }
  if (!canWalkTile(tx, ty, me, world)) {
    // the nearest floor to where they clicked
    let best = null;
    for (let r = 1; r < 4 && !best; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
      if (!best && canWalkTile(tx + dx, ty + dy, me, world)) best = [tx + dx, ty + dy];
    }
    if (!best) return;
    [tx, ty] = best;
    px = tx * TILE + TILE / 2; py = ty * TILE + TILE / 2;
  }
  const path = findPath(me.x, me.y, tx, ty, me, world);
  if (!path) return;
  if (path.length) path[path.length - 1] = { x: px, y: py };
  else path.push({ x: px, y: py });
  me.hpath = path;
}

// ---------- the host's frame ----------
export function stepGame(world, dt) {
  if (world.phase !== "play") return;
  dt = Math.min(dt, 0.05);
  world.t += dt;
  for (const e of world.entities) if (e.ride) rideTick(world, e);

  for (const e of world.entities) {
    if (world.phase !== "play") break;
    for (const k in e.cd) e.cd[k] = Math.max(0, e.cd[k] - dt);
    if (e.disguiseAs !== null && world.t > e.disguiseUntil) {
      e.disguiseAs = null;
      if (e.human) toast(world, "Your disguise wears off.", "info", e.id);
    }
    if (e.reveal && world.t > e.reveal.until) e.reveal = null;
    logRoom(world, e);
    if (!e.human) npcThink(world, e, dt);
    if (e.role === "jester" && e.alive && e.cd.hop <= 0) jesterHop(world, e);
  }

  marblesTick(world);
  world.stumbleTick -= dt;
  if (world.stumbleTick <= 0) { world.stumbleTick = 0.25; stumbleTick(world); }
  shebaTick(world, dt);
  nanaTick(world, dt);

  // sabotage timing out on its own
  if (world.lightsOut && world.t > world.lightsUntil) restoreLights(world, null);
  if (world.portcullisJammed && world.t > world.gateUntil) freeGate(world, null);

  world.sightTick -= dt;
  if (world.sightTick <= 0) { world.sightTick = 0.5; recordSightings(world); }

  // pending witness reports
  for (const e of world.entities) {
    if (world.phase !== "play") break;
    if (!e.human && e.alive && e.reportAt !== null && world.t >= e.reportAt) {
      e.reportAt = null;
      startMeeting(world, "report", e.id);
    }
  }

  if (world.t >= GAME_SECONDS) endGame(world, "dark", "midnight");
  else checkWin(world);
}

function logRoom(world, e) {
  const a = areaAt(e.x, e.y);
  if (!a) return;
  const last = e.roomLog[e.roomLog.length - 1];
  if (!last || last.room !== a.id) {
    e.roomLog.push({ room: a.id, t: world.t });
    if (e.roomLog.length > 14) e.roomLog.shift();
  }
}

function recordSightings(world) {
  const alive = world.entities.filter((e) => e.alive);
  for (const o of alive) {
    const range = sightRange(world, o);
    for (const e of alive) {
      if (e === o || !canSee(world, o, e, range)) continue;
      const a = areaAt(e.x, e.y);
      if (!a) continue;
      const id = apparentId(e);
      const last = o.seen.find((s) => s.id === id && s.room === a.id && world.t - s.t < 4);
      if (last) last.t = world.t;
      else o.seen.push({ id, room: a.id, t: world.t });
    }
    if (o.seen.length > 120) o.seen.splice(0, o.seen.length - 120);
  }
}

// ---------- what a player can do where they're standing ----------
export function humanContext(world, eid) {
  const me = world.entities[eid];
  const ctx = { station: null, label: null, need: 0, marker: null, bell: false, fake: false, power: null };
  if (!me || me.ride) return ctx;
  for (const s of STATIONS) {
    const sx = s.tx * TILE + TILE / 2, sy = s.ty * TILE + TILE / 2;
    if (Math.hypot(me.x - sx, me.y - sy) > TILE * (s.kind === "passage" ? 0.9 : 1.3)) continue;
    if (s.kind === "passage") {
      if (me.alive) { ctx.station = s; ctx.label = s.label; ctx.need = PASSAGE_HOLD; }
    } else if (s.kind === "chore" && me.chores.includes(s.id) && !me.done.includes(s.id)) {
      // ghosts can do their chores too, and they count
      ctx.station = s; ctx.label = s.label; ctx.fake = isDark(me);
    } else if (s.kind === "fixLights" && world.lightsOut && me.alive && !isDark(me)) {
      ctx.station = s; ctx.label = s.label; ctx.need = me.role === "blacksmith" ? FIX_FAST : FIX_SLOW;
    } else if (s.kind === "fixGate" && world.portcullisJammed && me.alive && !isDark(me)) {
      ctx.station = s; ctx.label = s.label; ctx.need = me.role === "blacksmith" ? FIX_FAST : FIX_SLOW;
    } else if (s.kind === "cell" && me.role === "locksmith" && me.alive && !world.freeUsed && prisoners(world).length) {
      ctx.station = s; ctx.label = "Unlock the cell and free a prisoner"; ctx.need = CELL_TIME;
    } else if (s.kind === "bell" && me.alive) {
      ctx.bell = !me.bellUsed;
    }
    if (ctx.station) break;
  }
  // a helmet can be reported once it's been found: standing by it, or anywhere in the room it's in
  const here = placeOf(areaAt(me.x, me.y));
  if (me.alive) ctx.marker = world.markers.find((m) => m.found && (Math.hypot(me.x - m.x, me.y - m.y) < TILE * 2.5 || m.place === here)) || null;
  const c = world.claymore;
  if (me.alive && c && !c.used && c.holder === null && Math.hypot(me.x - c.x, me.y - c.y) < TILE * 1.4) ctx.claymore = me.role === "blackknight" ? "heavy" : "take";
  if (me.alive && c && !c.used && c.holder === me.id) {
    const v = strikeTarget(world, me);
    ctx.strike = v ? `Strike ${look(world, v).name} with the Donaghy Claymore` : null;
  }
  if (me.alive && !ctx.station && Math.hypot(me.x - world.sheba.x, me.y - world.sheba.y) < TILE * 1.6) ctx.pet = true;
  // what your role's key would do right now
  if (me.alive && me.role === "blackknight") {
    const v = captureTarget(world, me);
    if (v && me.cd.capture <= 0) ctx.power = { key: "Q", label: `Capture ${look(world, v).name}`, hot: true };
    else if (v) ctx.power = { key: "Q", label: `Capture ready in ${Math.ceil(me.cd.capture)}s` };
  } else if (me.alive && me.role === "jester" && !me.swapUsed) {
    const v = swapTarget(world, me);
    if (v) ctx.power = { key: "Q", label: `Swap places with ${look(world, v).name}` };
  } else if (me.alive && me.role === "knight") {
    const v = aimedTarget(world, me, 5 * TILE);
    if (v && me.cd.truth <= 0) ctx.power = { key: "F", label: `Shine the Torch of Truth on ${look(world, v).name}`, hot: true };
  }
  return ctx;
}

function captureTarget(world, me) {
  return world.entities
    .filter((e) => e.alive && e !== me && e.role !== "jester" && dist(e, me) <= CAPTURE_RANGE + 12)
    .sort((a, b) => dist(a, me) - dist(b, me))[0] || null;
}
function strikeTarget(world, me) {
  return world.entities
    .filter((e) => e.alive && e !== me && dist(e, me) <= CAPTURE_RANGE + 12)
    .sort((a, b) => dist(a, me) - dist(b, me))[0] || null;
}
function swapTarget(world, me) {
  return world.entities.filter((e) => e.alive && e !== me && dist(e, me) < 8 * TILE).sort((a, b) => dist(a, me) - dist(b, me))[0] || null;
}

// the nearest thing a player ought to be doing: a sabotage to fix, else a chore
export function nextJob(world, eid) {
  const me = world.entities[eid];
  const jobs = [];
  if (me.alive && !isDark(me)) {
    if (world.lightsOut) jobs.push({ s: stationById("fixLights"), urgent: true });
    if (world.portcullisJammed) jobs.push({ s: stationById("fixGate"), urgent: true });
  }
  if (!jobs.length) for (const id of me.chores) if (!me.done.includes(id)) jobs.push({ s: stationById(id) });
  if (!jobs.length) return null;
  jobs.sort((a, b) => Math.hypot(a.s.tx * TILE - me.x, a.s.ty * TILE - me.y) - Math.hypot(b.s.tx * TILE - me.x, b.s.ty * TILE - me.y));
  const j = jobs[0];
  return { x: j.s.tx * TILE + TILE / 2, y: j.s.ty * TILE + TILE / 2, label: j.s.label, room: roomName(j.s.area), urgent: !!j.urgent };
}

function completeStation(world, e, s) {
  if (s.kind === "chore") {
    if (!e.done.includes(s.id)) {
      e.done.push(s.id);
      if (!isDark(e)) e.stats.chores++;
    }
    if (e.human) { sfx(world, "chore", { to: e.id }); toast(world, `${s.label}: done.`, "good", e.id); }
    // like being shown a card in Clue: this room, and one weapon
    if (e.alive) clueCard(world, e, s.area, "chore");
    if (s.id === "sheba") { world.sheba.dinner = true; world.sheba.path = []; world.sheba.wait = 0; }
  } else if (s.kind === "fixLights") restoreLights(world, e);
  else if (s.kind === "fixGate") freeGate(world, e);
  else if (s.kind === "cell") freePrisoner(world, e);
  else if (s.kind === "passage") {
    const [tx, ty] = passageExit(s.tx, s.ty);
    if (e.human) startRide(world, e, s.tx, s.ty, tx, ty);
    else teleport(e, tx * TILE + TILE / 2, ty * TILE + TILE / 2);
  }
}

// a chore, repair or trapdoor finished (checked against where they are)
export function humanFinish(world, eid, sid) {
  const me = world.entities[eid];
  if (!me || world.phase !== "play") return false;
  const ctx = humanContext(world, eid);
  if (!ctx.station || ctx.station.id !== sid) return false;
  completeStation(world, me, ctx.station);
  return true;
}

// one-shot key presses: report, bell, pet, and the role powers
export function humanAction(world, eid, action) {
  const me = world.entities[eid];
  if (!me || world.phase !== "play" || me.ride) return;
  const ctx = humanContext(world, eid);
  const tell = (text, tone) => toast(world, text, tone, me.id);
  if (action === "report") {
    if (ctx.marker) { me.stats.reports++; startMeeting(world, "report", me.id); }
    return;
  }
  if (action === "bell") {
    if (ctx.bell) { me.bellUsed = true; startMeeting(world, "bell", me.id); }
    else if (me.alive && me.bellUsed) tell("You've already rung the Great Bell tonight.");
    return;
  }
  if (!me.alive) return;
  if (action === "pet") {
    if (!ctx.pet) return;
    const sh = world.sheba;
    sh.wag = world.t + 3; sh.wait = Math.max(sh.wait, 2.5); sh.path = [];
    sfx(world, "happyDog", { x: sh.x, y: sh.y, r: 6 * TILE });
    tell(pick(["You pet Sheba. Her tail goes like a windmill.", "Sheba leans on your leg and sighs happily.", "Sheba rolls over for a belly rub.", "Good girl, Sheba!"]), "good");
    return;
  }
  if (action === "claymore") {
    const c = world.claymore;
    if (ctx.claymore === "heavy") return tell("You heave at the claymore, but it won't budge for the Black Knight. The old blade knows its enemies.", "bad");
    if (ctx.claymore !== "take") return;
    c.holder = me.id;
    logEvent(world, `${me.name} found the Donaghy Claymore ${c.where}.`);
    sfx(world, "unsheathe", { to: me.id });
    tell("You draw the Donaghy Claymore from its hiding place! One strike, at anyone: press G when you're right beside them. Choose well.", "good");
    return;
  }
  if (action === "strike") {
    const c = world.claymore;
    if (!c || c.used || c.holder !== me.id) return;
    const v = strikeTarget(world, me);
    if (!v) return tell("Get right up close to someone to strike with the Claymore.");
    claymoreStrike(world, me, v);
    return;
  }
  if (action === "truth" && me.role === "knight") {
    if (me.cd.truth > 0) return tell(`Torch of Truth recharging (${Math.ceil(me.cd.truth)}s).`);
    const t = aimedTarget(world, me, 5 * TILE);
    if (!t) return tell("Shine the Torch of Truth at someone close in front of you.");
    me.cd.truth = TRUTH_CD;
    sfx(world, "truth", { to: me.id });
    const verdict = t.role === "blackknight" ? "bk" : t.role === "jester" ? "jester" : "innocent";
    me.truth[t.id] = verdict;
    me.reveal = { id: t.id, verdict, until: world.t + 3.5 };
    if (verdict === "bk") { me.stats.truthCatch++; tell(`The Torch of Truth blazes red: ${t.name} is the BLACK KNIGHT!`, "bad"); }
    else if (verdict === "jester") tell(`The torch shows a cap and bells: ${t.name} is the Jester, the Black Knight's helper!`, "bad");
    else tell(`${t.name} is innocent.`, "good");
    return;
  }
  if (action === "power" && me.role === "blackknight") {
    if (me.cd.capture > 0) return tell(`You can capture again in ${Math.ceil(me.cd.capture)}s.`);
    const v = captureTarget(world, me);
    if (!v) return tell("Get right up close to someone (nearly touching) to capture them.");
    capture(world, me, v);
    return;
  }
  if (action === "power" && me.role === "jester") {
    if (me.swapUsed) return tell("You've used your swap this round.");
    const v = swapTarget(world, me);
    if (!v) return tell("Nobody near enough to swap with.");
    const [ax, ay] = [me.x, me.y];
    teleport(me, v.x, v.y); teleport(v, ax, ay);
    v.path = []; v.work = null; v.hunt = null;
    me.swapUsed = true;
    sfx(world, "honk", { x: me.x, y: me.y, r: 8 * TILE });
    tell(`Honk! You swapped places with ${v.name}.`);
    if (v.human) toast(world, "Whoosh! The Jester swapped places with you!", "bad", v.id);
    return;
  }
  if ((action === "sab1" || action === "sab2") && me.role === "blackknight") {
    if (me.cd.sabotage > 0) return tell(`Sabotage ready in ${Math.ceil(me.cd.sabotage)}s.`);
    if (action === "sab1") lightsOut(world, me); else jamGate(world, me);
    return;
  }
  if (action === "smoke" && me.role === "blackknight") {
    if (me.cd.smoke > 0) return tell(`Smoke bomb ready in ${Math.ceil(me.cd.smoke)}s.`);
    smokeBomb(world, me);
    return;
  }
  if (action === "sab1" && me.role === "jester") {
    if (me.cd.alarm > 0) return tell(`False alarm ready in ${Math.ceil(me.cd.alarm)}s.`);
    falseAlarm(world, me);
    return;
  }
  if (action === "sab2" && me.role === "jester") {
    if (me.cd.marbles > 0) return tell(`Marbles ready in ${Math.ceil(me.cd.marbles)}s.`);
    dropMarbles(world, me);
    return;
  }
  if (action === "disguise" && me.role === "blackknight") {
    if (me.cd.disguise > 0) return tell(`Disguise ready in ${Math.ceil(me.cd.disguise)}s.`);
    const others = world.entities.filter((e) => e.alive && e !== me && e.role !== "jester");
    if (!others.length) return;
    const nearby = others.filter((e) => dist(e, me) < 6 * TILE).sort((a, b) => dist(a, me) - dist(b, me));
    disguise(world, me, nearby[0] || pick(others));
  }
}

function aimedTarget(world, me, range) {
  let best = null, bestD = Infinity;
  for (const e of world.entities) {
    if (e === me || !e.alive) continue;
    const d = dist(e, me);
    if (d > range || !hasLOS(me.x, me.y, e.x, e.y) || smokeBlocks(world, me.x, me.y, e.x, e.y)) continue;
    let ang = Math.atan2(e.y - me.y, e.x - me.x) - me.facing;
    while (ang > Math.PI) ang -= Math.PI * 2;
    while (ang < -Math.PI) ang += Math.PI * 2;
    if (Math.abs(ang) > 0.8 && d > TILE * 1.2) continue;
    if (d < bestD) { bestD = d; best = e; }
  }
  return best;
}

// ---------- powers ----------
export const prisoners = (world) => world.entities.filter((e) => !e.alive && !e.out);

function capture(world, bk, v) {
  const area = areaAt(v.x, v.y);
  const room = area?.id || "hall";
  // the helmet lies hidden until someone searches the room (a chore there),
  // stumbles over it, or saw it happen
  const marker = {
    id: world.nextMarker++, x: v.x, y: v.y, victimId: v.id, room, place: placeOf(area) || "hall",
    trace: traceRoom(bk, room), t: world.t, by: bk.id, apparent: apparentId(bk),
    weapon: world.weapon, found: false, round: world.round,
  };
  world.markers.push(marker);
  dropClaymore(world, v);
  logEvent(world, `The Black Knight (${bk.name}${bk.disguiseAs !== null ? `, disguised as ${world.entities[bk.disguiseAs].name}` : ""}) captured ${v.name} with ${weaponById(world.weapon).the} in the ${roomName(room)}.`);
  // who saw it happen (they see whoever the Black Knight is dressed as)
  for (const o of world.entities) {
    if (!o.alive || o === bk || o === v) continue;
    if (!canSee(world, o, bk)) continue;
    marker.found = true;
    if (o.human) {
      toast(world, `You saw ${look(world, bk).name} drag ${v.name} into the dark! Press R to report it.`, "bad", o.id);
      o.witnessed = { apparent: apparentId(bk), victimId: v.id, room };
    } else if (!isDark(o)) {
      o.witnessed = { apparent: apparentId(bk), victimId: v.id, room };
      o.reportAt = world.t + 1.2;
    }
  }
  // everyone knows someone's gone; nobody knows where (yet)
  for (const h of humans(world)) if (h !== v && h !== bk) toast(world, `${v.name} has gone missing! Search the rooms: a chore in the right room turns up the helmet.`, "bad", h.id);
  sfx(world, "capture", { x: v.x, y: v.y, r: 9 * TILE });
  v.alive = false; v.ghost = true;
  placeInCell(v);
  bk.cd.capture = world.captureCd || CAPTURE_CD;
  bk.stats.captures++;
  bk.hunt = null;
  world.lastCaptureT = world.t;
  if (v.human) {
    sfx(world, "capture", { to: v.id });
    toast(world, "Someone seized you from behind and dragged you off. You never saw their face! You're a ghost now: float through walls and keep doing your chores. They still count.", "bad", v.id);
  }
  if (bk.human) toast(world, `You captured ${v.name} with ${weaponById(world.weapon).the}. Their helmet lies hidden in the ${roomName(room)}: get away before anyone searches it!`, "bad", bk.id);
}

function traceRoom(bk, room) {
  for (let i = bk.roomLog.length - 1; i >= 0; i--) if (bk.roomLog[i].room !== room) return bk.roomLog[i].room;
  return "upper";
}

function lightsOut(world, by) {
  logEvent(world, "The Black Knight put the lights out.");
  world.lightsOut = true;
  world.lightsUntil = world.t + LIGHTS_TIME;
  by.cd.sabotage = SABOTAGE_CD;
  world.lightsFixer = pickFixer(world, "fixLights");
  sfx(world, "lightsOut");
  for (const h of humans(world)) {
    toast(world, h.role === "blacksmith"
      ? "LIGHTS OUT! Every torch but yours has gone dark. Relight them at the Forge."
      : "LIGHTS OUT! The torches gutter and die. Someone relight them at the Forge!", "bad", h.id);
  }
}
function restoreLights(world, by) {
  if (!world.lightsOut) return;
  world.lightsOut = false;
  world.lightsFixer = null;
  sfx(world, "fixed");
  toast(world, by ? `${by.name} relit the torches.` : "The torches flicker back to life.", "good");
}
function jamGate(world, by) {
  logEvent(world, "The Black Knight jammed the portcullis.");
  world.portcullisJammed = true;
  world.gateUntil = world.t + GATE_TIME;
  by.cd.sabotage = SABOTAGE_CD;
  world.gateFixer = pickFixer(world, "fixGate");
  // nobody gets stuck under the bars: nudge them into the courtyard
  for (const e of world.entities) {
    if (Math.floor(e.x / TILE) === PORTCULLIS[0] && Math.floor(e.y / TILE) === PORTCULLIS[1]) teleport(e, e.x - TILE, e.y);
    if (!e.human) e.path = [];
  }
  sfx(world, "gateSlam");
  toast(world, "CRASH! The portcullis has slammed shut and jammed. Free it from the Gatehouse.", "bad");
}
function freeGate(world, by) {
  if (!world.portcullisJammed) return;
  world.portcullisJammed = false;
  world.gateFixer = null;
  sfx(world, "fixed");
  toast(world, by ? `${by.name} freed the portcullis.` : "The portcullis creaks free.", "good");
}
function pickFixer(world, sid) {
  const castle = world.entities.filter((e) => e.alive && !e.human && !isDark(e));
  const smith = castle.find((e) => e.role === "blacksmith");
  if (smith) return smith.id;
  const s = stationById(sid);
  const sx = s.tx * TILE, sy = s.ty * TILE;
  castle.sort((a, b) => Math.hypot(a.x - sx, a.y - sy) - Math.hypot(b.x - sx, b.y - sy));
  return castle[0]?.id ?? null;
}
function freePrisoner(world, by) {
  const p = prisoners(world).sort((a, b) => b.id - a.id)[0];
  if (!p || world.freeUsed) return;
  world.freeUsed = true;
  p.alive = true; p.ghost = false;
  const cs = stationById("cell");
  teleport(p, cs.tx * TILE + TILE / 2, cs.ty * TILE + TILE / 2);
  sfx(world, "fixed", { x: p.x, y: p.y, r: 10 * TILE });
  toast(world, `${by.name} freed ${p.name} from the dungeon!`, "good");
  if (p.human) toast(world, `${by.name} unlocked the cell. You're free!`, "good", p.id);
}
function smokeBomb(world, bk) {
  bk.cd.smoke = 45;
  world.smoke.push({ x: bk.x, y: bk.y, r: 3.2 * TILE, until: world.t + 14, t0: world.t });
  logEvent(world, `The Black Knight set off a smoke bomb in the ${roomName(areaAt(bk.x, bk.y)?.id)}.`);
  sfx(world, "whoosh", { x: bk.x, y: bk.y, r: 10 * TILE });
  if (bk.human) toast(world, "Smoke billows out around you. Nobody can see through it.", "info", bk.id);
  for (const h of near(world, bk.x, bk.y, 10 * TILE)) if (h !== bk) toast(world, "Thick smoke pours out nearby!", "bad", h.id);
}
function falseAlarm(world, j) {
  j.cd.alarm = 45;
  const room = pick(ROOMS.filter((r) => r.id !== areaAt(j.x, j.y)?.id && r.id !== "hall"));
  world.alarm = { room: room.id, until: world.t + 8 };
  sfx(world, "scream");
  for (const h of humans(world)) {
    toast(world, h === j ? `You let out a blood-curdling scream... from the ${room.name}. Off they run!` : `A SCREAM from the ${room.name}!`, "bad", h.id);
  }
  logEvent(world, `The Jester faked a scream from the ${room.name}.`);
  // some of the castle folk rush off to look
  for (const e of world.entities) {
    if (e.human || !e.alive || isDark(e) || rnd() < 0.45) continue;
    const { tx, ty } = randomTileIn(room);
    e.work = null; e.hunt = null;
    setGoal(world, e, tx, ty, null);
  }
}
function dropMarbles(world, j) {
  j.cd.marbles = 40;
  world.marbles.push({ x: j.x, y: j.y, r: TILE * 1.1, until: world.t + 35 });
  if (j.human) { sfx(world, "click", { to: j.id }); toast(world, "You scatter marbles across the floor. Hee hee.", "info", j.id); }
  logEvent(world, `The Jester scattered marbles in the ${roomName(areaAt(j.x, j.y)?.id)}.`);
}
function marblesTick(world) {
  world.marbles = world.marbles.filter((m) => world.t < m.until);
  world.smoke = world.smoke.filter((c) => world.t < c.until);
  for (const m of world.marbles) {
    for (const e of world.entities) {
      if (!e.alive || isDark(e) || world.t < e.frozenUntil) continue;
      if (Math.hypot(e.x - m.x, e.y - m.y) > m.r) continue;
      e.frozenUntil = world.t + 2.5;
      m.until = world.t; // the marbles scatter everywhere
      if (!e.human) { e.path = []; e.goal = null; e.work = { sid: null, idle: true, left: 2.5 }; }
      sfx(world, "thud", { x: e.x, y: e.y, r: 8 * TILE });
      for (const h of near(world, e.x, e.y, 8 * TILE)) {
        toast(world, h === e ? "Whoa! You slip on marbles and land flat on your back." : `${e.name} slips on marbles and goes flying!`, "info", h.id);
      }
      break;
    }
  }
}

function disguise(world, bk, as) {
  logEvent(world, `The Black Knight disguised themselves as ${as.name}.`);
  bk.disguiseAs = as.id;
  bk.disguiseUntil = world.t + DISGUISE_TIME;
  bk.cd.disguise = DISGUISE_CD;
  if (bk.human) { sfx(world, "disguise", { to: bk.id }); toast(world, `You now look exactly like ${as.name} for ${DISGUISE_TIME} seconds.`, "info", bk.id); }
}
function jesterHop(world, e) {
  const rooms = ROOMS.filter((r) => r.id !== "dungeon");
  const r = pick(rooms);
  const { tx, ty } = randomTileIn(r);
  teleport(e, tx * TILE + TILE / 2, ty * TILE + TILE / 2);
  e.path = []; e.work = null; e.goal = null;
  e.cd.hop = 40 + rnd() * 20;
  if (e.human) { sfx(world, "whoosh", { to: e.id }); toast(world, `Whoosh! You pop out of a suit of armour in the ${r.name}.`, "info", e.id); }
  sfx(world, "honk", { x: e.x, y: e.y, r: 10 * TILE });
}

// ---------- computer players ----------
function npcThink(world, e, dt) {
  if (world.phase !== "play") return;
  if (world.t < e.frozenUntil) return;
  if (e.alive && e.role === "jester") {
    if (e.cd.alarm <= 0 && rnd() < dt * 0.02) falseAlarm(world, e);
    if (e.cd.marbles <= 0 && rnd() < dt * 0.03) dropMarbles(world, e);
  }
  if (e.alive && e.role === "blackknight") bkThink(world, e, dt);
  if (e.alive && e.role === "knight" && e.cd.truth <= 0) knightLook(world, e);
  if (world.phase !== "play") return;

  // a found helmet in plain sight gets reported
  if (e.alive && !isDark(e)) {
    const m = world.markers.find((m) => m.found && Math.hypot(e.x - m.x, e.y - m.y) < 5 * TILE && hasLOS(e.x, e.y, m.x, m.y));
    if (m) { e.stats.reports++; startMeeting(world, "report", e.id); return; }
    // someone's missing and nobody's called a meeting: ring the bell when passing it
    if (!e.bellUsed && world.markers.length && world.t - world.markers[0].t > 25 && areaAt(e.x, e.y)?.id === "hall" && rnd() < dt * 0.5) {
      e.bellUsed = true; startMeeting(world, "bell", e.id); return;
    }
  }
  npcClaymore(world, e, dt);
  if (world.phase !== "play") return;

  // working at a station
  if (e.work) {
    e.work.left -= dt;
    if (e.work.left <= 0 && e.work.idle) { e.work = null; return; }
    if (e.work.left <= 0) {
      const s = stationById(e.work.sid);
      const stillNeeded = s.kind === "chore" || (s.kind === "fixLights" && world.lightsOut) || (s.kind === "fixGate" && world.portcullisJammed) || (s.kind === "cell" && !world.freeUsed);
      if (stillNeeded) completeStation(world, e, s);
      e.work = null; e.goal = null;
    }
    return;
  }
  if (e.hunt !== null) return; // the Black Knight's chase moves it

  if (!e.goal || (!e.path.length && !atGoal(e))) chooseGoal(world, e);
  followPath(world, e, dt, e.alive ? SPEED_NPC : SPEED_NPC * 1.2);
  if (e.goal && atGoal(e)) arrive(world, e);
}

const atGoal = (e) => e.goal && Math.abs(e.x - (e.goal.tx * TILE + TILE / 2)) < 6 && Math.abs(e.y - (e.goal.ty * TILE + TILE / 2)) < 6;

function setGoal(world, e, tx, ty, sid = null) {
  if (!e.alive) {
    // ghosts float straight there
    e.goal = { tx, ty, sid };
    e.path = [{ x: tx * TILE + TILE / 2, y: ty * TILE + TILE / 2 }];
    return;
  }
  const path = findPath(e.x, e.y, tx, ty, e, world);
  if (!path) { e.goal = null; e.path = []; e.work = { sid: null, idle: true, left: 0.8 }; return; }
  e.goal = { tx, ty, sid };
  e.path = path.length ? path : [{ x: tx * TILE + TILE / 2, y: ty * TILE + TILE / 2 }];
}

function chooseGoal(world, e) {
  if (e.alive && !isDark(e)) {
    if (world.lightsOut && world.lightsFixer === e.id) { const s = stationById("fixLights"); return setGoal(world, e, s.tx, s.ty, s.id); }
    if (world.portcullisJammed && world.gateFixer === e.id) { const s = stationById("fixGate"); return setGoal(world, e, s.tx, s.ty, s.id); }
    if (e.role === "locksmith" && !world.freeUsed && prisoners(world).length && world.t - world.lastCaptureT > 15) {
      const s = stationById("cell"); return setGoal(world, e, s.tx, s.ty, s.id);
    }
  }
  const left = e.chores.filter((c) => !e.done.includes(c));
  // the dark side cycles through pretend chores forever
  const pool = isDark(e) ? e.chores : left;
  if (pool.length && rnd() < 0.35) {
    const s = stationById(isDark(e) ? pick(pool) : nearestStation(e, pool));
    return setGoal(world, e, s.tx, s.ty, s.id);
  }
  const area = pick(AREAS.filter((a) => a.id !== "dungeon" || !e.alive));
  const { tx, ty } = randomTileIn(area);
  setGoal(world, e, tx, ty, null);
}

function nearestStation(e, ids) {
  return ids.map(stationById).sort((a, b) => Math.hypot(a.tx * TILE - e.x, a.ty * TILE - e.y) - Math.hypot(b.tx * TILE - e.x, b.ty * TILE - e.y))[0].id;
}

function arrive(world, e) {
  const sid = e.goal.sid;
  e.goal = null;
  if (!sid) { e.work = { sid: null, idle: true, left: 3 + rnd() * 6 }; return; }
  const s = stationById(sid);
  const smith = e.role === "blacksmith";
  // computer players dawdle at chores, much like real family members
  const need = s.kind === "chore" ? 9 + rnd() * 6 : s.kind === "cell" ? CELL_TIME : smith ? FIX_FAST : FIX_SLOW;
  e.work = { sid, left: need };
}

function followPath(world, e, dt, speed) {
  if (!e.path.length) { e.moving = false; return; }
  const n = e.path[0];
  const nt = { tx: Math.floor(n.x / TILE), ty: Math.floor(n.y / TILE) };
  if (e.alive && !canWalkTile(nt.tx, nt.ty, e, world)) { e.path = []; e.goal = null; return; }
  const dx = n.x - e.x, dy = n.y - e.y;
  const d = Math.hypot(dx, dy);
  // through a secret passage: out the other end
  if (e.alive && d > TILE * 2 && passageExit(Math.floor(e.x / TILE), Math.floor(e.y / TILE))) {
    teleport(e, n.x, n.y); e.path.shift(); return;
  }
  e.walk += speed * dt * 0.12;
  e.moving = true;
  const step = speed * dt;
  if (d <= step) { e.x = n.x; e.y = n.y; e.path.shift(); }
  else { e.x += (dx / d) * step; e.y += (dy / d) * step; }
  if (d > 0.5) e.facing = Math.atan2(dy, dx);
}

function knightLook(world, k) {
  const t = world.entities
    .filter((e) => e.alive && e !== k && !(e.id in k.truth) && canSee(world, k, e, 4 * TILE))
    .sort((a, b) => dist(a, k) - dist(b, k))[0];
  if (!t) return;
  k.cd.truth = TRUTH_CD + 20;
  const verdict = t.role === "blackknight" ? "bk" : t.role === "jester" ? "jester" : "innocent";
  k.truth[t.id] = verdict;
  if (verdict === "bk") {
    k.stats.truthCatch++;
    // sometimes rings at once, sometimes keeps it for the next meeting
    if (world.phase === "play" && rnd() < 0.5) startMeeting(world, "bell", k.id);
  }
}

function victims(world, bk) {
  return world.entities.filter((e) => e.alive && e !== bk && e.role !== "jester");
}
function witnessed(world, bk, target) {
  return world.entities.some((o) => {
    if (!o.alive || o === bk || o === target || o.role === "jester") return false;
    return canSee(world, o, bk) || canSee(world, o, target);
  });
}

function bkThink(world, bk, dt) {
  // sabotage and disguise now and then
  if (bk.cd.sabotage <= 0 && rnd() < dt * 0.04) {
    if (rnd() < 0.65) lightsOut(world, bk); else jamGate(world, bk);
  }
  if (bk.cd.smoke <= 0 && rnd() < dt * 0.025) smokeBomb(world, bk);
  if (bk.cd.disguise <= 0 && bk.disguiseAs === null && rnd() < dt * 0.12) {
    const as = pick(victims(world, bk));
    if (as) disguise(world, bk, as);
  }
  if (bk.cd.capture > 0) { bk.hunt = null; return; }

  bk.repath -= dt;
  if (bk.hunt !== null) {
    const v = world.entities[bk.hunt];
    if (!v || !v.alive || v.ride) { bk.hunt = null; return; }
    const d = dist(bk, v);
    if (d <= CAPTURE_RANGE) { capture(world, bk, v); bk.goal = null; bk.path = []; return; }
    if (d > 9 * TILE || (d > 2 * TILE && witnessed(world, bk, v))) { bk.hunt = null; bk.goal = null; bk.path = []; return; }
    if (bk.repath <= 0) {
      bk.repath = 0.35;
      bk.path = findPath(bk.x, bk.y, Math.floor(v.x / TILE), Math.floor(v.y / TILE), bk, world) || [];
    }
    followPath(world, bk, dt, SPEED_NPC * 1.25);
    return;
  }
  if (bk.repath > 0) return;
  bk.repath = 0.3;
  // braver as the night goes on
  const reach = (6 + Math.min(4, world.t / 90)) * TILE;
  const t = victims(world, bk)
    .filter((v) => !v.ride && dist(v, bk) < reach && hasLOS(bk.x, bk.y, v.x, v.y))
    .sort((a, b) => dist(a, bk) - dist(b, bk))[0];
  if (t && !witnessed(world, bk, t)) { bk.hunt = t.id; bk.work = null; }
}

// ---------- the Great Bell: meetings ----------
function startMeeting(world, kind, byId) {
  if (world.phase !== "play") return;
  world.phase = "meeting";
  for (const e of world.entities) { e.hwork = null; e.moving = false; }
  sfx(world, "bell");
  world.meeting = buildMeeting(world, kind, byId);
}

function windowRooms(world, e, from, to) {
  const rooms = [];
  for (let i = 0; i < e.roomLog.length; i++) {
    const r = e.roomLog[i];
    const end = i + 1 < e.roomLog.length ? e.roomLog[i + 1].t : world.t;
    if (end >= from && r.t <= to && !rooms.includes(r.room)) rooms.push(r.room);
  }
  return rooms;
}
const listRooms = (ids) => {
  const n = ids.slice(-4).map((r) => `the ${roomName(r)}`);
  if (ids.length > 4) n[0] = `${n[0]} (and more before that)`;
  if (n.length <= 1) return n[0] || "the Great Hall";
  return n.slice(0, -1).join(", ") + " and " + n[n.length - 1];
};

function buildMeeting(world, kind, byId) {
  const by = world.entities[byId];
  const name = (id) => world.entities[id].name;
  const markers = world.markers.slice();
  const lines = [];
  const accuse = []; // {by, target, w}
  // only a found helmet tells anything; the missing are just missing
  const evidence = markers.filter((m) => m.found).map((m) => {
    const room = areaById(m.room), tr = areaById(m.trace);
    return {
      victim: name(m.victimId), room: room.name, traceRoom: tr.name,
      text: `${tr.trace}: whoever took ${name(m.victimId)} had come from the ${tr.name}. ${MARKS[weaponById(m.weapon).mark]}`,
    };
  });
  world.caseNotes.push(...evidence.map((x) => ({ ...x, round: world.round })));

  if (kind === "report") {
    const m = markers.find((x) => x.found);
    lines.push({ who: null, text: `${by.name} found ${m ? `${name(m.victimId)}'s dropped helmet in the ${roomName(m.room)}` : "something"}!` });
  } else {
    lines.push({ who: null, text: `${by.name} rang the Great Bell!` });
    if (!markers.length) lines.push({ who: null, text: "No one has been taken... yet. There's no crime to solve this round: just say who you suspect." });
  }
  const lost = markers.filter((m) => !m.found);
  if (lost.length) lines.push({ who: null, text: `Still missing, and nobody knows where they were taken: ${lost.map((m) => name(m.victimId)).join(" and ")}.` });
  evidence.forEach((ev) => lines.push({ who: null, text: ev.text, evidence: true }));

  const focusRooms = new Set(markers.filter((m) => m.found).flatMap((m) => [m.room, m.trace]));
  // sightings from the crowded minutes right after everyone gathers in the hall don't count
  const from = Math.max(world.gatherT + 10, markers.length ? Math.min(...markers.map((m) => m.t)) - 60 : world.t - 60);
  const to = markers.length ? Math.max(...markers.map((m) => m.t)) + 5 : world.t;
  const speakers = shuffle(world.entities.filter((e) => e.alive && !e.human));
  const order = [
    ...speakers.filter((e) => e.witnessed && !isDark(e)),
    ...speakers.filter((e) => e.role === "knight"),
    ...speakers.filter((e) => !(e.witnessed && !isDark(e)) && e.role !== "knight"),
  ].filter((e, i, a) => a.indexOf(e) === i);
  const claims = {};
  const bk = world.entities.find((e) => e.role === "blackknight");

  for (const e of order) {
    if (isDark(e)) continue;
    if (e.witnessed) {
      const w = e.witnessed;
      lines.push({ who: e.id, text: `I SAW ${name(w.apparent).toUpperCase()} drag ${name(w.victimId)} away in the ${roomName(w.room)}!` });
      accuse.push({ by: e.id, target: w.apparent, w: 90 });
    }
    if (e.role === "knight") {
      const bkId = Object.keys(e.truth).find((id) => e.truth[id] === "bk");
      const jId = Object.keys(e.truth).find((id) => e.truth[id] === "jester");
      if (bkId !== undefined && world.entities[bkId].alive) {
        lines.push({ who: e.id, text: `My Torch of Truth never lies: ${name(+bkId)} is the Black Knight!` });
        accuse.push({ by: e.id, target: +bkId, w: 120 });
      } else {
        const ok = Object.keys(e.truth).filter((id) => e.truth[id] === "innocent" && world.entities[id].alive).slice(-2).map(Number);
        if (ok.length) {
          lines.push({ who: e.id, text: `I shone the Torch of Truth on ${ok.map(name).join(" and ")}: innocent.` });
          ok.forEach((id) => accuse.push({ by: e.id, target: id, w: -60 }));
        }
      }
      if (jId !== undefined && world.entities[jId].alive) {
        lines.push({ who: e.id, text: `And mark this: ${name(+jId)} is the Jester. Don't believe a word they say.` });
        accuse.push({ by: e.id, target: +jId, w: 50, reveal: "jester" });
      }
    }
    const growl = world.growls.find((gr) => gr.witnesses.includes(e.id) && world.entities[gr.id].alive && !gr.told);
    if (growl) {
      growl.told = true;
      lines.push({ who: e.id, text: `Sheba growled at ${name(growl.id)} in the ${roomName(growl.room)}. That dog knows something.` });
      accuse.push({ by: e.id, target: growl.id, w: 30 });
    }
    const rooms = windowRooms(world, e, from, to);
    claims[e.id] = rooms;
    const sighting = e.seen
      .filter((s) => s.id !== e.id && s.t >= from && s.t <= to && focusRooms.has(s.room) && world.entities[s.id].alive)
      .sort((a, b) => b.t - a.t)[0];
    let text = `I was in ${listRooms(rooms)}.`;
    if (sighting) {
      text += ` I saw ${name(sighting.id)} in the ${roomName(sighting.room)} not long before.`;
      // the galleries are busy; being seen there means less
      accuse.push({ by: e.id, target: sighting.id, w: isCorridor(sighting.room) ? 8 : 15 });
    } else if (!markers.length) {
      const any = e.seen.filter((s) => s.id !== e.id && world.entities[s.id].alive).slice(-1)[0];
      if (any) text += ` I saw ${name(any.id)} in the ${roomName(any.room)}.`;
    } else text += " Didn't see anyone about.";
    const card = e.cards.filter((c) => c.round === world.round).slice(-1)[0];
    if (card && rnd() < 0.6) text += " " + cardSpeech(card);
    lines.push({ who: e.id, text });
  }

  // the Black Knight's alibi (when the computer is playing it)
  if (bk && bk.alive && !bk.human) {
    // a half-truth: where it really was, leaving out the scene of the crime
    const real = windowRooms(world, bk, from, to).filter((r) => !focusRooms.has(r));
    const safe = ROOMS.filter((r) => !focusRooms.has(r.id) && r.id !== "dungeon" && !real.includes(r.id)).map((r) => r.id);
    const fake = [...real, ...shuffle(safe)].slice(0, 2);
    claims[bk.id] = fake;
    let text = `I was in ${listRooms(fake)}. Didn't see a thing.`;
    const scapegoat = pick(victims(world, bk).filter((v) => !v.human));
    if (scapegoat && rnd() < 0.45) {
      text += ` If you ask me, ${scapegoat.name} has been awfully quiet tonight.`;
      accuse.push({ by: bk.id, target: scapegoat.id, w: 10 });
    }
    lines.splice(1 + evidence.length + Math.floor(rnd() * Math.max(1, lines.length - 1 - evidence.length)), 0, { who: bk.id, text });
  }

  // the Jester's mischief (when the computer is playing it)
  const jester = world.entities.find((e) => e.role === "jester");
  const pressure = (id) => accuse.filter((a) => a.target === id).reduce((s, a) => s + a.w, 0);
  if (jester && jester.alive && !jester.human) {
    const where = roomName(markers[0]?.room || pick(ROOMS).id);
    if (bk && bk.alive && pressure(bk.id) >= 60) {
      lines.push({ who: jester.id, text: `${bk.name}? Never! They were juggling turnips with me in the ${roomName(pick(ROOMS).id)} all evening. Honk!` });
      accuse.push({ by: jester.id, target: bk.id, w: -25 });
    } else {
      const patsy = pick(victims(world, bk || jester).filter((v) => v !== jester));
      if (patsy) {
        lines.push({ who: jester.id, text: `I saw ${patsy.name} sneaking out of the ${where}! Probably. Honk honk!` });
        accuse.push({ by: jester.id, target: patsy.id, w: 20, jester: true });
      }
    }
  }

  // someone catches a lie (or a disguise makes an innocent look like a liar)
  let catches = 0;
  for (const o of order) {
    if (catches >= 3 || isDark(o)) continue;
    for (const s of o.seen) {
      if (s.t < from || s.t > to || !focusRooms.has(s.room) || s.id === o.id) continue;
      const claim = claims[s.id];
      if (!claim || claim.includes(s.room) || !world.entities[s.id].alive) continue;
      lines.push({ who: o.id, text: `Hold on, ${name(s.id)}. I saw you in the ${roomName(s.room)}!` });
      accuse.push({ by: o.id, target: s.id, w: 25 });
      catches++;
      break;
    }
  }

  // each real player's own notebook of what they saw
  const notebooks = {};
  for (const me of humans(world)) {
    const nb = [];
    for (const s of me.seen.slice().reverse()) {
      if (world.t - s.t > 120) continue;
      if (nb.some((n) => n.id === s.id && n.room === s.room)) continue;
      nb.push({ id: s.id, name: name(s.id), room: roomName(s.room), ago: Math.round(world.t - s.t) });
      if (nb.length >= 8) break;
    }
    for (const gr of world.growls) if (gr.witnesses.includes(me.id) && world.t - gr.t < 180) nb.unshift({ id: gr.id, name: name(gr.id), room: roomName(gr.room), ago: Math.round(world.t - gr.t), growl: true });
    if (me.witnessed) nb.unshift({ id: me.witnessed.apparent, name: name(me.witnessed.apparent), room: roomName(me.witnessed.room), ago: 0, saw: true });
    notebooks[me.id] = nb;
  }

  return {
    kind, by: byId, lines, accuse, evidence, notebooks, focus: [...focusRooms], from, to,
    shown: 0, humanVotes: {}, guesses: {}, resolved: false, startMs: null, deadlineMs: null, resolvedAt: null,
    // the crime to solve this round (secret until the votes are in)
    crime: markers.length ? { weapon: world.weapon, places: [...new Set(markers.map((x) => x.place))], victims: markers.map((x) => name(x.victimId)) } : null,
  };
}

// A player types into the meeting. Names they mention count as an
// accusation (or a defence, with words like "innocent"), and any of the
// castle folk who were named answer back.
const TITLE_WORDS = new Set(["sir", "lady", "brother", "old", "wee", "dame", "the", "o'", "of"]);
export function sayInMeeting(world, eid, text) {
  const m = world.meeting;
  const me = world.entities[eid];
  if (!m || !me || !me.alive || m.resolved) return;
  const clean = String(text).trim().slice(0, 240);
  if (!clean) return;
  m.lines.push({ who: eid, text: clean, typed: true });
  m.shown = Math.max(m.shown, m.lines.length);
  const low = clean.toLowerCase();
  const named = world.entities.filter((e) => e.alive && e !== me && e.name.toLowerCase().split(/\s+/).some((w) => w.length > 2 && !TITLE_WORDS.has(w) && low.includes(w)));
  const defend = /\b(innocent|not|trust|didn't|didnt|never|wasn't|wasnt|clear)\b/.test(low);
  const roomsSaid = ROOMS.filter((r) => low.includes(r.name.toLowerCase()) || low.includes(r.id));
  if (!named.length) {
    const someone = pick(world.entities.filter((e) => e.alive && !e.human));
    if (someone && rnd() < 0.7) {
      const pool = roomsSaid.length
        ? [`The ${roomsSaid[0].name}? I wasn't anywhere near it.`, `Who else was in the ${roomsSaid[0].name}, then?`]
        : ["Aye, but who? Give us a name.", "Talk is cheap. Where's the proof?", "Hmm. Go on...", "Somebody here is lying, that's for certain."];
      m.lines.push({ who: someone.id, text: someone.role === "jester" ? "Honk! I mean... quite right, quite right." : pick(pool) });
    }
    return;
  }
  for (const e of named.slice(0, 2)) {
    m.accuse.push({ by: eid, target: e.id, w: defend ? -20 : 22 });
    if (e.human) continue; // real people answer for themselves
    let reply;
    if (defend) reply = pick(["Thank you! At last, someone with sense.", "Bless you. I've done nothing but chores all night.", "See? I told you all."]);
    else if (e.role === "blackknight") {
      const fake = shuffle(ROOMS.filter((r) => !m.focus.includes(r.id) && r.id !== "dungeon")).slice(0, 2).map((r) => r.id);
      reply = pick([
        `Preposterous! I was in ${listRooms(fake)} the whole time.`,
        `Me? I was... polishing things. In ${listRooms(fake.slice(0, 1))}. Obviously.`,
        `How dare you. Ask anyone. Well, don't ask anyone. But I was in ${listRooms(fake)}.`,
      ]);
    } else if (e.role === "jester") reply = pick(["Honk?! HONK! You'll never take me alive!", "Me? I'm just the entertainment!", "I was juggling. Badly. Ask the cat."]);
    else {
      const rooms = windowRooms(world, e, m.from, m.to);
      reply = pick([
        `Me?! I was in ${listRooms(rooms.length ? rooms : ["hall"])}. Ask anyone!`,
        `That's rich, coming from you, ${me.name}.`,
        `On my honour, I was in ${listRooms(rooms.length ? rooms : ["hall"])}.`,
      ]);
    }
    m.lines.push({ who: e.id, text: reply });
  }
}

// a real player has read their role and lit their torch
export function markReady(world, eid) {
  if (world.phase === "intro" && world.entities[eid] && !world.ready.includes(eid)) world.ready.push(eid);
}

// a real player's vote (an entity id, or null to skip)
// Like Clue: "It was ___, with the ___, in the ___." Who decides the joust;
// weapon and room earn powers for next round (and dominoes).
export function castVote(world, eid, target, weapon, place) {
  const m = world.meeting;
  const me = world.entities[eid];
  if (!m || m.resolved || !me || !me.alive) return;
  if (target !== null && target !== undefined && !world.entities[target]?.alive) return;
  m.humanVotes[eid] = target ?? null;
  m.guesses[eid] = { weapon: weaponById(weapon) ? weapon : null, place: place || null };
}

export function resolveVotes(world) {
  const m = world.meeting;
  const votes = [];
  const humanTargets = [];
  for (const h of humans(world)) {
    if (!h.alive) continue;
    const t = h.id in m.humanVotes ? m.humanVotes[h.id] : null;
    votes.push({ voter: h.id, target: t });
    if (t !== null) humanTargets.push(t);
    if (t !== null && world.entities[t]?.role === "blackknight") h.stats.rightVotes++;
  }
  const bk = world.entities.find((e) => e.role === "blackknight");
  const publicScore = (id) => m.accuse.filter((a) => a.target === id).reduce((s, a) => s + a.w, 0);
  let darkTarget = null;
  if (bk) {
    const cand = victims(world, bk).map((v) => ({ id: v.id, s: publicScore(v.id) })).sort((a, b) => b.s - a.s)[0];
    if (cand && cand.s >= 15) darkTarget = cand.id;
  }
  for (const v of world.entities) {
    if (!v.alive || v.human) continue;
    if (isDark(v)) { votes.push({ voter: v.id, target: darkTarget }); continue; }
    const known = Object.keys(v.truth).find((id) => v.truth[id] === "bk" && world.entities[id].alive);
    if (known !== undefined) { votes.push({ voter: v.id, target: +known }); continue; }
    const knownJesters = m.accuse.filter((a) => a.reveal === "jester").map((a) => a.target);
    const scores = [];
    for (const c of world.entities) {
      if (!c.alive || c === v) continue;
      let s = 0;
      for (const a of m.accuse) {
        if (a.target !== c.id || a.by === c.id) continue;
        // once the Knight has unmasked the Jester, nobody listens to them
        if (knownJesters.includes(a.by)) continue;
        s += a.by === v.id ? a.w : a.w * v.trust;
      }
      if (v.seen.some((x) => x.id === c.id && x.t >= m.from && x.t <= m.to && m.focus.includes(x.room))) s += 12;
      // the castle folk are swayed by how the real people vote
      s += humanTargets.filter((t) => t === c.id).length * 15;
      s += rnd() * 12;
      scores.push({ id: c.id, s });
    }
    scores.sort((a, b) => b.s - a.s);
    const top = scores[0], next = scores[1];
    const sure = top && top.s >= 42 && (!next || top.s - next.s >= 10);
    votes.push({ voter: v.id, target: sure ? top.id : null });
  }
  const counts = {};
  let skip = 0;
  for (const x of votes) { if (x.target === null) skip++; else counts[x.target] = (counts[x.target] || 0) + 1; }
  const ranked = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  let accused = null;
  if (ranked.length && ranked[0][1] > skip && (ranked.length < 2 || ranked[0][1] > ranked[1][1])) accused = +ranked[0][0];
  m.votes = votes;
  m.counts = counts;
  m.skip = skip;
  m.accused = accused;
  m.resolved = true;
  m.shown = m.lines.length;
  judgeCase(world, m, bk);
  return { votes, counts, skip, accused };
}

// turn over the case cards: who named the weapon and the room, and their rewards
function judgeCase(world, m, bk) {
  for (const e of world.entities) e.powerups = {};
  m.results = {};
  const c = m.crime;
  if (!c) return;
  for (const h of humans(world)) {
    if (!h.alive) continue;
    const g = m.guesses[h.id] || {};
    const wRight = !!g.weapon && g.weapon === c.weapon;
    const rRight = !!g.place && c.places.includes(g.place);
    m.results[h.id] = { weapon: g.weapon || null, place: g.place || null, wRight, rRight };
    if (isDark(h)) continue; // they knew all along
    const whoRight = bk && m.humanVotes[h.id] === bk.id;
    if (wRight) h.stats.weaponRight++;
    if (rRight) h.stats.roomRight++;
    if (wRight && rRight && whoRight) h.stats.solved++;
    h.powerups = { boots: wRight, lantern: rRight, raven: wRight && rRight };
    const got = Object.keys(h.powerups).filter((k) => h.powerups[k]).map((k) => POWERUPS[k].name);
    if (got.length) toast(world, `For your sharp accusation: ${got.join(", ")}! ${Object.keys(h.powerups).filter((k) => h.powerups[k]).map((k) => POWERUPS[k].what).join(" ")}`, "good", h.id);
  }
  world.caseLog.push({ round: world.round, weapon: c.weapon, places: c.places, victims: c.victims });
}

// The host's clock for everything that isn't play: lines appearing one by
// one, the vote closing, the tally, the joust. `now` is the host's ms clock.
export function directorTick(world, now) {
  const m = world.meeting;
  if (world.phase === "intro") {
    // everyone reads who they are; the night starts when all have lit their
    // torches (or after a minute, so nobody can hold it up)
    if (world.introMs === null) world.introMs = now;
    const people = humans(world);
    if (people.every((h) => world.ready.includes(h.id)) || now - world.introMs > 60000) world.phase = "play";
    return;
  }
  if (world.phase === "meeting" && m) {
    if (m.startMs === null) { m.startMs = now; m.deadlineMs = now + VOTE_SECONDS * 1000; m.lineAt = now + 500; }
    if (!m.resolved && m.shown < m.lines.length && now >= m.lineAt) { m.shown++; m.lineAt = now + LINE_MS; }
    const voters = humans(world).filter((h) => h.alive);
    const allVoted = voters.length > 0 && voters.every((h) => h.id in m.humanVotes);
    if (!m.resolved && (allVoted || now >= m.deadlineMs || (!voters.length && now >= m.startMs + Math.min(VOTE_SECONDS * 1000, 14000)))) {
      resolveVotes(world);
      m.resolvedAt = now;
      // long enough for every seal to be broken, the case cards turned and the verdict read
      m.tallyMs = 1300 + m.votes.length * 420 + 600 + (m.crime ? 3600 : 0) + 2600;
      sfx(world, "click");
    }
    m.leftMs = m.resolved ? 0 : Math.max(0, m.deadlineMs - now);
    m.revealMs = m.resolved ? now - m.resolvedAt : 0;
    if (m.resolved && now - m.resolvedAt >= (m.tallyMs || TALLY_MS)) {
      if (m.accused !== null && m.accused !== undefined) {
        const e = world.entities[m.accused];
        world.phase = "joust";
        world.joust = {
          id: m.accused, startMs: now,
          accused: { name: e.name, role: e.role, look: e.look },
          crowd: world.entities.filter((x) => x !== e).map((x) => ({ look: x.look, name: x.name, ghost: !x.alive, id: x.id })),
        };
      } else applyJoust(world, null);
    }
  } else if (world.phase === "joust" && world.joust) {
    world.joust.ageMs = now - world.joust.startMs;
    if (now - world.joust.startMs >= JOUST_MS) {
      const id = world.joust.id;
      world.joust = null;
      applyJoust(world, id);
    }
  }
}

// after the joust (or a skipped vote): carry on, or the night is over
export function applyJoust(world, accusedId) {
  if (accusedId !== null && accusedId !== undefined) {
    const e = world.entities[accusedId];
    world.lastJoust = { id: accusedId, role: e.role };
    logEvent(world, `${e.name} was sent to the joust${e.role === "blackknight" ? " and unhorsed: the Black Knight!" : e.role === "jester" ? ": the Jester!" : ", and was innocent."}`);
    if (e.role === "blackknight") {
      e.alive = false; e.out = true;
      world.meeting = null;
      return endGame(world, "castle", "joust", true);
    }
    e.alive = false; e.ghost = true; e.out = true;
  } else world.lastJoust = null;
  world.markers = [];
  for (const e of world.entities) {
    e.witnessed = null; e.reportAt = null; e.swapUsed = false;
    if (e.role === "blackknight") e.cd.capture = Math.max(e.cd.capture, 15);
    e.disguiseAs = null;
  }
  world.lightsOut = false; world.portcullisJammed = false;
  world.lightsFixer = null; world.gateFixer = null;
  // the Black Knight hangs up this round's weapon and takes another from its stand
  const fresh = WEAPONS.filter((w) => !world.usedWeapons.slice(-3).includes(w.id));
  world.weapon = pick(fresh.length ? fresh : WEAPONS).id;
  world.usedWeapons.push(world.weapon);
  if (accusedId !== null && accusedId !== undefined && world.claymore.holder === accusedId) {
    const fresh2 = hideClaymore();
    Object.assign(world.claymore, { x: fresh2.x, y: fresh2.y, where: fresh2.where, holder: null });
  }
  world.round++;
  world.meeting = null;
  world.phase = "play";
  gatherInHall(world);
  // the Raven brings a free clue card
  for (const e of world.entities) {
    if (e.alive && e.powerups?.raven) clueCard(world, e, pick(ROOMS.filter((r) => r.id !== "dungeon")).id, "raven");
  }
  checkWin(world);
}

function checkWin(world) {
  if (world.phase === "ending") return;
  const bk = world.entities.find((e) => e.role === "blackknight");
  if (!bk || (!bk.alive && bk.out)) return endGame(world, "castle", "joust");
  const good = world.entities.filter((e) => e.alive && !isDark(e)).length;
  const dark = world.entities.filter((e) => e.alive && isDark(e)).length;
  // the Jester can't capture anyone, so only the Black Knight counts: down to one honest soul and it's over
  if (good <= Math.max(1, dark - 1)) return endGame(world, "dark", "overrun");
  if (castleChoreStats(world).frac >= 1) return endGame(world, "castle", "chores");
}

function endGame(world, winner, reason, force = false) {
  if (world.phase === "ending") return;
  if (world.phase === "meeting" && !force) return; // settle the vote first
  world.phase = "ending";
  const bk = world.entities.find((e) => e.role === "blackknight");
  const jester = world.entities.find((e) => e.role === "jester");
  world.result = {
    winner, reason,
    villains: [bk, jester].filter(Boolean).map((e) => ({ id: e.id, name: e.name, role: e.role, look: e.look, human: e.human })),
  };
  // scores are dominoes: each deed earns a tile, and the pips are the score
  for (const me of humans(world)) {
    const mine = ROLES[me.role].side;
    const won = winner === mine;
    const tiles = [];
    const add = (n, a, b, label) => { for (let i = 0; i < n; i++) tiles.push({ a, b, label }); };
    add(me.stats.chores, 1, 1, "a chore done");
    add(me.stats.reports, 1, 2, "a helmet reported");
    add(me.stats.rightVotes, 2, 3, "a vote for the Black Knight");
    add(me.stats.truthCatch, 3, 3, "the Torch of Truth caught the Black Knight");
    add(me.stats.captures, 1, 2, "a capture");
    add(me.stats.weaponRight, 2, 2, "named the weapon");
    add(me.stats.roomRight, 2, 2, "named the room");
    add(me.stats.solved, 5, 5, "solved the whole murder (who, weapon and room)");
    add(me.stats.claymoreBK, 6, 6, "slew the Black Knight with the Donaghy Claymore");
    if (won) add(1, mine === "castle" ? 5 : 6, mine === "castle" ? 5 : 6, mine === "castle" ? "the castle won" : "the darkness won");
    const pts = [];
    for (const t of tiles) { const row = pts.find((p) => p[0] === t.label); if (row) row[1] += t.a + t.b; else pts.push([t.label, t.a + t.b]); }
    world.results[me.id] = { won, tiles, points: pts, total: tiles.reduce((s, t) => s + t.a + t.b, 0), name: me.name };
  }
  logEvent(world, winner === "castle" ? "The castle won the night." : "The Black Knight won the night.");
}

export function hudInfo(world, eid) {
  const me = world.entities[eid];
  const chores = castleChoreStats(world);
  return {
    t: world.t, left: Math.max(0, GAME_SECONDS - world.t), round: world.round,
    secured: chores.frac, lightsOut: world.lightsOut, gate: world.portcullisJammed,
    room: areaAt(me.x, me.y)?.name || "",
    me: {
      name: me.name, role: me.role, alive: me.alive, color: me.color,
      cd: { ...me.cd }, swapUsed: me.swapUsed, bellUsed: me.bellUsed,
      disguisedAs: me.disguiseAs !== null ? world.entities[me.disguiseAs].name : null,
      chores: me.chores.map((id) => ({ id, label: stationById(id).label, room: roomName(stationById(id).area), done: me.done.includes(id) })),
    },
    ctx: humanContext(world, eid),
    work: me.hwork || null,
    toasts: world.toasts.filter((x) => (x.to === undefined || x.to === eid) && world.t - x.at < 6).slice(-4),
    schemes: schemesFor(world, me),
    captures: world.entities.filter((e) => !e.alive).length,
    frozen: world.t < me.frozenUntil,
    riding: !!me.ride,
    ally: isDark(me) ? world.entities.filter((e) => isDark(e) && e !== me).map((e) => ({ name: e.name, role: ROLES[e.role].name })) : [],
    alive: world.entities.filter((e) => e.alive).length,
    total: world.entities.length,
    freeUsed: world.freeUsed,
    prisoners: prisoners(world).length,
    job: nextJob(world, eid),
    powerups: me.powerups || {},
    cards: (me.cards || []).filter((c) => c.round === world.round),
    weapon: me.role === "blackknight" ? world.weapon : null,
    claymore: world.claymore && world.claymore.holder === me.id && !world.claymore.used,
    missing: world.markers.map((m) => ({ name: world.entities[m.victimId].name, found: m.found, room: m.found ? roomName(m.room) : null })),
    // 0..1, drives the music: later, after a capture, in the dark, fewer free
    tension: Math.min(1, (world.t / GAME_SECONDS) * 0.55
      + (world.t - world.lastCaptureT < 25 ? 0.3 : 0)
      + (world.lightsOut ? 0.25 : 0)
      + (1 - world.entities.filter((e) => e.alive).length / world.entities.length) * 0.4),
  };
}

// ---------- Sheba, the family dog ----------
const SHEBA_HAUNTS = ["upper", "lower", "hall", "kitchen", "west", "east", "courtyard", "stables", "hall", "kitchen"];
function makeSheba() {
  return { x: 10 * TILE, y: 22 * TILE, facing: 0, path: [], wait: 1, barkCd: 4, barkUntil: 0, growlUntil: 0, wag: 0, dinner: false, eating: 0, run: 0 };
}
function shebaTick(world, dt) {
  const sh = world.sheba;
  sh.barkCd = Math.max(0, sh.barkCd - dt);
  // dinner time: run to the bowl and eat
  if (sh.dinner && !sh.path.length && Math.hypot(sh.x - KITCHEN_BOWL.x, sh.y - KITCHEN_BOWL.y) > TILE) {
    sh.path = findPath(sh.x, sh.y, Math.floor(KITCHEN_BOWL.x / TILE), Math.floor(KITCHEN_BOWL.y / TILE) + 1, null, world) || [];
  } else if (sh.dinner && Math.hypot(sh.x - KITCHEN_BOWL.x, sh.y - KITCHEN_BOWL.y) <= TILE * 1.2) {
    sh.dinner = false; sh.eating = world.t + 6; sh.wait = 6; sh.path = [];
  }
  if (sh.wait > 0) { sh.wait -= dt; return; }
  if (!sh.path.length) {
    const area = areaById(pick(SHEBA_HAUNTS));
    const { tx, ty } = randomTileIn(area);
    sh.path = findPath(sh.x, sh.y, tx, ty, null, world) || [];
    if (!sh.path.length) sh.wait = 1;
    return;
  }
  const n = sh.path[0];
  const dx = n.x - sh.x, dy = n.y - sh.y, d = Math.hypot(dx, dy);
  const step = (sh.dinner ? 190 : 135) * dt;
  if (d <= step) { sh.x = n.x; sh.y = n.y; sh.path.shift(); if (!sh.path.length) sh.wait = 1.5 + rnd() * 4; }
  else { sh.x += (dx / d) * step; sh.y += (dy / d) * step; sh.facing = Math.atan2(dy, dx); sh.run += step; }
  // a bark at whoever walks by (which gives people away in the dark)
  if (sh.barkCd <= 0) {
    const close = world.entities.find((e) => e.alive && Math.hypot(e.x - sh.x, e.y - sh.y) < TILE * 2.2 && hasLOS(e.x, e.y, sh.x, sh.y));
    if (close && close.role === "blackknight" && rnd() < 0.7) {
      // Sheba always did know a bad'un
      sh.barkCd = 8 + rnd() * 6;
      sh.growlUntil = world.t + 2;
      // whoever is close enough to see it remembers who Sheba growled at
      const witnesses = world.entities.filter((o) => o.alive && o !== close && Math.hypot(o.x - sh.x, o.y - sh.y) < TILE * 7 && hasLOS(o.x, o.y, sh.x, sh.y)).map((o) => o.id);
      world.growls.push({ id: close.id, t: world.t, room: areaAt(sh.x, sh.y)?.id, witnesses });
      sfx(world, "growl", { x: sh.x, y: sh.y, r: 8 * TILE, scale: true });
      if (close.human) toast(world, "Sheba growls at you. Dogs know.", "bad", close.id);
    } else if (close) {
      sh.barkCd = 10 + rnd() * 10;
      if (rnd() < 0.55) {
        sh.barkUntil = world.t + 1.6;
        sfx(world, "bark", { x: sh.x, y: sh.y, r: 14 * TILE, scale: true });
        if (close.human) toast(world, "Woof! Sheba barks at you.", "info", close.id);
      }
    }
  }
}

// ---------- Nana, who has been in the castle longer than the castle ----------
// She doesn't say a word. She just toots.
function makeNana() {
  return { x: 28 * TILE, y: 36 * TILE, facing: 0, path: [], wait: 2, tootCd: 6, tootAt: -99, puffs: [], walk: 0, big: false };
}
function nanaTick(world, dt) {
  const n = world.nana;
  n.tootCd -= dt;
  const bumped = humans(world).find((h) => h.alive && Math.hypot(h.x - n.x, h.y - n.y) < TILE * 0.9);
  // a toot every so often, and always one when someone bumps into her
  if (n.tootCd <= 0 || (bumped && world.t - n.tootAt > 4)) {
    n.tootCd = 7 + rnd() * 12;
    n.tootAt = world.t;
    n.big = rnd() < 0.25;
    n.puffs.push({ x: n.x - Math.cos(n.facing) * 10, y: n.y - Math.sin(n.facing) * 10, t: world.t, big: n.big });
    if (n.puffs.length > 4) n.puffs.shift();
    sfx(world, "toot", { x: n.x, y: n.y, r: 10 * TILE, scale: true, big: n.big });
    for (const h of near(world, n.x, n.y, TILE * 2.5)) if (h.alive) toast(world, pick(["Nana toots and carries on as if nothing happened.", "Pfffrrrt. Nana smiles sweetly.", "Was that Nana? It was definitely Nana.", "Nana toots. Sheba looks at you."]), "info", h.id);
  }
  n.puffs = n.puffs.filter((p) => world.t - p.t < 3);
  if (n.wait > 0) { n.wait -= dt; return; }
  if (!n.path.length) {
    const { tx, ty } = randomTileIn(pick(AREAS));
    n.path = findPath(n.x, n.y, tx, ty, null, world) || [];
    if (!n.path.length) n.wait = 2;
    return;
  }
  const p = n.path[0];
  const dx = p.x - n.x, dy = p.y - n.y, d = Math.hypot(dx, dy);
  const step = 48 * dt;
  if (d <= step) { n.x = p.x; n.y = p.y; n.path.shift(); if (!n.path.length || rnd() < 0.03) n.wait = 2 + rnd() * 6; }
  else { n.x += (dx / d) * step; n.y += (dy / d) * step; n.facing = Math.atan2(dy, dx); n.walk += step * 0.12; }
}

// what the Black Knight or Jester can do right now (their "tasks")
function schemesFor(world, me) {
  if (!me.alive) return [];
  const row = (key, label, cd, extra) => ({ key, label, ready: cd <= 0 && !extra, left: Math.ceil(cd), note: extra || null });
  if (me.role === "blackknight") {
    const freeCastle = world.entities.filter((e) => e.alive && !isDark(e)).length;
    return [
      { key: "", label: `Capture the castle folk: ${freeCastle} still free`, ready: false, goal: true },
      { key: "", label: `This round you carry ${weaponById(world.weapon).the} (its stand in the ${roomName(weaponById(world.weapon).home)} stands empty)`, ready: false, note: null },
      row("Q", "Capture someone (walk right up to them)", me.cd.capture),
      row("1", "Lights Out", me.cd.sabotage, world.lightsOut ? "lights already out" : null),
      row("2", "Jam the portcullis", me.cd.sabotage, world.portcullisJammed ? "already jammed" : null),
      row("3", "Disguise as someone nearby", me.cd.disguise, me.disguiseAs !== null ? "disguised now" : null),
      row("4", "Smoke bomb (nobody sees through it)", me.cd.smoke),
    ];
  }
  if (me.role === "jester") {
    return [
      { key: "", label: "Help the Black Knight: muddle everyone", ready: false, goal: true },
      row("Q", "Swap places with someone nearby", 0, me.swapUsed ? "used this round" : null),
      row("1", "False alarm (a scream somewhere else)", me.cd.alarm),
      row("2", "Drop marbles to trip people", me.cd.marbles),
      { key: "", label: `Pop out somewhere new in ${Math.ceil(me.cd.hop)}s`, ready: false, note: "automatic" },
    ];
  }
  return [];
}

// ---------- the secret passages: a quick row round the moat ----------
const MOAT = { left: 0.5 * TILE, right: 78.9 * TILE, bottom: 56.2 * TILE };
function startRide(world, e, fx, fy, tx, ty) {
  const side = (x) => (x < 40 ? MOAT.left : MOAT.right);
  const a = { x: side(fx), y: (fy + 0.5) * TILE }, b = { x: side(tx), y: (ty + 0.5) * TILE };
  const pts = [{ x: e.x, y: e.y }, a, { x: a.x, y: MOAT.bottom }, { x: b.x, y: MOAT.bottom }, b, { x: (tx + 0.5) * TILE, y: (ty + 0.5) * TILE }];
  let len = 0;
  for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
  e.ride = { pts, len, t0: world.t, dur: 4 };
  e.hpath = [];
  sfx(world, "splash", { to: e.id });
  toast(world, "You drop through the trapdoor into a little boat and row like mad round the moat...", "info", e.id);
}
// where the little boat is, t seconds into the night
export function ridePos(r, t) {
  const k = Math.min(1, (t - r.t0) / r.dur);
  const ease = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
  let d = ease * r.len;
  for (let i = 1; i < r.pts.length; i++) {
    const p0 = r.pts[i - 1], p1 = r.pts[i], seg = Math.hypot(p1.x - p0.x, p1.y - p0.y);
    if (d <= seg || i === r.pts.length - 1) {
      const f = seg ? Math.min(1, d / seg) : 1;
      return { x: p0.x + (p1.x - p0.x) * f, y: p0.y + (p1.y - p0.y) * f, facing: seg ? Math.atan2(p1.y - p0.y, p1.x - p0.x) : null, k };
    }
    d -= seg;
  }
  return { x: r.pts[r.pts.length - 1].x, y: r.pts[r.pts.length - 1].y, facing: null, k };
}
function rideTick(world, e) {
  const r = e.ride;
  const p = ridePos(r, world.t);
  const k = p.k;
  e.x = p.x; e.y = p.y;
  if (p.facing !== null) e.facing = p.facing;
  r.k = k;
  if (k >= 1) {
    e.ride = null;
    e.tp = (e.tp || 0) + 1;
    sfx(world, "splash", { to: e.id });
    toast(world, `...and climb out, dripping, in the ${areaAt(e.x, e.y)?.name || "castle"}.`, "info", e.id);
  }
}

// ---------- sharing the castle ----------
// What the host sends everyone, a few times a second. Leaves out the
// computer players' private thinking (paths, memories, trust).
export function snapshot(world) {
  const m = world.meeting;
  return {
    t: world.t, phase: world.phase, round: world.round, seq: world.seq, gameId: world.gameId, ready: world.ready,
    lightsOut: world.lightsOut, portcullisJammed: world.portcullisJammed, freeUsed: world.freeUsed,
    lastCaptureT: world.lastCaptureT, gatherT: world.gatherT,
    markers: world.markers, smoke: world.smoke, marbles: world.marbles, alarm: world.alarm,
    sheba: { x: world.sheba.x, y: world.sheba.y, facing: world.sheba.facing, run: world.sheba.run, wag: world.sheba.wag, eating: world.sheba.eating, barkUntil: world.sheba.barkUntil, growlUntil: world.sheba.growlUntil },
    nana: { x: world.nana.x, y: world.nana.y, facing: world.nana.facing, walk: world.nana.walk, tootAt: world.nana.tootAt, puffs: world.nana.puffs, big: world.nana.big },
    toasts: world.toasts.filter((x) => world.t - x.at < 6),
    sfx: world.sfx.slice(-30),
    caseNotes: world.caseNotes, log: world.phase === "ending" ? world.log : [],
    weapon: world.weapon, caseLog: world.caseLog, claymore: world.claymore,
    meeting: m ? {
      kind: m.kind, by: m.by, lines: m.lines, evidence: m.evidence, notebooks: m.notebooks, shown: m.shown,
      voted: Object.keys(m.humanVotes).map(Number), resolved: m.resolved, leftMs: m.leftMs ?? VOTE_SECONDS * 1000,
      votes: m.resolved ? m.votes : null, counts: m.resolved ? m.counts : null, skip: m.resolved ? m.skip : null, accused: m.resolved ? m.accused : null,
      hasCrime: !!m.crime, crime: m.resolved ? m.crime : null, results: m.resolved ? m.results : null, revealMs: m.revealMs || 0,
    } : null,
    joust: world.joust ? { ...world.joust } : null,
    result: world.result, results: world.results,
    entities: world.entities.map((e) => ({
      id: e.id, name: e.name, human: e.human, pid: e.pid, role: e.role, color: e.color, look: e.look,
      x: Math.round(e.x), y: Math.round(e.y), facing: +e.facing.toFixed(2), walk: +(e.walk || 0).toFixed(1), moving: e.human ? !!e.moving : e.path.length > 0 && !e.work, tp: e.tp,
      alive: e.alive, ghost: e.ghost, out: e.out, disguiseAs: e.disguiseAs, canUnlock: e.canUnlock,
      chores: e.chores, done: e.done, cd: e.cd, swapUsed: e.swapUsed, bellUsed: e.bellUsed,
      frozenUntil: e.frozenUntil, ride: e.ride, reveal: e.reveal, witnessed: e.human ? e.witnessed : null,
      cards: e.human ? e.cards : [], powerups: e.powerups,
    })),
  };
}

// A laptop that isn't the host keeps a copy of the castle built from the
// host's snapshots. Its own knight stays where its player put it (unless
// the host moved it: a swap, a capture, the boat, a meeting).
export function applySnapshot(local, snap, myId) {
  if (!local) {
    const w = { ...snap, entities: snap.entities.map((e) => ({ ...e, nx: e.x, ny: e.y, hpath: [] })) };
    w.sheba = { ...snap.sheba, nx: snap.sheba.x, ny: snap.sheba.y };
    w.nana = { ...snap.nana, nx: snap.nana.x, ny: snap.nana.y };
    return w;
  }
  const keep = local.entities, sheba = local.sheba, nana = local.nana;
  Object.assign(local, snap);
  local.entities = snap.entities.map((s) => {
    const old = keep[s.id];
    const e = { ...s, hpath: old?.hpath || [], hwork: old?.hwork || null };
    if (s.id === myId && old && old.tp === s.tp && !s.ride && snap.phase === "play") {
      // trust my own movement
      e.x = old.x; e.y = old.y; e.facing = old.facing; e.walk = old.walk; e.moving = old.moving;
    } else if (old && old.tp === s.tp && !s.ride) {
      // glide others smoothly toward where the host says they are
      e.nx = s.x; e.ny = s.y; e.x = old.x; e.y = old.y;
    } else { e.nx = s.x; e.ny = s.y; e.hpath = s.id === myId ? [] : e.hpath; }
    return e;
  });
  local.sheba = { ...snap.sheba, nx: snap.sheba.x, ny: snap.sheba.y, x: sheba?.x ?? snap.sheba.x, y: sheba?.y ?? snap.sheba.y };
  local.nana = { ...snap.nana, nx: snap.nana.x, ny: snap.nana.y, x: nana?.x ?? snap.nana.x, y: nana?.y ?? snap.nana.y };
  return local;
}

// between snapshots: slide everyone (but me) toward their latest position
export function glide(local, myId, dt) {
  const k = Math.min(1, dt * 9);
  for (const e of local.entities) {
    if (e.id === myId || e.nx === undefined) continue;
    const d = Math.hypot(e.nx - e.x, e.ny - e.y);
    if (d > TILE * 6) { e.x = e.nx; e.y = e.ny; } else { e.x += (e.nx - e.x) * k; e.y += (e.ny - e.y) * k; }
  }
  for (const c of [local.sheba, local.nana]) if (c && c.nx !== undefined) { c.x += (c.nx - c.x) * k; c.y += (c.ny - c.y) * k; }
}

// ---------- the Clue side ----------
// A clue card: was there a struggle in this room this round? And one weapon:
// the room's own stand if it has one (an empty stand gives the game away),
// otherwise one that is NOT this round's weapon.
function clueCard(world, e, place, source) {
  const scenes = world.markers.filter((m) => m.place === place);
  const mine = e.cards.filter((c) => c.round === world.round);
  const home = WEAPONS.find((w) => w.home === place);
  let weapon = null, missing = false;
  if (home && !mine.some((c) => c.weapon === home.id)) { weapon = home.id; missing = home.id === world.weapon; }
  else {
    const pool = WEAPONS.filter((w) => w.id !== world.weapon && !mine.some((c) => c.weapon === w.id));
    if (pool.length) weapon = pick(pool).id;
  }
  const card = { round: world.round, place, struggle: scenes.length > 0, weapon, missing, t: Math.round(world.t), source };
  e.cards.push(card);
  if (e.cards.length > 40) e.cards.shift();
  // a real player sees it as a card on screen (and in their notebook)
  if (e.human) sfx(world, "card", { to: e.id });
  // searching the room turns up any hidden helmet
  const hidden = scenes.filter((m) => !m.found);
  if (hidden.length && !isDark(e)) {
    for (const m of hidden) m.found = true;
    if (e.human) toast(world, `You found ${hidden.map((m) => world.entities[m.victimId].name + "'s").join(" and ")} dropped helmet here! Press R to report it.`, "bad", e.id);
    else e.reportAt = world.t + 0.8;
  }
  return card;
}
function cardSpeech(c, mine = false) {
  const w = weaponById(c.weapon);
  const room = c.place === GALLERIES ? "the galleries" : `the ${roomName(c.place)}`;
  const where = c.struggle ? `Signs of a struggle in ${room}!` : `${mine ? "No" : "I searched " + room + ": no"} sign of a struggle${mine ? " in " + room : " there"}.`;
  const what = !w ? "" : c.missing ? ` ${w.name}'s stand is EMPTY!` : ` ${w.the[0].toUpperCase() + w.the.slice(1)} is ${w.home === c.place ? "on its stand" : "accounted for"}: not the weapon.`;
  return where + what;
}
// walking right over a hidden helmet
function stumbleTick(world) {
  for (const m of world.markers) {
    if (m.found) continue;
    const e = world.entities.find((x) => x.alive && !isDark(x) && Math.hypot(x.x - m.x, x.y - m.y) < TILE * 1.1);
    if (!e) continue;
    m.found = true;
    if (e.human) toast(world, `You stumble over ${world.entities[m.victimId].name}'s helmet in the dark! Press R to report it.`, "bad", e.id);
    else e.reportAt = world.t + 1;
  }
}

// the Donaghy Claymore
function hideClaymore() {
  const s = pick(CLAYMORE_SPOTS);
  return { x: s[0] * TILE + TILE / 2, y: s[1] * TILE + TILE / 2, where: s[2], holder: null, used: false };
}
function dropClaymore(world, e) {
  const c = world.claymore;
  if (!c || c.used || c.holder !== e.id) return;
  c.holder = null; c.x = e.x; c.y = e.y; c.where = `where ${e.name} fell`;
}
function claymoreStrike(world, by, v) {
  const c = world.claymore;
  c.used = true; c.holder = null;
  const was = v.role;
  logEvent(world, `${by.name} struck ${v.name} (the ${ROLES[was].name}) with the Donaghy Claymore.`);
  for (const o of world.entities) {
    if (!o.alive || o === by || o === v || !o.human) continue;
    if (canSee(world, o, by)) toast(world, `You saw ${look(world, by).name} swing the Donaghy Claymore at ${v.name}!`, "bad", o.id);
  }
  v.alive = false; v.ghost = true; v.out = true; v.hunt = null; v.work = null; v.path = [];
  sfx(world, "claymore");
  toast(world, was === "blackknight"
    ? `The Donaghy Claymore has struck! ${v.name} falls... and a BLACK helmet rolls across the floor!`
    : `The Donaghy Claymore has struck! ${v.name} has fallen. Only one blow was in it, and it is spent.`, was === "blackknight" ? "good" : "bad");
  if (by.human) toast(world, was === "blackknight" ? "You slew the Black Knight!" : was === "jester" ? `${v.name} was the Jester! A fine blow.` : `${v.name} was innocent...`, was === "blackknight" || was === "jester" ? "good" : "bad", by.id);
  if (v.human) toast(world, "The Donaghy Claymore! You've fallen. You're a ghost now, and your chores still count.", "bad", v.id);
  if (was === "blackknight") {
    by.stats.claymoreBK++;
    endGame(world, "castle", "claymore");
  }
}
// computer players and the Claymore: take it if they trip over it; the
// castle folk use it only on someone they're sure of (and can be fooled by a
// disguise); a Jester uses it on whoever is alone with them
function npcClaymore(world, e, dt) {
  const c = world.claymore;
  if (!c || c.used || !e.alive) return;
  if (c.holder === null) {
    if (e.role !== "blackknight" && Math.hypot(e.x - c.x, e.y - c.y) < TILE * 1.2) { c.holder = e.id; e.clayT = world.t; logEvent(world, `${e.name} found the Donaghy Claymore ${c.where}.`); }
    return;
  }
  if (c.holder !== e.id) return;
  let target = null;
  if (e.role === "jester") {
    if (world.t - e.clayT > 20) {
      const v = strikeTarget(world, e);
      if (v && !isDark(v) && !witnessed(world, e, v)) target = v;
    }
  } else {
    const known = Object.keys(e.truth).find((id) => e.truth[id] === "bk" && world.entities[id].alive);
    const sure = known !== undefined ? world.entities[known] : e.witnessed && world.entities[e.witnessed.apparent]?.alive ? world.entities[e.witnessed.apparent] : null;
    if (sure) {
      if (dist(e, sure) <= CAPTURE_RANGE + 8) target = sure;
      else if ((e.repath -= dt) <= 0) { e.repath = 1.2; e.work = null; setGoal(world, e, Math.floor(sure.x / TILE), Math.floor(sure.y / TILE), null); }
    }
  }
  if (target) claymoreStrike(world, e, target);
}
