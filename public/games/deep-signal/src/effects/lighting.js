// Lighting: the world is drawn fully, then a darkness layer is laid over it
// with soft holes cut wherever there is light. The player reveals the world
// by carrying light into it.

export function createLighting() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  let lights = [];

  return {
    resize(w, h) {
      canvas.width = Math.max(1, Math.round(w));
      canvas.height = Math.max(1, Math.round(h));
    },
    begin() { lights = []; },
    // x, y in screen pixels; r in screen pixels; strength 0..1
    add(x, y, r, strength = 1) {
      if (r > 0 && strength > 0) lights.push({ x, y, r, strength });
    },
    ring(x, y, r, width, strength = 1) {
      lights.push({ x, y, r, width, strength, ring: true });
    },
    render(target, darkness) {
      const w = canvas.width, h = canvas.height;
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = `rgba(2,2,3,${darkness})`;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "destination-out";
      for (const l of lights) {
        if (l.x + l.r < 0 || l.y + l.r < 0 || l.x - l.r > w || l.y - l.r > h) continue;
        if (l.ring) {
          const inner = Math.max(0, l.r - l.width), outer = l.r + l.width;
          const g = ctx.createRadialGradient(l.x, l.y, inner, l.x, l.y, outer);
          g.addColorStop(0, "rgba(0,0,0,0)");
          g.addColorStop(0.5, `rgba(0,0,0,${0.8 * l.strength})`);
          g.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(l.x, l.y, outer, 0, Math.PI * 2);
          ctx.fill();
          continue;
        }
        const g = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.r);
        g.addColorStop(0, `rgba(0,0,0,${l.strength})`);
        g.addColorStop(0.55, `rgba(0,0,0,${l.strength * 0.7})`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(l.x, l.y, l.r, 0, Math.PI * 2);
        ctx.fill();
      }
      // the light canvas is in device pixels - draw it 1:1
      target.save();
      target.setTransform(1, 0, 0, 1, 0, 0);
      target.drawImage(canvas, 0, 0);
      target.restore();
    },
  };
}
