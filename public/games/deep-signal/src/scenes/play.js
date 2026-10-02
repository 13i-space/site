// The run: exploring the world, reconstructing the signal, being noticed.

import { generateWorld, TW } from "../world/generator.js";
import { drawWorld, moveCircle, updateDoors, isSolid } from "../world/world.js";
import { PLAYER, COSTS, AWARENESS, SIGNAL, TILE, ROOM_W, ROOM_H } from "../config.js";
import { formatSeed } from "../core/rng.js";
import { LORE_BY_ID, FRAGMENTS } from "../lore/lore.js";
import { createWarden, updateWarden, trigger as wardenTrigger } from "../systems/warden.js";
import { createWalkers, onRoomChange, updateWalkers, drawTracks, drawWalkerFigures } from "../systems/walkers.js";
import { updateConstructs, pulseConstructs, drawConstructs } from "../entities/constructs.js";
import { drawObject, objectLight, isInteractive, NAMES, VERBS } from "../entities/objects.js";
import { openPuzzle, PUZZLE_NAMES } from "../puzzles/index.js";
import { drawHud, drawDialog, drawFullMap } from "../ui/hud.js";
import { text, menuList, hitIndex } from "../ui/text.js";
import { drawGlyph } from "../puzzles/glyphs.js";
import { createDebug } from "../debug.js";

const ROOM_LORE = {
  landing: "loc-landing", ruins: "loc-ruins", relay: "loc-relay", caverns: "loc-caverns", field: "loc-field",
  walker: "loc-walker", anomaly: "loc-anomaly", warden: "loc-warden", gate: "loc-gate", node: "loc-node",
};
const PAUSE_ITEMS = ["RESUME", "MAP", "DISCOVERY LOG", "SETTINGS", "HOW TO PLAY", "ABANDON RUN"];

