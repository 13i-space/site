"use client";

import { createClient } from "./supabaseBrowser";
import { STORY_GAMES } from "./storyGames";
import { ALL_STEPS, progressFrom } from "./assignments";

// A Kin's progress through their assignments (lib/assignments.js). Each step
// is checked against what's already recorded (reading_progress, game_plays,
// alien_species, profiles, the forum) or, where nothing else records it,
// kin_milestones (docs/v5.8-continuance-and-milestones.sql, lib/milestones.js).
export const JOURNEY = ALL_STEPS;

export async function loadJourney() {
  const done = {};
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { signedIn: false, done, ...progressFrom(done) };
    const [reads, plays, species, milestones, profile, threads, replies] = await Promise.all([
      supabase.from("reading_progress").select("assignment_number").eq("user_id", user.id).limit(1),
      supabase.from("game_plays").select("game").eq("user_id", user.id).in("game", STORY_GAMES.map((g) => g.game)).limit(1),
      supabase.from("alien_species").select("*").eq("user_id", user.id).limit(50),
      supabase.from("kin_milestones").select("milestone").eq("user_id", user.id),
      supabase.from("profiles").select("avatar_url").eq("id", user.id).maybeSingle(),
      supabase.from("forum_threads").select("id").eq("author_id", user.id).limit(1),
      supabase.from("forum_replies").select("id").eq("author_id", user.id).limit(1),
    ]);
    const reached = new Set((milestones.data || []).map((m) => m.milestone));
    const mine = species.data || [];
    done.oracle = reached.has("oracle");
    done.read = (reads.data || []).length > 0;
    done.play = (plays.data || []).length > 0;
    done.create = mine.length > 0;
    done.review = mine.some((s) => s.review) || reached.has("review");
    done.map = reached.has("map");
    done.avatar = !!profile.data?.avatar_url || reached.has("avatar");
    done.trials = reached.has("trials");
    done.forum = (threads.data || []).length > 0 || (replies.data || []).length > 0 || reached.has("forum");
    // point the review step at their newest species' own page
    const newest = mine.sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))[0];
    return { signedIn: true, done, newestSpeciesId: newest?.id || null, ...progressFrom(done) };
  } catch (e) {
    return { signedIn: false, done, ...progressFrom(done) };
  }
}
