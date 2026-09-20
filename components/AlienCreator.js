"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabaseBrowser";
import { ALIEN_QUESTIONS } from "../lib/alienQuestions";

const OTHER = "__other__";

export default function AlienCreator({ loggedIn }) {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0..N-1 questions, N = naming, N+1 = sheet
  const [answers, setAnswers] = useState({});
  const [otherText, setOtherText] = useState({});
  const [speciesName, setSpeciesName] = useState("");
  const [saveStatus, setSaveStatus] = useState("idle");
  const [error, setError] = useState("");

  const total = ALIEN_QUESTIONS.length;
  const onNaming = step === total;
  const onSheet = step === total + 1;
  const current = !onNaming && !onSheet ? ALIEN_QUESTIONS[step] : null;

  const choose = (option) => {
    setAnswers((a) => ({ ...a, [current.id]: option }));
    setTimeout(() => setStep((s) => s + 1), 150);
  };

  const chooseOther = () => {
    setAnswers((a) => ({ ...a, [current.id]: OTHER }));
  };

  const submitOther = () => {
    if (!otherText[current.id]?.trim()) return;
    setStep((s) => s + 1);
  };

  const displayAnswer = (q) => {
    const a = answers[q.id];
    if (a === OTHER) return otherText[q.id] || "(unspecified)";
    return a;
  };

  const save = async () => {
    setSaveStatus("loading");
    setError("");
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You need to be logged in to save a species.");
      const finalAnswers = {};
      ALIEN_QUESTIONS.forEach((q) => { finalAnswers[q.category + " / " + q.question] = displayAnswer(q); });
      const { error: insertError } = await supabase.from("alien_species").insert({
        user_id: user.id,
        name: speciesName.trim() || "Unnamed species",
        answers: finalAnswers,
      });
      if (insertError) throw new Error(insertError.message);
      setSaveStatus("done");
    } catch (e) {
      setError(e.message);
      setSaveStatus("idle");
    }
  };

  if (!loggedIn) {
    return (
      <div className="panel" style={{ textAlign: "center", maxWidth: 500, margin: "0 auto" }}>
        <p style={{ color: "#8A8FBF", margin: 0 }}>
          You'll need to be logged in to save a species to your Node \u2014
          you can still click through the questions to see how it works.
        </p>
      </div>
    );
  }

  if (onSheet) {
    return (
      <div className="panel" style={{ maxWidth: 560, margin: "0 auto" }}>
        <div className="mono" style={{ fontSize: 10, color: "#565B8F", letterSpacing: "1px", marginBottom: 8 }}>
          SPECIES SHEET
        </div>
        {saveStatus !== "done" ? (
          <>
            <input
              value={speciesName}
              onChange={(e) => setSpeciesName(e.target.value)}
              placeholder="Name this species..."
              style={{
                width: "100%", background: "transparent", border: "1px solid #262A55", borderRadius: 3,
                color: "#E4E4EF", fontSize: 18, padding: "10px 12px", outline: "none", marginBottom: 16,
                boxSizing: "border-box", fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic",
              }}
            />
          </>
        ) : (
          <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 22, color: "#DCDFFF", marginBottom: 16 }}>
            {speciesName || "Unnamed species"}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          {ALIEN_QUESTIONS.map((q) => (
            <div key={q.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 13, padding: "6px 0", borderBottom: "1px solid #21244A" }}>
              <span style={{ color: "#565B8F" }}>{q.category}</span>
              <span style={{ color: "#D9DCFF", textAlign: "right" }}>{displayAnswer(q)}</span>
            </div>
          ))}
        </div>

        {saveStatus === "done" ? (
          <p style={{ color: "#8B95F6", textAlign: "center", margin: 0 }}>Saved to your Node.</p>
        ) : (
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button onClick={save} disabled={saveStatus === "loading"} style={btnStyle}>
              {saveStatus === "loading" ? "Saving..." : "Save this species"}
            </button>
            <button onClick={() => setStep(0)} style={{ ...btnStyle, background: "none", opacity: 0.7 }}>
              Start over
            </button>
            {error && <span className="mono" style={{ fontSize: 12, color: "#C97B6E" }}>{error}</span>}
          </div>
        )}

        <p style={{ fontSize: 11.5, color: "#3A3E75", marginTop: 18, fontStyle: "italic" }}>
          An illustration of your species isn't built yet \u2014 that needs its
          own image-generation service, which is a deliberate next step, not
          an oversight.
        </p>
      </div>
    );
  }

  return (
    <div className="panel" style={{ maxWidth: 560, margin: "0 auto" }}>
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
            onClick={() => choose(opt)}
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
          Other \u2014 tell us
        </button>
        {answers[current.id] === OTHER && (
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <input
              autoFocus
              value={otherText[current.id] || ""}
              onChange={(e) => setOtherText((t) => ({ ...t, [current.id]: e.target.value }))}
              onKeyDown={(e) => e.key === "Enter" && submitOther()}
              placeholder="Describe it..."
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

const btnStyle = {
  background: "none", border: "1px solid #3A3E75", borderRadius: 4, color: "#B9C0FF",
  fontFamily: "'JetBrains Mono', monospace", fontSize: 13, padding: "9px 18px", cursor: "pointer",
};
