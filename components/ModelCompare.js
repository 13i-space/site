"use client";

// Update 5.86 - the model comparison (Sentinel-X only).
//
// Draws the same species twice at once, from the same answers: once with
// Sonnet 5.5 (what every portrait uses today) and once with Haiku 5.5 (the
// cheaper model), so the two can be compared for look and cost side by
// side. Each drawing shows its time, tokens and cost. "Use this one" puts
// that drawing on the card, ready to save as usual.
//
// These test drawings don't count against the daily limit (Sentinel-X has
// none) and are logged in api_usage as "alien-portrait-test", so they never
// mix with the real portrait numbers.

import { useState } from "react";

const MODELS = [
  { id: "claude-sonnet-5-5", label: "Sonnet 5.5", note: "today's model" },
  { id: "claude-haiku-5-5", label: "Haiku 5.5", note: "proposed" },
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
const money = (n) => (n >= 0.01 ? `$${n.toFixed(3)}` : `${(n * 100).toFixed(2)}¢`);

export default function ModelCompare({ getAnswers, name, onUse }) {
  const [runs, setRuns] = useState({}); // model id -> { status, svg, facts, error }
  const busy = Object.values(runs).some((r) => r.status === "drawing");

  const drawAll = () => {
    const answers = getAnswers();
    MODELS.forEach(async (m) => {
      setRuns((r) => ({ ...r, [m.id]: { status: "drawing" } }));
      try {
        const res = await fetch("/api/alien", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "portrait", answers, name, model: m.id }),
        });
        const out = await readStream(res);
        setRuns((r) => ({ ...r, [m.id]: out.svg ? { status: "done", svg: out.svg, facts: out.facts } : { status: "error", error: out.error, facts: out.facts } }));
      } catch (e) {
        setRuns((r) => ({ ...r, [m.id]: { status: "error", error: "The connection dropped." } }));
      }
    });
  };

  const done = MODELS.map((m) => runs[m.id]).filter((r) => r && r.facts);
  const a = runs[MODELS[0].id]?.facts, b = runs[MODELS[1].id]?.facts;

  return (
    <div style={{ marginTop: 18, padding: 14, border: "1px solid #3A3E75", borderRadius: 6, background: "rgba(20,22,58,0.6)" }}>
      <div className="mono" style={{ fontSize: 10, color: "#E9D29A", letterSpacing: "1.5px", marginBottom: 8 }}>SENTINEL-X &middot; MODEL COMPARISON</div>
      <p style={{ fontSize: 12, color: "#8A8FBF", margin: "0 0 12px", lineHeight: 1.6 }}>
        Draws this species with both models at once, from the same answers. Test drawings are logged separately and don&rsquo;t touch anyone else&rsquo;s Lab.
      </p>
      <button onClick={drawAll} disabled={busy} className="mono" style={{ background: "#1C1F4A", color: "#DCDFFF", border: "1px solid #8B95F6", borderRadius: 4, padding: "8px 14px", fontSize: 12, cursor: busy ? "default" : "pointer", opacity: busy ? 0.5 : 1 }}>
        {busy ? "Drawing both..." : done.length ? "Draw both again" : "Draw with both models"}
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginTop: 14 }}>
        {MODELS.map((m) => {
          const r = runs[m.id];
          const f = r?.facts;
          return (
            <div key={m.id}>
              <div className="mono" style={{ fontSize: 11, color: "#B9C0FF", marginBottom: 6 }}>{m.label} <span style={{ color: "#565B8F" }}>&middot; {m.note}</span></div>
              <div style={{ aspectRatio: "1", border: "1px solid #262A55", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "#0A0B1C" }}>
                {r?.svg ? <img src={svgSrc(r.svg)} alt={`${m.label} drawing`} style={{ width: "100%", display: "block" }} />
                  : <span className="mono" style={{ fontSize: 11, color: r?.status === "error" ? "#C97B6E" : "#565B8F", padding: 12, textAlign: "center" }}>{r?.status === "drawing" ? "Drawing..." : r?.error || "Not drawn yet"}</span>}
              </div>
              {f && (
                <div className="mono" style={{ fontSize: 11, color: "#8A8FBF", lineHeight: 1.7, marginTop: 6 }}>
                  <div style={{ color: "#E8CFC0", fontSize: 13 }}>{money(f.cost_usd)}</div>
                  <div>{f.seconds}s &middot; {f.input_tokens.toLocaleString()} in / {f.output_tokens.toLocaleString()} out</div>
                  <div>{(f.chars / 1000).toFixed(1)}k characters of SVG</div>
                </div>
              )}
              {r?.svg && <button onClick={() => onUse(r.svg)} className="mono" style={{ marginTop: 6, background: "none", border: "1px solid #3A3E75", color: "#B9C0FF", borderRadius: 4, padding: "4px 10px", fontSize: 11, cursor: "pointer" }}>Use this one on the card</button>}
            </div>
          );
        })}
      </div>

      {a && b && a.cost_usd > 0 && b.cost_usd > 0 && (
        <p className="mono" style={{ fontSize: 12, color: "#DCDFFF", margin: "12px 0 0" }}>
          On this species, Sonnet cost {(a.cost_usd / b.cost_usd).toFixed(1)}&times; what Haiku did.
        </p>
      )}
    </div>
  );
}
