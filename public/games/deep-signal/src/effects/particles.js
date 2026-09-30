// Pooled particles - a fixed number of slots, reused, never allocated mid-run.

const MAX = 360;

export function createParticles() {
  const pool = Array.from({ length: MAX }, () => ({ alive: false }));
  let cursor = 0;
  let enabled = true;

  const spawn = (p) => {
    if (!enabled) return;
    const slot = pool[cursor];
    cursor = (cursor + 1) % MAX;
    Object.assign(slot, { alive: true, vx: 0, vy: 0, life: 1, max: 1, size: 1.5, alpha: 0.8, drag: 0, color: "243,227,181" }, p);
    slot.max = slot.life;
  };

  return {
    setEnabled(v) { enabled = v; if (!v) pool.forEach((p) => { p.alive = false; }); },
    spawn,
    burst(x, y, n, { speed = 80, life = 0.9, size = 1.6, color } = {}) {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2, s = speed * (0.3 + Math.random() * 0.7);
        spawn({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: life * (0.6 + Math.random() * 0.6), size, drag: 2, color });
      }
    },
    update(dt) {
      for (const p of pool) {
        if (!p.alive) continue;
        p.life -= dt;
        if (p.life <= 0) { p.alive = false; continue; }
        p.vx *= 1 - Math.min(1, p.drag * dt);
        p.vy *= 1 - Math.min(1, p.drag * dt);
        p.x += p.vx * dt;
        p.y += p.vy * dt;
      }
    },
    draw(ctx) {
      for (const p of pool) {
        if (!p.alive) continue;
        ctx.fillStyle = `rgba(${p.color},${p.alpha * (p.life / p.max)})`;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      }
    },
  };
}
