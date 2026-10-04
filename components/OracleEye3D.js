"use client";

import { useEffect, useRef, useState } from "react";
import OracleEyeFlat, { paintIris } from "./OracleEyeFlat";

// The Oracle's eye, in the round (Update 5.57, replacing 5.55's flat one).
// Something enormous is pressed up to the far side of the 13i ring and
// looking through it: the eyeball is bigger than the window, so you only
// ever see the middle of it - the iris and the dark sclera around it -
// never the whole eye.
//
// Drawn by a WebGL shader every frame, per pixel, as a real sphere:
//   - the eyeball ROTATES to look at you: veins and iris are fixed to its
//     surface, so as it turns they swing across, foreshorten, and roll
//     toward the edge of the window - not a flat disc sliding about
//   - the iris is the same hand-painted texture as before (paintIris), the
//     pupil widens and narrows with the Oracle's mood, stars deep inside
//   - the light stays put while the eye turns: a window reflection and a
//     glint on the wet cornea, shadow at the rim of the porthole
//   - alien lids slide in from above and below when it closes
//   - the gold 13i ring frames it all
// Falls back to the flat version without WebGL. Reduced motion: it holds
// still and looks straight out.
//
// open: 0..1 (lids). mood: sleeping | listening | receiving | speaking

const PUPIL = { sleeping: 0.16, listening: 0.3, receiving: 0.14, speaking: 0.42 };

