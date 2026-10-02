// 13i: THE DEEP SIGNAL - entry point. Sets up the canvas, the shared
// services every scene uses, and the frame loop.

import { createInput } from "./core/input.js";
import { createAudio } from "./core/audio.js";
import { createSave } from "./core/save.js";
import { createParticles } from "./effects/particles.js";
import { createLighting } from "./effects/lighting.js";
import { createOverlays } from "./ui/overlays.js";
import { titleScene } from "./scenes/title.js";
import { introScene } from "./scenes/intro.js";
import { playScene } from "./scenes/play.js";
import { finaleScene } from "./scenes/finale.js";
import { GAME_ID } from "./config.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d", { alpha: false });
const focusHint = document.getElementById("focus-hint");

const save = createSave();
const game = {
  canvas,
  ctx,
  w: 0,
  h: 0,
  dpr: 1,
  time: 0,
  save,
  settings: () => save.settings(),
  input: createInput(canvas),
  audio: null,
  particles: createParticles(),
  lighting: createLighting(),
  scene: null,
  sceneName: "",
  // Tell the 13i.space page hosting us (if any) about plays and scores.
  post(message) {
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ source: GAME_ID, ...message }, window.location.origin);
      }
    } catch (e) {
      // not embedded, or the parent is elsewhere - nothing to report to
    }
  },
  switchTo(name, args) {
    const scenes = { title: titleScene, intro: introScene, play: playScene, finale: finaleScene };
    if (game.scene && game.scene.exit) game.scene.exit();
    game.sceneName = name;
    game.scene = scenes[name](game, args || {});
  },
};
game.audio = createAudio(game.settings);
game.overlays = createOverlays(game);
game.applySettings = () => {
  game.audio.applyVolume();
  game.particles.setEnabled(!game.settings().reducedEffects);
};
game.applySettings();

function resize() {
  game.dpr = Math.min(window.devicePixelRatio || 1, 2);
  game.w = canvas.clientWidth;
  game.h = canvas.clientHeight;
  canvas.width = Math.round(game.w * game.dpr);
  canvas.height = Math.round(game.h * game.dpr);
  game.lighting.resize(canvas.width, canvas.height);
  if (game.scene && game.scene.resize) game.scene.resize();
}
window.addEventListener("resize", resize);
resize();

// Audio can only start after a user gesture.
const unlockAudio = () => game.audio.start();
window.addEventListener("pointerdown", unlockAudio);
window.addEventListener("keydown", unlockAudio);

// Keyboard input needs focus inside an iframe - make that obvious.
const showHint = (show) => { focusHint.hidden = !show; };
window.addEventListener("blur", () => {
  showHint(true);
  if (game.scene && game.scene.onBlur) game.scene.onBlur();
});
window.addEventListener("focus", () => showHint(false));
canvas.addEventListener("pointerdown", () => { canvas.focus(); showHint(false); });
canvas.focus();

game.switchTo("title");

// Automated testing only: /games/deep-signal/?test exposes the game object.
if (new URLSearchParams(window.location.search).has("test")) window.__deepSignal = game;

let last = performance.now();
let fpsAcc = 0, fpsFrames = 0;
game.fps = 60;

function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000) * (game.timeScale || 1); // timeScale: ?test hook only
  last = now;
  game.time += dt;
  fpsAcc += dt; fpsFrames++;
  if (fpsAcc >= 0.5) { game.fps = Math.round(fpsFrames / fpsAcc); fpsAcc = 0; fpsFrames = 0; }

  try {
    if (game.overlays.active) game.overlays.update(dt);
    else if (game.scene) game.scene.update(dt);

    ctx.setTransform(game.dpr, 0, 0, game.dpr, 0, 0);
    if (game.scene) game.scene.draw(ctx);
    ctx.setTransform(game.dpr, 0, 0, game.dpr, 0, 0);
    if (game.overlays.active) game.overlays.draw(ctx);
  } catch (e) {
    // One bad frame should never kill the game - log it and keep going.
    console.warn("[deep-signal] frame error", e);
    // reset everything a half-finished draw could have left behind, so one
    // error can't make the craft vanish or the screen smear on later frames
    try {
      if (ctx.reset) ctx.reset();
      else { for (let i = 0; i < 32; i++) ctx.restore(); }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      ctx.setLineDash([]);
      ctx.shadowBlur = 0;
    } catch (e2) { /* nothing more to do */ }
  }
  game.input.endFrame();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
