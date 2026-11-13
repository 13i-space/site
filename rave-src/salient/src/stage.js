// The room: a nine-sided floor, the LED wall, the truss with nine moving heads,
// speakers, lasers, haze, CO2 jets and a crowd with glow sticks.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

import { LOGO } from './logo.js';
const TAU = Math.PI * 2;
export const FLOOR_R = 8;
export const BOOTH_Z = -7.6;
export const RISER_H = 1.0;

const NONAGON = `
float nonagon(vec2 p){ float a = atan(p.x, p.y); float seg = 6.2831853/9.0; a = mod(a + seg*0.5, seg) - seg*0.5; return length(p) * cos(a) / cos(seg*0.5); }
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
`;

function floorMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: { uBeat: { value: 0 }, uKick: { value: 0 }, uEnergy: { value: 0 }, uA: { value: new THREE.Color() }, uB: { value: new THREE.Color() }, uFlash: { value: 0 }, uWarden: { value: 0 } },
    vertexShader: `varying vec2 vP; varying vec3 vW; void main(){ vP = position.xy; vec4 w = modelMatrix*vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }`,
    fragmentShader: `
      uniform float uBeat,uKick,uEnergy,uFlash,uWarden; uniform vec3 uA,uB; varying vec2 vP; varying vec3 vW;
      ${NONAGON}
      void main(){
        vec2 p = vP / ${FLOOR_R.toFixed(1)};
        float d = nonagon(p);
        float ang = atan(p.x, p.y); float seg = floor((ang + 3.14159265) / (6.2831853/9.0));
        // rings rolling outward, one per beat
        float ring = fract(d*3.0 - uBeat*0.5);
        float ringGlow = smoothstep(0.0,0.08,ring) * smoothstep(0.34,0.08,ring);
        // tiles
        vec2 g = vW.xz*1.0; vec2 f = abs(fract(g)-0.5); float line = smoothstep(0.47,0.5,max(f.x,f.y));
        vec2 cell = floor(g); float tw = hash(cell + floor(uBeat*2.0)*0.37);
        float tile = step(1.0 - 0.10 - uEnergy*0.22, tw);
        // a chase round the nine segments
        float chase = step(0.5, 1.0 - abs(mod(seg - floor(uBeat), 9.0) - 0.0)) ;
        vec3 col = vec3(0.012,0.012,0.03);
        vec3 mixc = mix(uA, uB, 0.5 + 0.5*sin(d*5.0 - uBeat*0.7854));
        col += mixc * ringGlow * (0.05 + 0.3*uEnergy) * (0.35 + uKick);
        col += mix(uB,uA,tw) * tile * (0.08 + 0.4*uKick) * uEnergy;
        col += uA * chase * 0.22 * uEnergy * smoothstep(0.25,1.0,d);
        col += mixc * line * (0.07 + 0.16*uEnergy);
        // edge strip
        float edge = smoothstep(0.93,0.965,d) * smoothstep(1.0,0.975,d);
        col += mix(uA,uB,0.5+0.5*sin(ang*9.0 + uBeat*1.5708)) * edge * (0.9 + 1.6*uKick);
        // the warden's seal burning through the middle
        float wd = nonagon((vP - vec2(0.0, 1.2)) / 3.4);
        float seal = smoothstep(0.08,0.0,abs(wd-0.9)) + smoothstep(0.05,0.0,abs(wd-0.55)) + 0.6*smoothstep(1.0,0.0,wd)*(0.5+0.5*sin(ang*18.0+uBeat*3.14));
        col += vec3(1.0,0.72,0.25) * seal * uWarden * 1.6;
        col += vec3(1.0) * uFlash * 0.25;
        col *= smoothstep(1.02,0.99,d);
        gl_FragColor = vec4(col, 1.0);
      }`,
  });
}

function wallMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: { uBeat: { value: 0 }, uKick: { value: 0 }, uHigh: { value: 0 }, uMid: { value: 0 }, uMode: { value: 0 }, uMix: { value: 0 }, uModeB: { value: 0 }, uA: { value: new THREE.Color() }, uB: { value: new THREE.Color() }, uFlash: { value: 0 }, uDim: { value: 1 }, uClose: { value: 0 } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
    fragmentShader: `
      uniform float uBeat,uKick,uHigh,uMid,uMode,uModeB,uMix,uFlash,uDim,uClose; uniform vec3 uA,uB; varying vec2 vUv;
      ${NONAGON}
      vec3 scene(float mode, vec2 p, vec2 uv){
        float r = length(p); float d = nonagon(p); float a = atan(p.x,p.y);
        vec3 c = vec3(0.0);
        if (mode < 0.5) {            // the eye: a ring, and ripples leaving it
          float eye = smoothstep(0.035,0.0,abs(r-0.36-0.02*uKick));
          float pupil = smoothstep(0.13+0.05*uKick,0.10,r);
          float rip = 0.0; for(int i=0;i<4;i++){ float rr = fract(uBeat*0.125 + float(i)*0.25); rip += smoothstep(0.012,0.0,abs(r-0.36-rr*1.6))*(1.0-rr); }
          c = uA*eye*1.6 + uB*pupil*(0.5+uMid) + mix(uA,uB,0.5)*rip*0.8;
        } else if (mode < 1.5) {     // nine-sided tunnel
          float z = 1.0/max(d,0.02); float bands = fract(z*0.9 + uBeat*0.5);
          float w = smoothstep(0.0,0.06,bands)*smoothstep(0.5,0.12,bands);
          float spoke = smoothstep(0.75,1.0,abs(sin(a*4.5 + uBeat*0.3927)));
          c = mix(uA,uB,fract(z*0.25+uBeat*0.125))*w*(0.35+0.9*uKick)*smoothstep(0.0,0.5,d)*2.0 + uB*spoke*0.12*d;
        } else if (mode < 2.5) {     // drop: bars and blocks
          float col = floor(uv.x*24.0); float h = hash(vec2(col, floor(uBeat*4.0)));
          float bar = step(abs(uv.y-0.5)*2.0, 0.15 + h*(0.4+0.6*uKick));
          float blk = step(0.72, hash(floor(uv*vec2(12.0,5.0)) + floor(uBeat*2.0)));
          c = mix(uA,uB,h)*bar*1.3 + vec3(1.0)*blk*uKick*0.6;
        } else if (mode < 3.5) {     // break: slow curtains and stars
          float cur = 0.0; for(int i=0;i<3;i++){ float fi=float(i); cur += smoothstep(0.25,0.0,abs(p.y - 0.25*sin(p.x*2.0+uBeat*0.2+fi*2.1) - (fi-1.0)*0.35))*0.5; }
          vec2 sg = floor(uv*vec2(90.0,40.0)); float st = step(0.985, hash(sg))*(0.5+0.5*sin(uBeat*1.57+hash(sg+3.0)*6.28));
          c = mix(uA,uB,uv.y)*cur*(0.6+uMid) + vec3(0.8,0.9,1.0)*st;
        } else {                     // the warden: a sun behind him
          float rays = pow(abs(sin(a*9.0 + uBeat*0.3927)), 6.0);
          float disc = smoothstep(0.42,0.36,d);
          c = vec3(1.0,0.72,0.22)*(rays*smoothstep(1.6,0.3,r)*(0.5+uKick) + disc*0.4) + vec3(1.0,0.35,0.1)*smoothstep(0.05,0.0,abs(d-0.5))*2.0;
        }
        return c;
      }
      void main(){
        vec2 cells = vec2(144.0, 54.0);
        vec2 q = (floor(vUv*cells)+0.5)/cells;
        vec2 p = (q-0.5)*vec2(2.667,1.0)*2.0;
        vec3 c = mix(scene(uMode,p,q), scene(uModeB,p,q), uMix);
        // a shutter closing in during the held breath before a drop
        float sh = nonagon(p*0.6); c *= mix(1.0, smoothstep(1.0-uClose, 1.0-uClose-0.05, sh) , step(0.001,uClose));
        c += vec3(1.0)*smoothstep(0.03,0.0,abs(sh-(1.0-uClose)))*step(0.001,uClose)*1.5;
        vec2 f = fract(vUv*cells)-0.5; float dot_ = smoothstep(0.5,0.25,length(f));
        c = c*dot_*uDim + vec3(1.0)*uFlash*dot_;
        gl_FragColor = vec4(c*0.85 + vec3(0.004,0.004,0.01), 1.0);
      }`,
  });
}

