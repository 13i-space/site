"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabaseBrowser";
import { ALIEN_QUESTIONS } from "../lib/alienQuestions";
import { lyraReact } from "../lib/lyraReact";
import { lyraLookAt } from "../lib/lyraMusic";

// answers that make Lyra's eye go wide (they match lib/alienQuestions.js)
const BIG_ANSWERS = new Set([
  "No true daylight \u2014 they live by other light",
  "A brilliant blue giant",
  "A binary system with two suns",
  "Crushing \u2014 nothing survives without adapting to it",
  "No atmosphere at all",
  "Underground caverns \u2014 the surface is uninhabitable",
  "Massive \u2014 the size of a building",
  "None \u2014 no limbs at all",
  "They don't move \u2014 rooted in place",
  "A soft, bioluminescent membrane",
  "Something electromagnetic \u2014 not one of our five senses",
  "They can sense others' emotional state directly",
  "A sense of time passing differently than we experience it",
  "Aggressive \u2014 they treat the unknown as a threat",
  "A hive mind \u2014 no true individuals",
  "Gravitational, like 13i itself",
  "So far beyond ours it's barely comprehensible",
]);
import { STAT_GROUPS, evenStats, groupTotal } from "../lib/alienStats";
import AlienCard from "./AlienCard";
import StatRadar from "./StatRadar";
import { LabCrew, crewLine } from "./AlienLab";
import LabScene from "./LabScene";
import { specimenTraits } from "../lib/specimen";
import { embryoState } from "../lib/embryo";

const OTHER = "__other__";

