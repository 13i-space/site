"use client";

import { useRef, useEffect, useState, useCallback } from "react";

const SHIP_RADIUS = 11;
const ROD_COUNT = 12;
const ROD_LEN = 16;
const ROD_GAP = 10;
const TURN_RATE = 0.055; // radians per tick
const THRUST_POWER = 0.09;
const FRICTION = 0.988;
const BULLET_SPEED = 6.2;
const BULLET_LIFE = 62;
const MINING_SHIP_HP = 3;
const DETONATE_TICKS = 780; // ~13s at 60fps
const START_LIVES = 3;

function wrap(v, max) {
  if (v < 0) return v + max;
  if (v > max) return v - max;
  return v;
}

export default function Meteoroids() {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const keysRef = useRef({ left: false, right: false, thrust: false });
  const rafRef = useRef(null);

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(START_LIVES);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [message, setMessage] = useState("");

  const spawnMiningShip = useCallback((canvas) => {
    const edge = Math.floor(Math.random() * 4);
    const w = canvas.width, h = canvas.height;
    let x, y;
    if (edge === 0) { x = 0; y = Math.random() * h; }
    else if (edge === 1) { x = w; y = Math.random() * h; }
    else if (edge === 2) { x = Math.random() * w; y = 0; }
    else { x = Math.random() * w; y = h; }

    const angle = Math.atan2(h / 2 - y, w / 2 - x) + (Math.random() - 0.5) * 0.8;
    const speed = 0.5 + Math.random() * 0.3;

    return {
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      angle,
      hp: MINING_SHIP_HP,
      alive: true,
      detonateTimer: DETONATE_TICKS,
      scattered: false,
    };
  }, []);

  const initState = useCallback((canvas) => {
    const stars = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1 + 0.4,
    }));
    return {
      ship: {
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: 0,
        vy: 0,
        angle: -Math.PI / 2,
        invuln: 90,
      },
      bullets: [],
      miningShip: spawnMiningShip(canvas),
      rods: [], // scattered, independent rods once detonated
      particles: [],
      stars,
      score: 0,
      lives: START_LIVES,
      fireCooldown: 0,
    };
  }, [spawnMiningShip]);

  const start = useCallback(() => {
    const canvas = canvasRef.current;
    stateRef.current = initState(canvas);
    setScore(0);
    setLives(START_LIVES);
    setGameOver(false);
    setStarted(true);
    setMessage("");
  }, [initState]);

  const explode = (state, x, y, count = 14, color = "#E8CFC0") => {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2.4 + 0.4;
      state.particles.push({
        x, y,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed,
        life: 30 + Math.random() * 20,
        color,
      });
    }
  };

  useEffect(() => {
    if (!started) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const handleResize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = 420;
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const onKeyDown = (e) => {
      if (e.key === "ArrowLeft" || e.key === "a") keysRef.current.left = true;
      if (e.key === "ArrowRight" || e.key === "d") keysRef.current.right = true;
      if (e.key === "ArrowUp" || e.key === "w") keysRef.current.thrust = true;
      if (e.key === " ") { keysRef.current.fire = true; e.preventDefault(); }
    };
    const onKeyUp = (e) => {
      if (e.key === "ArrowLeft" || e.key === "a") keysRef.current.left = false;
      if (e.key === "ArrowRight" || e.key === "d") keysRef.current.right = false;
      if (e.key === "ArrowUp" || e.key === "w") keysRef.current.thrust = false;
      if (e.key === " ") keysRef.current.fire = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    const tick = () => {
      const s = stateRef.current;
      const w = canvas.width, h = canvas.height;
      const keys = keysRef.current;

      // --- ship ---
      const ship = s.ship;
      if (keys.left) ship.angle -= TURN_RATE;
      if (keys.right) ship.angle += TURN_RATE;
      if (keys.thrust) {
        ship.vx += Math.cos(ship.angle) * THRUST_POWER;
        ship.vy += Math.sin(ship.angle) * THRUST_POWER;
      }
      ship.vx *= FRICTION;
      ship.vy *= FRICTION;
      ship.x = wrap(ship.x + ship.vx, w);
      ship.y = wrap(ship.y + ship.vy, h);
      if (ship.invuln > 0) ship.invuln--;

      if (s.fireCooldown > 0) s.fireCooldown--;
      if (keys.fire && s.fireCooldown <= 0) {
        s.bullets.push({
          x: ship.x + Math.cos(ship.angle) * SHIP_RADIUS,
          y: ship.y + Math.sin(ship.angle) * SHIP_RADIUS,
          vx: Math.cos(ship.angle) * BULLET_SPEED + ship.vx,
          vy: Math.sin(ship.angle) * BULLET_SPEED + ship.vy,
          life: BULLET_LIFE,
        });
        s.fireCooldown = 10;
      }

      // --- bullets ---
      s.bullets.forEach((b) => {
        b.x = wrap(b.x + b.vx, w);
        b.y = wrap(b.y + b.vy, h);
        b.life--;
      });
      s.bullets = s.bullets.filter((b) => b.life > 0);

      // --- mining ship ---
      const ms = s.miningShip;
      if (ms && ms.alive) {
        ms.x = wrap(ms.x + ms.vx, w);
        ms.y = wrap(ms.y + ms.vy, h);
        ms.detonateTimer--;

        if (ms.detonateTimer <= 0) {
          // scatter the rods, remove the mining ship
          for (let i = 0; i < ROD_COUNT; i++) {
            const a = (i / ROD_COUNT) * Math.PI * 2 + Math.random() * 0.3;
            const speed = 0.8 + Math.random() * 1.6;
            s.rods.push({
              x: ms.x - Math.cos(ms.angle) * (i * ROD_GAP),
              y: ms.y - Math.sin(ms.angle) * (i * ROD_GAP),
              vx: Math.cos(a) * speed,
              vy: Math.sin(a) * speed,
              angle: Math.random() * Math.PI * 2,
              vangle: (Math.random() - 0.5) * 0.1,
              alive: true,
            });
          }
          explode(s, ms.x, ms.y, 26, "#C97B6E");
          ms.alive = false;
          s.miningShip = null;
        } else {
          // bullet hits on the mining ship hull
          s.bullets.forEach((b) => {
            const dx = b.x - ms.x, dy = b.y - ms.y;
            if (dx * dx + dy * dy < 22 * 22) {
              b.life = 0;
              ms.hp--;
              explode(s, b.x, b.y, 6, "#B9C0FF");
              if (ms.hp <= 0) {
                // destroyed intact - rods never scatter, big bonus
                explode(s, ms.x, ms.y, 30, "#8B95F6");
                s.score += 500;
                ms.alive = false;
                s.miningShip = null;
              }
            }
          });
        }
      }

      // spawn a new mining ship once the current one is fully resolved
      if (!s.miningShip && s.rods.every((r) => !r.alive) && s.spawnCooldown === undefined) {
        s.spawnCooldown = 120;
      }
      if (s.spawnCooldown !== undefined) {
        s.spawnCooldown--;
        if (s.spawnCooldown <= 0) {
          s.miningShip = spawnMiningShip(canvas);
          s.spawnCooldown = undefined;
        }
      }

      // --- scattered rods ---
      s.rods.forEach((r) => {
        if (!r.alive) return;
        r.x = wrap(r.x + r.vx, w);
        r.y = wrap(r.y + r.vy, h);
        r.angle += r.vangle;

        // bullet collision
        s.bullets.forEach((b) => {
          const dx = b.x - r.x, dy = b.y - r.y;
          if (dx * dx + dy * dy < 14 * 14) {
            b.life = 0;
            r.alive = false;
            s.score += 75;
            explode(s, r.x, r.y, 10, "#8B95F6");
          }
        });

        // ship collision
        if (r.alive && ship.invuln <= 0) {
          const dx = ship.x - r.x, dy = ship.y - r.y;
          if (dx * dx + dy * dy < (SHIP_RADIUS + 9) * (SHIP_RADIUS + 9)) {
            r.alive = false;
            explode(s, ship.x, ship.y, 20, "#C97B6E");
            s.lives--;
            ship.x = w / 2;
            ship.y = h / 2;
            ship.vx = 0; ship.vy = 0;
            ship.invuln = 120;
          }
        }
      });

      // mining-ship-hull collision with player (before it detonates)
      if (s.miningShip && s.miningShip.alive && ship.invuln <= 0) {
        const dx = ship.x - s.miningShip.x, dy = ship.y - s.miningShip.y;
        if (dx * dx + dy * dy < (SHIP_RADIUS + 16) * (SHIP_RADIUS + 16)) {
          explode(s, ship.x, ship.y, 20, "#C97B6E");
          s.lives--;
          ship.x = w / 2; ship.y = h / 2;
          ship.vx = 0; ship.vy = 0;
          ship.invuln = 120;
        }
      }

      // --- particles ---
      s.particles.forEach((p) => { p.x += p.vx; p.y += p.vy; p.life--; });
      s.particles = s.particles.filter((p) => p.life > 0);

      setScore(s.score);
      if (s.lives !== lives) setLives(Math.max(0, s.lives));
      if (s.lives <= 0) {
        setGameOver(true);
        setStarted(false);
        return;
      }

      // --- draw ---
      ctx.fillStyle = "#060712";
      ctx.fillRect(0, 0, w, h);
      s.stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(220,223,255,0.5)";
        ctx.fill();
      });

      // ship (styled after the "i" mark: a slim triangle + a bright dot at the nose)
      if (ship.invuln === 0 || Math.floor(ship.invuln / 5) % 2 === 0) {
        ctx.save();
        ctx.translate(ship.x, ship.y);
        ctx.rotate(ship.angle);
        ctx.strokeStyle = "#B9C0FF";
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(SHIP_RADIUS, 0);
        ctx.lineTo(-SHIP_RADIUS * 0.8, SHIP_RADIUS * 0.7);
        ctx.lineTo(-SHIP_RADIUS * 0.4, 0);
        ctx.lineTo(-SHIP_RADIUS * 0.8, -SHIP_RADIUS * 0.7);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(SHIP_RADIUS + 3, 0, 2.6, 0, Math.PI * 2);
        ctx.fillStyle = "#E8CFC0";
        ctx.fill();
        if (keys.thrust) {
          ctx.beginPath();
          ctx.moveTo(-SHIP_RADIUS * 0.4, 0);
          ctx.lineTo(-SHIP_RADIUS * 1.6, 0);
          ctx.strokeStyle = "#E8CFC0";
          ctx.stroke();
        }
        ctx.restore();
      }

      // bullets
      ctx.fillStyle = "#DCDFFF";
      s.bullets.forEach((b) => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      });

      // mining ship + attached rods
      if (s.miningShip && s.miningShip.alive) {
        const m = s.miningShip;
        // trailing attached rods
        for (let i = 0; i < ROD_COUNT; i++) {
          const rx = m.x - Math.cos(m.angle) * ((i + 1.6) * ROD_GAP);
          const ry = m.y - Math.sin(m.angle) * ((i + 1.6) * ROD_GAP);
          ctx.save();
          ctx.translate(rx, ry);
          ctx.rotate(m.angle);
          ctx.fillStyle = "#6E76B8";
          ctx.fillRect(-ROD_LEN / 2, -2.5, ROD_LEN, 5);
          ctx.restore();
        }
        // hull
        ctx.save();
        ctx.translate(m.x, m.y);
        ctx.rotate(m.angle);
        ctx.fillStyle = "#C97B6E";
        ctx.beginPath();
        ctx.moveTo(14, 0);
        ctx.lineTo(-10, 8);
        ctx.lineTo(-6, 0);
        ctx.lineTo(-10, -8);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // detonation warning flash near the end
        if (m.detonateTimer < 120 && Math.floor(m.detonateTimer / 8) % 2 === 0) {
          ctx.beginPath();
          ctx.arc(m.x, m.y, 20, 0, Math.PI * 2);
          ctx.strokeStyle = "#C97B6E";
          ctx.stroke();
        }
      }

      // scattered rods
      s.rods.forEach((r) => {
        if (!r.alive) return;
        ctx.save();
        ctx.translate(r.x, r.y);
        ctx.rotate(r.angle);
        ctx.fillStyle = "#6E76B8";
        ctx.fillRect(-ROD_LEN / 2, -2.5, ROD_LEN, 5);
        ctx.restore();
      });

      // particles
      s.particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.life / 40);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  const press = (key, val) => (e) => {
    e.preventDefault();
    keysRef.current[key] = val;
  };

  return (
    <div>
      <div style={styles.hud}>
        <div style={{ display: "flex", gap: 6 }}>
          {Array.from({ length: START_LIVES }).map((_, i) => (
            <LifeIcon key={i} lost={i >= lives} />
          ))}
        </div>
        <div className="mono" style={{ color: "#B9C0FF", fontSize: 14 }}>
          SCORE {score}
        </div>
      </div>

      <div style={{ position: "relative" }}>
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: 420, display: "block", background: "#060712", borderRadius: 4 }}
        />

        {!started && (
          <div style={styles.overlay}>
            {gameOver ? (
              <>
                <div style={styles.overlayTitle}>Game Over</div>
                <p style={{ color: "#8A8FBF", marginBottom: 16 }}>Final score: {score}</p>
              </>
            ) : (
              <div style={styles.overlayTitle}>Meteoroids</div>
            )}
            <p style={{ fontSize: 13, color: "#8A8FBF", maxWidth: 340, textAlign: "center", marginBottom: 18 }}>
              Destroy the mining ship before it can blow its tungsten rods
              apart — or don't, and clean up the twelve pieces after.
            </p>
            <button onClick={start} style={styles.startBtn}>
              {gameOver ? "Play again" : "Start"}
            </button>
          </div>
        )}
      </div>

      {started && (
        <div style={styles.controls}>
          <div style={{ display: "flex", gap: 10 }}>
            <CtrlBtn label="&#8634;" onDown={press("left", true)} onUp={press("left", false)} />
            <CtrlBtn label="&#8635;" onDown={press("right", true)} onUp={press("right", false)} />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <CtrlBtn label="THRUST" wide onDown={press("thrust", true)} onUp={press("thrust", false)} />
            <CtrlBtn label="FIRE" wide accent onDown={press("fire", true)} onUp={press("fire", false)} />
          </div>
        </div>
      )}
      <p className="mono" style={{ fontSize: 11, color: "#565B8F", textAlign: "center", marginTop: 10 }}>
        keyboard: arrow keys or WASD to move, space to fire
      </p>
    </div>
  );
}

