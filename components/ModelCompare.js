"use client";

// Update 5.86 / 5.88 - the model comparison (Sentinel-X only).
//
// Compares what the same money buys. One click draws the species, from the
// same answers:
//   - left:  once with Sonnet 5.5 and today's instructions (what every
//            portrait costs now)
//   - right: four times with Haiku 5.5 and the new detailed instructions
//            (PORTRAIT_SYSTEM_DETAILED in app/api/alien), for about the
//            same total
// Each side shows its total spend, and each drawing its own time, tokens,
// size and cost. "Use this one on the card" puts any drawing on the card,
// ready to save as usual.
//
// These test drawings don't count against the daily limit (Sentinel-X has
// none) and are logged in api_usage as "alien-portrait-test", so they never
// mix with the real portrait numbers.

import { useState } from "react";

// Update 5.89: Haiku in two pairs - its normal thinking level (medium, what
// made the good drawings in 5.88) and a lower one, to see if less thinking
// is nearly as good for less money.
const LANES = [
  { key: "sonnet", model: "claude-sonnet-5-5", detailed: false, count: 1, label: "Sonnet 5.5", note: "the old setup (before Update 5.90): Sonnet + the original instructions" },
  { key: "haiku-med", model: "claude-haiku-5-5", detailed: true, effort: "medium", count: 2, label: "Haiku 5.5 · normal thinking", note: "new detailed instructions · 2 drawings" },
  { key: "haiku-low", model: "claude-haiku-5-5", detailed: true, effort: "low", count: 2, label: "Haiku 5.5 · less thinking", note: "new detailed instructions · 2 drawings" },
];

// newline-delimited JSON from /api/alien: progress pings, then the result
async function readStream(res) {
  if (!res.body || (res.headers.get("content-type") || "").includes("application/json")) {
    const data = await res.json().catch(() => ({}));
    return { error: data.error || "The drawing couldn't be started." };
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let result = null;
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop();
    lines.forEach((line) => {
      if (!line.trim()) return;
      try {
        const msg = JSON.parse(line);
        if (msg.svg || msg.error) result = msg;
      } catch (e) { /* a partial line */ }
    });
  }
  return result || { error: "Nothing came back." };
}

const svgSrc = (svg) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(/xmlns=/.test(svg) ? svg : svg.replace(/<svg/i, '<svg xmlns="http://www.w3.org/2000/svg"'))}`;
// always cents, so every cost reads in the same unit
const money = (n) => `${(n * 100).toFixed(2)}¢`;

const slotsOf = (lane) => Array.from({ length: lane.count }, (_, i) => `${lane.key}-${i}`);

export default function ModelCompare({ getAnswers, name, onUse }) {
  const [runs, setRuns] = useState({}); // slot id -> { status, svg, facts, error }
  const busy = Object.values(runs).some((r) => r.status === "drawing");
  const started = Object.keys(runs).length > 0;

  const drawAll = () => {
    const answers = getAnswers();
    LANES.forEach((lane) => slotsOf(lane).forEach(async (slot) => {
      setRuns((r) => ({ ...r, [slot]: { status: "drawing" } }));
      try {
        const res = await fetch("/api/alien", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "portrait", answers, name, model: lane.model, detailed: lane.detailed, ...(lane.effort ? { effort: lane.effort } : {}) }),
        });
        const out = await readStream(res);
        setRuns((r) => ({ ...r, [slot]: out.svg ? { status: "done", svg: out.svg, facts: out.facts } : { status: "error", error: out.error, facts: out.facts } }));
      } catch (e) {
        setRuns((r) => ({ ...r, [slot]: { status: "error", error: "The connection dropped." } }));
      }
    }));
  };

  const totalOf = (lane) => slotsOf(lane).reduce((sum, s) => sum + (runs[s]?.facts?.cost_usd || 0), 0);
  const laneDone = (lane) => slotsOf(lane).every((s) => runs[s] && runs[s].status !== "drawing");

  return (
    <div style={{ marginTop: 18, padding: 14, border: "1px solid #3A3E75", borderRadius: 6, background: "rgba(20,22,58,0.6)" }}>
      <div className="mono" style={{ fontSize: 10, color: "#E9D29A", letterSpacing: "1.5px", marginBottom: 8 }}>SENTINEL-X &middot; SAME MONEY, SIDE BY SIDE</div>
      <p style={{ fontSize: 12, color: "#8A8FBF", margin: "0 0 12px", lineHeight: 1.6 }}>
        First: one drawing the way every portrait was made before Update 5.90. Then: what about the same money buys with Haiku and the detailed instructions, at two thinking levels (normal thinking is now the Lab's default). Test drawings are logged separately and don&rsquo;t touch anyone else&rsquo;s Lab.
      </p>
      <button onClick={drawAll} disabled={busy} className="mono" style={{ background: "#1C1F4A", color: "#DCDFFF", border: "1px solid #8B95F6", borderRadius: 4, padding: "8px 14px", fontSize: 12, cursor: busy ? "default" : "pointer", opacity: busy ? 0.5 : 1 }}>
        {busy ? "Drawing..." : started ? "Draw them all again" : "Draw the comparison"}
      </button>

      {started && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18, marginTop: 14 }}>
          {LANES.map((lane) => (
            <div key={lane.key}>
              <div className="mono" style={{ fontSize: 11, color: "#B9C0FF" }}>{lane.label}</div>
              <div className="mono" style={{ fontSize: 10, color: "#565B8F", marginBottom: 4 }}>{lane.note}</div>
              <div className="mono" style={{ fontSize: 13, color: "#E8CFC0", marginBottom: 8 }}>
                {laneDone(lane) ? `Total: ${money(totalOf(lane))}` : `So far: ${money(totalOf(lane))}`}
                {laneDone(lane) && lane.count > 1 && (() => {
                  const good = slotsOf(lane).filter((sl) => runs[sl]?.svg).length;
                  return <span style={{ fontSize: 11, color: "#8A8FBF" }}> · {good} of {lane.count} finished{good ? ` · ${money(totalOf(lane) / good)} per usable drawing` : ""}</span>;
                })()}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: lane.count > 1 ? "1fr 1fr" : "1fr", gap: 8 }}>
                {slotsOf(lane).map((slot) => {
                  const r = runs[slot];
                  const f = r?.facts;
                  return (
                    <div key={slot}>
                      <div style={{ aspectRatio: "1", border: "1px solid #262A55", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "#0A0B1C" }}>
                        {r?.svg ? <img src={svgSrc(r.svg)} alt={`${lane.label} drawing`} style={{ width: "100%", display: "block" }} />
                          : <span className="mono" style={{ fontSize: 11, color: r?.status === "error" ? "#C97B6E" : "#565B8F", padding: 10, textAlign: "center" }}>{r?.status === "drawing" ? "Drawing..." : f?.cut_off ? "Ran out of room before it finished (hit the token limit)." : r?.error || ""}</span>}
                      </div>
                      {f && (
                        <div className="mono" style={{ fontSize: 10, color: "#8A8FBF", lineHeight: 1.6, marginTop: 4 }}>
                          {money(f.cost_usd)} &middot; {f.seconds}s &middot; {f.output_tokens.toLocaleString()} out &middot; {(f.chars / 1000).toFixed(1)}k chars
                        </div>
                      )}
                      {r?.svg && <button onClick={() => onUse(r.svg)} className="mono" style={{ marginTop: 4, background: "none", border: "1px solid #3A3E75", color: "#B9C0FF", borderRadius: 4, padding: "3px 8px", fontSize: 10, cursor: "pointer" }}>Use this one on the card</button>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
