// The Lab's room, painted per pixel (Update 6.21): the back wall as brushed,
// bevelled metal panels with grime, lit by the tank (its colour, falling
// off with distance) and the beacon; the floor as dark, wet-looking tiles
// that reflect the tank's light. The 2D drawing (shelves, screen, pipes,
// the reservoir) goes on top. Scene units: 100 x 100. Returns false without
// WebGL, and the Lab draws its old wall.
import { makeGL } from "../rave/painted/glutil";

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform vec4 uBox;
uniform float uT, uHue, uAlarm, uBeacon, uGlow, uFlick;
uniform vec4 uVat; // x, y, w, h
float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1,0)), f.x), mix(h21(i + vec2(0,1)), h21(i + vec2(1,1)), f.x), f.y); }
float fbm(vec2 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 5; i++){ s += a * noise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; } return s; }
vec3 hsl(float h, float s, float l){ vec3 rgb = clamp(abs(mod(h / 60.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0); return l + s * (rgb - 0.5) * (1.0 - abs(2.0 * l - 1.0)); }
void main(){
  vec2 fc = gl_FragCoord.xy;
  vec2 p = vec2(uBox.x + fc.x / uRes.x * uBox.z, uBox.y + (1.0 - fc.y / uRes.y) * uBox.w);
  vec2 vc = vec2(uVat.x + uVat.z * 0.5, uVat.y + uVat.w * 0.5);
  vec3 tankC = uAlarm > 0.5 ? vec3(0.9, 0.15, 0.2) : hsl(uHue, 0.7, 0.55);
  vec3 col;
  if (p.y < 90.0) {
    // ── the wall: panels 12.5 wide, rows from y 34 every 19 (as the old lines)
    vec2 cell = vec2(mod(p.x, 12.5), mod(p.y - 15.0, 19.0));
    vec2 id = vec2(floor(p.x / 12.5), floor((p.y - 15.0) / 19.0));
    float r = h21(id);
    vec3 base = mix(vec3(0.035, 0.06, 0.075), vec3(0.05, 0.065, 0.1), r);
    base *= 0.85 + 0.3 * fbm(p * vec2(0.08, 1.6) + id * 3.0); // brushed, along the panel
    float grime = fbm(p * 0.35 + id * 7.0);
    base *= 0.75 + 0.4 * grime;
    base = mix(base, vec3(0.02, 0.03, 0.03), smoothstep(0.55, 0.85, fbm(p * vec2(0.6, 0.15) + 3.0)) * smoothstep(40.0, 88.0, p.y) * 0.6); // streaks down the wall
    // bevels: lit top-left edges, dark bottom-right, a dark seam between
    float e = 0.35;
    float top = smoothstep(e, 0.0, cell.y), left = smoothstep(e, 0.0, cell.x);
    float bot = smoothstep(19.0 - e, 19.0, cell.y), right = smoothstep(12.5 - e, 12.5, cell.x);
    base += vec3(0.07, 0.1, 0.12) * max(top, left) * 0.7;
    base *= 1.0 - 0.6 * max(bot, right);
    float seam = smoothstep(0.12, 0.0, min(min(cell.x, 12.5 - cell.x), min(cell.y, 19.0 - cell.y)));
    base *= 1.0 - seam * 0.7;
    // rivets in the corners
    vec2 rv = vec2(min(cell.x, 12.5 - cell.x), min(cell.y, 19.0 - cell.y)) - vec2(0.9);
    float riv = smoothstep(0.32, 0.18, length(rv));
    base = mix(base, vec3(0.12, 0.16, 0.18) * (0.8 + 0.6 * smoothstep(0.3, -0.3, rv.x + rv.y)), riv);
    // a vent grille in a couple of panels
    if (id.x == 2.0 && id.y == 2.0 || id.x == 6.0 && id.y == 1.0) {
      vec2 g = cell - vec2(3.0, 5.0);
      if (g.x > 0.0 && g.x < 6.5 && g.y > 0.0 && g.y < 8.0) base *= 0.45 + 0.55 * smoothstep(0.2, 0.5, abs(fract(g.y * 1.1) - 0.5) * 2.0);
    }
    // the tank's light on the wall: falls off with distance, stronger low down
    float d = length((p - vc) / vec2(1.0, 1.3));
    float light = exp(-d / 22.0) * (0.55 + uGlow * 0.6) * uFlick;
    col = base + base * tankC * light * 6.0 + tankC * light * 0.05;
    // the beacon, top left
    float bd = length(p - vec2(4.0, 10.0));
    vec3 bc = uAlarm > 0.5 ? vec3(0.95, 0.25, 0.3) : vec3(0.92, 0.82, 0.6);
    col += base * bc * exp(-bd / (uAlarm > 0.5 ? 26.0 : 9.0)) * uBeacon * 5.0;
    // cool light from the ceiling, falling off downward
    col += base * vec3(0.5, 0.65, 0.9) * exp(-p.y / 14.0) * 1.2;
  } else {
    // ── the floor: dark tiles, in perspective, a wet sheen
    float fy = (p.y - 90.0) / 10.0;               // 0 at the wall, 1 at the front
    float px = 50.0 + (p.x - 50.0) / (0.7 + 0.3 * fy);
    float pz = 1.0 / (0.15 + fy);
    vec2 tile = vec2(px / 7.0, pz * 2.2);
    vec2 tf = fract(tile);
    float joint = smoothstep(0.04, 0.0, min(min(tf.x, 1.0 - tf.x), min(tf.y, 1.0 - tf.y) * 0.6));
    vec3 base = vec3(0.03, 0.035, 0.06) * (0.8 + 0.4 * h21(floor(tile)));
    base *= 0.85 + 0.3 * fbm(p * vec2(0.6, 3.0));
    base *= 1.0 - joint * 0.6;
    col = base;
    // reflection of the tank: a tall streak of its colour under it, broken by the tiles
    float rx = (p.x - vc.x) / (uVat.z * 0.5);
    float ref = exp(-rx * rx * 2.2) * exp(-fy * 1.6) * (0.6 + 0.4 * noise(vec2(p.x * 2.0, fy * 30.0 + uT * 0.6)));
    col += tankC * ref * (0.25 + uGlow * 0.3) * uFlick * (1.0 - joint * 0.5);
    // the base ring's reflection, a line of light
    col += tankC * exp(-abs(p.y - 91.2) * 3.0) * exp(-rx * rx * 0.8) * 0.18;
    // ambient wall light on the floor near the wall
    col += vec3(0.03, 0.05, 0.07) * exp(-fy * 4.0);
  }
  gl_FragColor = vec4(col, 1.0);
}
`;
let G = null, broken = false;
const NAMES = ["uRes", "uBox", "uT", "uHue", "uAlarm", "uBeacon", "uGlow", "uFlick", "uVat"];
export function paintRoom(ctx, o) {
  if (broken) return false;
  try {
    if (!G) { G = makeGL(FRAG, { x0: 0, y0: 0, w: 100, h: 100 }, NAMES, [], "RB_"); if (!G) { broken = true; return false; } }
    const { gl, U, c } = G;
    const tf = ctx.getTransform(); const k = Math.hypot(tf.a, tf.b);
    let w = Math.round(100 * k), h = Math.round(100 * k);
    const cap = 1100 / Math.max(w, h); if (cap < 1) { w = Math.round(w * cap); h = Math.round(h * cap); }
    if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
    gl.viewport(0, 0, w, h);
    gl.uniform2f(U.uRes, w, h); gl.uniform4f(U.uBox, 0, 0, 100, 100);
    gl.uniform1f(U.uT, o.t); gl.uniform1f(U.uHue, o.hue); gl.uniform1f(U.uAlarm, o.alarm ? 1 : 0);
    gl.uniform1f(U.uBeacon, o.beacon); gl.uniform1f(U.uGlow, o.glow); gl.uniform1f(U.uFlick, o.flick ?? 1);
    gl.uniform4f(U.uVat, o.vat.x, o.vat.y, o.vat.w, o.vat.h);
    gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    ctx.drawImage(c, 0, 0, 100, 100);
    return true;
  } catch (e) { broken = true; console.error(e); return false; }
}
