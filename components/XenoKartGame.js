"use client";

import { useEffect } from "react";
import IframeGame from "./IframeGame";
import { createClient } from "../lib/supabaseBrowser";

// XenoKart (Update 6.00) runs as a standalone page in an iframe
// (public/games/xenokart.html, three.js self-hosted at
// public/games/lib/three.r128.min.js). IframeGame records its plays and
// its scores (a single race, or a whole Grand Prix) like every other
// iframe game. This adds unlock progress - Voraxx unlocked, best lap per
// track, Grand Prix wins - kept in Supabase table xkart_progress
// (docs/v6.00-xenokart-progress.sql), so it follows a Kin across devices.
// Signed out, or the table not created yet: the game keeps progress in
// that browser, and nothing here throws.
const GAME = "xenokart";
const KEY = /^[a-z]{2,12}$/;

async function loadProgress() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase.from("xkart_progress").select("unlocked, best_laps, gp_wins").eq("user_id", user.id).maybeSingle();
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
    const best_laps = {};
    for (const [k, v] of Object.entries(p.best_laps || {})) {
      const t = Number(v);
      if (KEY.test(k) && Number.isFinite(t) && t > 5 && t < 600) best_laps[k] = Math.round(t * 1000) / 1000;
    }
    await supabase.from("xkart_progress").upsert({
      user_id: user.id,
      unlocked: (p.unlocked || []).filter((u) => KEY.test(u)).slice(0, 12),
      best_laps,
      gp_wins: Math.max(0, Math.min(100000, Math.round(Number(p.gp_wins) || 0))),
      updated_at: new Date().toISOString(),
    });
  } catch (e) {
    // ignore - the game still has its own copy
  }
}

export default function XenoKartGame() {
  useEffect(() => {
    const onMessage = async (e) => {
      if (e.origin !== window.location.origin) return;
      const msg = e.data || {};
      if (msg.source !== GAME) return;
      if (msg.type === "progress-request") {
        const progress = await loadProgress();
        if (progress && e.source) e.source.postMessage({ source: "13i", type: "xkart-progress", progress }, window.location.origin);
      }
      if (msg.type === "progress" && msg.progress) saveProgress(msg.progress);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return <IframeGame game={GAME} songs src="/games/xenokart.html?v=6.10" title="XenoKart" note="click the game to give it the keyboard · ↑ gas · ← → steer · Space drift · A item · S ability · P pauses" />;
}
