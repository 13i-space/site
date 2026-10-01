"use client";

import { createClient } from "../supabaseBrowser";

// Saving for Interactive Assignments. Two layers, like the rest of the site:
// - this browser (localStorage): the bookmark to resume from, and endings found
// - signed-in Kin (Supabase `interactive_runs`, docs/v5.34-interactive-assignments.sql):
//   endings found follow you across devices, and count toward the Kin stats.
// Every function here is a silent no-op on any failure - including the table
// not existing yet - so the story itself can never be broken by saving.

const bookmarkKey = (n) => `13i_interactive_${n}_bookmark`;
const endingsKey = (n) => `13i_interactive_${n}_endings`;

export function loadBookmark(number) {
  try {
    const raw = localStorage.getItem(bookmarkKey(number));
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function saveBookmark(number, bookmark) {
  try {
    localStorage.setItem(bookmarkKey(number), JSON.stringify(bookmark));
  } catch (e) {
    // storage unavailable - the story still plays, it just can't resume
  }
}

export function clearBookmark(number) {
  try {
    localStorage.removeItem(bookmarkKey(number));
  } catch (e) {
    // ignore
  }
}

function localEndings(number) {
  try {
    const raw = localStorage.getItem(endingsKey(number));
    return new Set(raw ? JSON.parse(raw) : []);
  } catch (e) {
    return new Set();
  }
}

// Endings this visitor has found: this browser, plus their account if signed in.
export async function foundEndings(number) {
  const found = localEndings(number);
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from("interactive_runs").select("ending").eq("story", number).eq("user_id", user.id);
      (data || []).forEach((r) => found.add(r.ending));
    }
  } catch (e) {
    // signed out, offline, or the table isn't there yet
  }
  return found;
}

// Returns { signedIn } so the ending screen can invite signing in.
export async function recordEnding(number, ending, climax) {
  try {
    const set = localEndings(number);
    set.add(ending);
    localStorage.setItem(endingsKey(number), JSON.stringify([...set]));
  } catch (e) {
    // ignore
  }
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { signedIn: false };
    await supabase.from("interactive_runs").insert({ user_id: user.id, story: number, ending, climax: climax || null });
    return { signedIn: true };
  } catch (e) {
    return { signedIn: false };
  }
}

// { endings: {id: n}, climax: {choice: n}, total } or null when unavailable.
export async function kinStats(number) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.rpc("interactive_stats", { p_story: number });
    if (error || !data) return null;
    const out = { endings: {}, climax: {}, total: 0 };
    data.forEach((r) => {
      if (r.kind === "ending") {
        out.endings[r.key] = Number(r.n);
        out.total += Number(r.n);
      } else if (r.kind === "climax") {
        out.climax[r.key] = Number(r.n);
      }
    });
    return out;
  } catch (e) {
    return null;
  }
}
