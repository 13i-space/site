// Keyboard, mouse and a light touch layer. Scenes read `held` for movement
// and consume one-shot `pressed` keys each frame.

const KEYMAP = {
  KeyW: "up", ArrowUp: "up",
  KeyS: "down", ArrowDown: "down",
  KeyA: "left", ArrowLeft: "left",
  KeyD: "right", ArrowRight: "right",
  Space: "scan",
  KeyE: "interact",
  ShiftLeft: "pulse", ShiftRight: "pulse",
  KeyM: "map",
  Tab: "log",
  Escape: "pause",
  Enter: "confirm", NumpadEnter: "confirm",
  Digit1: "1", Digit2: "2", Digit3: "3", Digit4: "4",
  Backquote: "debug",
};

export function createInput(canvas) {
  const held = new Set();
  let pressed = new Set();
  const typed = []; // raw key codes, for the debug sequence
  const pointer = { x: 0, y: 0, down: false, clicked: false };
  const touch = { active: false, moveId: null, originX: 0, originY: 0, dx: 0, dy: 0, isTouchDevice: false };

  const onKeyDown = (e) => {
    const action = KEYMAP[e.code];
    if (action) {
      e.preventDefault();
      if (!e.repeat) pressed.add(action);
      held.add(action);
    }
    if (!e.repeat) typed.push(e.code);
    if (typed.length > 12) typed.shift();
  };
  const onKeyUp = (e) => {
    const action = KEYMAP[e.code];
    if (action) held.delete(action);
  };
  const onBlur = () => held.clear();

  const toCanvas = (e) => {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const onPointerDown = (e) => {
    canvas.focus();
    const p = toCanvas(e);
    pointer.x = p.x; pointer.y = p.y;
    pointer.down = true;
    pointer.clicked = true;
    if (e.pointerType === "touch") {
      touch.isTouchDevice = true;
      // left 55% of the screen is a floating joystick
      if (p.x < canvas.clientWidth * 0.55 && touch.moveId === null) {
        touch.moveId = e.pointerId;
        touch.originX = p.x; touch.originY = p.y;
        touch.dx = 0; touch.dy = 0;
        touch.active = true;
      }
    }
  };
  const onPointerMove = (e) => {
    const p = toCanvas(e);
    pointer.x = p.x; pointer.y = p.y;
    if (e.pointerId === touch.moveId) {
      const dx = p.x - touch.originX, dy = p.y - touch.originY;
      const len = Math.hypot(dx, dy) || 1;
      const mag = Math.min(1, len / 50);
      touch.dx = (dx / len) * mag;
      touch.dy = (dy / len) * mag;
    }
  };
  const onPointerUp = (e) => {
    pointer.down = false;
    if (e.pointerId === touch.moveId) {
      touch.moveId = null;
      touch.active = false;
      touch.dx = touch.dy = 0;
    }
  };

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("blur", onBlur);
  canvas.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("pointercancel", onPointerUp);

  return {
    held,
    pointer,
    touch,
    // one-shot: true once per key press
    take(action) {
      if (pressed.has(action)) {
        pressed.delete(action);
        return true;
      }
      return false;
    },
    press(action) { pressed.add(action); }, // for on-screen touch buttons
    takeClick() {
      const c = pointer.clicked;
      pointer.clicked = false;
      return c;
    },
    typedSequence() { return typed.join(","); },
    clearTyped() { typed.length = 0; },
    moveVector() {
      let x = 0, y = 0;
      if (held.has("left")) x -= 1;
      if (held.has("right")) x += 1;
      if (held.has("up")) y -= 1;
      if (held.has("down")) y += 1;
      if (touch.active) { x += touch.dx; y += touch.dy; }
      const len = Math.hypot(x, y);
      return len > 1 ? { x: x / len, y: y / len } : { x, y };
    },
    endFrame() {
      pressed = new Set();
      pointer.clicked = false;
    },
  };
}