export function beamMaterial(flip) {
  return new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(1, 1, 1) }, uI: { value: 1 } },
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    vertexShader: `varying float vL; varying vec3 vN; varying vec3 vV; void main(){ vL = uv.y; vec4 mv = modelViewMatrix*vec4(position,1.0); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }`,
    fragmentShader: `uniform vec3 uColor; uniform float uI; varying float vL; varying vec3 vN; varying vec3 vV;
      void main(){ float e = pow(abs(dot(normalize(vN), normalize(vV))), 1.2); float a = e * ${flip ? 'pow(1.0-vL, 0.8)' : 'pow(vL, 1.1)'} * uI; gl_FragColor = vec4(uColor*a, a); }`,
  });
}

export function buildStage(scene) {
  const S = { beams: [], lasers: [], speakers: [], jets: [], strips: [], arrayLeds: [] };
  const cv = document.createElement('canvas'); cv.width = cv.height = 128; const cx = cv.getContext('2d');
  const gr = cx.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, '#fff'); gr.addColorStop(0.35, '#888'); gr.addColorStop(1, '#000'); cx.fillStyle = gr; cx.fillRect(0, 0, 128, 128);
  S.glowTex = new THREE.CanvasTexture(cv);

  // ground beyond the floor
  const ground = new THREE.Mesh(new THREE.CircleGeometry(60, 48), new THREE.MeshStandardMaterial({ color: 0x030306, roughness: 0.95, metalness: 0.0 }));
  ground.rotation.x = -Math.PI / 2; ground.position.y = -0.02; scene.add(ground);

  // the nine-sided floor
  S.floorMat = floorMaterial();
  const floor = new THREE.Mesh(new THREE.CircleGeometry(FLOOR_R * 1.03, 9, Math.PI / 2 - Math.PI / 9), S.floorMat);
  floor.rotation.x = -Math.PI / 2; scene.add(floor);
  // LED wall
  S.wallMat = wallMaterial();
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(22, 8.25), S.wallMat);
  wall.position.set(0, 5.6, -11.2); scene.add(wall); S.wall = wall;
  S.logoMat = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(LOGO), transparent: true, opacity: 0, depthWrite: false, toneMapped: false });
  S.logoMat.map.colorSpace = THREE.SRGBColorSpace;
  S.logo = new THREE.Mesh(new THREE.PlaneGeometry(15.6, 15.6 * 249 / 720), S.logoMat); S.logo.position.set(0, 5.75, -11.05); S.logo.renderOrder = 3; scene.add(S.logo);
  const frameM = new THREE.MeshStandardMaterial({ color: 0x0b0c14, roughness: 0.5, metalness: 0.7 });
  const frame = new THREE.Mesh(new THREE.BoxGeometry(22.6, 8.85, 0.3), frameM); frame.position.set(0, 5.6, -11.4); scene.add(frame);
  // great pillars either side, with a light seam
  for (const sx of [-1, 1]) {
    const p = new THREE.Mesh(new THREE.BoxGeometry(2.2, 13, 2.2), new THREE.MeshStandardMaterial({ color: 0x15131c, roughness: 0.85, metalness: 0.1 }));
    p.position.set(sx * 13, 6.5, -10.6); scene.add(p);
    const seam = new THREE.Mesh(new THREE.BoxGeometry(0.12, 11, 0.05), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    seam.position.set(sx * 13, 6.3, -9.48); scene.add(seam); S.strips.push(seam);
    const p2 = p.clone(); p2.position.set(sx * 15.5, 6.5, 2); scene.add(p2);
    const seam2 = seam.clone(); seam2.material = seam.material.clone(); seam2.position.set(sx * 14.38, 6.3, 2); seam2.rotation.y = Math.PI / 2; scene.add(seam2); S.strips.push(seam2);
  }

  // truss: a nonagon ring, a moving head at each corner
  const trussM = new THREE.MeshStandardMaterial({ color: 0x22242e, roughness: 0.45, metalness: 0.9 });
  const TR = 7.2, TY = 8.6;
  const beamGeo = new THREE.CylinderGeometry(0.07, 1.25, 1, 20, 1, true); beamGeo.translate(0, -0.5, 0);
  // uv.y: 1 at apex (top) -> 0 at far end
  for (let i = 0; i < 9; i++) {
    const a0 = i / 9 * TAU + Math.PI / 9, a1 = (i + 1) / 9 * TAU + Math.PI / 9;
    const p0 = new THREE.Vector3(Math.sin(a0) * TR, TY, Math.cos(a0) * TR - 0.5), p1 = new THREE.Vector3(Math.sin(a1) * TR, TY, Math.cos(a1) * TR - 0.5);
    for (const dy of [0, 0.35]) {
      const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, p0.distanceTo(p1), 6), trussM);
      tube.position.copy(p0).lerp(p1, 0.5); tube.position.y += dy; tube.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p1.clone().sub(p0).normalize()); scene.add(tube);
    }
    const head = new THREE.Group(); head.position.copy(p0); head.position.y -= 0.25; scene.add(head);
    const can = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.42, 12), trussM); can.position.y = -0.05; head.add(can);
    const lens = new THREE.Mesh(new THREE.CircleGeometry(0.15, 16), new THREE.MeshBasicMaterial({ color: 0xffffff })); lens.rotation.x = Math.PI / 2; lens.position.y = -0.27; head.add(lens);
    const cone = new THREE.Mesh(beamGeo, beamMaterial()); cone.scale.set(1, 15, 1); cone.position.y = -0.27; cone.renderOrder = 5; head.add(cone);
    const pool = new THREE.Mesh(new THREE.CircleGeometry(2.3, 24), new THREE.MeshBasicMaterial({ map: S.glowTex, color: 0xffffff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.2 }));
    pool.rotation.x = -Math.PI / 2; pool.position.y = 0.02; scene.add(pool);
    S.beams.push({ head, cone, lens, pool, base: head.position.clone(), i, dir: new THREE.Vector3(0, -1, 0), target: new THREE.Vector3() });
  }

  // lasers from the top corners of the wall
  const lg = new THREE.CylinderGeometry(0.008, 0.008, 1, 5, 1, true); lg.translate(0, 0.5, 0);
  for (const sx of [-1, 1]) for (let k = 0; k < 6; k++) {
    const m = new THREE.Mesh(lg, new THREE.MeshBasicMaterial({ color: 0x66ffcc, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0 }));
    m.position.set(sx * 10.6, 9.4, -11); m.scale.set(1, 34, 1); scene.add(m); S.lasers.push({ m, sx, k });
  }

  // speaker stacks: two subs on the floor, a mid/high box on top, and a flown line array each side
  const boxM = new THREE.MeshStandardMaterial({ color: 0x0b0b10, roughness: 0.55, metalness: 0.45 });
  const edgeM = new THREE.MeshStandardMaterial({ color: 0x23242e, roughness: 0.35, metalness: 0.9 });
  const coneM = new THREE.MeshStandardMaterial({ color: 0x101016, roughness: 0.75, metalness: 0.2 });
  const capM = new THREE.MeshStandardMaterial({ color: 0x2c2d38, roughness: 0.25, metalness: 0.9 });
  const grilleM = new THREE.ShaderMaterial({ transparent: true, depthWrite: false,
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
    fragmentShader: `varying vec2 vUv; void main(){ vec2 g = fract(vUv*vec2(46.0,38.0))-0.5; float hole = smoothstep(0.34,0.26,length(g)); gl_FragColor = vec4(vec3(0.03,0.03,0.045), 0.78*(1.0-hole*0.9)); }` });
  const driver = (parent, x, y, r, amt, j) => {
    const g = new THREE.Group(); g.position.set(x, y, 0); parent.add(g);
    const basket = new THREE.Mesh(new THREE.RingGeometry(r * 1.0, r * 1.14, 36), edgeM); g.add(basket);
    for (let k = 0; k < 8; k++) { const bolt = new THREE.Mesh(new THREE.CircleGeometry(r * 0.035, 6), capM); const a = k / 8 * TAU + 0.39; bolt.position.set(Math.cos(a) * r * 1.07, Math.sin(a) * r * 1.07, 0.004); g.add(bolt); }
    const ringM = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const led = new THREE.Mesh(new THREE.RingGeometry(r * 1.15, r * 1.2, 40), ringM); led.position.z = 0.003; g.add(led);
    const pump = new THREE.Group(); g.add(pump);
    const cone = new THREE.Mesh(new THREE.ConeGeometry(r * 0.93, r * 0.42, 36, 1, true), coneM); cone.rotation.x = Math.PI / 2; cone.position.z = -r * 0.21; cone.material.side = THREE.DoubleSide; pump.add(cone);
    const surround = new THREE.Mesh(new THREE.TorusGeometry(r * 0.93, r * 0.055, 8, 36), new THREE.MeshStandardMaterial({ color: 0x060608, roughness: 0.9 })); pump.add(surround);
    const cap = new THREE.Mesh(new THREE.SphereGeometry(r * 0.3, 16, 8, 0, TAU, 0, Math.PI / 2), capM); cap.rotation.x = Math.PI / 2; cap.position.z = -r * 0.36; pump.add(cap);
    S.speakers.push({ cone: pump, ringM, j, amt, r });
    return g;
  };
  const cabinet = (w, h, d) => {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.BoxGeometry(w, h, d), boxM));
    const fr = new THREE.Mesh(new THREE.BoxGeometry(w + 0.04, h + 0.04, 0.06), edgeM); fr.position.z = d / 2 - 0.05; g.add(fr);
    const face = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.1, h - 0.1), new THREE.MeshStandardMaterial({ color: 0x050507, roughness: 0.9 })); face.position.z = d / 2 - 0.015; g.add(face);
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) { const c = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.14), edgeM); c.position.set(sx * (w / 2 - 0.04), sy * (h / 2 - 0.04), d / 2 - 0.04); g.add(c); }
    for (const sx of [-1, 1]) { const hd = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.34, 0.2), edgeM); hd.position.set(sx * (w / 2 + 0.01), 0, 0); g.add(hd); }
    const front = new THREE.Group(); front.position.z = d / 2; g.add(front); g.front = front; g.w = w; g.h = h;
    return g;
  };
  for (const sx of [-1, 1]) {
    const stack = new THREE.Group(); stack.position.set(sx * 9.7, 0, -8.1); stack.rotation.y = -sx * 0.38; scene.add(stack);
    for (let j = 0; j < 2; j++) {           // subs
      const c = cabinet(2.3, 1.55, 1.7); c.position.y = 0.8 + j * 1.6; stack.add(c);
      driver(c.front, -0.55, 0, 0.56, 1.0, j); driver(c.front, 0.6, 0.0, 0.56, 1.0, j + 1);
      for (const py of [-0.56, 0.56]) { const port = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.09, 0.02), new THREE.MeshBasicMaterial({ color: 0x000000 })); port.position.set(0, py * 1.18, 0.0); c.front.add(port); }
      const gr = new THREE.Mesh(new THREE.PlaneGeometry(2.18, 1.42), grilleM); gr.position.z = 0.06; c.front.add(gr);
    }
    const top = cabinet(2.1, 1.25, 1.4); top.position.y = 3.85; stack.add(top);   // mid / high
    driver(top.front, -0.58, -0.08, 0.34, 0.5, 2); driver(top.front, 0.58, -0.08, 0.34, 0.5, 3);
    const horn = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.3, 0.03), capM); horn.position.set(0, 0.36, 0.0); top.front.add(horn);
    const throat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.2, 0.035), new THREE.MeshBasicMaterial({ color: 0x000000 })); throat.position.set(0, 0.36, 0.004); top.front.add(throat);
    const hornLed = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.02, 0.04), new THREE.MeshBasicMaterial({ color: 0xffffff })); hornLed.position.set(0, 0.16, 0.0); top.front.add(hornLed); S.strips.push(hornLed);
    const tw = new THREE.Mesh(new THREE.CircleGeometry(0.09, 16), capM); tw.position.set(0, -0.3, 0.003); top.front.add(tw);
    const badge = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.05, 0.02), new THREE.MeshBasicMaterial({ color: 0xffffff })); badge.position.set(0, -0.52, 0.0); top.front.add(badge); S.strips.push(badge);
    // flown line array, curving down toward the floor
    const arr = new THREE.Group(); arr.position.set(sx * 8.3, 9.4, -5.6); arr.rotation.y = -sx * 0.5; scene.add(arr);
    const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 3, 4), edgeM); cable.position.y = 1.6; arr.add(cable);
    let y = 0, tilt = 0.05;
    for (let k = 0; k < 7; k++) {
      const el = new THREE.Group(); el.position.set(0, y, Math.sin(tilt) * -0.5 * k * 0.25); el.rotation.x = tilt; arr.add(el);
      el.add(new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.4, 0.75), boxM));
      const fr = new THREE.Mesh(new THREE.BoxGeometry(1.74, 0.42, 0.04), edgeM); fr.position.z = 0.36; el.add(fr);
      const gp = new THREE.Mesh(new THREE.PlaneGeometry(1.62, 0.32), new THREE.MeshStandardMaterial({ color: 0x040406, roughness: 0.9 })); gp.position.z = 0.385; el.add(gp);
      for (const dx of [-0.52, 0.52]) { const dm = new THREE.Mesh(new THREE.CircleGeometry(0.14, 16), coneM); dm.position.set(dx, 0, 0.388); el.add(dm); }
      const lm = new THREE.MeshBasicMaterial({ color: 0xffffff }); const ln = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.035, 0.02), lm); ln.position.set(0, 0, 0.39); el.add(ln); S.arrayLeds.push({ m: lm, k, sx });
      y -= 0.43; tilt += 0.055;
    }
  }

  // CO2 jets along the front of the booth
  const jg = new THREE.CylinderGeometry(0.55, 0.08, 1, 14, 1, true); jg.translate(0, 0.5, 0);
  for (const x of [-5.4, -3.6, 3.6, 5.4]) {
    const m = new THREE.Mesh(jg, beamMaterial(true)); m.position.set(x, 0.1, BOOTH_Z + 2.3); m.material.uniforms.uColor.value.set(0.9, 0.95, 1); m.scale.set(1, 0.01, 1); m.renderOrder = 6; scene.add(m); S.jets.push(m);
  }

  // haze motes
  const N = 700, pos = new Float32Array(N * 3), seed = new Float32Array(N);
  for (let i = 0; i < N; i++) { pos[i * 3] = (Math.random() - 0.5) * 30; pos[i * 3 + 1] = Math.random() * 10; pos[i * 3 + 2] = (Math.random() - 0.5) * 26 - 1; seed[i] = Math.random(); }
  const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pos, 3)); pg.setAttribute('seed', new THREE.BufferAttribute(seed, 1));
  S.moteMat = new THREE.ShaderMaterial({
    uniforms: { uT: { value: 0 }, uColor: { value: new THREE.Color() }, uI: { value: 1 } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `attribute float seed; uniform float uT; varying float vS; void main(){ vS = seed; vec3 p = position; p.y = mod(p.y + uT*(0.08+seed*0.12), 10.0); p.x += sin(uT*0.3+seed*40.0)*0.6; vec4 mv = modelViewMatrix*vec4(p,1.0); gl_PointSize = (10.0+seed*26.0)/-mv.z; gl_Position = projectionMatrix*mv; }`,
    fragmentShader: `uniform vec3 uColor; uniform float uI; varying float vS; void main(){ float d = length(gl_PointCoord-0.5); float a = smoothstep(0.5,0.0,d)*(0.25+0.5*vS)*uI; gl_FragColor = vec4(uColor*a, a); }`,
  });
  scene.add(new THREE.Points(pg, S.moteMat));

  // crowd: seven kinds of alien in the shadows, round the front and sides
  const C = 96; S.crowdN = C;
  const bodyM = new THREE.MeshStandardMaterial({ color: 0x08080e, roughness: 0.62, metalness: 0.25 });
  const part = (g, x, y, z, rx = 0, rz = 0, sx = 1, sy = 1, sz = 1) => { g.scale(sx, sy, sz); g.rotateX(rx); g.rotateZ(rz); g.translate(x, y, z); return g; };
  const sph = (r, x, y, z, sx = 1, sy = 1, sz = 1) => part(new THREE.SphereGeometry(r, 10, 8), x, y, z, 0, 0, sx, sy, sz);
  const cyl = (r0, r1, h, x, y, z, rx = 0, rz = 0) => part(new THREE.CylinderGeometry(r0, r1, h, 8), x, y, z, rx, rz);
  const cone = (r, h, x, y, z, rx = 0, rz = 0) => part(new THREE.ConeGeometry(r, h, 7), x, y, z, rx, rz);
  const K = {
    grey: { g: [cyl(0.15, 0.1, 1.0, 0, 0.6, 0), cyl(0.2, 0.15, 0.3, 0, 1.2, 0), cyl(0.05, 0.05, 0.16, 0, 1.42, 0), sph(0.22, 0, 1.66, 0.02, 1, 1.3, 1.05)], eyes: [[-0.09, 1.62, 0.2], [0.09, 1.62, 0.2]], eyeS: [1.5, 0.8], sh: [0.22, 1.28], arm: 0.7, top: 1.95 },
    squid: { g: [sph(0.3, 0, 1.45, 0, 0.9, 1.5, 0.9), cyl(0.2, 0.26, 0.5, 0, 0.95, 0), ...[0, 1, 2, 3, 4, 5].map(i => { const a = i / 6 * TAU; return cyl(0.05, 0.015, 0.85, Math.sin(a) * 0.2, 0.36, Math.cos(a) * 0.2, Math.cos(a) * 0.22, -Math.sin(a) * 0.22); })], eyes: [[-0.2, 1.2, 0.2], [0.2, 1.2, 0.2]], eyeS: [1.2, 1.2], sh: [0.24, 1.05], arm: 0.75, top: 1.9, tent: true },
    brute: { g: [cyl(0.5, 0.32, 0.95, 0, 0.95, 0), cyl(0.34, 0.3, 0.5, 0, 0.26, 0), sph(0.3, -0.5, 1.36, 0), sph(0.3, 0.5, 1.36, 0), sph(0.2, 0, 1.56, 0.08), cone(0.07, 0.36, -0.17, 1.8, 0.05, 0, 0.5), cone(0.07, 0.36, 0.17, 1.8, 0.05, 0, -0.5)], eyes: [[-0.08, 1.58, 0.26], [0.08, 1.58, 0.26]], eyeS: [1, 0.5], sh: [0.62, 1.34], arm: 0.8, top: 1.95, thick: 1.9 },
    mantis: { g: [cyl(0.1, 0.06, 0.9, 0, 0.5, 0), cyl(0.16, 0.1, 0.55, 0, 1.15, 0.06, 0.25), cone(0.2, 0.34, 0, 1.56, 0.18, Math.PI * 0.62), cyl(0.012, 0.012, 0.6, -0.1, 1.9, 0.1, -0.3, 0.35), cyl(0.012, 0.012, 0.6, 0.1, 1.9, 0.1, -0.3, -0.35), cyl(0.03, 0.02, 0.7, -0.14, 0.35, 0.06, 0, 0.18), cyl(0.03, 0.02, 0.7, 0.14, 0.35, 0.06, 0, -0.18)], eyes: [[-0.15, 1.62, 0.2], [0.15, 1.62, 0.2]], eyeS: [1.3, 1.3], sh: [0.17, 1.3], arm: 0.8, top: 2.1 },
    blob: { g: [sph(0.46, 0, 0.5, 0, 1.1, 1.05, 1), sph(0.3, 0, 0.98, 0.04), cyl(0.03, 0.04, 0.5, -0.14, 1.4, 0.05, 0, 0.25), cyl(0.03, 0.04, 0.5, 0.14, 1.4, 0.05, 0, -0.25), sph(0.08, -0.2, 1.66, 0.05), sph(0.08, 0.2, 1.66, 0.05)], eyes: [[-0.2, 1.67, 0.11], [0.2, 1.67, 0.11]], eyeS: [1.5, 1.5], sh: [0.45, 0.8], arm: 0.5, top: 1.75 },
    floater: { g: [sph(0.42, 0, 1.75, 0, 1, 0.62, 1), cyl(0.36, 0.42, 0.1, 0, 1.6, 0), ...[0, 1, 2, 3, 4, 5, 6].map(i => { const a = i / 7 * TAU; return cyl(0.035, 0.008, 1.1, Math.sin(a) * 0.27, 1.02, Math.cos(a) * 0.27, Math.cos(a) * 0.1, -Math.sin(a) * 0.1); })], eyes: [[-0.13, 1.7, 0.4], [0.13, 1.7, 0.4], [0, 1.82, 0.38]], eyeS: [0.9, 0.9], sh: null, top: 2.05, hover: 0.5 },
    spine: { g: [cyl(0.24, 0.3, 1.0, 0, 0.62, 0), sph(0.26, 0, 1.2, 0, 1.15, 0.9, 1), sph(0.19, 0, 1.52, 0.1, 1, 0.9, 1.25), ...[0, 1, 2, 3, 4].map(i => cone(0.06, 0.42, 0, 1.72 - i * 0.26, -0.16 - Math.sin(i * 0.7) * 0.1, -1.0 - i * 0.12)), cyl(0.07, 0.02, 0.9, 0, 0.3, -0.42, 1.0)], eyes: [[-0.09, 1.54, 0.3], [0.09, 1.54, 0.3]], eyeS: [1.6, 0.6], sh: [0.3, 1.22], arm: 0.7, top: 1.9 },
  };
  const kinds = Object.keys(K); const rnd = mulberry(13);
  S.crowd = []; const count = {}; kinds.forEach(k => count[k] = 0);
  const eyeHues = [0x66ffe0, 0xff5a4a, 0xffd060, 0xb080ff, 0x70b8ff, 0x9cff6a, 0xff7ad0];
  for (let i = 0; i < C; i++) {
    const ang = (rnd() * 250 - 125) * Math.PI / 180;           // 0 = straight toward the camera
    const r = 9.6 + rnd() * 4.4 + (Math.abs(ang) > 1.6 ? 1.2 : 0);
    let kind = kinds[Math.floor(rnd() * kinds.length)]; if (kind === 'floater' && Math.abs(ang) < 0.75) kind = 'grey';
    const x = Math.sin(ang) * r, z = Math.cos(ang) * r + 0.3;
    S.crowd.push({ kind, n: count[kind]++, x, z, yaw: Math.atan2(-x, -4.5 - z) + (rnd() - 0.5) * 0.5, h: (0.82 + rnd() * 0.5 + (kind === 'brute' ? 0.15 : 0)) * (Math.abs(ang) < 0.6 ? 0.82 : 1), ph: rnd(), amp: 0.5 + rnd() * 0.8, w: 0.85 + rnd() * 0.45, hue: rnd(), arms: rnd(), eye: eyeHues[Math.floor(rnd() * eyeHues.length)], blink: rnd() });
  }
  S.crowdKinds = K; S.crowdMeshes = [];
  for (const k of kinds) { const geo = mergeGeometries(K[k].g.map(g => g.index ? g.toNonIndexed() : g)); const m = new THREE.InstancedMesh(geo, bodyM, Math.max(1, count[k])); m.count = count[k]; K[k].mesh = m; S.crowdMeshes.push(m); }
  S.crowdArm = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.035, 0.06, 1, 6), bodyM, C * 2);
  S.crowdStick = new THREE.InstancedMesh(new THREE.BoxGeometry(0.045, 0.46, 0.045), new THREE.MeshBasicMaterial({ color: 0xffffff }), C * 2);
  S.crowdEye = new THREE.InstancedMesh(new THREE.SphereGeometry(0.028, 6, 5), new THREE.MeshBasicMaterial({ color: 0xffffff }), C * 3);
  for (const m of [...S.crowdMeshes, S.crowdArm, S.crowdStick, S.crowdEye]) { m.frustumCulled = false; scene.add(m); }
  S.crowdStick.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(C * 2 * 3), 3);
  S.crowdEye.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(C * 3 * 3), 3);

  return S;
}

export function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
export const hash1 = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
