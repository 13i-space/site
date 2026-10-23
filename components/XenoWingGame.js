"use client";

import { useEffect } from "react";
import IframeGame from "./IframeGame";
import { createClient } from "../lib/supabaseBrowser";

// XenoWing (Update 6.01) runs as a standalone page in an iframe
// (public/games/xenowing.html, three.js self-hosted at
// public/games/lib/three.r128.min.js). IframeGame records its plays and
// its scores (a mission or a free patrol) like every other iframe game.
// This adds unlock progress - which pilots are unlocked (Ilu, Qeth,
// Varrow), which missions are done, which difficulties have beaten the
// Methane Wyrm - kept in Supabase table xwing_progress
// (docs/v6.01-xenowing-progress.sql), so it follows a Kin across devices.
// Signed out, or the table not created yet: the game keeps progress in
// that browser, and nothing here throws.
const GAME = "xenowing";
const KEY = /^[a-z0-9]{2,12}$/;
const DIFF = /^(Easy|Normal|Hard)$/;

async function loadProgress() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase.from("xwing_progress").select("unlocked, done, beat").eq("user_id", user.id).maybeSingle();
    return data || {};
  } catch (e) {
    return null;
  }
}

async function saveProgress(p) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("xwing_progress").upsert({
      user_id: user.id,
      unlocked: (p.unlocked || []).filter((u) => KEY.test(u)).slice(0, 12),
      done: (p.done || []).filter((u) => KEY.test(u)).slice(0, 12),
      beat: (p.beat || []).filter((u) => DIFF.test(u)).slice(0, 3),
      updated_at: new Date().toISOString(),
    });
  } catch (e) {
    // ignore - the game still has its own copy
  }
}

export default function XenoWingGame() {
  useEffect(() => {
    const onMessage = async (e) => {
      if (e.origin !== window.location.origin) return;
      const msg = e.data || {};
      if (msg.source !== GAME) return;
      if (msg.type === "progress-request") {
        const progress = await loadProgress();
        if (progress && e.source) e.source.postMessage({ source: "13i", type: "xwing-progress", progress }, window.location.origin);
      }
      if (msg.type === "progress" && msg.progress) saveProgress(msg.progress);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return <IframeGame game={GAME} songs src="/games/xenowing.html?v=6.07" title="XenoWing" note="click the game to give it the keyboard · ↑↓ pitch · ← → roll · W S throttle · Space guns · F secondary · Shift boost · C cockpit · H handling · P pauses" />;
}
