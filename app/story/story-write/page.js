"use client";
import { useEffect, useMemo, useState } from "react";
import { getStoryBrowserClient, storyConfigured } from "../../../lib/story/storySupabase";
import { STORY_WRITE } from "../../../lib/story/lessonSteps";
import { assembleStory, wordCount, STORY_WRITE_ID } from "../../../lib/story/storyWrite";
import { partsFromStoryWrite } from "../../../lib/story/bookPdf";
import BookButton from "../_components/BookButton";

// My Story Write: the whole Story of Self, assembled from every lesson's drafts,
// editable here, with Aaron's word-count targets and a clean reading view.
export default function StoryWrite() {
  const [status, setStatus] = useState("loading");
  const [name, setName] = useState("");
  const [userId, setUserId] = useState(null);
  const [text, setText] = useState({});
  const [title, setTitle] = useState("");
  const [saved, setSaved] = useState({});
  const [savedTitle, setSavedTitle] = useState("");
  const [mode, setMode] = useState("edit");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!storyConfigured) { setStatus("not_configured"); return; }
    const sb = getStoryBrowserClient();
    (async () => {
      const { data: s } = await sb.auth.getSession();
      if (!s.session) { setStatus("signed_out"); return; }
      setUserId(s.session.user.id);
      setName(s.session.user.user_metadata?.first_name || "");
      const { data } = await sb.from("story_progress").select("lesson, step, captured, completed_at");
      const { sections, title: t } = assembleStory(data || []);
      setText(sections);
      setSaved(sections);
      setTitle(t);
      setSavedTitle(t);
      setStatus("ready");
    })();
  }, []);

  const dirty = useMemo(() => JSON.stringify(text) !== JSON.stringify(saved) || title !== savedTitle, [text, saved, title, savedTitle]);
  const total = useMemo(() => Object.values(text).reduce((n, t) => n + wordCount(t), 0), [text]);
  const written = STORY_WRITE.flatMap((p) => p.sections).filter((s) => (text[s.key] || "").trim()).length;
  const allSections = STORY_WRITE.flatMap((p) => p.sections).length;
  const book = { title: title || "My Story of Self", author: name, parts: partsFromStoryWrite(STORY_WRITE, text) };

  async function save() {
    const sb = getStoryBrowserClient();
    setMsg("Saving…");
    const { error } = await sb.from("story_progress").upsert(
      { user_id: userId, lesson: STORY_WRITE_ID, step: "complete", captured: { ...text, story_title: title }, updated_at: new Date().toISOString() },
      { onConflict: "user_id,lesson" }
    );
    if (error) { setMsg("Couldn't save just now. Try again in a moment."); return; }
    setSaved(text);
    setSavedTitle(title);
    setMsg("Saved.");
    setTimeout(() => setMsg(""), 2500);
  }

  if (status === "loading") return <div className="sos-center">Opening your story…</div>;
  if (status === "not_configured") return <div className="sos-center"><p>Accounts aren't switched on yet.</p></div>;
  if (status === "signed_out") {
    return (
      <div className="sos-narrow sos-center">
        <div>
          <h1 style={{ fontSize: 34, marginBottom: 12 }}>Your story lives here</h1>
          <a className="sos-btn" href="/story/start?next=/story/story-write">Sign in</a>
        </div>
      </div>
    );
  }

  if (mode === "read") {
    return (
      <div className="sos-read">
        <div className="sos-read-bar">
          <button className="sos-btn ghost" onClick={() => setMode("edit")}>← Back to editing</button>
          <BookButton {...book} className="sos-btn" />
          <button className="sos-btn ghost" onClick={() => window.print()}>Print</button>
        </div>
        <article>
          <div className="sos-eyebrow" style={{ textAlign: "center" }}>A Story of Self{name ? ` by ${name}` : ""}</div>
          <h1>{title || "My Story of Self"}</h1>
          {STORY_WRITE.map((p) => {
            const parts = p.sections.filter((s) => (text[s.key] || "").trim());
            if (!parts.length) return null;
            return (
              <section key={p.part}>
                <h2>{p.part}</h2>
                {parts.map((s) => (
                  <p key={s.key} className={s.sentence ? "sos-read-line" : ""}>{text[s.key]}</p>
                ))}
              </section>
            );
          })}
          <p className="sos-read-end">Own your story.</p>
        </article>
        <p className="sos-read-tip">Aaron's rule: read your story, don't give a speech. Stick to the script. No freestyles.</p>
        <p className="sos-read-tip" style={{ marginTop: 6 }}>The book is a small 5.5 × 8.5 inch PDF with your title on the cover: print it and bring it to Story Night.</p>
      </div>
    );
  }

  return (
    <div className="sos-narrow" style={{ maxWidth: 820, padding: "40px 24px 20px" }}>
      <div className="sos-eyebrow">My Story Write · {written} of {allSections} sections · {total} words</div>
      <h1 style={{ fontSize: "clamp(34px, 6vw, 50px)" }}>Your Story of Self</h1>
      <p className="sos-lede" style={{ marginTop: 12 }}>
        Every piece you write with your Champion lands here. Edit anything, any time. Finish first, edit last, and read it out loud.
      </p>

      <div className="sos-sw-bar">
        <button className="sos-btn" onClick={save} disabled={!dirty}>{dirty ? "Save changes" : "Saved"}</button>
        <button className="sos-btn ghost" onClick={() => setMode("read")}>Reading view</button>
        <BookButton {...book} />
        {msg && <span className="sos-sw-msg">{msg}</span>}
      </div>

      <div className="sos-field" style={{ marginTop: 18 }}>
        <label htmlFor="sos-title">Title (optional)</label>
        <input id="sos-title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} placeholder="e.g. The Invisible Kid" />
      </div>

      {STORY_WRITE.map((p) => (
        <section key={p.part} className="sos-sw-part">
          <h2>{p.part} <small>{p.target}</small></h2>
          {p.sections.map((s) => {
            const v = text[s.key] || "";
            const wc = wordCount(v);
            const over = s.words && wc > s.words * 1.25;
            return (
              <div key={s.key} className="sos-sw-sec">
                <div className="sos-sw-head">
                  <b>{s.label}</b>
                  <span className={over ? "over" : ""}>
                    {s.sentence ? "one sentence" : s.words ? `${wc} / ~${s.words} words` : `${wc} words`}
                  </span>
                </div>
                <textarea
                  value={v}
                  onChange={(e) => setText({ ...text, [s.key]: e.target.value })}
                  rows={s.sentence ? 2 : Math.max(4, Math.min(12, Math.ceil(wc / 18) + 2))}
                  placeholder={v ? "" : "Not written yet. Your Champion will help you write this in its lesson, or write it here."}
                />
              </div>
            );
          })}
        </section>
      ))}

      <div className="sos-sw-bar" style={{ marginTop: 24 }}>
        <button className="sos-btn" onClick={save} disabled={!dirty}>{dirty ? "Save changes" : "Saved"}</button>
        <button className="sos-btn ghost" onClick={() => setMode("read")}>Reading view</button>
        <a className="sos-btn ghost" href="/story/my-story">My story</a>
      </div>
    </div>
  );
}
