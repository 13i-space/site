"use client";

import { useState, useEffect, useRef } from "react";
import { lyraReact, lyraHint } from "../lib/lyraReact";
import { lyraLookAt } from "../lib/lyraMusic";
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

// One of these, after a long pause (the Assignment Protocol, docs/WORLD.md)
const WRITING_PROMPTS = [
  "If you're stuck: what does 13i not understand yet here? That's usually where an Assignment comes alive.",
  "A thought, if it helps: what did 13i expect to find - and what did it find instead?",
  "Every Assignment leaves the collective knowing something it didn't before. What does it learn in yours?",
  "Remember, 13i is never all-knowing. Let it misread something.",
];

// A spark to start from, if the page is blank (Update 5.57)
const SPARKS = [
  "We arrive at a world whose people have stopped speaking. Not one of them. All of them, on the same day.",
  "A signal has been repeating from the same empty point for nine thousand years. We were sent to find out who is still listening to it.",
  "The species we were sent to assess has already assessed us. They are waiting at the edge of their system.",
  "Something on this moon is growing in perfect circles. We do not know if it is alive.",
  "We were sent to stop a war. When we arrived, both sides asked us which of them we had come to help.",
  "A manifestation of ours went silent here forty years ago. We have come to learn what it learned.",
  "They have built a machine to talk to their dead. We were sent because it has started to answer.",
];

