"use client";
import { useCallback, useEffect, useRef, useState } from "react";

// Voice notes for the Champion chat, using the browser's own speech services:
// speak instead of type (speech-to-text), and listen to the Champion's replies
// (text-to-speech). No audio is ever sent to Story of Self.

const Recognition = () => (typeof window === "undefined" ? null : window.SpeechRecognition || window.webkitSpeechRecognition || null);

// Dictation into a text box. `getBase` returns the text already typed, and
// `onText` receives the box's new full value as they speak.
export function useDictation({ getBase, onText }) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");
  const rec = useRef(null);
  const base = useRef("");
  const finals = useRef("");

  useEffect(() => { setSupported(Boolean(Recognition())); return () => rec.current?.abort?.(); }, []);

  const stop = useCallback(() => { rec.current?.stop(); }, []);
  const start = useCallback(() => {
    const R = Recognition();
    if (!R) return;
    setError("");
    const r = new R();
    r.lang = navigator.language || "en-US";
    r.continuous = true;
    r.interimResults = true;
    base.current = getBase();
    finals.current = "";
    r.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finals.current += t; else interim += t;
      }
      const said = (finals.current + interim).replace(/\s+/g, " ").trim();
      const b = base.current;
      onText(b ? `${b}${/\s$/.test(b) ? "" : " "}${said}` : said.charAt(0).toUpperCase() + said.slice(1));
    };
    r.onerror = (e) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") setError("Microphone access is blocked. Allow it in your browser to speak your answers.");
      else if (e.error !== "no-speech" && e.error !== "aborted") setError("Voice input stopped. Tap the mic to try again.");
    };
    r.onend = () => setListening(false);
    rec.current = r;
    try { r.start(); setListening(true); } catch { setListening(false); }
  }, [getBase, onText]);

  return { supported, listening, error, start, stop };
}

export function MicButton({ dictation, disabled }) {
  const { supported, listening, start, stop } = dictation;
  if (!supported) return null;
  return (
    <button type="button" className={`vc-mic${listening ? " on" : ""}`} onClick={listening ? stop : start} disabled={disabled && !listening}
      aria-pressed={listening} aria-label={listening ? "Stop voice input" : "Speak your answer"} title={listening ? "Tap to stop" : "Speak your answer"}>
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor" />
        <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      {listening && <span className="vc-mic-label">Listening… tap to stop</span>}
    </button>
  );
}

// Text-to-speech: a calm, natural voice if the device has one.
function pickVoice() {
  const vs = window.speechSynthesis?.getVoices?.() || [];
  const en = vs.filter((v) => /^en(-|_|$)/i.test(v.lang));
  const prefer = [/natural/i, /samantha/i, /google us english/i, /aria|jenny|guy/i, /daniel|karen|moira|serena/i];
  for (const p of prefer) { const v = en.find((x) => p.test(x.name)); if (v) return v; }
  return en.find((v) => v.default) || en[0] || null;
}

export function useSpeaker() {
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(null);
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    setSupported(true);
    window.speechSynthesis.getVoices();
    return () => window.speechSynthesis.cancel();
  }, []);
  const say = useCallback((id, text) => {
    const s = window.speechSynthesis;
    if (!s) return;
    s.cancel();
    if (speaking === id) { setSpeaking(null); return; }
    const u = new SpeechSynthesisUtterance(String(text).replace(/[*_#>]/g, ""));
    const v = pickVoice();
    if (v) u.voice = v;
    u.rate = 0.98;
    u.onend = u.onerror = () => setSpeaking((cur) => (cur === id ? null : cur));
    setSpeaking(id);
    s.speak(u);
  }, [speaking]);
  const hush = useCallback(() => { window.speechSynthesis?.cancel(); setSpeaking(null); }, []);
  return { supported, speaking, say, hush };
}

export function SpeakButton({ speaker, id, text }) {
  if (!speaker.supported) return null;
  const on = speaker.speaking === id;
  return (
    <button type="button" className={`vc-say${on ? " on" : ""}`} onClick={() => speaker.say(id, text)} aria-label={on ? "Stop reading aloud" : "Read aloud"} title={on ? "Stop" : "Listen"}>
      <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
        <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" />
        {on ? <path d="M16 9l5 5M21 9l-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /> : <path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />}
      </svg>
      {on ? "Stop" : "Listen"}
    </button>
  );
}