export default function AlienCreator({ loggedIn }) {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0..N-1 questions, N = points, N+1 = sheet
  const [answers, setAnswers] = useState({});
  const [otherText, setOtherText] = useState({});
  const [speciesName, setSpeciesName] = useState("");
  const [saveStatus, setSaveStatus] = useState("idle");
  const [error, setError] = useState("");
  const [portrait, setPortrait] = useState(null); // SVG markup from Claude
  const [portraitStatus, setPortraitStatus] = useState("idle"); // idle | drawing | error
  const [portraitNote, setPortraitNote] = useState("");
  const [namingStatus, setNamingStatus] = useState("idle");
  const [drawSeconds, setDrawSeconds] = useState(0);
  const [stats, setStats] = useState(evenStats);
  const [savedId, setSavedId] = useState(null);
  // the lab (Update 5.55): the vat scans on every answer, the crew talk
  const [pulse, setPulse] = useState(0);
  const [nudge, setNudge] = useState(0); // small jobs for Ixxen (the sliders)
  const [bigAnswer, setBigAnswer] = useState(false);
  const [crew, setCrew] = useState(["qeth", "Welcome to the bay, guest. Answer as you go. The vat does the rest."]);
  const reacted = useRef(0);
  const [review, setReview] = useState(null);
  // the vat's phase (Update 5.59): grow -> anomaly -> cocoon -> reveal
  const [labPhase, setLabPhase] = useState("grow");
  const anomalySeen = useRef(false);
  const holdUntil = useRef(0); // the anomaly and the cocoon always play out before the reveal
  const afterHold = (fn) => setTimeout(fn, Math.max(0, holdUntil.current - Date.now()));
  const [reviewStatus, setReviewStatus] = useState("idle"); // idle | waiting | error

  // elapsed-time clock while a portrait is being drawn
  useEffect(() => {
    if (portraitStatus !== "drawing") return;
    const started = Date.now();
    setDrawSeconds(0);
    const id = setInterval(() => setDrawSeconds(Math.floor((Date.now() - started) / 1000)), 250);
    return () => clearInterval(id);
  }, [portraitStatus]);

  const total = ALIEN_QUESTIONS.length;
  const onPoints = step === total;
  const onSheet = step === total + 1;
  const current = step < total ? ALIEN_QUESTIONS[step] : null;
  const pointsLeft = STAT_GROUPS.reduce((n, g) => n + g.pool - groupTotal(stats, g), 0);

  // the crew: a reaction to the answer just given, then the next question
  useEffect(() => {
    const line = onPoints ? crewLine("points", {}) : onSheet ? crewLine(saveStatus === "done" ? "saved" : "sheet", {}) : crewLine("question", { questionId: ALIEN_QUESTIONS[step]?.id });
    const id = setTimeout(() => setCrew(line), step === 0 && !onSheet ? 900 : 1700);
    return () => clearTimeout(id);
  }, [step, saveStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  // what the vat knows so far
  const traits = specimenTraits((id) => {
    const a = answers[id];
    if (a === undefined) return undefined;
    return a === OTHER ? otherText[id] || "" : a;
  });
  // the embryo: ambiguous until the end, nudged by every answer so far
  const answeredCount = ALIEN_QUESTIONS.filter((q) => answers[q.id] !== undefined).length;
  const embryo = embryoState((id) => {
    const a = answers[id];
    if (a === undefined) return undefined;
    return a === OTHER ? otherText[id] || "" : a;
  }, answeredCount / total);
  const lab = (panel, vatLabel = labPhase === "anomaly" ? "SPECIMEN \u00b7 ?" : labPhase === "cocoon" ? "SPECIMEN \u00b7 TRANSFORMING" : labPhase === "reveal" ? "SPECIES REVEALED" : "SPECIMEN IN PROGRESS") => (
    <div className="lab">
      <div className="lab-head">
        <span className="mono">⟡ XENOGENESIS BAY 13 &middot; ALIEN-RUN &middot; GUESTS WELCOME</span>
        <span className="mono lab-head-glyphs" aria-hidden="true">⌬ ⏃ ⍜ ⟁ ◬ ⋔ ⏚</span>
      </div>
      <LabCrew line={crew} />
      <div className="lab-grid">
        <LabScene traits={traits} pulse={pulse} nudge={nudge} big={bigAnswer} label={vatLabel} embryo={embryo} phase={labPhase} portrait={labPhase === "reveal" ? portrait : null} />
        <div className="lab-console">{panel}</div>
      </div>
    </div>
  );

  // 13i's full assessment of the saved species (shows on the card's third side)
  const askReview = async (id = savedId) => {
    if (!id) return;
    setReviewStatus("waiting");
    try {
      const res = await fetch("/api/alien", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "review", speciesId: id }) });
      const data = await res.json();
      if (!data.review) throw new Error(data.error || "No assessment came back. Try again.");
      setReview(data.review);
      lyraReact({ granted: "warm", observation: "watchful", not_yet: "subdued" }[data.review.verdict] || "notice");
      setCrew(["qeth", "13i has spoken. Turn the card to its third side, guest."]);
      setReviewStatus("idle");
    } catch (e) {
      setError(e.message);
      setReviewStatus("error");
    }
  };

  // Lyra watches the species take shape: her eye goes to each answer, and the
  // big ones (a blue giant, a hive mind, technology like 13i's...) widen it
  const choose = (option, e) => {
    if (e && e.currentTarget) {
      const r = e.currentTarget.getBoundingClientRect();
      lyraLookAt(r.left + r.width / 2, r.top + r.height / 2, 1100);
    }
    lyraReact(BIG_ANSWERS.has(option) ? "wow" : "notice");
    setBigAnswer(BIG_ANSWERS.has(option));
    setPulse((n) => n + 1);
    reacted.current += 1;
    setCrew(crewLine("question", { answered: true, big: BIG_ANSWERS.has(option), n: reacted.current }));
    setAnswers((a) => ({ ...a, [current.id]: option }));
    setTimeout(() => setStep((s) => s + 1), 150);
  };

  const chooseOther = () => {
    setAnswers((a) => ({ ...a, [current.id]: OTHER }));
  };

  const submitOther = () => {
    if (!otherText[current.id]?.trim()) return;
    setBigAnswer(true);
    setPulse((n) => n + 1);
    setCrew(["ilu", "A write-in! The vat will improvise."]);
    setStep((s) => s + 1);
  };

  const displayAnswer = (q) => {
    const a = answers[q.id];
    if (a === OTHER) return otherText[q.id] || "(unspecified)";
    return a;
  };

  // answers keyed the way they're saved ("Category / question"), for the card preview
  const sheetAnswers = () => {
    const out = {};
    ALIEN_QUESTIONS.forEach((q) => { out[q.category + " / " + q.question] = displayAnswer(q); });
    return out;
  };

  const answersForClaude = () => {
    const out = {};
    ALIEN_QUESTIONS.forEach((q) => { out[`${q.category}: ${q.question}`] = displayAnswer(q) || ""; });
    return out;
  };

  const suggestName = async () => {
    setNamingStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/alien", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "name", answers: answersForClaude() }),
      });
      const data = await res.json();
      if (data.name) setSpeciesName(data.name);
      else setError(data.error || "No name came back. Try again.");
    } catch (e) {
      setError("No name came back. Try again.");
    }
    setNamingStatus("idle");
  };

  const generatePortrait = async () => {
    // the first time: something happens in the tank. Then it wraps itself up.
    if (!anomalySeen.current) {
      anomalySeen.current = true;
      setLabPhase("anomaly");
      holdUntil.current = Date.now() + 6300 + 2600;
      setCrew(["ilu", "Qeth? ...Qeth. The readings."]);
      setTimeout(() => { setLabPhase((p) => (p === "anomaly" ? "cocoon" : p)); setCrew(["qeth", "Recording nothing. We saw nothing. Continue, guest."]); }, 6300);
    } else { setLabPhase("cocoon"); holdUntil.current = Date.now() + 2600; }
    setPortraitStatus("drawing");
    setPortraitNote("");
    setError("");
    try {
      const res = await fetch("/api/alien", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "portrait", answers: answersForClaude(), name: speciesName.trim() }),
      });
      if (!res.body || (res.headers.get("content-type") || "").includes("application/json")) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "The portrait couldn't be started.");
      }
      // newline-delimited JSON: progress pings, then the SVG (or an error)
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
          } catch (e) {
            // ignore a partial line
          }
        });
      }
      if (result && result.svg) {
        // an SVG shown through <img> must declare its namespace
        const svg = /xmlns=/.test(result.svg) ? result.svg : result.svg.replace(/<svg/i, '<svg xmlns="http://www.w3.org/2000/svg"');
        setPortrait(svg);
        setPortraitStatus("idle");
        // let the anomaly finish, and the cocoon close, before it opens
        afterHold(() => setLabPhase("reveal"));
      } else {
        throw new Error((result && result.error) || "That portrait didn't come out. Try again.");
      }
    } catch (e) {
      setPortraitNote(e.message);
      setPortraitStatus("error");
      afterHold(() => setLabPhase("grow"));
    }
  };

  const save = async () => {
    setSaveStatus("loading");
    setError("");
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You need to be logged in to save a species.");
      const finalAnswers = sheetAnswers();
      const row = {
        user_id: user.id,
        name: speciesName.trim() || "Unnamed species",
        answers: finalAnswers,
        stats,
      };
      const insert = (r) => supabase.from("alien_species").insert(r).select("id").single();
      let { data: saved, error: insertError } = await insert(portrait ? { ...row, portrait_svg: portrait } : row);
      // Until the portrait_svg column exists (see docs/v5.2-alien-portraits.sql),
      // still save the species itself rather than failing outright.
      if (insertError && portrait && /portrait_svg/.test(insertError.message)) {
        ({ data: saved, error: insertError } = await insert(row));
      }
      // Likewise before the stats column exists (docs/v5.7-alien-stats.sql).
      if (insertError && /stats/.test(insertError.message)) {
        const { stats: _unsaved, ...withoutStats } = row;
        ({ data: saved, error: insertError } = await insert(portrait ? { ...withoutStats, portrait_svg: portrait } : withoutStats));
      }
      if (insertError) throw new Error(insertError.message);
      setSavedId(saved?.id || null);
      setSaveStatus("done");
      setLabPhase("reveal");
      // Update 5.63: saving IS submitting - 13i's assessment follows at once
      setCrew(["qeth", "Transmitted. 13i is reading it now. Nobody speak."]);
      if (saved?.id) askReview(saved.id);
    } catch (e) {
      setError(e.message);
      setSaveStatus("idle");
    }
  };

  if (onSheet) {
    return lab(
      <div>
        <div className="mono" style={{ fontSize: 10, color: "#565B8F", letterSpacing: "1px", marginBottom: 8 }}>
          SPECIES SHEET
        </div>
        {saveStatus !== "done" ? (
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            <input
              value={speciesName}
              onChange={(e) => setSpeciesName(e.target.value)}
              placeholder="Name this species..."
              style={{
                flex: "1 1 220px", background: "transparent", border: "1px solid #262A55", borderRadius: 3,
                color: "#E4E4EF", fontSize: 18, padding: "10px 12px", outline: "none",
                boxSizing: "border-box", fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic",
              }}
            />
            <button onClick={suggestName} disabled={namingStatus === "loading"} style={{ ...btnStyle, fontSize: 12 }}>
              {namingStatus === "loading" ? "Thinking..." : "Suggest a name"}
            </button>
          </div>
        ) : (
          <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 22, color: "#DCDFFF", marginBottom: 16 }}>
            {speciesName || "Unnamed species"}
          </div>
        )}

        <div style={{ marginBottom: 20 }}>
          {portrait && portraitStatus !== "drawing" ? (
            <img
              src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(portrait)}`}
              alt={`Portrait of ${speciesName || "this species"}`}
              style={{ width: "100%", maxWidth: 400, display: "block", margin: "0 auto", borderRadius: 4, border: "1px solid #262A55" }}
            />
          ) : (
            <div style={{ aspectRatio: "1", maxWidth: 400, margin: "0 auto", border: "1px dashed #262A55", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 20, boxSizing: "border-box" }}>
              {portraitStatus === "drawing" ? (
                <DrawingProgress seconds={drawSeconds} />
              ) : (
                <span className="mono" style={{ fontSize: 11, color: "#565B8F", lineHeight: 1.7 }}>NO PORTRAIT YET</span>
              )}
            </div>
          )}
          {saveStatus !== "done" && (
            <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
              <button onClick={generatePortrait} disabled={portraitStatus === "drawing"} style={btnStyle}>
                {portraitStatus === "drawing" ? "Drawing..." : portrait ? "Generate again" : "Generate Species"}
              </button>
            </div>
          )}
          {portraitNote && <p className="mono" style={{ fontSize: 11, color: "#C97B6E", textAlign: "center", margin: "8px 0 0" }}>{portraitNote}</p>}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
          <div style={{ textAlign: "center" }}>
            <div className="mono" style={{ fontSize: 10, color: "#565B8F", letterSpacing: "1px", marginBottom: 8 }}>YOUR CARD &middot; FOUR SIDES &middot; TAP TO TURN</div>
            <AlienCard
              species={{ id: null, name: speciesName.trim() || "Unnamed species", answers: sheetAnswers(), portrait_svg: labPhase === "reveal" ? portrait : null, stats, review, created_at: new Date().toISOString() }}
              creator="you"
              width={230}
              live
            />
          </div>
          {saveStatus !== "done" && (
            <button onClick={() => setStep(total)} className="mono" style={{ background: "none", border: "none", color: "#6E76B8", fontSize: 12, cursor: "pointer", alignSelf: "flex-end" }}>
              &larr; adjust points
            </button>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          {ALIEN_QUESTIONS.map((q) => (
            <div key={q.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 13, padding: "6px 0", borderBottom: "1px solid #21244A" }}>
              <span style={{ color: "#565B8F" }}>{q.category}</span>
              <span style={{ color: "#D9DCFF", textAlign: "right" }}>{displayAnswer(q)}</span>
            </div>
          ))}
        </div>

        {saveStatus === "done" ? (
          <div style={{ textAlign: "center" }}>
            <div className="lab-sent">
              <div className="mono lab-sent-kicker">{reviewStatus === "waiting" ? "TRANSMITTED \u00b7 13i IS ASSESSING" : review ? "13i HAS SPOKEN" : "TRANSMITTED TO 13i"}</div>
              {reviewStatus === "waiting" && <div className="lab-sent-wait"><span /><span /><span /></div>}
              {review && (
                <p className="lab-sent-review">
                  <span className="mono" style={{ color: { granted: "#6FC3A8", observation: "#E9D29A", not_yet: "#C97B6E" }[review.verdict] || "#B9C0FF" }}>
                    {{ granted: "CONTINUANCE GRANTED", observation: "UNDER OBSERVATION", not_yet: "NOT YET" }[review.verdict] || "REVIEWED"}
                  </span>
                  <br />{review.learned || "Its full assessment is on the card's third side."}
                </p>
              )}
              {error && reviewStatus === "error" && (
                <p className="mono" style={{ fontSize: 11, color: "#C97B6E", margin: "6px 0" }}>
                  {error} <button onClick={() => askReview()} className="mono" style={{ background: "none", border: "none", color: "#B9C0FF", cursor: "pointer", textDecoration: "underline" }}>try again</button>
                </p>
              )}
            </div>
            {savedId && (
              <div className="lab-next">
                <p className="lab-next-line">Your species has entered the Galaxy.<br /><em>Go and meet it - then see if it can survive.</em></p>
                <a href={`/galaxy/aliens?new=${savedId}`} className="lab-next-primary">See it in Aliens of the Galaxy &rarr;</a>
                <a href={`/galaxy/aliens/trials?species=${savedId}`} className="lab-next-second">Test it in the Survival Trials</a>
                <div className="lab-next-more">
                  <a href={`/galaxy/aliens/${savedId}`} className="mono">open its page</a>
                  <a href={`/galaxy/map?species=${savedId}`} className="mono">see it on the map</a>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {loggedIn ? (
              <button onClick={save} disabled={saveStatus === "loading" || portraitStatus === "drawing"} className="lab-submit">
                {saveStatus === "loading" ? "Transmitting..." : "Submit to 13i \u2192"}
              </button>
            ) : (
              <a href="/login?next=/create/alien-lab" className="lab-submit" style={{ textDecoration: "none" }}>Sign in to submit to 13i</a>
            )}
            <button onClick={() => { setStep(0); setPortrait(null); setPortraitStatus("idle"); setStats(evenStats()); setLabPhase("grow"); }} style={{ ...btnStyle, background: "none", opacity: 0.7 }}>
              Start over
            </button>
            {error && <span className="mono" style={{ fontSize: 12, color: "#C97B6E" }}>{error}</span>}
          </div>
        )}

        <p style={{ fontSize: 11.5, color: "#3A3E75", marginTop: 18, fontStyle: "italic" }}>
          Portraits are drawn from your answers, as line art rather than a
          painting, so each one is an interpretation.
        </p>
      </div>,
      saveStatus === "done" ? "SPECIMEN FILED" : "SPECIMEN COMPLETE"
    );
  }

  if (onPoints) {
    // Raising a stat can only spend what's left in its group.
    const setStat = (group, id, value) => {
      setNudge((n) => n + 1);
      setStats((st) => {
        const others = groupTotal(st, group) - st[id];
        return { ...st, [id]: Math.max(0, Math.min(Math.round(value), group.pool - others)) };
      });
    };
    return lab(
      <div>
        <div className="mono" style={{ fontSize: 10, color: "#565B8F", letterSpacing: "1px", marginBottom: 4 }}>
          ATTRIBUTES &middot; LAST STEP
        </div>
        <div style={{ height: 3, background: "#21244A", borderRadius: 2, marginBottom: 20, overflow: "hidden" }}>
          <div style={{ height: "100%", width: "100%", background: "#8B95F6" }} />
        </div>
        <p style={{ fontSize: 17, color: "#DCDFFF", margin: "0 0 6px" }}>Spend your points.</p>
        <p style={{ fontSize: 13, color: "#8A8FBF", margin: "0 0 18px", lineHeight: 1.6 }}>
          Every species gets the same budget: 100 Physical, 100 Mental, 50 Ecological &amp; Sensory and 50 Life Cycle.
          Spread them evenly or pour everything into one thing. These go on your card and decide how
          your species does in the Survival Trials.
        </p>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
          <StatRadar stats={stats} size={230} />
        </div>

        {STAT_GROUPS.map((g) => {
          const left = g.pool - groupTotal(stats, g);
          return (
            <div key={g.id} style={{ marginBottom: 20 }}>
              <div className="mono" style={{ display: "flex", justifyContent: "space-between", fontSize: 11, letterSpacing: "1px", color: g.color, paddingBottom: 6, borderBottom: `1px solid ${g.color}44`, marginBottom: 10 }}>
                <span>{g.label.toUpperCase()} &middot; {g.pool}</span>
                <span style={{ color: left ? "#E8CFC0" : "#565B8F" }}>{left ? `${left} left` : "all spent"}</span>
              </div>
              {g.stats.map((st) => (
                <div key={st.id} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
                    <span style={{ fontSize: 14, color: "#DCDFFF" }}>{st.label}</span>
                    <span className="mono" style={{ fontSize: 15, color: "#E4E4EF", minWidth: 28, textAlign: "right" }}>{stats[st.id]}</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: "#565B8F", marginBottom: 4 }}>{st.desc}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button aria-label={`Less ${st.label}`} onClick={() => setStat(g, st.id, stats[st.id] - 1)} style={stepBtn}>&minus;</button>
                    <input
                      type="range"
                      min={0}
                      max={g.pool}
                      value={stats[st.id]}
                      onChange={(e) => setStat(g, st.id, Number(e.target.value))}
                      aria-label={st.label}
                      style={{ flex: 1, accentColor: g.color }}
                    />
                    <button aria-label={`More ${st.label}`} onClick={() => setStat(g, st.id, stats[st.id] + 1)} style={stepBtn}>+</button>
                  </div>
                </div>
              ))}
            </div>
          );
        })}

        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <button onClick={() => setStep(total + 1)} disabled={pointsLeft > 0} style={{ ...btnStyle, opacity: pointsLeft > 0 ? 0.4 : 1, cursor: pointsLeft > 0 ? "default" : "pointer" }}>
            Continue &rarr;
          </button>
          <button onClick={() => setStats(evenStats())} style={{ ...btnStyle, background: "none", opacity: 0.7 }}>
            Even split
          </button>
          {pointsLeft > 0 && <span className="mono" style={{ fontSize: 11, color: "#E8CFC0" }}>spend all {pointsLeft} remaining points to continue</span>}
        </div>

        <button
          onClick={() => setStep(total - 1)}
          className="mono"
          style={{ marginTop: 20, background: "none", border: "none", color: "#565B8F", fontSize: 12, cursor: "pointer" }}
        >
          &larr; back
        </button>
      </div>,
      "SPECIMEN · CALIBRATING"
    );
  }

  return lab(
    <div>
      {!loggedIn && step === 0 && (
        <p className="mono" style={{ fontSize: 11, color: "#E8CFC0", margin: "0 0 14px", lineHeight: 1.6 }}>
          Guests may grow a specimen. To name it with 13i&rsquo;s help, draw its portrait and save it to your Node, <a href="/login?next=/create/alien-lab">sign in</a>.
        </p>
      )}
      <div className="mono" style={{ fontSize: 10, color: "#565B8F", letterSpacing: "1px", marginBottom: 4 }}>
        {current.category.toUpperCase()} &middot; {step + 1} OF {total}
      </div>
      <div style={{ height: 3, background: "#21244A", borderRadius: 2, marginBottom: 20, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${((step + 1) / total) * 100}%`, background: "#8B95F6", transition: "width 0.2s" }} />
      </div>

      <p style={{ fontSize: 17, color: "#DCDFFF", marginBottom: 20 }}>{current.question}</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {current.options.map((opt) => (
          <button
            key={opt}
            onClick={(e) => choose(opt, e)}
            style={{
              textAlign: "left", background: answers[current.id] === opt ? "rgba(139,149,246,0.12)" : "none",
              border: `1px solid ${answers[current.id] === opt ? "#8B95F6" : "#262A55"}`, borderRadius: 4,
              color: "#D9DCFF", fontSize: 14, padding: "10px 14px", cursor: "pointer",
            }}
          >
            {opt}
          </button>
        ))}
        <button
          onClick={chooseOther}
          style={{
            textAlign: "left", background: answers[current.id] === OTHER ? "rgba(139,149,246,0.12)" : "none",
            border: `1px solid ${answers[current.id] === OTHER ? "#8B95F6" : "#262A55"}`, borderRadius: 4,
            color: "#8A8FBF", fontSize: 14, padding: "10px 14px", cursor: "pointer", fontStyle: "italic",
          }}
        >
          Other
        </button>
        {answers[current.id] === OTHER && (
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <input
              autoFocus
              value={otherText[current.id] || ""}
              onChange={(e) => setOtherText((t) => ({ ...t, [current.id]: e.target.value }))}
              onKeyDown={(e) => e.key === "Enter" && submitOther()}
              placeholder="Type your answer..."
              style={{
                flex: 1, background: "transparent", border: "1px solid #262A55", borderRadius: 3,
                color: "#E4E4EF", fontSize: 13, padding: "8px 10px", outline: "none",
              }}
            />
            <button onClick={submitOther} style={{ ...btnStyle, padding: "8px 16px" }}>Next</button>
          </div>
        )}
      </div>

      {step > 0 && (
        <button
          onClick={() => setStep((s) => s - 1)}
          className="mono"
          style={{ marginTop: 20, background: "none", border: "none", color: "#565B8F", fontSize: 12, cursor: "pointer" }}
        >
          &larr; back
        </button>
      )}
    </div>
  );
}

