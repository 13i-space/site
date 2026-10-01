"use client";
import { useState } from "react";
import { getStoryBrowserClient, storyConfigured } from "../../../lib/story/storySupabase";

const TOPICS = ["I'm a student", "I'm a parent", "Becoming a Champion", "School or organization", "Press", "Something else"];

export default function ContactForm() {
  const [f, setF] = useState({ name: "", email: "", topic: TOPICS[0], message: "", website: "" });
  const [state, setState] = useState("idle"); // idle | sending | sent | error
  const [err, setErr] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    if (f.website) { setState("sent"); return; } // a bot filled the hidden field
    if (!f.name.trim() || !/^\S+@\S+\.\S+$/.test(f.email.trim()) || f.message.trim().length < 5) {
      setErr("Please add your name, a valid email and a short message.");
      setState("error");
      return;
    }
    setState("sending");
    setErr("");
    try {
      if (!storyConfigured) throw new Error("not configured");
      const { error } = await getStoryBrowserClient().from("story_contact").insert({
        name: f.name.trim().slice(0, 120),
        email: f.email.trim().slice(0, 200),
        topic: f.topic,
        message: f.message.trim().slice(0, 5000),
      });
      if (error) throw error;
      setState("sent");
    } catch {
      setErr("Your message couldn't be sent just now. Please try again in a little while.");
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="sp-form sent">
        <div className="sp-sent-mark" aria-hidden="true">✓</div>
        <h2>Thank you, {f.name.split(" ")[0] || "friend"}.</h2>
        <p>Your message is on its way. We'll reply to {f.email || "you"} as soon as we can.</p>
        <a className="sos-btn ghost" href="/story">Back to Story of Self</a>
      </div>
    );
  }

  return (
    <form className="sp-form" onSubmit={submit} noValidate>
      <div className="sp-field-row">
        <label className="sp-field">
          <span>Your name</span>
          <input value={f.name} onChange={set("name")} autoComplete="name" maxLength={120} required />
        </label>
        <label className="sp-field">
          <span>Email</span>
          <input type="email" value={f.email} onChange={set("email")} autoComplete="email" maxLength={200} required />
        </label>
      </div>
      <fieldset className="sp-topics">
        <legend>What's this about?</legend>
        {TOPICS.map((t) => (
          <label key={t} className={f.topic === t ? "on" : ""}>
            <input type="radio" name="topic" value={t} checked={f.topic === t} onChange={set("topic")} />
            {t}
          </label>
        ))}
      </fieldset>
      <label className="sp-field">
        <span>Message</span>
        <textarea rows={6} value={f.message} onChange={set("message")} maxLength={5000} required />
      </label>
      <label className="sp-hp" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={f.website} onChange={set("website")} /></label>
      {state === "error" && <div className="sos-msg err">{err}</div>}
      <button className="sos-btn" type="submit" disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Send message"}</button>
      <p className="sp-small">We'll only use your details to reply. See our <a href="/story/privacy">privacy policy</a>.</p>
    </form>
  );
}
