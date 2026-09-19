"use client";

import { createClient } from "./supabaseBrowser";

// All of these are silent no-ops when signed out or on any error - activity
// tracking should never be able to break the experience it's tracking.

export async function recordStoryRead(assignmentNumber) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase
      .from("reading_progress")
      .upsert({ user_id: user.id, assignment_number: assignmentNumber, read_at: new Date().toISOString() });
  } catch (e) {
    // ignore
  }
}

export async function recordGamePlay(game) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: existing } = await supabase
      .from("game_plays")
      .select("play_count")
      .eq("user_id", user.id)
      .eq("game", game)
      .single();
    await supabase.from("game_plays").upsert({
      user_id: user.id,
      game,
      play_count: (existing?.play_count || 0) + 1,
      last_played_at: new Date().toISOString(),
    });
  } catch (e) {
    // ignore
  }
}

export async function recordHighScore(game, score) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: existing } = await supabase
      .from("high_scores")
      .select("score")
      .eq("user_id", user.id)
      .eq("game", game)
      .single();
    if (existing && existing.score >= score) return; // only ever keep the best
    await supabase.from("high_scores").upsert({
      user_id: user.id,
      game,
      score,
      updated_at: new Date().toISOString(),
    });
  } catch (e) {
    // ignore
  }
}