export function playScene(game, { seed }) {
  const world = generateWorld(seed);
  const run = {
    seed,
    seedText: formatSeed(seed),
    world,
    time: 0,
    player: { x: world.start.x, y: world.start.y, vx: 0, vy: -40, radius: PLAYER.radius, heading: -Math.PI / 2 },
    stats: { energy: 100, integrity: 100, signal: 0, awareness: 0 },
    fragments: [],
    found: new Set(),
    glyphs: {},
    warden: createWarden(),
    walkers: createWalkers(),
    constructs: [],
    messages: [],
    deltas: {},
    prompt: null,
    dialog: null,
    puzzle: null,
    mapOpen: false,
    paused: false,
    pauseSel: 0,
    scan: null,
    scanCd: 0,
    pulseCd: 0,
    pulseFx: null,
    hudGlitch: 0,
    roomsExplored: 0,
    currentRoom: null,
    hurtCd: 0,
    fade: 1, // fades in from black
    teleport: null,
    ending: null,
    debugReveal: false,
  };
  const cam = { x: run.player.x, y: run.player.y, zoom: 1 };
  const rng = world.rng;
  let pauseRects = [];
  let touchButtons = [];

  // ---------- the API every system talks to ----------
  const api = {
    rng,
    audio: game.audio,
    particles: game.particles,
    msg(textLine, opts = {}) {
      run.messages = run.messages.filter((m) => m.text !== textLine);
      run.messages.push({ text: textLine, life: opts.life || 4, max: opts.life || 4, dim: opts.dim });
      if (run.messages.length > 3) run.messages.shift();
    },
    discover(id) {
      if (!LORE_BY_ID[id] || run.found.has(id)) return false;
      run.found.add(id);
      game.save.discover(id);
      return true;
    },
    addSignal(n) {
      const before = run.stats.signal;
      run.stats.signal = Math.min(100, run.stats.signal + n);
      if (run.stats.signal > before) delta("signal", run.stats.signal - before);
      if (before < 30 && run.stats.signal >= 30 && api.discover("loc-veyra")) api.msg("ORBITAL RECORDS MATCH: VEYRA", { life: 5 });
      if (before < SIGNAL.gateThreshold && run.stats.signal >= SIGNAL.gateThreshold) api.msg("THE GATE WILL ANSWER NOW.", { life: 5 });
    },
    addAwareness(n) {
      run.stats.awareness = Math.max(0, Math.min(100, run.stats.awareness + n));
      if (Math.abs(n) >= 1) delta("awareness", n);
    },
    damage(n, silent) {
      run.stats.integrity = Math.max(0, run.stats.integrity - n);
      delta("integrity", -n);
      if (!silent) game.audio.hurt();
      run.hudGlitch = 0.35;
      api.particles.burst(run.player.x, run.player.y, 8, { speed: 90, life: 0.5 });
    },
    spend(n) {
      if (run.stats.energy < n) return false;
      run.stats.energy -= n;
      delta("energy", -n);
      return true;
    },
    gainEnergy(n) {
      const before = run.stats.energy;
      run.stats.energy = Math.min(100, run.stats.energy + n);
      delta("energy", run.stats.energy - before);
    },
  };
  function delta(stat, amount) {
    const d = run.deltas[stat];
    run.deltas[stat] = d && d.age < 0.6 ? { amount: d.amount + amount, age: 0 } : { amount, age: 0 };
  }
  api.run = run;
  game.run = run; // for the ?test hook only
  game.runApi = { api, interact: (o) => interact(o), finish: (e) => finish(e) };
  const debug = createDebug(game, run, api, {
    regenerate: () => game.switchTo("play", { seed: (Math.random() * 0xffffffff) >>> 0 }),
    end: (ending) => finish(ending),
  });

  game.audio.ambient(0.55, 3);
  game.audio.setTension(0);
  game.post({ type: "play" });
  api.msg("SIGNAL DETECTED. ORIGIN UNKNOWN.", { life: 5 });

  const resize = () => {
    cam.zoom = Math.max(0.7, Math.min(1.7, Math.min(game.w / 760, game.h / 540)));
  };
  resize();

  // ---------- helpers ----------
  const nearbyObjects = () => {
    const r = world.roomAt(run.player.x, run.player.y);
    if (!r) return [];
    const list = [...r.objects];
    Object.values(r.doors).forEach((d) => {
      if (d.state !== "open") return;
      list.push(...world.rooms.get(d.a === r.key ? d.b : d.a).objects);
    });
    return list;
  };
  const lightRadius = () => {
    const base = run.stats.energy <= 0 ? PLAYER.lowEnergyLight : PLAYER.lightRadius;
    const r = world.roomAt(run.player.x, run.player.y);
    return r && r.dark ? base * 0.75 : base;
  };

  // Never lose the craft: if it ever ends up somewhere impossible (inside a
  // wall or a door that sealed on it, or with a broken position), put it back
  // at the last place it was standing freely.
  let lastSafe = { x: run.player.x, y: run.player.y };
  function keepPlayerSafe(p) {
    const bad = !Number.isFinite(p.x) || !Number.isFinite(p.y) || !Number.isFinite(p.vx) || !Number.isFinite(p.vy)
      || isSolid(world, Math.floor(p.x / TILE), Math.floor(p.y / TILE));
    if (bad) {
      p.x = lastSafe.x; p.y = lastSafe.y; p.vx = 0; p.vy = 0;
      if (!Number.isFinite(cam.x) || !Number.isFinite(cam.y)) { cam.x = p.x; cam.y = p.y; }
    } else {
      lastSafe = { x: p.x, y: p.y };
    }
  }
  run.playerOverlaps = (tiles) => tiles.some((idx) => {
    const x = ((idx % TW) + 0.5) * TILE, y = (Math.floor(idx / TW) + 0.5) * TILE;
    return Math.abs(x - run.player.x) < TILE / 2 + run.player.radius + 4 && Math.abs(y - run.player.y) < TILE / 2 + run.player.radius + 4;
  });

  function finish(ending) {
    if (run.ending) return;
    run.ending = ending;
    game.switchTo("finale", { run, ending });
  }

  // ---------- interactions ----------
  function interact(o) {
    const s = run.stats;
    switch (o.type) {
      case "energy":
        api.gainEnergy(o.charge);
        o.charge = 0;
        game.audio.energy();
        api.particles.burst(o.x, o.y, 16, { speed: 60, life: 1 });
        api.msg("ENERGY RESTORED.");
        break;
      case "relay": {
        const opts = [];
        if (o.state === "idle") opts.push({ label: "SCAN", act: () => relayScan(o) });
        opts.push({ label: "CONNECT", act: () => relayConnect(o) });
        opts.push({ label: "LEAVE", act: () => {} });
        run.dialog = { title: NAMES.relay, body: o.state === "scanned" ? FRAGMENTS[o.fragment] : "Its emitters face down, into the planet. A fragment of the signal is caught in it.", options: opts, sel: 0 };
        break;
      }
      case "artifact": {
        const lore = LORE_BY_ID[o.lore];
        const opts = [];
        if (o.state === "idle") opts.push({ label: "SCAN", act: () => {
          if (!api.spend(5)) return api.msg("NOT ENOUGH ENERGY.");
          o.state = "scanned"; api.addSignal(1); learn(o.lore); game.audio.scan();
        } });
        opts.push({ label: "EXTRACT", act: () => {
          api.addSignal(o.state === "scanned" ? 3 : 4); api.addAwareness(7); learn(o.lore);
          o.state = "taken"; o.gone = true;
          game.audio.discovery();
          api.particles.burst(o.x, o.y, 20, { speed: 70, life: 1 });
          api.msg(`${lore.title.toUpperCase()} RECOVERED.`);
        } });
        opts.push({ label: "LEAVE", act: () => {} });
        run.dialog = { title: NAMES.artifact, body: o.state === "scanned" ? lore.text : "Something made, and left.", options: opts, sel: 0 };
        break;
      }
      case "marker":
        o.state = "read";
        learn(o.lore);
        api.addSignal(2);
        game.audio.discovery();
        showLore(o.lore);
        break;
      case "trace":
        o.state = "read";
        learn("an-13i");
        api.addSignal(2);
        game.audio.transmission();
        showLore("an-13i");
        break;
      case "anomaly":
        o.state = "read";
        learn(o.kind === "well" ? "an-well" : "an-time");
        api.addSignal(1);
        showLore(o.kind === "well" ? "an-well" : "an-time");
        break;
      case "glyph":
        o.state = "read";
        run.glyphs[o.order] = o.glyph;
        game.audio.transmission();
        api.msg(`GLYPH RECORDED  ·  POSITION ${o.order}`);
        break;
      case "terminal":
        run.puzzle = { obj: o, p: openPuzzle(o.puzzle, game, run, api) };
        break;
      case "wterminal": {
        const opts = [];
        if (o.state === "idle") opts.push({ label: "SCAN", act: () => {
          if (!api.spend(5)) return api.msg("NOT ENOUGH ENERGY.");
          o.state = "scanned"; learn("wd-terminal"); api.addAwareness(4); game.audio.scan();
        } });
        opts.push({ label: "CONNECT", act: () => {
          o.state = "connected"; api.addSignal(5); api.addAwareness(16); learn("wd-terminal");
          game.audio.warden();
          api.msg("IT ACCEPTED THE CONNECTION.");
          wardenTrigger(run.warden, run, api);
        } });
        opts.push({ label: "LEAVE", act: () => {} });
        run.dialog = { title: NAMES.wterminal, body: o.state === "scanned" ? LORE_BY_ID["wd-terminal"].text : "The interface is waiting. It has been waiting a long time.", options: opts, sel: 0 };
        break;
      }
      case "gate":
        learn("loc-gate");
        if (s.signal < SIGNAL.gateThreshold) {
          api.msg(`THE SIGNAL IS TOO WEAK TO FOLLOW.  ${Math.round(s.signal)}%`);
          game.audio.failure();
        } else {
          run.dialog = {
            title: NAMES.gate,
            body: "The signal is strong enough to follow now. It will not bring you back.",
            options: [
              { label: "FOLLOW THE SIGNAL", act: () => { run.teleport = { t: 0 }; game.audio.swell(); } },
              { label: "NOT YET", act: () => {} },
            ],
            sel: 1,
          };
        }
        break;
      case "node":
        finish(run.stats.signal >= SIGNAL.connectionThreshold ? "connection" : "signal");
        break;
      default:
        break;
    }
  }

  function learn(id) {
    if (api.discover(id)) {
      const l = LORE_BY_ID[id];
      api.msg(`LOGGED  ·  ${l.title.toUpperCase()}`, { dim: true });
    }
  }
  function showLore(id) {
    const l = LORE_BY_ID[id];
    run.dialog = { title: l.title.toUpperCase(), body: l.text, options: [{ label: "CONTINUE", act: () => {} }], sel: 0 };
  }
  function logFragment(o) {
    if (run.fragments.includes(o.fragment)) return;
    run.fragments.push(o.fragment);
    learn(`tx-${String(o.fragment + 1).padStart(2, "0")}`);
  }
  function relayScan(o) {
    if (!api.spend(4)) return api.msg("NOT ENOUGH ENERGY.");
    o.state = "scanned";
    logFragment(o);
    api.addSignal(2);
    game.audio.transmission();
    api.msg(FRAGMENTS[o.fragment], { life: 5 });
  }
  function relayConnect(o) {
    const wasScanned = o.state === "scanned";
    o.state = "connected";
    logFragment(o);
    api.addSignal(wasScanned ? 6 : 8);
    api.addAwareness(13);
    game.audio.transmission();
    game.audio.energy();
    api.particles.burst(o.x, o.y, 30, { speed: 120, life: 1.4 });
    api.msg(FRAGMENTS[o.fragment], { life: 5 });
    // connecting is loud
    if (run.warden.state !== "DORMANT" && rng.chance(0.4)) setTimeout(() => wardenTrigger(run.warden, run, api), 1500);
  }

  // ---------- actions ----------
  function doScan() {
    if (run.scanCd > 0) return;
    if (run.warden.effects.scanSuppressed > 0) { api.msg("SCAN SUPPRESSED."); game.audio.failure(); run.scanCd = 0.6; return; }
    if (!api.spend(COSTS.scan)) { api.msg("NOT ENOUGH ENERGY TO SCAN."); run.scanCd = 0.6; return; }
    run.scanCd = COSTS.scanCooldown;
    run.scan = { x: run.player.x, y: run.player.y, r: 0, hit: new Set() };
    game.audio.scan();
    const room = world.roomAt(run.player.x, run.player.y);
    api.addAwareness(room && room.wardenZone ? 3 : 1);
  }
  function doPulse() {
    if (run.pulseCd > 0) return;
    if (!api.spend(COSTS.pulse)) { api.msg("NOT ENOUGH ENERGY."); return; }
    run.pulseCd = COSTS.pulseCooldown;
    const p = run.player;
    run.pulseFx = { x: p.x, y: p.y, t: 0 };
    game.audio.pulse();
    // emergency movement along the current heading
    p.vx += Math.cos(p.heading) * 320;
    p.vy += Math.sin(p.heading) * 320;
    const hit = pulseConstructs(run, p.x, p.y, 160);
    if (hit) api.msg("IT RECONSIDERED.", { dim: true });
    api.addAwareness(2);
    api.particles.burst(p.x, p.y, 24, { speed: 180, life: 0.6 });
  }

  function updateScan(dt) {
    const sc = run.scan;
    if (!sc) return;
    sc.r += 470 * dt;
    const reach = 420;
    world.rooms.forEach((room) => {
      room.objects.forEach((o) => {
        if (sc.hit.has(o.id) || !NAMES[o.type]) return;
        const d = Math.hypot(o.x - sc.x, o.y - sc.y);
        if (d > sc.r || d > reach) return;
        sc.hit.add(o.id);
        o.seen = true;
        o.glowUntil = run.time + 6;
        if (o.hidden) {
          o.hidden = false;
          game.audio.discovery();
          api.msg(`${NAMES[o.type] || "SOMETHING"} DETECTED.`);
        }
      });
    });
    // hidden passages
    world.doors.forEach((d) => {
      if (d.state !== "hidden") return;
      const idx = d.tiles[Math.floor(d.tiles.length / 2)];
      const x = ((idx % TW) + 0.5) * TILE, y = (Math.floor(idx / TW) + 0.5) * TILE;
      if (Math.hypot(x - sc.x, y - sc.y) < Math.min(sc.r, reach)) {
        d.state = "open";
        d.revealed = true;
        api.msg("A HIDDEN PASSAGE.");
        game.audio.discovery();
        api.particles.burst(x, y, 20, { speed: 60, life: 1 });
      }
    });
    // a shape at the edge of the light, caught by the wave
    const sil = run.walkers.silhouette;
    if (sil && Math.hypot(sil.x - sc.x, sil.y - sc.y) < sc.r) { sil.fade = 1; sil.seen = true; }
    const room = world.roomAt(sc.x, sc.y);
    if (room && room.hazards.some((hz) => hz.type === "slow")) api.discover("ent-echo");
    if (sc.r > reach + 40) run.scan = null;
  }

  function updateHazards(dt) {
    const p = run.player;
    const room = world.roomAt(p.x, p.y);
    if (!room) return;
    run.hurtCd = Math.max(0, run.hurtCd - dt);
    run.slowed = false;
    room.hazards.forEach((hz) => {
      if (hz.type === "field") {
        const wasActive = hz.active;
        hz.active = Math.sin(((run.time + hz.phase) / hz.period) * Math.PI * 2) > 0.3;
        // a clear warning before it discharges: is it about to switch on?
        hz.warnLead = Math.min(1, hz.period * 0.25);
        hz.charging = !hz.active && Math.sin(((run.time + hz.warnLead + hz.phase) / hz.period) * Math.PI * 2) > 0.3;
        const near = p.x > hz.x - 60 && p.x < hz.x + hz.w + 60 && p.y > hz.y - 60 && p.y < hz.y + hz.h + 60;
        if (hz.charging && !hz.warned && near) { hz.warned = true; game.audio.warning(); }
        if (!hz.charging && !hz.active) hz.warned = false;
        if (hz.active && !wasActive) hz.warned = false;
        if (hz.active && p.x > hz.x && p.x < hz.x + hz.w && p.y > hz.y && p.y < hz.y + hz.h && run.hurtCd <= 0) {
          api.damage(5);
          api.addAwareness(1);
          run.hurtCd = 0.45;
        }
      } else if (hz.type === "vent") {
        const c = ((run.time + hz.phase) % hz.period) / hz.period;
        hz.warn = c > 0.7 && c < 0.92;
        const erupt = c >= 0.92;
        if (erupt && !hz.fired && Math.hypot(p.x - hz.x, p.y - hz.y) < hz.r + p.radius) {
          api.damage(14);
          hz.fired = true;
        }
        if (erupt && !hz.burst) { hz.burst = true; api.particles.burst(hz.x, hz.y, 18, { speed: 110, life: 0.7 }); }
        if (!erupt) { hz.fired = false; hz.burst = false; }
        hz.erupting = erupt;
      } else if (hz.type === "well") {
        const dx = hz.x - p.x, dy = hz.y - p.y, d = Math.hypot(dx, dy);
        if (d < hz.r && d > 8) {
          const f = 150 * (1 - d / hz.r);
          const turn = run.time * 0.4; // the pull's direction slowly turns
          p.vx += ((dx / d) * Math.cos(turn) - (dy / d) * Math.sin(turn) * 0.4) * f * dt;
          p.vy += ((dy / d) * Math.cos(turn) + (dx / d) * Math.sin(turn) * 0.4) * f * dt;
          if (d < hz.r * 0.6) api.discover("an-well");
        }
      } else if (hz.type === "slow") {
        if (Math.hypot(hz.x - p.x, hz.y - p.y) < hz.r) { run.slowed = true; api.discover("an-time"); }
      }
    });
  }

  function onEnterRoom(room, from) {
    if (!room.explored) {
      room.explored = true;
      run.roomsExplored++;
      if (ROOM_LORE[room.type]) learn(ROOM_LORE[room.type]);
    }
    room.visits++;
    if (run.warden.falseObjective === room.key) {
      run.warden.falseObjective = null;
      api.msg("IT WAS NOT HERE.");
      api.discover("wd-false");
    }
    onRoomChange(run.walkers, run, api, from, room);
    // lamps wake up when something is paying attention
    if (run.warden.state !== "DORMANT" && !room.lampsLit && room.objects.some((o) => o.type === "lamp") && rng.chance(0.5)) {
      room.lampsLit = true;
      room.objects.forEach((o) => { if (o.type === "lamp") o.on = true; });
      api.discover("wd-lights");
    }
  }

  // ---------- update ----------
  function update(dt) {
    const input = game.input;
    run.time += dt;
    run.fade = Math.max(0, run.fade - dt * 0.8);
    Object.values(run.deltas).forEach((d) => { d.age += dt; });
    run.messages.forEach((m) => { m.life -= dt; });
    run.messages = run.messages.filter((m) => m.life > 0);
    run.hudGlitch = Math.max(0, run.hudGlitch - dt);

    if (debug.update(dt)) return;

    // teleport to the Node
    if (run.teleport) {
      run.teleport.t += dt;
      if (run.teleport.t > 1.4 && !run.teleport.done) {
        run.teleport.done = true;
        const node = world.nodeRoom;
        run.player.x = (node.cx * ROOM_W + 10.5) * TILE;
        run.player.y = (node.cy * ROOM_H + 11.5) * TILE;
        run.player.vx = 0; run.player.vy = -30;
        cam.x = run.player.x; cam.y = run.player.y;
        lastSafe = { x: run.player.x, y: run.player.y };
        api.msg("ORIGIN IS NOT A LOCATION.", { life: 5 });
      }
      if (run.teleport.t > 2.8) run.teleport = null;
      return;
    }

    // modal layers
    if (run.paused) return updatePause(input);
    if (run.mapOpen) {
      if (input.take("map") || input.take("pause") || input.takeClick()) run.mapOpen = false;
      return;
    }
    if (run.puzzle) {
      run.puzzle.p.update(dt, input);
      const res = run.puzzle.p.result;
      if (res) {
        if (run.puzzle.p.dispose) run.puzzle.p.dispose();
        if (res === "solved") {
          run.puzzle.obj.solved = true;
          api.addSignal(6);
          api.addAwareness(3);
          api.msg(`${PUZZLE_NAMES[run.puzzle.obj.puzzle]} RESOLVED.`);
          game.audio.discovery();
        }
        run.puzzle = null;
      }
      return;
    }
    if (run.dialog) return updateDialog(input);

    if (input.take("pause")) { run.paused = true; run.pauseSel = 0; return; }
    if (input.take("map")) { run.mapOpen = true; return; }
    if (input.take("log")) { game.overlays.open("log", { run: run.found }); return; }

    // touch buttons
    if (input.touch.isTouchDevice && input.pointer.clicked) {
      const i = hitIndex(touchButtons, input.pointer.x, input.pointer.y);
      if (i >= 0) { input.takeClick(); input.press(touchButtons[i].action); }
    }

    run.scanCd = Math.max(0, run.scanCd - dt);
    run.pulseCd = Math.max(0, run.pulseCd - dt);
    if (input.take("scan")) doScan();
    if (input.take("pulse")) doPulse();

    // movement
    const p = run.player;
    const mv = input.moveVector();
    let max = run.stats.energy <= 0 ? PLAYER.lowEnergySpeed : PLAYER.maxSpeed;
    if (run.slowed) max *= 0.5;
    p.vx += mv.x * PLAYER.accel * dt;
    p.vy += mv.y * PLAYER.accel * dt;
    const drag = Math.min(1, PLAYER.drag * dt);
    p.vx -= p.vx * drag;
    p.vy -= p.vy * drag;
    const sp = Math.hypot(p.vx, p.vy);
    if (sp > max && (mv.x || mv.y)) { p.vx *= max / sp; p.vy *= max / sp; }
    if (sp > 20) p.heading = Math.atan2(p.vy, p.vx);
    moveCircle(world, p, p.vx * dt, p.vy * dt);
    keepPlayerSafe(p);
    if (sp > 60 && !game.settings().reducedEffects && rng.chance(0.3)) {
      game.particles.spawn({ x: p.x - Math.cos(p.heading) * 10, y: p.y - Math.sin(p.heading) * 10, vx: -p.vx * 0.2, vy: -p.vy * 0.2, life: 0.5, size: 1.2, alpha: 0.5 });
    }

    // rooms
    const room = world.roomAt(p.x, p.y);
    if (room && room !== run.currentRoom) {
      const from = run.currentRoom;
      run.currentRoom = room;
      onEnterRoom(room, from);
    }

    updateDoors(world, dt);
    updateHazards(dt);
    updateScan(dt);
    updateConstructs(run, api, dt);
    updateWalkers(run.walkers, run, api, dt, lightRadius());
    updateWarden(run.warden, run, api, dt);
    if (run.pulseFx) { run.pulseFx.t += dt; if (run.pulseFx.t > 0.6) run.pulseFx = null; }
    game.particles.update(dt);

    // awareness: rises in the Warden's zones, settles slowly elsewhere
    if (room && room.wardenZone) api.addAwareness(AWARENESS.wardenZonePerSec * dt);
    else run.stats.awareness = Math.max(0, run.stats.awareness - AWARENESS.decayPerSec * dt);
    // a trickle of energy when nearly empty, so a run can't dead-end
    if (run.stats.energy < 20) run.stats.energy = Math.min(20, run.stats.energy + 0.25 * dt);
    game.audio.setTension(run.stats.awareness / 100);

    // things in the light are remembered on the map
    const lr = lightRadius();
    nearbyObjects().forEach((o) => { if (!o.hidden && Math.hypot(o.x - p.x, o.y - p.y) < lr) o.seen = true; });

    // interaction prompt
    let best = null, bestD = 60;
    nearbyObjects().forEach((o) => {
      if (!isInteractive(o)) return;
      const d = Math.hypot(o.x - p.x, o.y - p.y);
      if (d < bestD) { best = o; bestD = d; }
    });
    run.prompt = best ? `[E] ${VERBS[best.type]}   ${NAMES[best.type]}` : null;
    if (best && input.take("interact")) interact(best);

    // endings
    if (run.stats.integrity <= 0) finish("terminated");
    else if (run.stats.awareness >= AWARENESS.intercept) { api.discover("wd-core"); finish("warden"); }
  }

  function updateDialog(input) {
    const d = run.dialog;
    const n = d.options.length;
    if (input.take("up")) { d.sel = (d.sel + n - 1) % n; game.audio.ui(); }
    if (input.take("down")) { d.sel = (d.sel + 1) % n; game.audio.ui(); }
    let choice = -1;
    ["1", "2", "3", "4"].forEach((k, i) => { if (input.take(k) && i < n) choice = i; });
    if (input.take("confirm") || input.take("interact")) choice = d.sel;
    if (input.takeClick()) {
      const i = hitIndex(d.rects || [], input.pointer.x, input.pointer.y);
      if (i >= 0) choice = i;
    }
    if (input.take("pause")) { run.dialog = null; return; }
    if (choice >= 0) {
      run.dialog = null;
      game.audio.ui();
      d.options[choice].act();
    }
  }

  function updatePause(input) {
    const n = PAUSE_ITEMS.length;
    if (input.take("up")) { run.pauseSel = (run.pauseSel + n - 1) % n; game.audio.ui(); }
    if (input.take("down")) { run.pauseSel = (run.pauseSel + 1) % n; game.audio.ui(); }
    let choice = -1;
    if (input.take("confirm") || input.take("interact")) choice = run.pauseSel;
    if (input.takeClick()) choice = hitIndex(pauseRects, input.pointer.x, input.pointer.y);
    if (input.take("pause")) { run.paused = false; return; }
    if (choice < 0) return;
    game.audio.ui();
    if (choice === 0) run.paused = false;
    if (choice === 1) { run.paused = false; run.mapOpen = true; }
    if (choice === 2) game.overlays.open("log", { run: run.found });
    if (choice === 3) game.overlays.open("settings");
    if (choice === 4) game.overlays.open("howto");
    if (choice === 5) game.switchTo("title");
  }

  // ---------- draw ----------
  function toScreen(x, y) {
    return { x: (x - cam.x) * cam.zoom + game.w / 2, y: (y - cam.y) * cam.zoom + game.h / 2 };
  }

  function draw(ctx) {
    const { w, h, dpr } = game;
    const settings = game.settings();
    const p = run.player;
    // camera eases toward the player, leading a little in the direction of travel
    const tx = p.x + p.vx * 0.25, ty = p.y + p.vy * 0.25;
    cam.x += (tx - cam.x) * 0.08;
    cam.y += (ty - cam.y) * 0.08;
    if (!Number.isFinite(cam.x) || !Number.isFinite(cam.y)) { cam.x = p.x; cam.y = p.y; }
    // the craft always stays on screen, whatever pushed it
    const maxOff = Math.min(w, h) * 0.35 / cam.zoom;
    cam.x = Math.max(p.x - maxOff, Math.min(p.x + maxOff, cam.x));
    cam.y = Math.max(p.y - maxOff, Math.min(p.y + maxOff, cam.y));
    const t = run.time;

    ctx.fillStyle = "#030303";
    ctx.fillRect(0, 0, w, h);
    const view = { x0: cam.x - w / 2 / cam.zoom, y0: cam.y - h / 2 / cam.zoom, x1: cam.x + w / 2 / cam.zoom, y1: cam.y + h / 2 / cam.zoom };

    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.scale(cam.zoom, cam.zoom);
    ctx.translate(-cam.x, -cam.y);
    drawWorld(ctx, world, view, t, settings);

    // hazards
    const room = world.roomAt(p.x, p.y);
    const visibleRooms = [...world.rooms.values()].filter((r) => {
      const rx = r.cx * ROOM_W * TILE, ry = r.cy * ROOM_H * TILE;
      return rx < view.x1 && ry < view.y1 && rx + ROOM_W * TILE > view.x0 && ry + ROOM_H * TILE > view.y0;
    });
    visibleRooms.forEach((r) => r.hazards.forEach((hz) => {
      if (hz.type === "field") {
        const on = Math.sin(((run.time + hz.phase) / hz.period) * Math.PI * 2);
        ctx.fillStyle = on > 0.3 ? `rgba(255,244,214,${0.18 + 0.1 * Math.sin(t * 20)})` : `rgba(243,227,181,${Math.max(0.03, on * 0.08)})`;
        ctx.fillRect(hz.x, hz.y, hz.w, hz.h);
        if (on > 0.3) {
          ctx.strokeStyle = "rgba(255,244,214,0.6)";
          ctx.beginPath();
          const vertical = hz.h > hz.w;
          const len = vertical ? hz.h : hz.w;
          for (let i = 0; i <= len; i += 16) {
            const j = (Math.random() - 0.5) * 14;
            if (vertical) i ? ctx.lineTo(hz.x + hz.w / 2 + j, hz.y + i) : ctx.moveTo(hz.x + hz.w / 2 + j, hz.y + i);
            else i ? ctx.lineTo(hz.x + i, hz.y + hz.h / 2 + j) : ctx.moveTo(hz.x + i, hz.y + hz.h / 2 + j);
          }
          ctx.stroke();
        } else if (hz.charging) {
          // CHARGING: it's about to discharge - flashing border, sparks, and a mark
          const flash = 0.45 + 0.45 * Math.abs(Math.sin(t * 14));
          ctx.fillStyle = `rgba(255,244,214,${0.06 + 0.08 * flash})`;
          ctx.fillRect(hz.x, hz.y, hz.w, hz.h);
          ctx.strokeStyle = `rgba(255,244,214,${flash})`;
          ctx.lineWidth = 2;
          ctx.setLineDash([6, 4]);
          ctx.lineDashOffset = -t * 40;
          ctx.strokeRect(hz.x + 1, hz.y + 1, hz.w - 2, hz.h - 2);
          ctx.setLineDash([]);
          ctx.lineDashOffset = 0;
          ctx.lineWidth = 1;
          for (let k = 0; k < 3; k++) {
            const sx = hz.x + Math.random() * hz.w, sy = hz.y + Math.random() * hz.h;
            ctx.fillStyle = `rgba(255,244,214,${0.5 + Math.random() * 0.5})`;
            ctx.fillRect(sx, sy, 2, 2);
          }
          const mx = hz.x + hz.w / 2, my = hz.y + hz.h / 2;
          ctx.fillStyle = `rgba(255,244,214,${flash})`;
          ctx.font = "bold 16px 'JetBrains Mono', monospace";
          ctx.textAlign = "center";
          ctx.fillText("!", mx, my + 6);
        } else if (on > 0.05) {
          ctx.strokeStyle = "rgba(243,227,181,0.35)";
          ctx.setLineDash([4, 6]);
          ctx.strokeRect(hz.x + 0.5, hz.y + 0.5, hz.w - 1, hz.h - 1);
          ctx.setLineDash([]);
        }
      } else if (hz.type === "vent") {
        if (hz.warn) {
          const c = ((run.time + hz.phase) % hz.period) / hz.period;
          ctx.strokeStyle = `rgba(255,244,214,${(c - 0.7) * 3})`;
          ctx.beginPath(); ctx.arc(hz.x, hz.y, hz.r * ((c - 0.7) / 0.22), 0, Math.PI * 2); ctx.stroke();
          ctx.setLineDash([3, 5]);
          ctx.beginPath(); ctx.arc(hz.x, hz.y, hz.r, 0, Math.PI * 2); ctx.stroke();
          ctx.setLineDash([]);
        }
        if (hz.erupting) {
          ctx.fillStyle = "rgba(255,244,214,0.3)";
          ctx.beginPath(); ctx.arc(hz.x, hz.y, hz.r, 0, Math.PI * 2); ctx.fill();
        }
      } else if (hz.type === "well" || hz.type === "slow") {
        ctx.strokeStyle = "rgba(243,227,181,0.08)";
        for (let i = 1; i <= 3; i++) {
          ctx.beginPath();
          ctx.arc(hz.x, hz.y, (hz.r * i) / 3 - ((t * 20) % (hz.r / 3)) * (hz.type === "well" ? 1 : -0.3), 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    }));

    drawTracks(ctx, run, view);
    visibleRooms.forEach((r) => r.objects.forEach((o) => drawObject(ctx, o, run, t)));
    game.particles.draw(ctx);
    drawConstructs(ctx, run, t);

    // the craft
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.heading);
    ctx.fillStyle = "#101012";
    ctx.strokeStyle = "#fff4d6";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(0, 0, p.radius, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, p.radius * 0.45, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, p.radius + 4, -0.5, 0.5); ctx.stroke();
    ctx.fillStyle = "#fff4d6";
    ctx.beginPath(); ctx.arc(p.radius * 0.45, 0, 1.6, 0, Math.PI * 2); ctx.fill();
    if (run.scanCd > 0) {
      ctx.strokeStyle = "rgba(243,227,181,0.35)";
      ctx.beginPath(); ctx.arc(0, 0, p.radius + 8, 0, Math.PI * 2 * (1 - run.scanCd / COSTS.scanCooldown)); ctx.stroke();
    }
    ctx.restore();
    ctx.restore();

    // ---- light & darkness ----
    const L = game.lighting;
    L.begin();
    const addWorldLight = (x, y, r, s) => {
      const sp = toScreen(x, y);
      L.add(sp.x * dpr, sp.y * dpr, r * cam.zoom * dpr, s);
    };
    const flicker = settings.reducedEffects ? 1 : 0.97 + Math.random() * 0.03;
    addWorldLight(p.x, p.y, lightRadius() * flicker, 1);
    addWorldLight(p.x + Math.cos(p.heading) * 60, p.y + Math.sin(p.heading) * 60, lightRadius() * 0.6, 0.5);
    visibleRooms.forEach((r) => {
      r.objects.forEach((o) => {
        const l = objectLight(o, run, t);
        if (l) addWorldLight(o.x, o.y, l[0], l[1]);
      });
      r.hazards.forEach((hz) => {
        if (hz.type === "field" && hz.charging) {
          const vertical = hz.h > hz.w, len = vertical ? hz.h : hz.w;
          for (let i = 40; i < len; i += 90) addWorldLight(vertical ? hz.x + hz.w / 2 : hz.x + i, vertical ? hz.y + i : hz.y + hz.h / 2, 55, 0.3);
        }
        if (hz.type === "field" && hz.active) {
          const vertical = hz.h > hz.w, len = vertical ? hz.h : hz.w;
          for (let i = 40; i < len; i += 90) addWorldLight(vertical ? hz.x + hz.w / 2 : hz.x + i, vertical ? hz.y + i : hz.y + hz.h / 2, 70, 0.45);
        }
        if (hz.type === "vent" && hz.erupting) addWorldLight(hz.x, hz.y, 110, 0.7);
      });
    });
    run.constructs.forEach((c) => { if (c.alive) addWorldLight(c.x, c.y, 50, 0.35 * c.appear); });
    const sg = run.walkers.sighting;
    if (sg && sg.alive) addWorldLight(sg.x, sg.y - 10, 120, 0.6);
    if (run.scan) {
      const sp = toScreen(run.scan.x, run.scan.y);
      L.ring(sp.x * dpr, sp.y * dpr, Math.min(run.scan.r, 460) * cam.zoom * dpr, 40 * cam.zoom * dpr, Math.max(0, 1 - run.scan.r / 480));
    }
    if (run.pulseFx) addWorldLight(run.pulseFx.x, run.pulseFx.y, 60 + run.pulseFx.t * 300, 1 - run.pulseFx.t / 0.6);
    let darkness = room && room.dark ? 0.985 : 0.965;
    if (room && room.type === "node") darkness = 0.55;
    if (settings.highContrast) darkness -= 0.12;
    L.render(ctx, darkness);

    // ---- over the darkness: what the scan revealed, and what watches ----
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.scale(cam.zoom, cam.zoom);
    ctx.translate(-cam.x, -cam.y);
    visibleRooms.forEach((r) => r.objects.forEach((o) => {
      if (!o.glowUntil || o.glowUntil < t || o.hidden || o.gone) return;
      const a = Math.min(1, (o.glowUntil - t) / 2);
      ctx.strokeStyle = `rgba(243,227,181,${a * 0.9})`;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(o.x, o.y, 16 + Math.sin(t * 4) * 2, 0, Math.PI * 2); ctx.stroke();
      if (o.type === "glyph") drawGlyph(ctx, o.glyph, o.x, o.y - 2, 14, "#f3e3b5", a);
      else { ctx.fillStyle = `rgba(255,244,214,${a})`; ctx.beginPath(); ctx.arc(o.x, o.y, 2.5, 0, Math.PI * 2); ctx.fill(); }
    }));
    if (run.scan) {
      ctx.strokeStyle = `rgba(243,227,181,${Math.max(0, 0.7 - run.scan.r / 600)})`;
      ctx.lineWidth = 2 / cam.zoom;
      ctx.beginPath(); ctx.arc(run.scan.x, run.scan.y, Math.min(run.scan.r, 460), 0, Math.PI * 2); ctx.stroke();
    }
    if (run.pulseFx) {
      ctx.strokeStyle = `rgba(255,244,214,${1 - run.pulseFx.t / 0.6})`;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(run.pulseFx.x, run.pulseFx.y, 20 + run.pulseFx.t * 240, 0, Math.PI * 2); ctx.stroke();
    }
    drawWalkerFigures(ctx, run.walkers, t);
    ctx.restore();

    // ---- interface ----
    drawHud(ctx, game, run, t);
    if (run.dialog) drawDialog(ctx, game, run.dialog);
    if (game.input.touch.isTouchDevice) drawTouch(ctx);
    if (run.mapOpen) drawFullMap(ctx, game, run, t);
    if (run.puzzle) run.puzzle.p.draw(ctx, w, h, t);
    if (run.paused) drawPause(ctx);
    debug.draw(ctx);

    // fades
    let black = run.fade;
    if (run.teleport) {
      const tt = run.teleport.t;
      const white = tt < 1.4 ? tt / 1.4 : Math.max(0, 1 - (tt - 1.4) / 1.4);
      ctx.fillStyle = `rgba(255,244,214,${white})`;
      ctx.fillRect(0, 0, w, h);
    }
    if (black > 0) { ctx.fillStyle = `rgba(3,3,3,${black})`; ctx.fillRect(0, 0, w, h); }
  }

  function drawPause(ctx) {
    const { w, h } = game;
    ctx.fillStyle = "rgba(3,3,3,0.88)";
    ctx.fillRect(0, 0, w, h);
    text(ctx, "PAUSED", w / 2, h * 0.28, { size: 14, spacing: 8, color: "#f3e3b5", align: "center" });
    text(ctx, `SIGNAL SEED  ${run.seedText}`, w / 2, h * 0.28 + 26, { size: 9, spacing: 2, color: "#4a4a52", align: "center" });
    pauseRects = menuList(ctx, PAUSE_ITEMS, run.pauseSel, w / 2, h * 0.28 + 80, { size: 12, gap: 34 });
  }

  function drawTouch(ctx) {
    const { w, h } = game;
    const s = 58;
    touchButtons = [
      { label: "SCAN", action: "scan", x: w - s * 2 - 30, y: h - s - 24 },
      { label: "E", action: "interact", x: w - s - 16, y: h - s * 2 - 34 },
      { label: "PULSE", action: "pulse", x: w - s - 16, y: h - s - 24 },
      { label: "MENU", action: "pause", x: w / 2 - s / 2, y: 12, small: true },
    ].map((b) => ({ ...b, w: b.small ? s : s, h: b.small ? 28 : s }));
    touchButtons.forEach((b) => {
      ctx.strokeStyle = "rgba(243,227,181,0.4)";
      ctx.fillStyle = "rgba(3,3,3,0.5)";
      ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.strokeRect(b.x + 0.5, b.y + 0.5, b.w - 1, b.h - 1);
      text(ctx, b.label, b.x + b.w / 2, b.y + b.h / 2 + 4, { size: 10, spacing: 2, color: "#f3e3b5", align: "center" });
    });
    const tc = game.input.touch;
    if (tc.active) {
      ctx.strokeStyle = "rgba(243,227,181,0.3)";
      ctx.beginPath(); ctx.arc(tc.originX, tc.originY, 50, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = "rgba(243,227,181,0.5)";
      ctx.beginPath(); ctx.arc(tc.originX + tc.dx * 50, tc.originY + tc.dy * 50, 14, 0, Math.PI * 2); ctx.fill();
    }
  }

  return {
    update,
    draw,
    resize,
    onBlur() { if (!run.dialog && !run.puzzle && !run.ending) { run.paused = true; } },
    exit() {
      debug.dispose();
      if (run.puzzle && run.puzzle.p.dispose) run.puzzle.p.dispose();
    },
  };
}