const VERT = `
attribute vec2 a;
varying vec2 v;
void main() { v = a; gl_Position = vec4(a, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
varying vec2 v;
uniform sampler2D uIris;
uniform vec3 uF, uR, uU;   // the eye's forward, right and up, in view space
uniform float uT, uPupil, uLid, uPx;

const float WIN = 0.90;    // the window inside the gold ring
const float RS = 1.32;     // the eyeball's radius, in window units: bigger than the window
const float IRIS = 0.40;   // the iris's angular radius on the sphere (radians)

float hash(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float noise(vec3 x) {
  vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x), mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x), mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
}
float fbm(vec3 p) { float s = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { s += a * noise(p); p *= 2.03; a *= 0.5; } return s; }
// thin branching lines: the ridges of a noise field
float veins(vec3 p) { float n = 1.0 - abs(fbm(p) * 2.0 - 1.0); return pow(n, 9.0); }

void main() {
  vec2 q = v;                       // -1..1 across the canvas, y up
  float r = length(q);
  vec3 col = vec3(0.0);
  float alpha = 0.0;

  if (r < WIN) {
    vec2 p = q / WIN;               // window units
    float z = sqrt(RS * RS - dot(p, p));
    vec3 n = normalize(vec3(p, z)); // surface normal, view space
    // the same point, in the eye's own coordinates: this is what turns
    vec3 L = vec3(dot(n, uR), dot(n, uU), dot(n, uF));
    float th = acos(clamp(L.z, -1.0, 1.0));

    // sclera: deep violet-black, veins of light fixed to the surface
    vec3 base = mix(vec3(0.09, 0.08, 0.22), vec3(0.025, 0.02, 0.07), smoothstep(0.3, 1.1, th));
    float vn = veins(L * 4.2) * 0.9 + veins(L * 9.0 + 3.1) * 0.45;
    vn *= smoothstep(IRIS * 1.05, IRIS * 1.6, th);
    base += vec3(0.42, 0.45, 0.95) * vn * 0.38;
    base += vec3(0.05, 0.04, 0.10) * fbm(L * 14.0);
    // a gold warmth the iris throws onto the sclera
    base += vec3(0.55, 0.42, 0.18) * 0.35 * smoothstep(IRIS * 1.7, IRIS, th);
    col = base;

    // the iris and pupil
    if (th < IRIS * 1.02) {
      float rr = th / IRIS;                         // 0 centre .. 1 limbus
      float ang = atan(L.y, L.x) + uT * 0.02;       // a slow drift of the stroma
      float pu = uPupil;
      // the pupil pushes the iris fibres outward as it widens
      float tr = rr < pu ? 0.0 : mix(0.12, 1.0, (rr - pu) / (1.0 - pu));
      vec2 uv = 0.5 + 0.5 * tr * vec2(cos(ang), sin(ang));
      vec3 ir = texture2D(uIris, uv).rgb;
      float edge = smoothstep(1.02, 0.97, rr);
      col = mix(col, ir, edge);
      // the pupil, with stars a long way down
      float pm = smoothstep(pu + 0.02, pu - 0.01, rr);
      vec3 deep = vec3(0.012, 0.008, 0.05);
      vec2 sp = vec2(cos(ang), sin(ang)) * rr / max(pu, 0.01) * 6.0;
      vec2 cell = floor(sp), fr = fract(sp) - 0.5;
      float h = hash(vec3(cell, 7.0));
      float star = step(0.82, h) * smoothstep(0.16, 0.0, length(fr)) * (0.45 + 0.55 * abs(sin(uT * 0.9 + h * 40.0)));
      deep += mix(vec3(0.72, 0.75, 1.0), vec3(0.91, 0.82, 0.6), step(0.92, h)) * star;
      col = mix(col, deep, pm);
    }

    // light from the upper left; it stays put while the eye turns
    vec3 Ld = normalize(vec3(-0.45, 0.55, 0.7));
    float lam = 0.55 + 0.6 * max(dot(n, Ld), 0.0);
    col *= lam;
    // the wet cornea: a bulge over the iris catches a window of light and a glint
    vec3 H = normalize(Ld + vec3(0.0, 0.0, 1.0));
    float spec = pow(max(dot(n, H), 0.0), 220.0);
    float win = smoothstep(0.12, 0.0, length((p - vec2(-0.36, 0.38)) * vec2(1.0, 1.7)));
    col += vec3(1.0) * spec * 0.9 + vec3(0.85, 0.88, 1.0) * win * 0.22;
    col += vec3(1.0) * smoothstep(0.03, 0.0, length(p - vec2(0.34, -0.3))) * 0.35;

    // the porthole's own shadow: the eye is behind the ring, darker at its edge
    col *= mix(1.0, 0.25, smoothstep(0.6, 1.0, r / WIN));

    // alien lids, closing from above and below
    float lidH = uLid * 1.05;
    float curve = lidH * (1.0 - 0.38 * p.x * p.x);
    float d = abs(p.y) - curve;              // > 0: under a lid
    if (d > 0.0) {
      vec3 lid = mix(vec3(0.07, 0.065, 0.17), vec3(0.03, 0.03, 0.08), clamp(d * 2.0, 0.0, 1.0));
      lid += vec3(0.54, 0.58, 0.96) * 0.08 * smoothstep(0.02, 0.0, abs(fract(d * 9.0) - 0.5) - 0.47);
      col = lid * mix(1.0, 0.4, smoothstep(0.6, 1.0, r / WIN));
    }
    // the lid edges catch the light
    col += vec3(0.91, 0.82, 0.6) * 0.6 * smoothstep(uPx * 2.5, 0.0, abs(d)) * step(0.02, uLid);
    alpha = 1.0;
  }

  // the gold 13i ring
  float ringIn = WIN - 0.005, ringOut = 0.985;
  float ring = smoothstep(ringIn - uPx, ringIn + uPx, r) * smoothstep(ringOut + uPx, ringOut - uPx, r);
  if (ring > 0.0) {
    vec3 gold = vec3(0.91, 0.82, 0.60);
    float a = atan(q.y, q.x);
    float hl = smoothstep(0.5, 0.0, abs(a - 2.4)) * 0.5;      // a highlight at the upper left
    float bevel = 1.0 - abs((r - (ringIn + ringOut) * 0.5) / ((ringOut - ringIn) * 0.5));
    vec3 g = gold * (0.65 + 0.35 * bevel) + vec3(1.0, 0.96, 0.86) * hl * bevel;
    col = mix(col, g, ring);
    alpha = max(alpha, ring);
  }
  gl_FragColor = vec4(col * alpha, alpha);
}
`;

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
  return s;
}

