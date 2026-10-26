"use client";

import { useEffect, useRef, useState } from "react";
import { CX_FRAG } from "../lib/cryptexShader";

// The Cryptex's body, in 3D (Update 6.20): renders lib/cryptexShader.js into a
// canvas from the puzzle's state - each drum's turn (eased, so they roll), which
// are held, whether it's open, a shake when it refuses - and tilts toward the
// pointer. onReady(false) if there's no WebGL (the puzzle falls back to the
// flat drums).

const SEC = (Math.PI * 2) / 9;

function makeGL(canvas, glyphs) {
  const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: true });
  if (!gl) return null;
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, "attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }"));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, CX_FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  gl.useProgram(prog);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const a = gl.getAttribLocation(prog, "a"); gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
  const U = {};
  ["uRes", "uT", "uOpen", "uShake", "uYaw", "uPitch", "uHover", "uRot", "uLock"].forEach((n) => { U[n] = gl.getUniformLocation(prog, n); });
  // the nine marks, as lines and dots
  const edges = new Float32Array(40 * 3), dots = new Float32Array(9);
  let e = 0;
  glyphs.forEach((g, gi) => {
    const list = g.edges === "full" ? Array.from({ length: 9 }, (_, i) => [i, (i + 1) % 9]) : g.edges;
    list.forEach(([x, y]) => { if (e < 40) { edges[e * 3] = gi; edges[e * 3 + 1] = x; edges[e * 3 + 2] = y; e++; } });
    const ds = g.dots === "all" ? [0, 1, 2, 3, 4, 5, 6, 7, 8] : g.dots;
    dots[gi] = ds.reduce((m, d) => m + Math.pow(2, d), 0);
  });
  for (; e < 40; e++) { edges[e * 3] = -10; }
  gl.uniform3fv(gl.getUniformLocation(prog, "uEdge[0]"), edges);
  gl.uniform1fv(gl.getUniformLocation(prog, "uDots[0]"), dots);
  return { gl, U };
}

export default function CryptexDevice({ glyphs, rots, locked, open, shake, onReady, children }) {
  const ref = useRef(null);
  const live = useRef({ rots, locked, open, shake, hover: -1 });
  live.current = { ...live.current, rots, locked, open, shake };
  const [ok, setOk] = useState(true);
  useEffect(() => {
    const c = ref.current;
    let R = null;
    try { R = makeGL(c, glyphs); } catch (e) { console.error(e); R = null; }
    if (!R) { setOk(false); onReady && onReady(false); return; }
    onReady && onReady(true);
    const { gl, U } = R;
    const st = { ang: [0, 0, 0], lock: [0, 0, 0], open: 0, shake: 0, yaw: 0, pit: 0, tyaw: 0, tpit: 0 };
    const onMove = (e) => {
      const r = c.getBoundingClientRect();
      st.tyaw = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2)) * 0.32;
      st.tpit = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2)) * 0.12;
    };
    window.addEventListener("pointermove", onMove);
    let raf = 0, last = performance.now();
    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const W = c.clientWidth, H = c.clientHeight;
      if (!W) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const cw = Math.round(W * dpr), ch = Math.round(H * dpr);
      if (c.width !== cw || c.height !== ch) { c.width = cw; c.height = ch; }
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const L = live.current;
      // ease everything toward the puzzle's state
      for (let i = 0; i < 3; i++) {
        st.ang[i] += (L.rots[i] * SEC - st.ang[i]) * Math.min(1, dt * 12);
        st.lock[i] += ((L.locked[i] ? 1 : 0) - st.lock[i]) * Math.min(1, dt * 5);
      }
      st.open += ((L.open ? 1 : 0) - st.open) * Math.min(1, dt * (L.open ? 1.6 : 4));
      st.shake += ((L.shake ? 1 : 0) - st.shake) * Math.min(1, dt * 20);
      // a slow drift when nobody's moving it
      const idle = Math.sin(now / 4200) * 0.06;
      st.yaw += (st.tyaw + idle - st.yaw) * Math.min(1, dt * 3);
      st.pit += (st.tpit - st.pit) * Math.min(1, dt * 3);
      gl.viewport(0, 0, cw, ch);
      gl.uniform2f(U.uRes, cw, ch);
      gl.uniform1f(U.uT, now / 1000); gl.uniform1f(U.uOpen, st.open); gl.uniform1f(U.uShake, st.shake);
      gl.uniform1f(U.uYaw, st.yaw); gl.uniform1f(U.uPitch, st.pit); gl.uniform1f(U.uHover, L.hover);
      gl.uniform3f(U.uRot, st.ang[0], st.ang[1], st.ang[2]);
      gl.uniform3f(U.uLock, st.lock[0], st.lock[1], st.lock[2]);
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("pointermove", onMove); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  if (!ok) return null;
  return (
    <div className="cx3-stage" onPointerLeave={() => { live.current.hover = -1; }}>
      <canvas ref={ref} className="cx3-canvas" aria-hidden="true" />
      <div className="cx3-zones">
        {children && children((i) => { live.current.hover = i; })}
      </div>
    </div>
  );
}
