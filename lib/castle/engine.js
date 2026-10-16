// Lights Out at Donaghy Castle - the game rules and the computer players.
//
// One world object holds everything. The page calls stepGame() every frame
// while the night is being played, humanAction() for one-shot key presses,
// and resolveVotes()/applyJoust() when the Great Bell has rung. There is no
// network code yet: this is the single-player test build, where every
// other seat is a computer player (NPC). The rules are written so the same
// world can later be shared between real players.
import {
  TILE, AREAS, ROOMS, STATIONS, CHORES, CELL_AREA, HALL_CENTRE, PORTCULLIS,
  areaAt, areaById, canWalkTile, hasLOS, findPath, randomTileIn, stationById, passageExit, W, H,
} from "./map";
import { TABARDS, randomLook, DEFAULT_LOOK } from "./looks";
import { castleSound as snd } from "./sound";

export const ROLES = {
  squire: {
    name: "Squire", side: "castle",
    blurb: "Do your chores, report anyone who goes missing, and vote out the Black Knight.",
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
    blurb: "You're secretly helping the Black Knight. You pop up all over the castle at random, and once a round you can swap places with anyone nearby (Q). Spread mischief at the meetings!",
    keys: [["Q", "Swap places"]],
  },
  blackknight: {
    name: "Black Knight", side: "dark",
    blurb: "Capture everyone without being caught. You have every power: locked doors, sabotage, and disguise. Pretend to do chores.",
    keys: [["Q", "Capture"], ["1", "Lights Out"], ["2", "Jam the portcullis"], ["3", "Disguise"]],
  },
};

const NPC_NAMES = [
  "Sir Hamish", "Lady Marjorie", "Brother Cuthbert", "Old Agnes", "Wee Rab", "Fergus",
  "Morag", "Ned the Ostler", "Lady Pemberton", "Tam o' the Glen", "Dame Winifred",
];
export const COLORS = [
  "#C0392B", "#2E5FB8", "#2E8B57", "#D4A017", "#8E44AD", "#D9772B",
  "#1F9E9E", "#D46A9F", "#E8E4D8", "#8B5A2B", "#6FB7E8", "#9ACD32",
];

export const GAME_SECONDS = 8 * 60;
const CHORES_EACH = 8;
const CAPTURE_CD = 28, FIRST_CAPTURE_CD = 18, TRUTH_CD = 45, SABOTAGE_CD = 45;
const DISGUISE_CD = 40, DISGUISE_TIME = 30, LIGHTS_TIME = 45, GATE_TIME = 60;
const CAPTURE_RANGE = 34, SPEED_HUMAN = 150, SPEED_GHOST = 165, SPEED_NPC = 112;
const CHORE_TIME = 3, FIX_FAST = 1.5, FIX_SLOW = 6, CELL_TIME = 2.5;

