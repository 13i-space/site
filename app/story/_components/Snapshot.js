"use client";

// The Character Snapshot: the artifact at the end of Lesson 1.
// "Save as image" draws the card onto a canvas and downloads a PNG.
export default function Snapshot({ name, captured = {}, hideNext = false }) {
  const words = captured.five_words || [];
  const one = captured.one_word || words[0] || "";
  const moments = captured.five_events || [];
  const note = captured.champion_note || "";

  function download() {
    const W = 1080, H = 1350;
    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const g = c.getContext("2d");
    const grad = g.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, "#FFFCF7"); grad.addColorStop(1, "#F2E2D1");
    g.fillStyle = grad; g.fillRect(0, 0, W, H);
    g.strokeStyle = "rgba(194,91,52,.25)"; g.lineWidth = 4;
    g.beginPath(); g.arc(W - 80, 80, 260, 0, Math.PI * 2); g.stroke();

    const serif = "Georgia, 'Times New Roman', serif";
    const sans = "Helvetica, Arial, sans-serif";
    let y = 130;
    g.fillStyle = "#C25B34"; g.font = `bold 28px ${sans}`;
    g.fillText("STORY OF SELF · CHARACTER SNAPSHOT", 90, y);
    y += 60;
    g.fillStyle = "#8C7F74"; g.font = `34px ${sans}`;
    g.fillText(name ? `${name}, in one word:` : "In one word:", 90, y);
    y += 150;
    g.fillStyle = "#2A2420"; g.font = `italic 140px ${serif}`;
    g.fillText(fit(g, one || "—", W - 180), 90, y);

    y += 110;
    g.fillStyle = "#C25B34"; g.font = `bold 26px ${sans}`; g.fillText("FIVE WORDS", 90, y);
    y += 56; g.font = `40px ${sans}`; g.fillStyle = "#2A2420";
    let x = 90;
    for (const w of words) {
      const tw = g.measureText(w).width + 48;
      if (x + tw > W - 90) { x = 90; y += 70; }
      g.fillStyle = w === one ? "#C25B34" : "#FFFFFF";
      roundRect(g, x, y - 42, tw, 58, 29); g.fill();
      g.strokeStyle = "#E2D6C5"; g.lineWidth = 2; g.stroke();
      g.fillStyle = w === one ? "#FFFFFF" : "#2A2420"; g.fillText(w, x + 24, y);
      x += tw + 14;
    }

    y += 100;
    g.fillStyle = "#C25B34"; g.font = `bold 26px ${sans}`; g.fillText("FIVE MOMENTS THAT DEFINE MY STORY", 90, y);
    g.font = `36px ${sans}`; g.fillStyle = "#2A2420";
    for (const m of moments) { y += 58; g.fillText(`·  ${fit(g, m, W - 200)}`, 90, y); }

    if (note) {
      y += 100;
      g.fillStyle = "#C25B34"; g.fillRect(90, y - 40, 6, 120);
      g.fillStyle = "#5E534B"; g.font = `italic 38px ${serif}`;
      wrap(g, note, 120, y, W - 220, 50, 3);
    }

    g.fillStyle = "#8C7F74"; g.font = `28px ${sans}`;
    g.fillText("I am the lead character of my own story.", 90, H - 90);

    const a = document.createElement("a");
    a.download = "my-character-snapshot.png";
    a.href = c.toDataURL("image/png");
    a.click();
  }

  return (
    <div className="sos-snap">
      <div className="sos-snap-card">
        <div className="sos-snap-label">Character Snapshot · Lesson 1</div>
        <div className="sos-snap-word">{one || "Your one word"}</div>
        <div className="sos-snap-name">{name ? `${name}, in one word` : "In one word"}</div>
        {words.length > 0 && (
          <>
            <div className="sos-snap-label">Five words</div>
            <div className="sos-chips">
              {words.map((w) => <span key={w} className={`sos-chip ${w === one ? "hero" : ""}`}>{w}</span>)}
            </div>
          </>
        )}
        {moments.length > 0 && (
          <>
            <div className="sos-snap-label">Five moments that define my story</div>
            <ul className="sos-moments">{moments.map((m) => <li key={m}>{m}</li>)}</ul>
          </>
        )}
        {note && <p className="sos-snap-note">{note}</p>}
      </div>
      <div className="sos-snap-actions">
        <button className="sos-btn ghost" onClick={download}>Save as image</button>
      </div>
      {!hideNext && <NextUp
        label="Up next · Lesson 2"
        title="A Life in Stages"
        text="You were born unique, and then your story began. Next, walk through the chapters of your life that brought you here. It takes about 20 minutes."
        href="/story/lesson-2"
        cta="Continue to Lesson 2"
        aside="Or take a break. Your story is saved, and Lesson 2 will be waiting."
      />}
    </div>
  );
}

export function NextUp({ label, title, text, href, cta, aside }) {
  return (
    <div className="sos-next">
      <div className="sos-snap-label">{label}</div>
      <h3>{title}</h3>
      <p>{text}</p>
      <div className="sos-snap-actions" style={{ marginTop: 6 }}>
        {href && <a className="sos-btn" href={href}>{cta}</a>}
        <a className="sos-btn ghost" href="/story/my-story">My story</a>
      </div>
      {aside && <p className="sos-next-aside">{aside}</p>}
    </div>
  );
}

export function fit(g, text, max) {
  let t = String(text);
  if (g.measureText(t).width <= max) return t;
  while (t.length > 1 && g.measureText(t + "…").width > max) t = t.slice(0, -1);
  return t + "…";
}
function roundRect(g, x, y, w, h, r) {
  g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
}
function wrap(g, text, x, y, max, lh, maxLines) {
  const words = String(text).split(/\s+/); let line = ""; let n = 0;
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (g.measureText(test).width > max && line) {
      g.fillText(line, x, y); y += lh; n++; line = w;
      if (n >= maxLines - 1) { g.fillText(fit(g, words.slice(words.indexOf(w)).join(" "), max), x, y); return; }
    } else line = test;
  }
  if (line) g.fillText(line, x, y);
}
