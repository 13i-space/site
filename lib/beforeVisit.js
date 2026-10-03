// Assignment 0000000 - Before (Update 5.54): who still has it ahead of them.
//
// Everyone sees it once - including Kin who were here before it existed.
// No new table: a flag in this browser, and for signed-in Kin a flag on
// their account (Supabase user metadata), so a new phone or laptop never
// sends them through it twice.
//   - finished (or skipped) here           -> straight to /launch
//   - signed in, finished on another device -> straight to /launch
//   - anything else                         -> /before
// Refreshing or closing midway leaves nothing saved, so it simply starts
// again from the silence. /before itself always plays when opened
// directly - that's how to replay it, or hand it to someone on a browser
// that has already seen it.
import { createClient } from "./supabaseBrowser";

const KEY = "13i_before";
const ARRIVED = "13i_before_arrived"; // sessionStorage: just came through it

export function beforeDoneHere() {
  try { return localStorage.getItem(KEY) === "done"; } catch (e) { return true; } // no storage: never trap anyone
}

// Should this visitor to /launch be sent to /before first?
export async function needsBefore() {
  if (beforeDoneHere()) return false;
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return true;
    const { data } = await createClient().auth.getSession(); // local, no network wait
    const meta = data && data.session && data.session.user && data.session.user.user_metadata;
    if (meta && meta.before_done) {
      try { localStorage.setItem(KEY, "done"); } catch (e) { /* ignore */ }
      return false;
    }
  } catch (e) { /* signed-out or auth not set up: fall through */ }
  return true;
}

// Finished (or stepped out with "enter 13i"). universe: the number their
// creation made, or null if they skipped before making one.
export async function markBeforeDone(universe) {
  try {
    localStorage.setItem(KEY, "done");
    localStorage.setItem("bigbang_seen", "1"); // they've had their Big Bang
    if (universe) localStorage.setItem("13i_universe", String(universe));
    sessionStorage.setItem(ARRIVED, universe ? String(universe) : "skipped");
  } catch (e) { /* ignore */ }
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    if (data && data.session) {
      const patch = { before_done: true };
      if (universe) patch.before_universe = String(universe);
      await Promise.race([supabase.auth.updateUser({ data: patch }), new Promise((r) => setTimeout(r, 1500))]);
    }
  } catch (e) { /* the local flag is enough */ }
}

// /launch asks once: did they just arrive from /before? -> "1234567" | "skipped" | null
export function takeArrival() {
  try {
    const v = sessionStorage.getItem(ARRIVED);
    if (v) sessionStorage.removeItem(ARRIVED);
    return v;
  } catch (e) { return null; }
}