const rnd = Math.random;
const pick = (a) => a[Math.floor(rnd() * a.length)];
const shuffle = (a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const isDark = (e) => ROLES[e.role].side === "dark";
const roomName = (id) => areaById(id)?.name || "castle";
const isCorridor = (id) => areaById(id)?.floor === "corridor";

export function createGame({ playerName = "You", total = 8, humanRole = "random", playerLook = DEFAULT_LOOK }) {
  total = Math.max(8, Math.min(12, total | 0));
  let roles = ["blackknight", "knight", "locksmith", "blacksmith", "jester"];
  while (roles.length < total) roles.push("squire");
  let mine;
  if (humanRole && humanRole !== "random" && ROLES[humanRole]) {
    mine = humanRole;
    roles.splice(roles.indexOf(humanRole), 1);
  } else {
    roles = shuffle(roles);
    mine = roles.pop();
  }
  roles = shuffle(roles);
  const names = shuffle(NPC_NAMES);
  // computer players never wear the player's colour, so colours stay unique
  const colors = [playerLook.tabard, ...shuffle(TABARDS.filter((c) => c !== playerLook.tabard))];
  const all = [mine, ...roles];
  const entities = all.map((role, id) => ({
    id, role, human: id === 0,
    name: id === 0 ? playerName : names[id - 1],
    color: colors[id],
    look: id === 0 ? { ...playerLook } : randomLook(colors[id]),
    walk: 0,
    alive: true, ghost: false, out: false,
    x: 0, y: 0, facing: Math.PI / 2,
    path: [], work: null, goal: null, repath: 0,
    chores: shuffle(CHORES).slice(0, CHORES_EACH).map((s) => s.id),
    done: [],
    canUnlock: role === "locksmith" || role === "blackknight",
    roomLog: [], seen: [],
    cd: { capture: FIRST_CAPTURE_CD, truth: 40, sabotage: 30, disguise: 20, hop: 30 + rnd() * 20 },
    swapUsed: false, bellUsed: false,
    trust: 0.45 + rnd() * 0.75, // how much a computer player believes what others say
    disguiseAs: null, disguiseUntil: 0,
    truth: {}, witnessed: null, reportAt: null, hunt: null,
    stats: { chores: 0, reports: 0, captures: 0, truthCatch: 0, rightVotes: 0 },
  }));
  const world = {
    t: 0, entities, phase: "play", round: 1,
    markers: [], caseNotes: [], toasts: [],
    lightsOut: false, lightsUntil: 0, lightsFixer: null,
    portcullisJammed: false, gateUntil: 0, gateFixer: null,
    freeUsed: false, lastCaptureT: -99, sightTick: 0,
    humanWork: null, reveal: null, meeting: null, result: null, lastJoust: null,
    nextMarker: 1,
  };
  gatherInHall(world);
  return world;
}

// ---------- small helpers ----------
export const apparentId = (e) => (e.disguiseAs !== null ? e.disguiseAs : e.id);
export const look = (world, e) => world.entities[apparentId(e)];
export const human = (world) => world.entities[0];
const toast = (world, text, tone = "info") => world.toasts.push({ text, tone, at: world.t });
function sightRange(world, observer) {
  if (world.lightsOut && observer.role !== "blacksmith" && observer.role !== "blackknight") return 2.5 * TILE;
  return 7 * TILE;
}
const canSee = (world, o, e, range = sightRange(world, o)) => dist(o, e) <= range && hasLOS(o.x, o.y, e.x, e.y);
const castleChoreStats = (world) => {
  let need = 0, done = 0;
  for (const e of world.entities) if (!isDark(e)) { need += e.chores.length; done += e.done.length; }
  return { need, done, frac: need ? done / need : 0 };
};

function gatherInHall(world) {
  world.gatherT = world.t;
  const alive = world.entities.filter((e) => e.alive);
  alive.forEach((e, i) => {
    const a = (i / alive.length) * Math.PI * 2;
    e.x = HALL_CENTRE.x + Math.cos(a) * TILE * 3.2;
    e.y = HALL_CENTRE.y + Math.sin(a) * TILE * 2.6;
    e.facing = a + Math.PI;
    e.path = []; e.work = null; e.goal = null; e.hunt = null;
  });
  world.humanWork = null;
}

function placeInCell(e) {
  e.x = (CELL_AREA.tx + rnd() * CELL_AREA.w) * TILE;
  e.y = (CELL_AREA.ty + rnd() * CELL_AREA.h) * TILE;
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

// ---------- the frame ----------
export function stepGame(world, input, dt) {
  if (world.phase !== "play") return;
  dt = Math.min(dt, 0.05);
  world.t += dt;
  const me = human(world);

  // human movement
  let mx = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  let my = (input.down ? 1 : 0) - (input.up ? 1 : 0);
  me.moving = false;
  if (mx || my) {
    const len = Math.hypot(mx, my);
    const sp = (me.alive ? SPEED_HUMAN : SPEED_GHOST) * dt;
    moveCircle(world, me, (mx / len) * sp, (my / len) * sp);
    me.walk += sp * 0.12;
    me.moving = true;
    const target = Math.atan2(my, mx);
    let d = target - me.facing;
    while (d > Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    me.facing += d * Math.min(1, dt * 12);
  }

  // human holding E at a station
  humanWorkTick(world, input.use, dt);

  for (const e of world.entities) {
    if (world.phase !== "play") break;
    for (const k in e.cd) e.cd[k] = Math.max(0, e.cd[k] - dt);
    if (e.disguiseAs !== null && world.t > e.disguiseUntil) {
      e.disguiseAs = null;
      if (e.human) toast(world, "Your disguise wears off.");
    }
    logRoom(world, e);
    if (!e.human) npcThink(world, e, dt);
    if (e.role === "jester" && e.alive && e.cd.hop <= 0) jesterHop(world, e);
  }

  // sabotage timing out on its own
  if (world.lightsOut && world.t > world.lightsUntil) restoreLights(world, null);
  if (world.portcullisJammed && world.t > world.gateUntil) freeGate(world, null);
  if (world.reveal && world.t > world.reveal.until) world.reveal = null;

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
  world.toasts = world.toasts.filter((x) => world.t - x.at < 6);
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

// ---------- what the human can do here ----------
// The station (or prompt) the human is standing at, if any.
export function humanContext(world) {
  const me = human(world);
  const ctx = { station: null, label: null, need: 0, marker: null, bell: false, fake: false, power: null };
  for (const s of STATIONS) {
    const sx = s.tx * TILE + TILE / 2, sy = s.ty * TILE + TILE / 2;
    if (Math.hypot(me.x - sx, me.y - sy) > TILE * (s.kind === "passage" ? 0.9 : 1.3)) continue;
    if (s.kind === "passage") {
      ctx.station = s; ctx.label = s.label; ctx.need = 0.6;
    } else if (s.kind === "chore" && me.chores.includes(s.id) && !me.done.includes(s.id)) {
      ctx.station = s; ctx.label = s.label; ctx.need = CHORE_TIME; ctx.fake = isDark(me);
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
  if (me.alive) ctx.marker = world.markers.find((m) => Math.hypot(me.x - m.x, me.y - m.y) < TILE * 2.5) || null;
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
function swapTarget(world, me) {
  return world.entities.filter((e) => e.alive && e !== me && dist(e, me) < 8 * TILE).sort((a, b) => dist(a, me) - dist(b, me))[0] || null;
}

// the nearest thing the human ought to be doing: a sabotage to fix, else a chore
export function nextJob(world) {
  const me = human(world);
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

function humanWorkTick(world, holding, dt) {
  const me = human(world);
  const ctx = humanContext(world);
  if (!holding || !ctx.station) { world.humanWork = null; return; }
  if (!world.humanWork || world.humanWork.sid !== ctx.station.id) world.humanWork = { sid: ctx.station.id, p: 0, need: ctx.need };
  world.humanWork.p += dt;
  if (world.humanWork.p >= ctx.need) {
    completeStation(world, me, ctx.station);
    world.humanWork = null;
  }
}

function completeStation(world, e, s) {
  if (s.kind === "chore") {
    if (!e.done.includes(s.id)) {
      e.done.push(s.id);
      if (!isDark(e)) e.stats.chores++;
    }
    if (e.human) { snd.chore(); toast(world, `${s.label}: done.`, "good"); }
  } else if (s.kind === "fixLights") restoreLights(world, e);
  else if (s.kind === "fixGate") freeGate(world, e);
  else if (s.kind === "cell") freePrisoner(world, e);
  else if (s.kind === "passage") {
    const [tx, ty] = passageExit(s.tx, s.ty);
    e.x = tx * TILE + TILE / 2; e.y = ty * TILE + TILE / 2;
    if (e.human) { snd.whoosh(); toast(world, `You crawl through the secret passage and climb out in the ${areaAt(e.x, e.y).name}.`); }
  }
}

export function humanAction(world, action) {
  if (world.phase !== "play") return;
  const me = human(world);
  const ctx = humanContext(world);
  if (action === "report") {
    if (ctx.marker) { me.stats.reports++; startMeeting(world, "report", me.id); }
    return;
  }
  if (action === "bell") {
    if (ctx.bell) { me.bellUsed = true; startMeeting(world, "bell", me.id); }
    else if (me.alive && me.bellUsed) toast(world, "You've already rung the Great Bell tonight.");
    return;
  }
  if (!me.alive) return;
  if (action === "truth" && me.role === "knight") {
    if (me.cd.truth > 0) return toast(world, `Torch of Truth recharging (${Math.ceil(me.cd.truth)}s).`);
    const t = aimedTarget(world, me, 5 * TILE);
    if (!t) return toast(world, "Shine the Torch of Truth at someone close in front of you.");
    me.cd.truth = TRUTH_CD;
    snd.truth();
    const verdict = t.role === "blackknight" ? "bk" : t.role === "jester" ? "jester" : "innocent";
    me.truth[t.id] = verdict;
    world.reveal = { id: t.id, verdict, until: world.t + 3.5 };
    if (verdict === "bk") { me.stats.truthCatch++; toast(world, `The Torch of Truth blazes red: ${t.name} is the BLACK KNIGHT!`, "bad"); }
    else if (verdict === "jester") toast(world, `The torch shows a cap and bells: ${t.name} is the Jester, the Black Knight's helper!`, "bad");
    else toast(world, `${t.name} is innocent.`, "good");
    return;
  }
  if (action === "power" && me.role === "blackknight") {
    if (me.cd.capture > 0) return toast(world, `You can capture again in ${Math.ceil(me.cd.capture)}s.`);
    const v = captureTarget(world, me);
    if (!v) return toast(world, "Get right up close to someone (nearly touching) to capture them.");
    capture(world, me, v);
    return;
  }
  if (action === "power" && me.role === "jester") {
    if (me.swapUsed) return toast(world, "You've used your swap this round.");
    const v = swapTarget(world, me);
    if (!v) return toast(world, "Nobody near enough to swap with.");
    [me.x, me.y, v.x, v.y] = [v.x, v.y, me.x, me.y];
    v.path = []; v.work = null; v.hunt = null;
    me.swapUsed = true;
    snd.honk();
    toast(world, `Honk! You swapped places with ${v.name}.`);
    return;
  }
  if ((action === "sab1" || action === "sab2") && me.role === "blackknight") {
    if (me.cd.sabotage > 0) return toast(world, `Sabotage ready in ${Math.ceil(me.cd.sabotage)}s.`);
    if (action === "sab1") lightsOut(world, me); else jamGate(world, me);
    return;
  }
  if (action === "disguise" && me.role === "blackknight") {
    if (me.cd.disguise > 0) return toast(world, `Disguise ready in ${Math.ceil(me.cd.disguise)}s.`);
    const others = world.entities.filter((e) => e.alive && e !== me && e.role !== "jester");
    if (!others.length) return;
    const near = others.filter((e) => dist(e, me) < 6 * TILE).sort((a, b) => dist(a, me) - dist(b, me));
    disguise(world, me, near[0] || pick(others));
  }
}

function aimedTarget(world, me, range) {
  let best = null, bestD = Infinity;
  for (const e of world.entities) {
    if (e === me || !e.alive) continue;
    const d = dist(e, me);
    if (d > range || !hasLOS(me.x, me.y, e.x, e.y)) continue;
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
  const me = human(world);
  const room = areaAt(v.x, v.y)?.id || "hall";
  const marker = {
    id: world.nextMarker++, x: v.x, y: v.y, victimId: v.id, room,
    trace: traceRoom(bk, room), t: world.t, by: bk.id, apparent: apparentId(bk),
  };
  world.markers.push(marker);
  // who saw it happen (they see whoever the Black Knight is dressed as)
  for (const o of world.entities) {
    if (!o.alive || o === bk || o === v) continue;
    if (!canSee(world, o, bk)) continue;
    if (o.human) {
      toast(world, `You saw ${look(world, bk).name} drag ${v.name} into the dark!`, "bad");
      o.witnessed = { apparent: apparentId(bk), victimId: v.id, room };
    } else if (!isDark(o)) {
      o.witnessed = { apparent: apparentId(bk), victimId: v.id, room };
      o.reportAt = world.t + 1.2;
    }
  }
  v.alive = false; v.ghost = true;
  placeInCell(v);
  bk.cd.capture = CAPTURE_CD;
  bk.stats.captures++;
  bk.hunt = null;
  world.lastCaptureT = world.t;
  if (v.human) {
    snd.capture();
    toast(world, `${look(world, bk).name} captured you! You're a ghost now: keep doing chores to help the castle.`, "bad");
  } else if (bk.human) {
    snd.capture();
    toast(world, `You captured ${v.name}. Get away before someone finds the helmet!`, "bad");
  } else if (dist(me, v) < 9 * TILE) snd.capture();
}

function traceRoom(bk, room) {
  for (let i = bk.roomLog.length - 1; i >= 0; i--) if (bk.roomLog[i].room !== room) return bk.roomLog[i].room;
  return "upper";
}

function lightsOut(world, by) {
  world.lightsOut = true;
  world.lightsUntil = world.t + LIGHTS_TIME;
  by.cd.sabotage = SABOTAGE_CD;
  world.lightsFixer = pickFixer(world, "fixLights");
  snd.lightsOut();
  toast(world, human(world).role === "blacksmith"
    ? "LIGHTS OUT! Every torch but yours has gone dark. Relight them at the Forge."
    : "LIGHTS OUT! The torches gutter and die. Someone relight them at the Forge!", "bad");
}
function restoreLights(world, by) {
  if (!world.lightsOut) return;
  world.lightsOut = false;
  world.lightsFixer = null;
  snd.fixed();
  toast(world, by ? `${by.human ? "You" : by.name} relit the torches.` : "The torches flicker back to life.", "good");
}
function jamGate(world, by) {
  world.portcullisJammed = true;
  world.gateUntil = world.t + GATE_TIME;
  by.cd.sabotage = SABOTAGE_CD;
  world.gateFixer = pickFixer(world, "fixGate");
  // nobody gets stuck under the bars: nudge them into the courtyard
  for (const e of world.entities) {
    if (Math.floor(e.x / TILE) === PORTCULLIS[0] && Math.floor(e.y / TILE) === PORTCULLIS[1]) e.x -= TILE;
    e.path = e.human ? e.path : [];
  }
  snd.gateSlam();
  toast(world, "CRASH! The portcullis has slammed shut and jammed. Free it from the Gatehouse.", "bad");
}
function freeGate(world, by) {
  if (!world.portcullisJammed) return;
  world.portcullisJammed = false;
  world.gateFixer = null;
  snd.fixed();
  toast(world, by ? `${by.human ? "You" : by.name} freed the portcullis.` : "The portcullis creaks free.", "good");
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
  p.x = 7 * TILE + TILE / 2; p.y = 35 * TILE + TILE / 2;
  snd.fixed();
  toast(world, p.human ? `${by.name} unlocked the cell. You're free!` : `${by.human ? "You" : by.name} freed ${p.name} from the dungeon!`, "good");
}
function disguise(world, bk, as) {
  bk.disguiseAs = as.id;
  bk.disguiseUntil = world.t + DISGUISE_TIME;
  bk.cd.disguise = DISGUISE_CD;
  if (bk.human) { snd.disguise(); toast(world, `You now look exactly like ${as.name} for ${DISGUISE_TIME} seconds.`); }
}
function jesterHop(world, e) {
  const rooms = ROOMS.filter((r) => r.id !== "dungeon");
  const r = pick(rooms);
  const { tx, ty } = randomTileIn(r);
  e.x = tx * TILE + TILE / 2; e.y = ty * TILE + TILE / 2;
  e.path = []; e.work = null; e.goal = null;
  e.cd.hop = 40 + rnd() * 20;
  const me = human(world);
  if (e.human) { snd.whoosh(); toast(world, `Whoosh! You pop out of a suit of armour in the ${r.name}.`); }
  else if (me.alive && canSee(world, me, e, 10 * TILE)) snd.honk();
}

// ---------- computer players ----------
function npcThink(world, e, dt) {
  if (world.phase !== "play") return;
  if (e.alive && e.role === "blackknight") bkThink(world, e, dt);
  if (e.alive && e.role === "knight" && e.cd.truth <= 0) knightLook(world, e);
  if (world.phase !== "play") return;

  // finding a dropped helmet
  if (e.alive && e.role !== "jester" && (e.role !== "blackknight" || rnd() < 0.002)) {
    const m = world.markers.find((m) => Math.hypot(e.x - m.x, e.y - m.y) < 5 * TILE && hasLOS(e.x, e.y, m.x, m.y));
    if (m && (e.role !== "blackknight" || m.by !== e.id || rnd() < 0.5)) {
      e.stats.reports++;
      startMeeting(world, "report", e.id);
      return;
    }
  }

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
  if (!e.path.length) return;
  const n = e.path[0];
  const nt = { tx: Math.floor(n.x / TILE), ty: Math.floor(n.y / TILE) };
  if (e.alive && !canWalkTile(nt.tx, nt.ty, e, world)) { e.path = []; e.goal = null; return; }
  const dx = n.x - e.x, dy = n.y - e.y;
  const d = Math.hypot(dx, dy);
  // through a secret passage: out the other end
  if (e.alive && d > TILE * 2 && passageExit(Math.floor(e.x / TILE), Math.floor(e.y / TILE))) {
    e.x = n.x; e.y = n.y; e.path.shift(); return;
  }
  e.walk += speed * dt * 0.12;
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
  if (bk.cd.disguise <= 0 && bk.disguiseAs === null && rnd() < dt * 0.12) {
    const as = pick(victims(world, bk));
    if (as) disguise(world, bk, as);
  }
  if (bk.cd.capture > 0) { bk.hunt = null; return; }

  bk.repath -= dt;
  if (bk.hunt !== null) {
    const v = world.entities[bk.hunt];
    if (!v || !v.alive) { bk.hunt = null; return; }
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
    .filter((v) => dist(v, bk) < reach && hasLOS(bk.x, bk.y, v.x, v.y))
    .sort((a, b) => dist(a, bk) - dist(b, bk))[0];
  if (t && !witnessed(world, bk, t)) { bk.hunt = t.id; bk.work = null; }
}

// ---------- the Great Bell: meetings ----------
function startMeeting(world, kind, byId) {
  if (world.phase !== "play") return;
  world.phase = "meeting";
  world.humanWork = null;
  snd.bell();
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
  const whom = (id) => (id === 0 ? "you" : name(id));
  const whose = (id) => (id === 0 ? "your" : `${name(id)}'s`);
  const markers = world.markers.slice();
  const lines = [];
  const accuse = []; // {by, target, w}
  const evidence = markers.map((m) => {
    const room = areaById(m.room), tr = areaById(m.trace);
    return {
      victim: name(m.victimId), room: room.name, traceRoom: tr.name,
      text: `${tr.trace}: whoever took ${whom(m.victimId)} had come from the ${tr.name}.`,
    };
  });
  world.caseNotes.push(...evidence.map((x) => ({ ...x, round: world.round })));

  if (kind === "report") {
    const m = markers[0];
    lines.push({ who: null, text: `${by.human ? "You" : by.name} found ${m ? whose(m.victimId) + " dropped helmet in the " + roomName(m.room) : "something"}!` });
  } else {
    lines.push({ who: null, text: `${by.human ? "You" : by.name} rang the Great Bell!` });
    if (!markers.length) lines.push({ who: null, text: "No one has been taken... yet." });
  }
  if (markers.length > 1) lines.push({ who: null, text: `The guards found ${markers.length} dropped helmets in all.` });
  evidence.forEach((ev) => lines.push({ who: null, text: ev.text, evidence: true }));

  const focusRooms = new Set(markers.flatMap((m) => [m.room, m.trace]));
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
      lines.push({ who: e.id, text: `I SAW ${name(w.apparent).toUpperCase()} drag ${whom(w.victimId)} away in the ${roomName(w.room)}!` });
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
    lines.push({ who: e.id, text });
  }

  // the Black Knight's alibi
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

  // the Jester's mischief
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

  // what the human saw (their own notebook)
  const me = human(world);
  const notebook = [];
  for (const s of me.seen.slice().reverse()) {
    if (world.t - s.t > 120) continue;
    if (notebook.some((n) => n.id === s.id && n.room === s.room)) continue;
    notebook.push({ id: s.id, name: name(s.id), room: roomName(s.room), ago: Math.round(world.t - s.t) });
    if (notebook.length >= 8) break;
  }
  if (me.witnessed) notebook.unshift({ id: me.witnessed.apparent, name: name(me.witnessed.apparent), room: roomName(me.witnessed.room), ago: 0, saw: true });

  return { kind, by: byId, lines, accuse, evidence, notebook, focus: [...focusRooms], from, to };
}

// The human types into the meeting. Names they mention are taken as an
// accusation (or a defence, with words like "innocent"), and whoever was
// named answers back.
const TITLE_WORDS = new Set(["sir", "lady", "brother", "old", "wee", "dame", "the", "o'", "of"]);
export function sayInMeeting(world, text) {
  const m = world.meeting;
  const me = human(world);
  if (!m || !me.alive) return;
  const clean = String(text).trim().slice(0, 240);
  if (!clean) return;
  m.lines.push({ who: 0, text: clean, typed: true });
  const low = clean.toLowerCase();
  const named = world.entities.filter((e) => e.alive && !e.human && e.name.toLowerCase().split(/\s+/).some((w) => w.length > 2 && !TITLE_WORDS.has(w) && low.includes(w)));
  const defend = /\b(innocent|not|trust|didn't|didnt|never|wasn't|wasnt|clear)\b/.test(low);
  const roomsSaid = ROOMS.filter((r) => low.includes(r.name.toLowerCase()) || low.includes(r.id));
  if (!named.length) {
    const someone = pick(world.entities.filter((e) => e.alive && !e.human));
    if (someone) {
      const pool = roomsSaid.length
        ? [`The ${roomsSaid[0].name}? I wasn't anywhere near it.`, `Who else was in the ${roomsSaid[0].name}, then?`]
        : ["Aye, but who? Give us a name.", "Talk is cheap. Where's the proof?", "Hmm. Go on...", "Somebody here is lying, that's for certain."];
      m.lines.push({ who: someone.id, text: someone.role === "jester" ? "Honk! I mean... quite right, quite right." : pick(pool) });
    }
    return;
  }
  for (const e of named.slice(0, 2)) {
    m.accuse.push({ by: 0, target: e.id, w: defend ? -20 : 22 });
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

export function resolveVotes(world, humanVote) {
  const m = world.meeting;
  const me = human(world);
  const votes = [];
  if (me.alive) votes.push({ voter: 0, target: humanVote === undefined ? null : humanVote });
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
      if (humanVote !== undefined && humanVote !== null && humanVote === c.id && me.alive) s += 15;
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
  if (me.alive && humanVote !== null && humanVote !== undefined && world.entities[humanVote]?.role === "blackknight") me.stats.rightVotes++;
  m.votes = votes;
  m.counts = counts;
  m.skip = skip;
  m.accused = accused;
  return { votes, counts, skip, accused };
}

// after the joust (or a skipped vote): carry on, or the night is over
export function applyJoust(world, accusedId) {
  if (accusedId !== null && accusedId !== undefined) {
    const e = world.entities[accusedId];
    world.lastJoust = { id: accusedId, role: e.role };
    if (e.role === "blackknight") {
      e.alive = false; e.out = true;
      return endGame(world, "castle", "joust");
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
  world.round++;
  world.meeting = null;
  world.phase = "play";
  gatherInHall(world);
  checkWin(world);
}

function checkWin(world) {
  if (world.phase === "over") return;
  const bk = world.entities.find((e) => e.role === "blackknight");
  if (!bk || (!bk.alive && bk.out)) return endGame(world, "castle", "joust");
  const good = world.entities.filter((e) => e.alive && !isDark(e)).length;
  const dark = world.entities.filter((e) => e.alive && isDark(e)).length;
  if (good <= dark) return endGame(world, "dark", "overrun");
  if (castleChoreStats(world).frac >= 1) return endGame(world, "castle", "chores");
}

function endGame(world, winner, reason) {
  if (world.phase === "over") return;
  if (world.phase === "meeting" && reason !== "joust") return; // settle the vote first
  world.phase = "over";
  const me = human(world);
  const mine = ROLES[me.role].side;
  const won = (winner === "castle" && mine === "castle") || (winner === "dark" && mine === "dark");
  const pts = [];
  if (me.stats.chores) pts.push([`Chores done (${me.stats.chores})`, me.stats.chores * 10]);
  if (me.stats.reports) pts.push([`Helmets reported (${me.stats.reports})`, me.stats.reports * 10]);
  if (me.stats.rightVotes) pts.push([`Voted for the Black Knight (${me.stats.rightVotes})`, me.stats.rightVotes * 25]);
  if (me.stats.truthCatch) pts.push(["Caught the Black Knight with the Torch of Truth", 30]);
  if (me.stats.captures) pts.push([`Captures (${me.stats.captures})`, me.stats.captures * 10]);
  if (won) pts.push([mine === "castle" ? "The castle won" : "The darkness won", mine === "castle" ? 50 : 60]);
  world.result = { winner, reason, won, points: pts, total: pts.reduce((s, p) => s + p[1], 0) };
  if (won) snd.fanfare(); else snd.doom();
}

export function hudInfo(world) {
  const me = human(world);
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
    ctx: humanContext(world),
    work: world.humanWork,
    toasts: world.toasts.slice(-4),
    ally: isDark(me) ? world.entities.filter((e) => isDark(e) && e !== me).map((e) => ({ name: e.name, role: ROLES[e.role].name })) : [],
    alive: world.entities.filter((e) => e.alive).length,
    total: world.entities.length,
    freeUsed: world.freeUsed,
    prisoners: prisoners(world).length,
    job: nextJob(world),
    // 0..1, drives the music: later, after a capture, in the dark, fewer free
    tension: Math.min(1, (world.t / GAME_SECONDS) * 0.55
      + (world.t - world.lastCaptureT < 25 ? 0.3 : 0)
      + (world.lightsOut ? 0.25 : 0)
      + (1 - world.entities.filter((e) => e.alive).length / world.entities.length) * 0.4),
  };
}