// Claude doesn't report how far along a drawing is, so the bar is an
// estimate: it eases toward full over a typical one-to-two-minute drawing
// and never claims to be finished until the portrait actually arrives.
function DrawingProgress({ seconds }) {
  const estimate = Math.min(0.95, 1 - Math.exp(-seconds / 50));
  const clock = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
  return (
    <div style={{ width: "80%" }}>
      <div className="mono" style={{ fontSize: 11, color: "#8B95F6", letterSpacing: "1px", marginBottom: 12 }}>
        DRAWING YOUR SPECIES
      </div>
      <div style={{ height: 3, background: "#21244A", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${estimate * 100}%`, background: "#8B95F6", transition: "width 0.25s linear" }} />
      </div>
      <div className="mono" style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#565B8F", marginTop: 10 }}>
        <span>{clock}</span>
        <span>{seconds < 150 ? "usually 1\u20132 minutes" : "taking longer than usual\u2026"}</span>
      </div>
    </div>
  );
}

const stepBtn = {
  background: "none", border: "1px solid #262A55", borderRadius: 4, color: "#B9C0FF",
  width: 30, height: 28, fontSize: 15, lineHeight: 1, cursor: "pointer", flexShrink: 0,
};

const btnStyle = {
  background: "none", border: "1px solid #3A3E75", borderRadius: 4, color: "#B9C0FF",
  fontFamily: "'JetBrains Mono', monospace", fontSize: 13, padding: "9px 18px", cursor: "pointer",
};
