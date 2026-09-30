import { createClient } from "./supabaseBrowser";

// Games that belong to a short story. Each one stays hidden in Games until
// the visitor has opened its story, in any way: signed in (reading_progress)
// or not (remembered in this browser). Add an entry here when the next
// AI-written story gets its game.
export const STORY_GAMES = [
  {
    assignment: 87,
    story: "The Deep Walkers",
    storyHref: "/assignments/87",
    game: "deep-signal", // high_scores / daily_scores key
    title: "13i: The Deep Signal",
    href: "/games/deep-signal",
    blurb: "An exploration game from The Deep Walkers. Follow an impossible transmission across an ancient world, and be noticed.",
  },
];

const key = (n) => `13i_story_opened_${n}`;

export function markStoryOpened(assignmentNumber) {
  try {
    localStorage.setItem(key(assignmentNumber), "1");
  } catch (e) {
    // storage unavailable - the signed-in record still counts
  }
}

// Resolves to the set of assignment numbers this visitor has opened.
export async function openedStories() {
  const opened = new Set();
  STORY_GAMES.forEach((g) => {
    try {
      if (localStorage.getItem(key(g.assignment))) opened.add(g.assignment);
    } catch (e) {
      // ignore
    }
  });
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from("reading_progress").select("assignment_number").eq("user_id", user.id);
      (data || []).forEach((r) => opened.add(r.assignment_number));
    }
  } catch (e) {
    // offline or signed out - localStorage alone decides
  }
  return opened;
}