export default function OracleEye3D({ open = 1, mood = "listening" }) {
  const canvasRef = useRef(null);
  const [flat, setFlat] = useState(false);
  const live = useRef({ open, mood });
  live.current.open = open;
  live.current.mood = mood;

  useEffect(() => {
    if (flat) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    let gl = null;
    try { gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: true }); } catch (e) { gl = null; }
    if (!gl) { setFlat(true); return; }
    let prog;
    try {
      prog = gl.createProgram();
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    } catch (e) { setFlat(true); return; }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const aLoc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(aLoc);
    gl.vertexAttribPointer(aLoc, 2, gl.FLOAT, false, 0, 0);

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, paintIris(512));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const U = {};
    ["uIris", "uF", "uR", "uU", "uT", "uPupil", "uLid", "uPx"].forEach((n) => { U[n] = gl.getUniformLocation(prog, n); });
    gl.uniform1i(U.uIris, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, dpr = 1, raf = 0;
    const st = { yaw: 0, pitch: 0, ty: 0, tp: 0, pupil: 0.3, lid: 0, lastMove: 0, nextGlance: 0 };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(W * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    ro?.observe(canvas);

    // where you are, as angles for the eyeball to turn through
    const onMove = (e) => {
      if (reduced) return;
      const r = canvas.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / (window.innerWidth * 0.5);
      const dy = (e.clientY - cy) / (window.innerHeight * 0.5);
      st.ty = Math.max(-1, Math.min(1, dx)) * 0.55;
      st.tp = -Math.max(-1, Math.min(1, dy)) * 0.45;
      st.lastMove = performance.now();
    };
    window.addEventListener("pointermove", onMove);

    const draw = (now) => {
      const t = now / 1000;
      const { open: o, mood: m } = live.current;
      if (!reduced) {
        if (m === "receiving") { st.ty = 0; st.tp = 0.35; }
        else if (now - st.lastMove > 3500 && now > st.nextGlance) {
          st.ty = (Math.random() - 0.5) * 0.8;
          st.tp = (Math.random() - 0.5) * 0.5;
          st.nextGlance = now + 1800 + Math.random() * 2600;
        }
      }
      // eyes move in quick, eased turns
      const k = reduced ? 1 : 0.09;
      st.yaw += (st.ty - st.yaw) * k;
      st.pitch += (st.tp - st.pitch) * k;
      st.pupil += ((PUPIL[m] || 0.3) * (1 + (m === "speaking" ? 0.06 * Math.sin(t * 3) : 0.03 * Math.sin(t * 0.8))) - st.pupil) * 0.06;
      st.lid += (Math.max(0, Math.min(1, o)) - st.lid) * (reduced ? 1 : 0.04);

      // the eye's basis: forward toward the gaze, with a little roll of its own
      const cy = Math.cos(st.yaw), sy = Math.sin(st.yaw), cp = Math.cos(st.pitch), sp = Math.sin(st.pitch);
      const F = [sy * cp, sp, cy * cp];
      const roll = reduced ? 0 : 0.06 * Math.sin(t * 0.21);
      const up0 = [Math.sin(roll), Math.cos(roll), 0];
      const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
      const norm = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
      const R = norm(cross(up0, F));
      const Uv = cross(F, R);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform3fv(U.uF, F);
      gl.uniform3fv(U.uR, R);
      gl.uniform3fv(U.uU, Uv);
      gl.uniform1f(U.uT, t);
      gl.uniform1f(U.uPupil, st.pupil);
      gl.uniform1f(U.uLid, st.lid);
      gl.uniform1f(U.uPx, 2 / Math.max(1, canvas.width));
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      window.removeEventListener("pointermove", onMove);
      gl.deleteTexture(tex); gl.deleteBuffer(buf); gl.deleteProgram(prog);
    };
  }, [flat]);

  if (flat) return <OracleEyeFlat open={open} mood={mood} />;
  return <canvas ref={canvasRef} className="oracle-eye3d" aria-hidden="true" />;
}
