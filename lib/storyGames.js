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
  {
    assignment: 832040,
    story: "The Borrowed Seconds",
    storyHref: "/assignments/832040",
    game: "rubato",
    title: "RUBATO",
    href: "/games/rubato",
    blurb: "Be Concord. Borrow a few seconds from every angry message so the Velani keep talking - without letting them see your hand.",
    src: "/games/rubato/index.html",
    note: "tap red messages to borrow time · never touch the gold · M for sound",
  },
  {
    assignment: 1346269,
    story: "First Fire",
    storyHref: "/assignments/1346269",
    game: "hold-fire",
    title: "HOLD FIRE",
    href: "/games/hold-fire",
    blurb: "The Kesh fire first. Bend their slugs away without ever firing back, and when their star flares, stand between it and their world.",
    src: "/games/hold-fire/index.html",
    note: "tap a slug to bend it · hold during a flare · F returns fire (don't) · M for sound",
  },
  {
    assignment: 2178309,
    story: "The Fermata",
    storyHref: "/assignments/2178309",
    game: "fermata",
    title: "FERMATA",
    href: "/games/fermata",
    blurb: "Lean on a comet as lightly as you can. Keep its closest pass in the warm band so the wakers wake again, and read the letter each waking leaves.",
    src: "/games/fermata/index.html",
    note: "hold left or right side (or arrow keys) to lean, only in the dark · M for sound",
  },
  {
    assignment: 3524578,
    story: "The Accord",
    storyHref: "/assignments/3524578",
    game: "tutti",
    title: "TUTTI",
    href: "/games/tutti",
    blurb: "Keep the Accord: give every species of the Great Wood what it needs, so it joins the song. And when the vine creeps in, find out what it really is.",
    src: "/games/tutti/index.html",
    note: "drag from a species to one that needs what it gives · drag 13i to the vine · M for sound",
  },
  {
    assignment: 5702887,
    story: "The Ring",
    storyHref: "/assignments/5702887",
    game: "ritornello",
    title: "RITORNELLO",
    href: "/games/ritornello",
    blurb: "At the eyepiece on Hal Teru, answer the Ring's phrase back to it. Every time you do, it returns with one more note. Sometimes it wants it backward.",
    src: "/games/ritornello/index.html",
    note: "tap the arcs or press 1-6 · M for sound",
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
