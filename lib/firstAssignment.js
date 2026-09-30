"use client";

import { createClient } from "./supabaseBrowser";
import { STORY_GAMES } from "./storyGames";

// Your First Assignment: 13i's assignment for a new Kin - a short path
// through the universe that touches each part of it once. Each step is
// checked against what's already recorded (reading_progress, game_plays,
// alien_species) or, where nothing else records it, kin_milestones
// (docs/v5.8-continuance-and-milestones.sql, via lib/milestones.js).
export const JOURNEY = [
  { id: "oracle", title: "Speak with 13i", text: "Ask the Oracle anything. We will answer.", href: "/oracle", cta: "open the Oracle" },
  { id: "read", title: "Read an Assignment", text: "One of our short stories from the Archive.", href: "/assignments", cta: "the Archive" },
  { id: "play", title: "Play what it unlocks", text: "Each story opens a game set inside it.", href: "/games", cta: "Games" },
  { id: "create", title: "Make a species", text: "Build one in the Alien Lab and save it.", href: "/create/alien-lab", cta: "the Alien Lab" },
  { id: "review", title: "Submit it to 13i", text: "Ask for its Continuance Review.", href: "/account", cta: "your species" },
  { id: "map", title: "Find it in the galaxy", text: "Locate your species on the Galaxy Map.", href: "/galaxy/map", cta: "the Galaxy Map" },
];

export async function loadJourney() {
  const done = {};
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { signedIn: false, done };
    const [reads, plays, species, milestones] = await Promise.all([
      supabase.from("reading_progress").select("assignment_number").eq("user_id", user.id).limit(1),
      supabase.from("game_plays").select("game").eq("user_id", user.id).in("game", STORY_GAMES.map((g) => g.game)).limit(1),
      supabase.from("alien_species").select("*").eq("user_id", user.id).limit(50),
      supabase.from("kin_milestones").select("milestone").eq("user_id", user.id),
    ]);
    const reached = new Set((milestones.data || []).map((m) => m.milestone));
    const mine = species.data || [];
    done.oracle = reached.has("oracle");
    done.read = (reads.data || []).length > 0;
    done.play = (plays.data || []).length > 0;
    done.create = mine.length > 0;
    done.review = mine.some((s) => s.review) || reached.has("review");
    done.map = reached.has("map");
    // point the review step at their newest species' own page
    const newest = mine.sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))[0];
    return { signedIn: true, done, newestSpeciesId: newest?.id || null };
  } catch (e) {
    return { signedIn: false, done };
  }
}
