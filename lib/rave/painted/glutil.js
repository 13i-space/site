// one small WebGL renderer per painted character
export function makeGL(FR, BX, names, arrays, pre) {
  const c = document.createElement("canvas");
  const gl = c.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false, preserveDrawingBuffer: true });
  if (!gl) return null;
  const head = `#define ${pre}X0 ${BX.x0.toFixed(1)}\n#define ${pre}Y0 ${BX.y0.toFixed(1)}\n#define ${pre}W ${BX.w.toFixed(1)}\n#define ${pre}H ${BX.h.toFixed(1)}\n`;
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
  const prog = gl.createProgram();
  try {
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, "attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }"));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FR.replace("precision highp float;", "precision highp float;\n" + head)));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  } catch (e) { console.error(e); return null; }
  gl.useProgram(prog);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const a = gl.getAttribLocation(prog, "a"); gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
  const U = {};
  names.forEach((n) => { U[n] = gl.getUniformLocation(prog, n); });
  arrays.forEach((n) => { U[n] = gl.getUniformLocation(prog, n + "[0]"); });
  return { c, gl, U };
}
