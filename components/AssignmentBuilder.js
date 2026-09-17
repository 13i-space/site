"use client";

import { useState } from "react";

const CATEGORIES = ["Civilization", "Species", "Technology", "Biological phenomenon", "Threat", "Anomaly", "Unknown", "Other"];

const CHECKLIST = [
  "Uses \u201cwe\u201d as the voice of 13i",
  "Treats 13i as a collective, not an individual character",
  "Gives 13i a genuine objective",
  "Lets 13i encounter something it doesn't fully understand",
  "Doesn't make 13i omniscient",
  "Allows 13i's interpretation of events to potentially be wrong",
  "Lets new information change the course of the Assignment",
  "Leaves the collective knowing something it didn't know before",
  "Stays consistent with the established 13i universe",
  "Tells a story, rather than just explaining an idea",
];

export default function AssignmentBuilder({ nextNumber }) {
  const [step, setStep] = useState("identify"); // identify | write | done
  const [designation, setDesignation] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [era, setEra] = useState("");
  const [category, setCategory] = useState("");
  const [objective, setObjective] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [story, setStory] = useState("");
  const [checked, setChecked] = useState({});
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const wordCount = story.trim() ? story.trim().split(/\s+/).length : 0;

  const submit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/submit-assignment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, story, designation, origin, destination, era, category, objective }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("done");
    } catch (err) {
      setStatus("idle");
      setError(err.message);
    }
  };

  if (status === "done") {
    return (
      <div className="panel" style={{ textAlign: "center" }}>
        <p style={{ margin: 0, color: "#8B95F6" }}>
          Received. Assignment {String(nextNumber).padStart(7, "0")} has been submitted.
        </p>
      </div>
    );
  }

  if (step === "identify") {
    return (
      <div className="panel">
        <div className="mono" style={{ fontSize: 11, color: "#565B8F", letterSpacing: "1px", marginBottom: 4 }}>
          ASSIGNMENT NUMBER
        </div>
        <div className="mono" style={{ fontSize: 22, color: "#E8CFC0", marginBottom: 20 }}>
          {String(nextNumber).padStart(7, "0")}
        </div>

        <Field label="Designation" value={designation} onChange={setDesignation} placeholder="A name for this Assignment" />
        <Field label="Origin" value={origin} onChange={setOrigin} placeholder="Where 13i begins" />
        <Field label="Destination" value={destination} onChange={setDestination} placeholder="Where 13i is sent (can be unknown)" />
        <Field label="Era" value={era} onChange={setEra} placeholder="When this takes place" />

        <div style={{ marginBottom: 16 }}>
          <div className="mono" style={{ fontSize: 10, color: "#565B8F", letterSpacing: "1px", marginBottom: 8 }}>
            WHAT ARE YOU INVESTIGATING? (OPTIONAL)
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(category === c ? "" : c)}
                style={{
                  background: category === c ? "rgba(139,149,246,0.15)" : "none",
                  border: `1px solid ${category === c ? "#8B95F6" : "#262A55"}`,
                  borderRadius: 4,
                  color: category === c ? "#DCDFFF" : "#6E76B8",
                  fontSize: 12,
                  padding: "6px 12px",
                  cursor: "pointer",
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <Field
          label="Initial objective (optional)"
          value={objective}
          onChange={setObjective}
          placeholder="What does 13i expect to find?"
          textarea
        />

        <button
          type="button"
          onClick={() => setStep("write")}
          disabled={!designation.trim()}
          style={{
            background: "none", border: "1px solid #3A3E75", borderRadius: 4, color: "#B9C0FF",
            fontFamily: "'JetBrains Mono', monospace", fontSize: 13, padding: "10px 22px",
            cursor: designation.trim() ? "pointer" : "default", opacity: designation.trim() ? 1 : 0.4,
          }}
        >
          Begin Assignment &rarr;
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="panel">
      <div className="mono" style={{ fontSize: 11, color: "#565B8F", letterSpacing: "1px", marginBottom: 10 }}>
        ASSIGNMENT {String(nextNumber).padStart(7, "0")} &middot; {designation}
      </div>

      <textarea
        required
        placeholder="Begin writing here..."
        value={story}
        onChange={(e) => setStory(e.target.value)}
        rows={16}
        style={{ ...inputStyle, width: "100%", resize: "vertical", fontFamily: "'Inter', sans-serif", lineHeight: 1.6 }}
      />
      <div className="mono" style={{ fontSize: 11, color: "#565B8F", marginTop: 6, marginBottom: 4 }}>
        {wordCount.toLocaleString()} words &middot; 1,500\u20135,000 is a guideline, not a rule
      </div>
      <p style={{ fontSize: 12.5, color: "#6E76B8", fontStyle: "italic", marginBottom: 20 }}>
        Remember: you are 13i. Think collectively. You don't know everything. Let the Assignment change you.
      </p>

      <div style={{ marginBottom: 20 }}>
        <div className="mono" style={{ fontSize: 11, color: "#565B8F", letterSpacing: "1px", marginBottom: 10 }}>
          BEFORE YOU SUBMIT
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {CHECKLIST.map((item, i) => (
            <label key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "#8A8FBF", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={!!checked[i]}
                onChange={() => setChecked((c) => ({ ...c, [i]: !c[i] }))}
                style={{ marginTop: 3 }}
              />
              {item}
            </label>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />
        <input
          type="email"
          placeholder="Your email (optional, so Paul can reply)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 14 }}>
        <button
          type="submit"
          disabled={status === "loading"}
          style={{
            background: "none", border: "1px solid #3A3E75", borderRadius: 4, color: "#B9C0FF",
            fontFamily: "'JetBrains Mono', monospace", fontSize: 13, padding: "10px 22px",
            cursor: "pointer", opacity: status === "loading" ? 0.5 : 1,
          }}
        >
          {status === "loading" ? "Sending..." : "Submit Assignment"}
        </button>
        <button
          type="button"
          onClick={() => setStep("identify")}
          style={{ background: "none", border: "none", color: "#565B8F", fontSize: 12, textDecoration: "underline", cursor: "pointer" }}
        >
          back to identification
        </button>
        {error && <span className="mono" style={{ fontSize: 12, color: "#C97B6E" }}>{error}</span>}
      </div>
    </form>
  );
}

function Field({ label, value, onChange, placeholder, textarea }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label className="mono" style={{ fontSize: 10, color: "#565B8F", letterSpacing: "1px" }}>
        {label.toUpperCase()}
      </label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={2}
          style={{ ...inputStyle, width: "100%", resize: "none", marginTop: 6, fontFamily: "'Inter', sans-serif" }}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ ...inputStyle, width: "100%", marginTop: 6, boxSizing: "border-box" }}
        />
      )}
    </div>
  );
}

const inputStyle = {
  flex: 1,
  background: "transparent",
  border: "1px solid #262A55",
  borderRadius: 3,
  color: "#E4E4EF",
  fontSize: 13,
  padding: "9px 12px",
  outline: "none",
  boxSizing: "border-box",
};
