"use client";

import { useEffect } from "react";
import IframeGame from "./IframeGame";
import { createClient } from "../lib/supabaseBrowser";

// XenoKlash (Update 5.99) runs as a standalone page in an iframe
// (public/games/xenoklash.html). IframeGame records its plays and its
// tournament scores like every other iframe game. This adds one thing:
// unlock progress (tournaments won; Voraxx, Rhakka, Zhaal and Morrow unlocked,
// "ultimate" once the Hollow King falls; which fighters have won) kept in Supabase table xk_progress
// (docs/v5.99-xenoklash-progress.sql), so it follows a Kin across devices.
// Signed out, or the table not created yet: the game just keeps progress
// in that browser, and nothing here throws.
const GAME = "xenoklash";

async function loadProgress() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase.from("xk_progress").select("tournaments_won, unlocked, champions, best_score").eq("user_id", user.id).maybeSingle();
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
    const n = (v) => Math.max(0, Math.min(1000000, Math.round(Number(v) || 0)));
    const champions = {};
    for (const [k, v] of Object.entries(p.champions || {})) if (/^[a-z]{2,12}$/.test(k)) champions[k] = n(v);
    await supabase.from("xk_progress").upsert({
      user_id: user.id,
      tournaments_won: n(p.tournaments_won),
      unlocked: (p.unlocked || []).filter((u) => /^[a-z]{2,12}$/.test(u)).slice(0, 12),
      champions,
      best_score: n(p.best_score),
      updated_at: new Date().toISOString(),
    });
  } catch (e) {
    // ignore - the game still has its own copy
  }
}

export default function XenoKlashGame() {
  useEffect(() => {
    const onMessage = async (e) => {
      if (e.origin !== window.location.origin) return;
      const msg = e.data || {};
      if (msg.source !== GAME) return;
      if (msg.type === "progress-request") {
        const progress = await loadProgress();
        if (progress && e.source) e.source.postMessage({ source: "13i", type: "xk-progress", progress }, window.location.origin);
      }
      if (msg.type === "progress" && msg.progress) saveProgress(msg.progress);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return <IframeGame game={GAME} songs src="/games/xenoklash.html?v=6.11" title="XenoKlash" note="click the game to give it the keyboard · arrows move · A S D W · Space special · P pauses · or plug in a controller" />;
}