function LifeIcon({ lost }) {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" style={{ opacity: lost ? 0.25 : 1 }}>
      <line x1="8" y1="5" x2="8" y2="14" stroke="#B9C0FF" strokeWidth="2" strokeLinecap="round" />
      <circle cx="8" cy="2.4" r="2" fill="#E8CFC0" />
    </svg>
  );
}

function CtrlBtn({ label, onDown, onUp, wide, accent }) {
  return (
    <button
      onMouseDown={onDown}
      onMouseUp={onUp}
      onMouseLeave={onUp}
      onTouchStart={onDown}
      onTouchEnd={onUp}
      style={{
        width: wide ? 96 : 52,
        height: 52,
        background: accent ? "rgba(232,207,192,0.12)" : "rgba(139,149,246,0.08)",
        border: `1px solid ${accent ? "#E8CFC0" : "#3A3E75"}`,
        borderRadius: 6,
        color: accent ? "#E8CFC0" : "#B9C0FF",
        fontSize: wide ? 12 : 20,
        fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: "0.5px",
        userSelect: "none",
        touchAction: "none",
      }}
    >
      <span dangerouslySetInnerHTML={{ __html: label }} />
    </button>
  );
}

const styles = {
  hud: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  overlay: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(6,7,18,0.82)",
    borderRadius: 4,
  },
  overlayTitle: {
    fontFamily: "'Fraunces', Georgia, serif",
    fontStyle: "italic",
    fontSize: 28,
    color: "#DCDFFF",
    marginBottom: 10,
  },
  startBtn: {
    background: "none",
    border: "1px solid #3A3E75",
    borderRadius: 4,
    color: "#B9C0FF",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13,
    padding: "10px 22px",
    cursor: "pointer",
  },
  controls: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 14,
  },
};
