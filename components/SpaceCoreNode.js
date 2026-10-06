import Link from "next/link";
import { SPACECORE_ATTRS, SPACECORE_STAGES, SPACECORE_MAIN_STAGES, SPACECORE_TIME_SCALE, stageProgress } from "../lib/spacecore";

// The SpaceCore panel on the Node (/account). Server-rendered from the
// crew's saved summary (spacecore_players.summary, written by the game) and
// the shared colony row. Auto-drills and training keep running while the
// Kin is away, so both are estimated forward to "now".
const label = { fontSize: 10, color: "#565B8F", letterSpacing: "1px" };
const fmt = (min) => { const h = Math.floor(min / 60), m = Math.floor(min % 60); return h ? `${h}h ${String(m).padStart(2, "0")}m` : `${m}m`; };

// what the Fabricator is doing now, estimated forward from the last save
function craftLine(s, awayMarsMin) {
  const queue = s.craft || [];
  if (!queue.length) return (s.kit || []).length ? `idle \u00b7 kit: ${s.kit.map((k) => `${k.count} ${k.n}`).join(", ")}` : "idle";
  let left = awayMarsMin;
  const ready = [];
  let current = null;
  for (const c of queue) {
    if (left >= c.left) { left -= c.left; ready.push(c.n); } else { current = { n: c.n, left: c.left - left }; left = 0; break; }
  }
  const parts = [];
  if (ready.length) parts.push(`ready: ${ready.join(", ")}`);
  if (current) parts.push(`${current.n} in ${fmt(current.left)}`);
  return parts.join(" \u00b7 ");
}

export default function SpaceCoreNode({ player, colony }) {
  const st = SPACECORE_STAGES[colony?.stage ?? 0];
  const prog = colony ? stageProgress(colony) : 0;

  if (!player) {
    return (
      <Link href="/create/spacecore" className="panel launch-card" style={{ display: "block", textDecoration: "none" }}>
        <div className="mono node-label">SPACECORE &middot; MARS</div>
        <p style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 21, color: "#DCDFFF", margin: "0 0 6px" }}>You haven't landed yet.</p>
        <p style={{ fontSize: 13, color: "#8A8FBF", lineHeight: 1.6, margin: "0 0 10px" }}>
          Every Kin is building one colony on Mars together.{st ? ` The ${st.name} is ${Math.floor(prog * 100)}% built.` : ""}
        </p>
        <span className="mono" style={{ fontSize: 11, color: "#E8CFC0" }}>join the crews on Mars &rarr;</span>
      </Link>
    );
  }

  const s = player.summary || {};
  const scale = s.timeScale || SPACECORE_TIME_SCALE;
  const awayMarsMin = s.lastReal ? Math.max(0, (Date.now() - s.lastReal) / 60000) * scale : 0;
  const rigs = (s.rigs || []).map((r) => (r.cap ? Math.min(1, r.fill + (awayMarsMin / 60) * (r.rate / r.cap)) : r.fill || 0));
  const rigAvg = rigs.length ? Math.round((rigs.reduce((a, b) => a + b, 0) / rigs.length) * 100) : null;
  const trainAttr = SPACECORE_ATTRS.find((a) => a.k === s.training?.attr);
  const trainMin = (s.training?.min || 0) + awayMarsMin;
  const attrs = s.attrs || {};

  return (
    <div className="panel">
      <div className="mono node-label">SPACECORE &middot; MARS</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
        <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 22, color: "#DCDFFF" }}>Level {s.level || 1} crew</span>
        {s.unspent ? <span className="mono" style={{ fontSize: 11, color: "#E8CFC0" }}>{s.unspent} point{s.unspent > 1 ? "s" : ""} to spend</span> : null}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "6px 14px", margin: "12px 0" }}>
        {SPACECORE_ATTRS.map((a) => (
          <div key={a.k} style={{ minWidth: 0 }}>
            <div className="mono" style={{ fontSize: 10.5, color: "#8A8FBF", display: "flex", justifyContent: "space-between" }}>
              <span>{a.n}</span><span style={{ color: "#DCDFFF" }}>{attrs[a.k] || 1}</span>
            </div>
            <div style={{ display: "flex", gap: 2, marginTop: 3 }}>
              {Array.from({ length: Math.max(6, attrs[a.k] || 1) }).map((_, i) => (
                <span key={i} style={{ flex: 1, height: 4, borderRadius: 1, background: i < (attrs[a.k] || 1) ? "#8B95F6" : "#262A55" }} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mono" style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 12px", fontSize: 11.5, color: "#D9DCFF", borderTop: "1px solid #21244A", paddingTop: 10 }}>
        <span style={label}>AUTO-DRILLS</span>
        <span style={{ color: rigAvg >= 99 ? "#E8CFC0" : "#D9DCFF" }}>
          {rigAvg === null ? "none yet" : `${rigs.length} running · about ${rigAvg}% full${rigAvg >= 99 ? " · ready to collect" : ""}`}
        </span>
        <span style={label}>TRAINING</span>
        <span>{trainAttr ? (trainMin >= 480 ? `${trainAttr.n} · a point is waiting` : `${trainAttr.n} · ${fmt(trainMin)} of 8h`) : "—"}</span>
        <span style={label}>BORER</span>
        <span>{s.battery == null ? "\u2014" : s.atCharger ? "parked at a charger \u00b7 100%" : `battery ${s.battery}%`}</span>
        <span style={label}>FABRICATOR</span>
        <span>{craftLine(s, awayMarsMin)}</span>
        <span style={label}>LYRA</span>
        <span>{s.mission?.name ? `mission ${s.mission.i + 1} of ${s.mission.total}: ${s.mission.name}` : "missions done · answering colony calls"}</span>
        <span style={label}>LEDGER</span>
        <span>{s.maxDepth || 0} m deepest · {(s.given || 0).toLocaleString()} sent to the colony</span>
      </div>

      {st ? (
        <div style={{ marginTop: 12 }}>
          <div className="mono" style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "#8A8FBF" }}>
            <span>{st.name.toUpperCase()} &middot; {colony.stage < SPACECORE_MAIN_STAGES ? `GREAT WORK ${colony.stage + 1} OF ${SPACECORE_MAIN_STAGES}` : `SEASON PROJECT ${colony.stage - SPACECORE_MAIN_STAGES + 1} OF ${SPACECORE_STAGES.length - SPACECORE_MAIN_STAGES}`}</span>
            <span>{Math.floor(prog * 100)}%</span>
          </div>
          <div style={{ height: 5, background: "#262A55", borderRadius: 2, marginTop: 4, overflow: "hidden" }}>
            <div style={{ width: `${prog * 100}%`, height: "100%", background: "#E8CFC0" }} />
          </div>
        </div>
      ) : (
        <p className="mono" style={{ fontSize: 11, color: "#E8CFC0", marginTop: 12 }}>All five Great Works are complete. Season 2 is next.</p>
      )}

      <Link href="/create/spacecore" className="mono" style={{ display: "inline-block", marginTop: 14, fontSize: 11.5, color: "#E8CFC0" }}>
        return to Mars &rarr;
      </Link>
    </div>
  );
}
