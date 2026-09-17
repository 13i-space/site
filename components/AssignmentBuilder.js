"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "../lib/supabaseBrowser";

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

function randomAssignmentNumber() {
  return Math.floor(50000 + Math.random() * 200000);
}

export default function AssignmentBuilder() {
  const [ready, setReady] = useState(false);
  const [userId, setUserId] = useState(null);
  const [assignmentNumber, setAssignmentNumber] = useState(null);
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [checked, setChecked] = useState({});
  const [saveStatus, setSaveStatus] = useState("idle"); // idle | saving | saved
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [error, setError] = useState("");
  const loadedDraft = useRef(false);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setReady(true);
        return;
      }
      setUserId(user.id);
      setEmail(user.email || "");

      const { data: profile } = await supabase.from("profiles").select("username").eq("id", user.id).single();
      if (profile?.username) setName(profile.username);

      const { data: draft } = await supabase.from("assignment_drafts").select("*").eq("user_id", user.id).single();
      if (draft) {
        setAssignmentNumber(draft.assignment_number);
        setTitle(draft.title || "");
        setStory(draft.story || "");
        loadedDraft.current = true;
      } else {
        setAssignmentNumber(randomAssignmentNumber());
      }
      setReady(true);
    })();
  }, []);

  const wordCount = story.trim() ? story.trim().split(/\s+/).length : 0;

  const saveProgress = async () => {
    if (!userId) return;
    setSaveStatus("saving");
    const supabase = createClient();
    await supabase.from("assignment_drafts").upsert({
      user_id: userId,
      assignment_number: assignmentNumber,
      title,
      story,
      updated_at: new Date().toISOString(),
    });
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 2000);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/submit-assignment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, story, title, assignmentNumber }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setSubmitStatus("done");
    } catch (err) {
      setSubmitStatus("idle");
      setError(err.message);
    }
  };

  if (!ready) return null;

  if (!userId) {
    return (
      <div className="panel" style={{ textAlign: "center" }}>
        <p style={{ margin: 0, color: "#8A8FBF" }}>
          You need to be logged in to write an Assignment \u2014 it's tied to
          your Node so you can save progress and come back to it.
        </p>
        <a
          href="/login"
          className="mono"
          style={{ display: "inline-block", marginTop: 14, fontSize: 12, color: "#B9C0FF", border: "1px solid #3A3E75", borderRadius: 4, padding: "8px 18px" }}
        >
          Log in
        </a>
      </div>
    );
  }

  if (submitStatus === "done") {
    return (
      <div className="panel" style={{ textAlign: "center" }}>
        <p style={{ margin: 0, color: "#8B95F6" }}>
          Received. Assignment {assignmentNumber.toLocaleString()} has been submitted.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="panel">
      <div className="mono" style={{ fontSize: 11, color: "#565B8F", letterSpacing: "1px", marginBottom: 4 }}>
        ASSIGNMENT NUMBER
      </div>
      <div className="mono" style={{ fontSize: 20, color: "#E8CFC0", marginBottom: 18 }}>
        {assignmentNumber?.toLocaleString()}
      </div>

      <input
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        style={{ ...inputStyle, width: "100%", marginBottom: 12, boxSizing: "border-box", fontSize: 16 }}
      />

      <textarea
        required
        placeholder="Begin writing here or paste story here..."
        value={story}
        onChange={(e) => setStory(e.target.value)}
        rows={16}
        style={{ ...inputStyle, width: "100%", resize: "vertical", fontFamily: "'Inter', sans-serif", lineHeight: 1.6, boxSizing: "border-box" }}
      />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6, marginBottom: 4 }}>
        <span className="mono" style={{ fontSize: 11, color: "#565B8F" }}>
          {wordCount.toLocaleString()} words &middot; 1,500\u20135,000 is a guideline, not a rule
        </span>
        <button
          type="button"
          onClick={saveProgress}
          disabled={saveStatus === "saving"}
          className="mono"
          style={{ background: "none", border: "1px solid #262A55", borderRadius: 4, color: "#B9C0FF", fontSize: 11, padding: "5px 12px", cursor: "pointer" }}
        >
          {saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? "Saved \u2713" : "Save progress"}
        </button>
      </div>

      <p style={{ fontSize: 12.5, color: "#6E76B8", fontStyle: "italic", marginTop: 14, marginBottom: 20 }}>
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

      <div style={{ marginBottom: 16 }}>
        <div className="mono" style={{ fontSize: 10, color: "#565B8F", letterSpacing: "1px", marginBottom: 8 }}>
          CREDIT & CONTACT
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Your name or username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
          <input
            type="email"
            placeholder="Email for feedback"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
        </div>
        <p style={{ fontSize: 11, color: "#3A3E75", marginTop: 6 }}>
          Defaults to your account \u2014 change either if you'd rather use something else for this Assignment.
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button
          type="submit"
          disabled={submitStatus === "loading"}
          style={{
            background: "none", border: "1px solid #3A3E75", borderRadius: 4, color: "#B9C0FF",
            fontFamily: "'JetBrains Mono', monospace", fontSize: 13, padding: "10px 22px",
            cursor: "pointer", opacity: submitStatus === "loading" ? 0.5 : 1,
          }}
        >
          {submitStatus === "loading" ? "Sending..." : "Submit Assignment"}
        </button>
        {error && <span className="mono" style={{ fontSize: 12, color: "#C97B6E" }}>{error}</span>}
      </div>
    </form>
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
};
