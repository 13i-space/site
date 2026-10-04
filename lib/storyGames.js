import { createClient } from "./supabaseBrowser";

// Games that belong to a short story. Each one stays hidden in Games until
// the visitor has opened its story, in any way: signed in (reading_progress)
// or not (remembered in this browser). Add an entry here when the next
// AI-written story gets its game.
export const STORY_GAMES = [
  {
    assignment: 28657,
    story: "The Quiet Moon",
    storyHref: "/assignments/28657",
    game: "tacet",
    title: "TACET",
    href: "/games/tacet",
    blurb: "Be the silence. Thousands of holders under the ice of a loud moon - take the shocks, share them, and keep the young below in still water.",
    src: "/games/tacet/index.html",
    note: "touch the holder a shock is falling into · M for sound",
  },
  {
    assignment: 87,
    story: "The Deep Walkers",
    storyHref: "/assignments/87",
    game: "deep-signal", // high_scores / daily_scores key
    title: "13i: The Deep Signal",
    href: "/games/deep-signal",
    blurb: "An exploration game from The Deep Walkers. Follow an impossible transmission across an ancient world, and be noticed.",
    src: "/games/deep-signal/index.html",
    note: "click the game to give it the keyboard · desktop recommended",
  },
  {
    assignment: 215783,
    story: "Nerath's Secret",
    storyHref: "/assignments/215783",
    game: "sixteen",
    title: "SIXTEEN",
    href: "/games/sixteen",
    blurb: "Be Nerathi: one mind at the center, sixteen in your limbs. Keep a drowning city lit - and learn when to listen to yourself.",
    src: "/games/sixteen/index.html",
    note: "click faults to send limbs · space to listen · tap your body to anchor",
  },
  {
    assignment: 514229,
    story: "The Sea of Glass",
    storyHref: "/assignments/514229",
    game: "prism",
    title: "PRISM",
    href: "/games/prism",
    blurb: "Carry the bright one's light across the sea of glass. Turn the returners' crowns until it reaches the heavy one, before the white star rises.",
    src: "/games/prism/index.html",
    note: "tap a crown to turn it · arrows + space work too · M for sound",
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
