"use client";
import { useEffect, useState } from "react";
import { WAITLIST_ROLES, GRAD_YEARS } from "../../../lib/story/waitlist";

const SAVED = "sos-waitlist";
const read = () => { try { return JSON.parse(localStorage.getItem(SAVED) || "null"); } catch { return null; } };
const keep = (v) => { try { localStorage.setItem(SAVED, JSON.stringify(v)); } catch {} };

// Join the launch list. `variant` = "band" (compact, for the homepage) or "page".
export default function WaitlistForm({ variant = "page", source = "site" }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("student");
  const [year, setYear] = useState(GRAD_YEARS[1]);
  const [hp, setHp] = useState("");
  const [ref, setRef] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setDone(read());
    try {
      const r = new URLSearchParams(window.location.search).get("ref");
      if (r) { setRef(r); sessionStorage.setItem("sos-ref", r); } else setRef(sessionStorage.getItem("sos-ref") || "");
    } catch {}
  }, []);

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setErr("");
    try {
      const res = await fetch("/api/story/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, first_name: name, role, grad_year: role === "student" ? year : null, ref, source, website: hp }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Couldn't add you just now. Please try again.");
      const v = { position: data.position, ref_code: data.ref_code, already: data.already, name: name.trim() };
      keep(v); setDone(v);
    } catch (e2) { setErr(e2.message); }
    setBusy(false);
  }

  const link = done?.ref_code && typeof window !== "undefined" ? `${window.location.origin}/story?ref=${done.ref_code}` : "";
  async function share() {
    try {
      if (navigator.share) { await navigator.share({ title: "Story of Self", text: "Own your story before the next chapter begins.", url: link }); return; }
      await navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 2200);
    } catch {}
  }

  if (done) {
    return (
      <div className={`wl wl-${variant} wl-done`} role="status">
        <div className="wl-check" aria-hidden="true">✓</div>
        <div>
          <b className="wl-done-h">{done.already ? "You're already on the list" : `You're on the list${done.name ? `, ${done.name}` : ""}.`}</b>
          <p>{done.position ? <>You're <strong>#{done.position.toLocaleString()}</strong> in line. </> : null}We'll email you when Story of Self opens, with a few launch updates before then. Nothing else.</p>
          {link && (
            <div className="wl-share">
              <span>Know someone graduating? Send them your link:</span>
              <div className="wl-share-row">
                <input readOnly value={link} aria-label="Your share link" onFocus={(e) => e.target.select()} />
                <button type="button" className="sos-btn ghost" onClick={share}>{copied ? "Copied ✓" : "Share"}</button>
              </div>
            </div>
          )}
          <button type="button" className="wl-reset" onClick={() => { keep(null); setDone(null); }}>Add someone else</button>
        </div>
      </div>
    );
  }

  return (
    <form className={`wl wl-${variant}`} onSubmit={submit}>
      <fieldset className="wl-roles">
        <legend>Who are you?</legend>
        {WAITLIST_ROLES.map((r) => (
          <label key={r.id} className={role === r.id ? "on" : ""}>
            <input type="radio" name="wl-role" value={r.id} checked={role === r.id} onChange={() => setRole(r.id)} />
            {variant === "band" ? r.short : r.label}
          </label>
        ))}
      </fieldset>
      {role === "student" && (
        <fieldset className="wl-years">
          <legend>High school class of</legend>
          {GRAD_YEARS.map((y) => (
            <label key={y} className={year === y ? "on" : ""}>
              <input type="radio" name="wl-year" value={y} checked={year === y} onChange={() => setYear(y)} />{y}
            </label>
          ))}
        </fieldset>
      )}
      <div className="wl-fields">
        <input className="wl-name" value={name} onChange={(e) => setName(e.target.value)} placeholder={variant === "band" ? "First name" : "First name (optional)"} aria-label="First name" maxLength={60} autoComplete="given-name" />
        <input className="wl-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" aria-label="Email" maxLength={200} autoComplete="email" />
        <input className="wl-hp" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} aria-hidden="true" placeholder="Leave this empty" />
        <button className="sos-btn" type="submit" disabled={busy}>{busy ? "Adding you…" : "Join the launch list"}</button>
      </div>
      {err && <p className="wl-err" role="alert">{err}</p>}
      <p className="wl-fine">First access when we open in spring 2027, and a few updates before then. No spam, unsubscribe any time. You must be 13 or older to join. <a href="/story/privacy">Privacy</a></p>
    </form>
  );
}