export default function AssignmentBuilder() {
  const [ready, setReady] = useState(false);
  const [userId, setUserId] = useState(null);
  const [assignmentNumber, setAssignmentNumber] = useState(null);
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [checked, setChecked] = useState({});
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [saveStatus, setSaveStatus] = useState("idle"); // idle | saving | saved
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [error, setError] = useState("");
  const [spark, setSpark] = useState(0);
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

  // Lyra watches you write: her eye follows the end of the line you're on.
  // After a long pause in a story already under way she holds one quiet
  // prompt (her dot - never popping open). Submitting gets a small burst.
  const storyRef = useRef(null);
  const pauseTimer = useRef(null);
  const followCaret = () => {
    const el = storyRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cs = window.getComputedStyle(el);
    const fontSize = parseFloat(cs.fontSize) || 15;
    const lineH = parseFloat(cs.lineHeight) || fontSize * 1.6;
    const padL = parseFloat(cs.paddingLeft) || 0, padT = parseFloat(cs.paddingTop) || 0;
    const perRow = Math.max(10, Math.floor((el.clientWidth - padL * 2) / (fontSize * 0.5)));
    const before = el.value.slice(0, el.selectionStart || 0).split("\n");
    let rows = 0;
    before.forEach((ln, k) => { rows += k < before.length - 1 ? Math.max(1, Math.ceil(ln.length / perRow)) : Math.floor(ln.length / perRow); });
    const col = before[before.length - 1].length % perRow;
    const x = r.left + padL + Math.min(el.clientWidth - padL, col * fontSize * 0.5);
    const y = Math.min(r.bottom, Math.max(r.top, r.top + padT + rows * lineH + lineH / 2 - el.scrollTop));
    lyraLookAt(x, y, 1600);
  };
  const onStoryInput = () => {
    followCaret();
    clearTimeout(pauseTimer.current);
    pauseTimer.current = setTimeout(() => {
      if ((storyRef.current?.value || "").trim().length < 40) return;
      lyraHint(WRITING_PROMPTS[Math.floor(Math.random() * WRITING_PROMPTS.length)], "writing-pause");
    }, 90000);
  };
  useEffect(() => () => clearTimeout(pauseTimer.current), []);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitStatus("loading");
    setError("");
    try {
      let coverUrl = null;
      if (coverFile) {
        const supabase = createClient();
        const ext = coverFile.name.split(".").pop();
        const path = `${userId}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("assignment-covers")
          .upload(path, coverFile);
        if (uploadError) throw new Error(`Cover upload failed: ${uploadError.message}`);
        const { data } = supabase.storage.from("assignment-covers").getPublicUrl(path);
        coverUrl = data.publicUrl;
      }

      const res = await fetch("/api/submit-assignment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, story, title, assignmentNumber, coverUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      clearTimeout(pauseTimer.current);
      lyraReact("celebrate");
      setSubmitStatus("done");
    } catch (err) {
      setSubmitStatus("idle");
      setError(err.message);
    }
  };

  if (!ready) return null;

  if (!userId) {
    return (
      <div className="wa-sheet wa-gate">
        <div className="wa-gate-title">Your Assignment is waiting.</div>
        <p>Sign in to write one. It&rsquo;s tied to your Node, so you can save as you go and come back to it any time.</p>
        <a href="/login" className="wa-primary">Sign in to write &rarr;</a>
      </div>
    );
  }

  if (submitStatus === "done") {
    return (
      <div className="wa-sheet wa-gate">
        <div className="mono wa-stamp wa-stamp-sent">transmitted</div>
        <div className="wa-gate-title">Received.</div>
        <p>Assignment {String(assignmentNumber).padStart(7, "0")} has reached the archive. The collective will read it.</p>
      </div>
    );
  }

  const goal = Math.min(1, wordCount / 1500);
  const ticks = Object.values(checked).filter(Boolean).length;

  return (
    <form onSubmit={submit} className="wa-sheet">
      <div className="wa-sheet-head">
        <div>
          <div className="mono wa-small">assignment</div>
          <div className="mono wa-number">{assignmentNumber ? String(assignmentNumber).padStart(7, "0") : ""}</div>
        </div>
        <button type="button" onClick={saveProgress} disabled={saveStatus === "saving"} className="mono wa-save">
          {saveStatus === "saving" ? "saving..." : saveStatus === "saved" ? "saved \u2713" : "save progress"}
        </button>
      </div>

      {!story.trim() && (
        <div className="wa-spark">
          <span className="mono wa-small">need a spark?</span>
          <p>&ldquo;{SPARKS[spark]}&rdquo;</p>
          <span className="wa-spark-actions">
            <button type="button" className="mono" onClick={() => setSpark((n) => (n + 1) % SPARKS.length)}>another &rarr;</button>
            <button type="button" className="mono" onClick={() => { setStory(SPARKS[spark] + "\n\n"); setTimeout(() => storyRef.current?.focus(), 0); }}>start from this one</button>
          </span>
        </div>
      )}

      <input
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Give it a title"
        className="wa-title-input"
      />

      <textarea
        required
        placeholder="We arrived..."
        value={story}
        onChange={(e) => { setStory(e.target.value); onStoryInput(); }}
        onSelect={followCaret}
        ref={storyRef}
        rows={14}
        className="wa-story"
      />

      <div className="wa-meter">
        <div className="wa-meter-bar"><span style={{ width: `${goal * 100}%` }} /></div>
        <span className="mono">{wordCount.toLocaleString()} words &middot; 1,500&ndash;5,000 is a guideline, not a rule</span>
      </div>

      <details className="wa-step">
        <summary>
          <span className="wa-step-n">1</span>
          <span>Before you send it <span className="mono wa-small">{ticks}/{CHECKLIST.length} checked &middot; optional</span></span>
        </summary>
        <div className="wa-checks">
          {CHECKLIST.map((item, i) => (
            <label key={i} className={checked[i] ? "wa-check-on" : ""}>
              <input type="checkbox" checked={!!checked[i]} onChange={() => setChecked((c) => ({ ...c, [i]: !c[i] }))} />
              {item}
            </label>
          ))}
        </div>
      </details>

      <details className="wa-step">
        <summary>
          <span className="wa-step-n">2</span>
          <span>Cover and credit <span className="mono wa-small">{coverFile ? "cover added" : "optional cover"} &middot; {name || "your name"}</span></span>
        </summary>
        <div className="wa-step-body">
          <div className="wa-cover-row">
            {coverPreview && <img src={coverPreview} alt="" />}
            <label className="mono wa-ghost">
              {coverFile ? "change image" : "upload a cover"}
              <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setCoverFile(file);
                setCoverPreview(URL.createObjectURL(file));
              }} />
            </label>
          </div>
          <div className="wa-credit">
            <input type="text" placeholder="Your name or username" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
            <input type="email" placeholder="Email for feedback" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
          </div>
          <p className="wa-hint">Defaults to your account; change either for this Assignment if you like.</p>
        </div>
      </details>

      <div className="wa-send">
        <p>Remember: you are 13i. Think collectively. Let the Assignment change you.</p>
        <button type="submit" disabled={submitStatus === "loading"} className="wa-primary">
          {submitStatus === "loading" ? "Transmitting..." : "Transmit Assignment \u2192"}
        </button>
        {error && <span className="mono wa-error">{error}</span>}
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
