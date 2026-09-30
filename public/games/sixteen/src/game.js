// The simulation: arms, faults, disagreement, trust, currents, tides and
// the Great Rupture. No drawing here - render.js reads this state.

import {
  CENTER, ARMS, SPECIALTIES, PERSONALITIES, LIGHT, TIDE, FAULTS, CURRENT, DISSENT, SCORE,
} from "./config.js";
import { buildCity, sitePos, siteKey } from "./world.js";
import {
  ARM_NAMES, DISSENT_LINES, DISSENT_RIGHT, DISSENT_WRONG, IGNORED_RIGHT, AUTONOMY_LINES,
  SENSE_LINES, LEVEL_LINES, MATURE_LINES, RUPTURE, TIDE_OPENERS,
} from "./lore.js";

const pickFrom = (rng, arr) => arr[Math.floor(rng() * arr.length)];
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const SPEC_KEYS = Object.keys(SPECIALTIES);

export function createGame(seed, hooks = {}) {
  let s = seed >>> 0;
  const rng = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const emit = (type, data) => hooks.onEvent && hooks.onEvent(type, data);

  const city = buildCity();

  // --- arms: sixteen minds, eight awake to start ---
  // a balanced set of specialties, shuffled
  const specs = [];
  for (let i = 0; i < ARMS.total; i++) specs.push(SPEC_KEYS[i % SPEC_KEYS.length]);
  for (let i = specs.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [specs[i], specs[j]] = [specs[j], specs[i]]; }
  // the limbs that start awake are spread evenly around the body (every
  // other one); make sure they include a grip, a sense and an anchor
  const awakeIdx = Array.from({ length: ARMS.total }, (_, i) => i).filter((i) => i % 2 === 0).slice(0, ARMS.startMature);
  ["grip", "sense", "anchor"].forEach((need, k) => {
    if (!awakeIdx.some((i) => specs[i] === need)) {
      const j = specs.findIndex((sp, i) => sp === need && !awakeIdx.includes(i));
      [specs[awakeIdx[k]], specs[j]] = [specs[j], specs[awakeIdx[k]]];
    }
  });

  const arms = Array.from({ length: ARMS.total }, (_, i) => {
    const angle = (i / ARMS.total) * Math.PI * 2 - Math.PI / 2;
    const root = { x: CENTER.x + Math.cos(angle) * 32, y: CENTER.y + Math.sin(angle) * 26 };
    const rest = { x: CENTER.x + Math.cos(angle) * 78, y: CENTER.y + Math.sin(angle) * 62 };
    return {
      id: i,
      name: ARM_NAMES[i],
      mature: awakeIdx.includes(i),
      specialty: specs[i],
      personality: pickFrom(rng, PERSONALITIES),
      level: 1,
      xp: 0,
      trust: 1,
      angle,
      root,
      rest,
      tip: { ...rest },
      state: "idle", // idle | travel | fetch | carry | work | anchor | dissent | wander | return
      task: null, // fault id
      reluctant: 0,
      sulk: 0,
      carrying: false,
      wanderTo: null,
      phase: rng() * 6,
    };
  });

  const g = {
    seed,
    city,
    arms,
    faults: [],
    nextFaultId: 1,
    light: LIGHT.max,
    score: 0,
    mult: 1,
    comboTimer: 0,
    tide: 1,
    tideTime: 0,
    phase: "play", // play | rupture | between | over
    spawnTimer: 2,
    currentTimer: 0,
    current: null, // { angle, need, warn, active, anchored }
    dissent: null, // { armId, target, right, window, fromFault }
    rupture: null,
    messages: [],
    selectedArm: null,
    stats: { repairs: 0, listened: 0, listenedRight: 0, ignoredRight: 0, autonomous: 0, currentsHeld: 0, ruptures: 0, peakMult: 1, time: 0 },
    mods: { chorus: 0, scars: 0, listener: 0, chamber: 0, glow: 0, swift: 0, wander: 0, steady: 0, song: 0 },
    shake: 0,
    flash: 0,
    rng,
  };

  const say = (text, kind = "info") => {
    g.messages.push({ text, kind, life: kind === "big" ? 5 : 3.6 });
    if (g.messages.length > 4) g.messages.shift();
    emit("message", { text, kind });
  };

  // --- helpers ---
  g.maturedCount = () => arms.filter((a) => a.mature).length;
  const tipSpeed = (a) => ARMS.tipSpeed * (1 + g.mods.swift * 0.22) * (a.state === "fetch" || a.state === "carry" ? 1 + g.mods.chamber * 0.6 : 1);
  const workRate = (a) => {
    let r = ARMS.baseWork;
    if (a.specialty === "grip") r *= 1 + 0.3 * a.level;
    if (a.reluctant > 0) r *= 0.75;
    if (a.personality === "patient") r *= 0.9;
    return r;
  };
  const anchorPower = (a) => (a.specialty === "anchor" ? 2 + (a.level - 1) * 0.5 : 1);
  const faultById = (id) => g.faults.find((f) => f.id === id);
  const freeArms = () => arms.filter((a) => a.mature && (a.state === "idle" || a.state === "return" || a.state === "wander"));

  g.matureArm = (id) => {
    const a = arms[id];
    a.mature = true;
    a.tip = { ...a.root };
    say(pickFrom(rng, MATURE_LINES)(a.name));
    emit("mature", { arm: a });
  };
  g.levelArm = (id) => {
    const a = arms[id];
    if (a.level >= 5) return;
    a.level += 1;
    say(pickFrom(rng, LEVEL_LINES)(a.name, SPECIALTIES[a.specialty].label.toLowerCase()));
  };

  // --- faults ---
  // after tide six, the deep keeps pressing harder
  const pressure = () => Math.max(0, g.tide - 6);
  const occupied = () => new Set(g.faults.map((f) => siteKey(f.site)));
  function spawnFault(type) {
    const busy = occupied();
    let site = null;
    for (let tries = 0; tries < 30 && !site; tries++) {
      let cand;
      if (type === "breach") cand = { type: "link", id: Math.floor(rng() * city.links.length) };
      else if (type === "call") cand = { type: "node", id: pickFrom(rng, city.outer).id };
      else if (type === "hidden") cand = rng() < 0.5 ? { type: "link", id: Math.floor(rng() * city.links.length) } : { type: "node", id: pickFrom(rng, city.towers).id };
      else cand = { type: "node", id: pickFrom(rng, city.towers).id };
      if (!busy.has(siteKey(cand))) site = cand;
    }
    if (!site) return null;
    const def = FAULTS[type];
    const pos = sitePos(city, site);
    const f = {
      id: g.nextFaultId++,
      type,
      site,
      x: pos.x,
      y: pos.y,
      age: 0,
      work: def.work * (1 + 0.05 * pressure()),
      need: type === "overload" && g.tide >= 8 && rng() < 0.3 ? 3 : def.arms,
      progress: 0,
      escalated: false,
      revealed: type !== "hidden",
      burstAt: type === "hidden" ? def.burstAfter[0] + rng() * (def.burstAfter[1] - def.burstAfter[0]) : null,
      burst: false,
      partDelivered: !def.needsPart,
      assigned: new Set(),
      pulse: 0,
    };
    g.faults.push(f);
    if (f.revealed) emit("fault", { fault: f });
    return f;
  }

  function faultDrain(f) {
    if (f.type === "call" || (f.type === "hidden" && !f.burst)) return 0;
    const def = FAULTS[f.type];
    return (f.escalated || f.burst ? def.escalatedDrain : def.drain) * (1 + 0.07 * pressure());
  }

  function releaseFault(f) {
    f.assigned.forEach((id) => {
      const a = arms[id];
      if (a.task === f.id) { a.task = null; a.carrying = false; a.state = "return"; }
    });
    f.assigned.clear();
  }

  function completeFault(f) {
    g.faults = g.faults.filter((x) => x !== f);
    const helpers = [...f.assigned].map((id) => arms[id]);
    releaseFault(f);
    if (f.type === "call") {
      const bonus = 1 + g.mods.song;
      g.light = Math.min(LIGHT.max, g.light + 7 * bonus);
      g.score += 150 * bonus * g.mult;
      say("A neighbor answers your signal. Their light joins yours.", "good");
      emit("call", {});
    } else {
      g.stats.repairs += 1;
      g.comboTimer = SCORE.comboWindow;
      g.mult = Math.min(SCORE.maxMult, g.mult + 0.25);
      g.stats.peakMult = Math.max(g.stats.peakMult, g.mult);
      g.score += Math.round(SCORE.repair * g.mult * (f.escalated ? 0.7 : 1) * (f.type === "overload" ? 1.4 : 1));
      emit("repair", { fault: f });
    }
    // what a limb does, it gets better at
    helpers.forEach((a) => {
      const used = f.type === "call" ? "signal" : f.type === "hidden" ? "sense" : "grip";
      if (a.specialty === used) {
        a.xp += 1;
        if (a.xp >= 3 + a.level * 2) { a.xp = 0; g.levelArm(a.id); }
      }
    });
  }

  // --- assigning limbs ---
  function scoreArmFor(a, f) {
    let sc = -dist(a.tip, f) / 100;
    if (f.type === "call" && a.specialty === "signal") sc += 4;
    if (f.type === "hidden" && a.specialty === "sense") sc += 3;
    if (f.type !== "call" && a.specialty === "grip") sc += 2.5;
    if (a.specialty === "anchor" && g.current && !g.current.active) sc -= 3; // keep anchors home when a current is coming
    return sc;
  }

  function sendArm(a, f, { reluctant = false } = {}) {
    a.task = f.id;
    a.state = !f.partDelivered && !f.fetcher ? "fetch" : "travel";
    if (a.state === "fetch") f.fetcher = a.id;
    a.reluctant = reluctant ? 6 : 0;
    a.wanderTo = null;
    f.assigned.add(a.id);
    emit("send", { arm: a, fault: f });
  }

  // Player action: send a limb to a fault (best free one, or the selected one).
  g.assign = (faultId) => {
    const f = faultById(faultId);
    if (!f || !f.revealed || g.phase === "over" || g.phase === "between") return;
    if (f.assigned.size >= Math.max(f.need + 2, 3)) return;
    let a = g.selectedArm !== null ? arms[g.selectedArm] : null;
    if (a && !(a.mature && a.state !== "anchor" && a.state !== "dissent")) a = null;
    if (a && a.task !== null) {
      const old = faultById(a.task);
      if (old) { old.assigned.delete(a.id); if (old.fetcher === a.id) old.fetcher = null; }
    }
    if (!a) {
      const free = freeArms().filter((x) => !(g.dissent && g.dissent.armId === x.id));
      if (!free.length) { say("Every limb is busy.", "warn"); emit("busy", {}); return; }
      free.sort((x, y) => scoreArmFor(y, f) - scoreArmFor(x, f));
      a = free[0];
    }
    g.selectedArm = null;
    if (maybeDissent(a, f)) return;
    sendArm(a, f);
  };

  g.recall = (armId) => {
    const a = arms[armId];
    if (!a || !a.mature) return;
    const f = a.task !== null ? faultById(a.task) : null;
    if (f) { f.assigned.delete(a.id); if (f.fetcher === a.id) f.fetcher = null; }
    a.task = null;
    a.carrying = false;
    a.state = "return";
  };

  g.selectArm = (armId) => {
    const a = arms[armId];
    if (!a || !a.mature) return;
    g.selectedArm = g.selectedArm === armId ? null : armId;
  };

  // Player action: commit one more limb to anchoring against a current.
  g.addAnchor = () => {
    if (!g.current || g.phase === "between" || g.phase === "over") return;
    const free = freeArms();
    if (!free.length) {
      // pull the least-committed working limb home to anchor
      const working = arms.filter((a) => a.mature && (a.state === "travel" || a.state === "work"));
      if (!working.length) { say("No limb is free to anchor.", "warn"); return; }
      working.sort((x, y) => anchorPower(y) - anchorPower(x));
      g.recall(working[0].id);
      working[0].state = "anchor";
      emit("anchor", {});
      return;
    }
    free.sort((x, y) => anchorPower(y) - anchorPower(x));
    free[0].state = "anchor";
    free[0].task = null;
    emit("anchor", {});
  };
  g.anchorStrength = () => arms.filter((a) => a.state === "anchor").reduce((sum, a) => sum + anchorPower(a), 0);

  // --- disagreement ---
  function maybeDissent(a, f) {
    if (g.tide < DISSENT.firstTide || g.dissent || g.phase === "rupture") return false;
    if (a.personality === "steady") return false;
    const chance = a.personality === "stubborn" ? DISSENT.stubbornChance : DISSENT.chance;
    if (rng() > chance) return false;
    const accuracy = a.specialty === "sense" ? DISSENT.rightChanceSense : DISSENT.rightChanceBase;
    const hidden = g.faults.filter((x) => !x.revealed && x !== f);
    const urgent = g.faults.filter((x) => x.revealed && x !== f && x.assigned.size === 0 && x.type !== "call").sort((x, y) => (y.escalated - x.escalated) || y.age - x.age);
    let target = null, right = false;
    if (rng() < accuracy && (hidden.length || urgent.length)) {
      target = hidden.length ? pickFrom(rng, hidden) : urgent[0];
      right = true;
    } else {
      // a false alarm: a quiet tower
      const quiet = city.towers.filter((t) => !g.faults.some((x) => x.site.type === "node" && x.site.id === t.id));
      const t = quiet.length ? pickFrom(rng, quiet) : city.towers[0];
      target = { ghost: true, x: t.x, y: t.y };
    }
    const where = target.x < CENTER.x - 60 ? "the west" : target.x > CENTER.x + 60 ? "the east" : target.y < CENTER.y ? "the north" : "the south";
    g.dissent = { armId: a.id, target, right, fromFault: f.id, window: DISSENT.window + g.mods.listener * 2.4, max: DISSENT.window + g.mods.listener * 2.4 };
    a.state = "dissent";
    say(pickFrom(rng, DISSENT_LINES)(a.name, where), "dissent");
    emit("dissent", { arm: a });
    return true;
  }

  // Player action: heed the limb that disagrees.
  g.listen = () => {
    const d = g.dissent;
    if (!d) return;
    const a = arms[d.armId];
    g.dissent = null;
    g.stats.listened += 1;
    if (d.target.ghost) {
      a.state = "wander";
      a.wanderTo = { x: d.target.x, y: d.target.y, ghost: true };
      a.task = null;
      return;
    }
    const f = d.target;
    if (!g.faults.includes(f)) { a.state = "return"; return; }
    if (!f.revealed) { f.revealed = true; emit("reveal", { fault: f }); }
    g.stats.listenedRight += 1;
    a.trust = Math.min(5, a.trust + 1 + (g.mods.listener > 0 ? 1 : 0) + (a.personality === "gentle" ? 1 : 0));
    g.light = Math.min(LIGHT.max, g.light + 3);
    g.score += 80 * g.mult;
    say(pickFrom(rng, DISSENT_RIGHT)(a.name), "good");
    sendArm(a, f);
    emit("listen", { right: true });
  };

  function dissentExpired() {
    const d = g.dissent;
    g.dissent = null;
    const a = arms[d.armId];
    const f = faultById(d.fromFault);
    if (d.right && d.target && !d.target.ghost) d.target.ignoredBy = a.id; // it'll remember if this bursts
    if (f) sendArm(a, f, { reluctant: a.personality !== "patient" });
    else a.state = "return";
  }

  // --- currents ---
  function scheduleCurrent() {
    g.currentTimer = CURRENT.every[0] + rng() * (CURRENT.every[1] - CURRENT.every[0]);
  }
  function startCurrent() {
    const need = Math.max(1, Math.min(10, 2 + Math.floor(g.tide / 2)) - g.mods.scars);
    g.current = { angle: rng() * Math.PI * 2, need, warn: CURRENT.warning, active: 0 };
    say(`A current is coming. Anchor ${need > 1 ? `with ${need}` : "one limb"} - tap your body.`, "warn");
    emit("currentWarn", { need });
  }
  function currentHits() {
    const held = g.anchorStrength() >= g.current.need;
    g.current.active = CURRENT.duration;
    g.current.held = held;
    if (held) {
      g.stats.currentsHeld += 1;
      g.score += 120 * g.mult;
      say("You held.", "good");
      emit("held", {});
    } else {
      g.light = Math.max(0, g.light - CURRENT.failPenalty);
      g.shake = 0.8;
      // the flood tears working limbs back to the body
      arms.forEach((a) => {
        if (a.task !== null) {
          const f = faultById(a.task);
          if (f) { f.progress *= 0.5; f.assigned.delete(a.id); if (f.fetcher === a.id) f.fetcher = null; }
          a.task = null; a.carrying = false; a.state = "return";
        }
      });
      say("Torn loose. The current scatters your work.", "bad");
      emit("torn", {});
    }
  }

  // --- the Great Rupture ---
  function startRupture() {
    g.phase = "rupture";
    const f = {
      id: g.nextFaultId++, type: "rupture", site: { type: "node", id: city.core.id }, x: CENTER.x, y: CENTER.y + 64,
      age: 0, work: 9, need: 6, progress: 0, escalated: false, revealed: true, partDelivered: true, assigned: new Set(), pulse: 0,
    };
    g.faults.push(f);
    g.rupture = { fault: f, stage: "working", dissentShown: false, listened: false, needAnchors: Math.max(1, 3 - g.mods.scars) };
    g.current = { angle: rng() * Math.PI * 2, need: g.rupture.needAnchors, warn: 0, active: 999, sustained: true };
    say(RUPTURE.open, "big");
    say(RUPTURE.need, "info");
    emit("ruptureStart", {});
  }

  function ruptureTick(dt) {
    const r = g.rupture;
    const f = r.fault;
    const present = [...f.assigned].filter((id) => arms[id].state === "work").length;
    const anchored = g.anchorStrength() >= r.needAnchors;
    if (present >= f.need && anchored) {
      const rate = r.listened ? 1.35 : 1;
      f.progress += dt * rate;
    }
    if (!r.dissentShown && f.progress > f.work * 0.42) {
      r.dissentShown = true;
      r.stage = "dissent";
      r.window = 7 + g.mods.listener * 2;
      say(RUPTURE.dissent, "dissent");
      emit("dissent", { rupture: true });
    }
    if (r.stage === "dissent") {
      r.window -= dt;
      if (r.window <= 0) r.stage = "ignored";
    }
    if (r.stage === "ignored" && f.progress > f.work * 0.72) {
      f.progress = f.work * 0.12;
      r.stage = "dissent";
      r.window = 7 + g.mods.listener * 2;
      r.retries = (r.retries || 0) + 1;
      g.shake = 0.6;
      say(RUPTURE.failed, "bad");
      emit("torn", {});
    }
    if (f.progress >= f.work) {
      g.faults = g.faults.filter((x) => x !== f);
      releaseFault(f);
      g.rupture = null;
      g.current = null;
      arms.forEach((a) => { if (a.state === "anchor") a.state = "return"; });
      g.stats.ruptures += 1;
      g.score += SCORE.rupture * g.mult;
      g.light = LIGHT.max;
      g.flash = 1;
      say(RUPTURE.done, "big");
      emit("ruptureDone", {});
      endTide();
    }
  }

  g.listenRupture = () => {
    const r = g.rupture;
    if (!r || (r.stage !== "dissent" && r.stage !== "ignored")) return false;
    r.listened = true;
    r.stage = "listened";
    g.stats.listened += 1;
    g.stats.listenedRight += 1;
    // the three who spoke up gain trust
    [...r.fault.assigned].slice(0, 3).forEach((id) => { arms[id].trust = Math.min(5, arms[id].trust + 2); });
    say(RUPTURE.listened, "good");
    emit("listen", { right: true });
    return true;
  };

  // --- tides ---
  function endTide() {
    g.phase = "between";
    g.score += SCORE.tideClear * g.tide;
    // loose ends are cleared between tides; limbs come home
    g.faults.forEach((f) => releaseFault(f));
    g.faults = [];
    g.current = null;
    g.dissent = null;
    arms.forEach((a) => { if (a.mature && a.state !== "idle") { a.state = "return"; a.task = null; a.carrying = false; } });
    emit("tideEnd", { tide: g.tide });
  }

  g.nextTide = () => {
    g.tide += 1;
    g.tideTime = 0;
    g.phase = "play";
    g.spawnTimer = 1.5;
    scheduleCurrent();
    say(`Tide ${g.tide}. ${pickFrom(rng, TIDE_OPENERS)}`, "big");
    emit("tideStart", { tide: g.tide });
  };

  function spawnInterval() {
    return Math.max(Math.max(0.55, TIDE.spawnMin - 0.025 * pressure()), TIDE.spawnStart * Math.pow(TIDE.spawnFactor, g.tide - 1)) * (0.75 + rng() * 0.5);
  }

  function chooseFaultType() {
    const t = g.tide;
    const table = [["breach", 5]];
    if (t >= 2) table.push(["overload", 2.2]);
    if (t >= 2) table.push(["hidden", 1.4 + t * 0.15]);
    if (t >= 3) table.push(["component", 2]);
    table.push(["call", 0.7 + g.mods.song * 0.8]);
    const total = table.reduce((sum, [, w]) => sum + w, 0);
    let r = rng() * total;
    for (const [type, w] of table) { if ((r -= w) <= 0) return type; }
    return "breach";
  }

  // --- the main tick ---
  g.update = (dt) => {
    if (g.phase === "over" || g.phase === "between") {
      moveArms(dt);
      return;
    }
    g.stats.time += dt;
    g.tideTime += dt;
    g.shake = Math.max(0, g.shake - dt);
    g.flash = Math.max(0, g.flash - dt * 0.6);
    g.messages.forEach((m) => { m.life -= dt; });
    g.messages = g.messages.filter((m) => m.life > 0);

    // combo decays
    g.comboTimer -= dt;
    if (g.comboTimer <= 0 && g.mult > 1) { g.mult = Math.max(1, g.mult - dt * 0.5); }

    if (g.phase === "play") {
      g.spawnTimer -= dt;
      // never more open faults than the tide allows - pressure, not an avalanche
      const openNow = g.faults.filter((f) => f.type !== "call").length;
      if (g.spawnTimer <= 0 && g.tideTime < TIDE.length - 3 && openNow < 5 + g.tide) {
        spawnFault(chooseFaultType());
        g.spawnTimer = spawnInterval();
      }
      if (g.tide >= CURRENT.firstTide) {
        if (!g.current) {
          g.currentTimer -= dt;
          if (g.currentTimer <= 0 && g.tideTime < TIDE.length - 8) startCurrent();
        } else if (g.current.warn > 0) {
          g.current.warn -= dt;
          if (g.current.warn <= 0) currentHits();
        } else {
          g.current.active -= dt;
          if (g.current.active <= 0) {
            g.current = null;
            arms.forEach((a) => { if (a.state === "anchor") a.state = "return"; });
            scheduleCurrent();
          }
        }
      }
      // the tide ends once every fault you can see is fixed (with a grace limit)
      const open = g.faults.filter((f) => f.revealed && f.type !== "call").length;
      if ((g.tideTime >= TIDE.length && open === 0) || g.tideTime >= TIDE.length + 12) {
        if (g.tide % TIDE.ruptureEvery === 0) startRupture();
        else endTide();
      }
    } else if (g.phase === "rupture") {
      ruptureTick(dt);
      // the rupture drains hard while it stays open
      g.light -= 3.2 * dt;
    }

    // faults age, escalate, burst
    for (const f of [...g.faults]) {
      if (f.type === "rupture") continue;
      f.age += dt;
      f.pulse += dt;
      const def = FAULTS[f.type];
      if (f.type === "call" && f.age > def.expire) { releaseFault(f); g.faults = g.faults.filter((x) => x !== f); continue; }
      if (f.type === "hidden" && !f.burst && f.age >= f.burstAt) {
        f.burst = true;
        f.revealed = true;
        g.light = Math.max(0, g.light - def.burstHit * (f.ignoredBy !== undefined ? 1.6 : 1));
        g.shake = 0.5;
        if (f.ignoredBy !== undefined) {
          const a = arms[f.ignoredBy];
          a.trust = Math.max(0, a.trust - 1);
          a.sulk = 8;
          g.stats.ignoredRight += 1;
          say(pickFrom(rng, IGNORED_RIGHT)(a.name), "bad");
        } else {
          say("Something burst beneath the city.", "bad");
        }
        emit("burst", { fault: f });
      }
      if (def.escalate && !f.escalated && f.age > def.escalate * (1 + g.mods.steady * 0.3) / (1 + 0.05 * pressure())) {
        f.escalated = true;
        emit("escalate", { fault: f });
      }
    }

    // light: regen minus every open fault's drain
    const drain = g.faults.reduce((sum, f) => sum + (f.type === "rupture" ? 0 : faultDrain(f)), 0);
    g.light += (LIGHT.regen + g.mods.glow * 0.7) * dt * (drain === 0 ? 1 : 0.5) - drain * dt;
    g.light = Math.min(LIGHT.max, g.light);
    g.score += SCORE.perSecond * (g.light / LIGHT.max) * g.mult * dt;

    // tower lighting follows the faults near them
    city.nodes.forEach((n) => { n.light = 1; });
    g.faults.forEach((f) => {
      if (!f.revealed && !f.burst) return;
      const k = f.escalated || f.burst ? 0.15 : 0.45;
      if (f.site.type === "node") city.nodes[f.site.id].light = Math.min(city.nodes[f.site.id].light, k);
      else { const l = city.links[f.site.id]; l.a.light = Math.min(l.a.light, 0.6); l.b.light = Math.min(l.b.light, k + 0.2); }
    });

    // a limb's disagreement window
    if (g.dissent) {
      g.dissent.window -= dt;
      if (g.dissent.window <= 0) dissentExpired();
    }

    senseAndAutonomy(dt);
    moveArms(dt);
    workFaults(dt);

    if (g.light <= 0) {
      g.light = 0;
      g.phase = "over";
      emit("over", {});
    }
  };

  // --- limbs acting for themselves ---
  let thinkTimer = 0;
  function senseAndAutonomy(dt) {
    thinkTimer -= dt;
    if (thinkTimer > 0) return;
    thinkTimer = 1;
    const hidden = g.faults.filter((f) => !f.revealed);
    arms.forEach((a) => {
      if (!a.mature) return;
      a.sulk = Math.max(0, a.sulk - 1);
      a.reluctant = Math.max(0, a.reluctant - 1);
      if (a.state !== "idle") return;
      // sense limbs (and wandering minds) feel hidden faults
      if (hidden.length) {
        const p = (a.specialty === "sense" ? 0.07 * a.level : 0.012) * (1 + g.mods.wander) * (a.personality === "curious" ? 1.6 : 1);
        if (rng() < p) {
          const f = pickFrom(rng, hidden);
          f.revealed = true;
          say(pickFrom(rng, SENSE_LINES)(a.name), "sense");
          emit("reveal", { fault: f });
          hidden.splice(hidden.indexOf(f), 1);
        }
      }
      // trusted limbs don't wait to be asked
      const threshold = a.personality === "restless" ? 2 : 3;
      if (a.trust >= threshold && a.sulk <= 0 && g.phase === "play") {
        const waiting = g.faults.filter((f) => f.revealed && f.type !== "call" && f.assigned.size < f.need && f.age > (a.personality === "restless" ? 2.5 : 4));
        if (waiting.length && rng() < 0.18 + a.trust * 0.06) {
          waiting.sort((x, y) => (y.escalated - x.escalated) || y.age - x.age);
          sendArm(a, waiting[0]);
          g.stats.autonomous += 1;
          say(pickFrom(rng, AUTONOMY_LINES)(a.name), "good");
          emit("autonomy", {});
        }
      }
    });
  }

  // --- limbs moving ---
  function moveArms(dt) {
    arms.forEach((a) => {
      if (!a.mature) return;
      let goal;
      const f = a.task !== null ? faultById(a.task) : null;
      if (a.task !== null && !f) { a.task = null; a.state = "return"; }
      switch (a.state) {
        case "fetch": {
          const ch = g.city.chambers.reduce((best, c) => (dist(c, a.tip) < dist(best, a.tip) ? c : best));
          goal = ch;
          if (dist(a.tip, ch) < 12) { a.carrying = true; a.state = "carry"; emit("part", {}); }
          break;
        }
        case "carry":
        case "travel":
          goal = f;
          if (f && dist(a.tip, f) < 10) {
            if (a.carrying) { f.partDelivered = true; a.carrying = false; }
            a.state = "work";
            emit("arrive", {});
          }
          break;
        case "work":
          if (f && f.type === "rupture") {
            const order = [...f.assigned].indexOf(a.id);
            const r = g.rupture;
            if (r && (r.stage === "dissent" || r.stage === "ignored") && order < 3) {
              // as in the story: three limbs leave the repair and touch the body
              goal = { x: CENTER.x + Math.cos(a.angle) * 44, y: CENTER.y + Math.sin(a.angle) * 36 };
            } else {
              goal = { x: CENTER.x - 150 + (order % 7) * 50, y: CENTER.y + 58 + (order % 2) * 18 };
            }
          } else {
            goal = f ? { x: f.x + Math.cos(a.angle) * 12, y: f.y + Math.sin(a.angle) * 10 } : a.rest;
          }
          break;
        case "anchor": {
          const ang = g.current ? g.current.angle + Math.PI + (a.id % 5 - 2) * 0.35 : a.angle;
          goal = { x: CENTER.x + Math.cos(ang) * 86, y: CENTER.y + Math.sin(ang) * 70 };
          break;
        }
        case "dissent":
          goal = g.dissent && g.dissent.armId === a.id
            ? { x: a.rest.x + (g.dissent.target.x - a.rest.x) * 0.18, y: a.rest.y + (g.dissent.target.y - a.rest.y) * 0.18 }
            : a.rest;
          break;
        case "wander":
          goal = a.wanderTo || a.rest;
          if (a.wanderTo && dist(a.tip, a.wanderTo) < 10) {
            if (a.wanderTo.ghost) say(pickFrom(rng, DISSENT_WRONG)(a.name), "info");
            a.wanderTo = null;
            a.state = "return";
          }
          break;
        case "return":
          goal = a.rest;
          if (dist(a.tip, a.rest) < 6) a.state = "idle";
          break;
        default: {
          // idle: a slow sway around the rest point
          const t = g.stats.time + a.phase;
          goal = { x: a.rest.x + Math.cos(t * 0.9) * 6, y: a.rest.y + Math.sin(t * 1.1) * 5 };
        }
      }
      const d = dist(a.tip, goal);
      const step = tipSpeed(a) * dt * (a.state === "idle" || a.state === "work" ? 0.25 : 1);
      if (d > 0.5) {
        const k = Math.min(1, step / d);
        a.tip.x += (goal.x - a.tip.x) * k;
        a.tip.y += (goal.y - a.tip.y) * k;
      }
    });
  }

  // --- work on faults ---
  function workFaults(dt) {
    for (const f of [...g.faults]) {
      if (f.type === "rupture") continue;
      const workers = [...f.assigned].map((id) => arms[id]).filter((a) => a.state === "work" && a.task === f.id);
      if (!workers.length || !f.partDelivered) continue;
      if (!f.revealed) { f.revealed = true; emit("reveal", { fault: f }); }
      if (workers.length < f.need) continue; // multi-limb controls need everyone
      const avg = workers.reduce((sum, a) => sum + workRate(a) * (f.type === "call" && a.specialty === "signal" ? 2 : 1), 0) / workers.length;
      const extra = workers.length - f.need;
      const rate = avg * (1 + extra * (0.35 + g.mods.chorus * 0.45));
      f.progress += rate * dt;
      if (f.progress >= f.work) completeFault(f);
    }
  }

  // start
  scheduleCurrent();
  g.say = say;
  return g;
}
