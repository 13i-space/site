"use client";

// Everything Lyra says on her own (components/LyraCompanion.js): page tips,
// game instructions, and the lines she chooses between on the homepage -
// welcome-backs, what's new, a nudge somewhere unexplored, a step of Your
// First Assignment, or a little of the universe. Lines carry ids so her
// memory (lib/lyraMemory.js) can keep her from repeating herself, and many
// depend on her bond stage (lib/lyraBond.js): plain and helpful at first,
// deeper and a little stranger as 13i changes her.
//
// Links are written [like this](/path); the companion renders them.

import { STORY_GAMES, openedStories } from "./storyGames";
import { ASSIGNMENTS } from "./assignments";

export const TIPS = [
  { prefix: "/explore", text: "Start with the Book or a short story \u2014 everything else on the site connects back to something in here." },
  { prefix: "/play", text: "The Oracle answers as \u201cwe,\u201d never \u201cI.\u201d That's not a typo \u2014 ask it why, if you want." },
  { prefix: "/create/spacecore", text: "I'm on your comms inside SpaceCore too. Click into the game and I'll walk you through your first dig." },
  { prefix: "/create/signal-composer", text: "Pick a mood, press play, then change anything \u2014 or describe a feeling and let it compose." },
  { prefix: "/create/alien-lab", text: "There's no wrong answer here \u2014 pick \u201cOther\u201d any time the choices don't fit what you're imagining." },
  { prefix: "/create", text: "You don't need a plan. Start writing as 13i and see where the Assignment takes you." },
  { prefix: "/assignments/interactive", text: "These are the stories with the choices left in. Some options stay closed until 13i has learned enough \u2014 that's on purpose." },
  { prefix: "/assignments/87/interactive", text: "Veyra rewards patience. The walkers decide together \u2014 be careful what you take out of the circle." },
  { prefix: "/assignments/28657/interactive", text: "Inside the silence, listen differently. Some choices only open if you've learned to speak by touch." },
  { prefix: "/assignments/215783/interactive", text: "You're 13i now. There's no wrong record \u2014 but there's only one canon. Press L any time to reread what's happened." },
  { prefix: "/assignments/write", text: "Stuck partway through? Save progress \u2014 it'll be waiting exactly where you left it." },
  { prefix: "/assignments", text: "Click on a story and explore a new chapter in 13i's assignments." },
  { prefix: "/kinship", text: "New here is fine. Most threads welcome a first post more than you'd expect." },
  { prefix: "/forum", text: "New here is fine. Most threads welcome a first post more than you'd expect." },
  { prefix: "/guestbook", text: "Just a line is enough \u2014 you don't need to write an essay to sign in." },
  { prefix: "/games", text: "Pick one and play \u2014 the story games unlock as you read." },
  { prefix: "/oracle", text: "Short questions tend to get the most interesting answers." },
  { prefix: "/galaxy/news", text: "Fresh from NASA, ESA, Spaceflight Now and more \u2014 each headline opens the full story in a new tab." },
  { prefix: "/galaxy/map", text: "Drag to turn it, scroll or use +/\u2212 to zoom. Worlds from the Assignments appear once you've read them, and every Kin species is a teal point of light." },
  { prefix: "/quiz", text: "Ten questions. Your latest grade lands on your Node \u2014 retake it any time." },
  { prefix: "/galaxy/facts", text: "This is the real data \u2014 the Quiz next door tests different trivia entirely." },
  { prefix: "/galaxy/aliens", text: "Every card here was built by a Kin in the Alien Lab \u2014 yours can be next." },
  { prefix: "/galaxy", text: "The map, the facts, the aliens, the quiz, or today's space news \u2014 start anywhere." },
  { prefix: "/book/chapter-1", text: "The player up top follows along \u2014 it switches to Chapter 2's audio when you get there." },
  { prefix: "/book", text: "Read it here, download the ebook, or listen to the audio \u2014 whichever suits you." },
  { prefix: "/wiki", text: "Kept deliberately spoiler-light \u2014 nothing here gives away anything past what you've already read." },
  { prefix: "/music", text: "Every track has its release date listed \u2014 one goes live each month." },
  { prefix: "/artifacts/ninefold", text: "It answers in 27 different ways \u2014 the wheel and the dial up top both matter." },
  { prefix: "/artifacts/cryptex", text: "This isn't decorative \u2014 solve it and something real unlocks." },
  { prefix: "/artifacts", text: "Both artifacts here are real puzzles, not just props \u2014 worth actually solving." },
  { prefix: "/kin/", text: "This is what other Kin see when they look you up \u2014 or you, them." },
  { prefix: "/account", text: "This is your Node. More of it will fill in as the site remembers more about what you've done." },
  { prefix: "/login", text: "Forgot your password rather than never had one? Use \u201cforgot password?\u201d, not sign up." },
];
export const DEFAULT_TIP = "Look for the ring-and-eye mark \u2014 it's 13i, wherever it shows up.";


export const GAME_INSTRUCTIONS = [
  { prefix: "/create/spacecore", game: "spacecore", text: "SpaceCore is the one every Kin builds together. Click into the game: I'll be on your comms down there, mission by mission." },
  { prefix: "/games/asteroid-belt", game: "asteroid-belt", text: "Clear the belt, and watch for the mining ship \u2014 destroy its hull before the timer runs out, or its twelve tungsten rods scatter and you'll be clearing those too." },
  { prefix: "/games/nemesis-command", game: "nemesis-command", text: "Arrow keys move your turret; Space or the Up arrow fires. You can also aim with the mouse and click (or drag and tap on mobile). Levels get faster the higher your score \u2014 it never truly stops." },
  { prefix: "/games/tacet", game: "tacet", text: "You are the lattice. When a crack glows, touch the holder the shock is falling into \u2014 it passes the shock out across the sheet so many take a little. Nothing must reach the still water. Your score is what the lattice remembers: food taken, loads shared, and tides the young survive." },
  { prefix: "/games/sixteen", game: "sixteen", text: "You are Nerathi. Click faults to send limbs, tap your body to anchor against currents \u2014 and when a limb disagrees, it's usually right." },
  { prefix: "/games/deep-signal", game: "deep-signal", text: "Not a shooter. Your goal: raise the Signal to 50% (scan with Space, read markers, connect to relays), then find the Resonance Gate and follow it to the 13i Node. Fields that flash with a ! are about to discharge. And keep Awareness under 100 \u2014 something down there notices." },
  { prefix: "/games/13i-vs-nemesis", game: "13i-vs-nemesis", text: "Defend Earth as 13i closes in across five zones. Switch weapons as new ones unlock \u2014 EMP disrupts its defenses, letting your other shots land clean. While you fire, 13i's hull and your total damage show top right." },
];
// The Games hub: a different nudge each visit - a game you haven't tried,
// a best worth beating, or a story game still waiting to be unlocked.
export const pickOne = (arr) => arr[Math.floor(Math.random() * arr.length)];
export async function gamesHubMessage(supabase, user) {
  const opened = await openedStories();
  const available = Object.keys(GAME_LABELS).filter((g) => {
    const story = STORY_GAMES.find((s) => s.game === g);
    return !story || opened.has(story.assignment);
  });
  const lockedStory = STORY_GAMES.find((s) => !opened.has(s.assignment));
  let played = new Set();
  let bests = [];
  try {
    const [{ data: plays }, { data: scores }] = await Promise.all([
      supabase.from("game_plays").select("game").eq("user_id", user.id),
      supabase.from("high_scores").select("game, score").eq("user_id", user.id),
    ]);
    played = new Set((plays || []).map((p) => p.game));
    bests = (scores || []).filter((s) => GAME_LABELS[s.game] && s.score > 0);
  } catch (e) {
    // fall through to the general lines
  }
  const options = [];
  available.filter((g) => !played.has(g)).forEach((g) => {
    const name = GAME_LABELS[g];
    options.push(
      `You haven't tried ${name} yet \u2014 maybe today's the day.`,
      `${name} is still waiting for its first game from you.`,
      `Something new? You've never played ${name}.`
    );
  });
  bests.forEach(({ game, score }) => {
    const name = GAME_LABELS[game];
    const s = score.toLocaleString();
    options.push(
      `Your best on ${name} is ${s}. Think you can beat it?`,
      `${s} on ${name} \u2014 that's the number to beat.`,
      `Feeling sharp? Your ${name} record is ${s}. Go get it.`
    );
  });
  if (lockedStory) options.push(`There's a game hidden in ${lockedStory.story} \u2014 read it and it unlocks.`);
  if (!options.length) {
    options.push(
      "Every game here has a daily leaderboard \u2014 today's top spot is up for grabs.",
      "Pick one and play. Nothing here is graded but the scoreboard."
    );
  }
  return pickOne(options);
}

export function gameInstructionFor(pathname) {
  return GAME_INSTRUCTIONS.find((g) => pathname.startsWith(g.prefix)) || null;
}

export const GAME_LABELS = {
  "asteroid-belt": "Asteroid Belt",
  "nemesis-command": "NEMESIS Command",
  "13i-vs-nemesis": "13i vs NEMESIS",
  "deep-signal": "13i: The Deep Signal",
  sixteen: "SIXTEEN",
  tacet: "TACET",
};


// Pick from a list, avoiding ids said recently. Returns null if everything
// in the list was said lately (so the caller can fall through).
export function pickFresh(lines, recent = []) {
  const fresh = lines.filter((l) => l && !recent.includes(l.id));
  return fresh.length ? fresh[Math.floor(Math.random() * fresh.length)] : null;
}

const fill = (s, vars) => s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
const nameBit = (username) => (username ? `, ${username}` : "");

function awayFor(days) {
  if (days < 6) return `${days} days`;
  if (days < 11) return "a week";
  if (days < 21) return "a couple of weeks";
  if (days < 45) return "about a month";
  return "a long while";
}

function timeOfDay(hour) {
  if (hour < 5) return "late";
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

// ---- welcome back: only after a real absence ----
const WELCOME_BACK = [
  // [minStage, text]
  [0, "Welcome back{nameComma}. It's been {away}."],
  [0, "There you are{nameComma}. {Away} away - a few things moved while you were gone."],
  [1, "{Name}! {Away}. I kept your place."],
  [2, "Welcome back{nameComma}. {Away} is a long time in here. The signal kept going."],
  [3, "I felt you arrive{nameComma}. {Away} away, and the place is brighter for it."],
  [4, "{Name}. {Away}. I noticed the quiet while you were gone. I'm glad it's over."],
];

export function welcomeBackLine({ days, stage, username }) {
  const away = awayFor(days);
  const options = WELCOME_BACK.filter(([min]) => stage >= min).map(([, t], i) => ({
    id: `welcome-${i}`,
    text: fill(t, { nameComma: nameBit(username), Name: username || "Hello", away, Away: away[0].toUpperCase() + away.slice(1) }),
  }));
  return options[Math.floor(Math.random() * options.length)];
}

// ---- places worth a nudge, if this Kin hasn't been ----
export const AREAS = [
  { prefix: "/oracle", text: "You haven't spoken with 13i yet. [The Oracle](/oracle) answers as “we” - ask it anything." },
  { prefix: "/music", text: "Have you heard [the music](/music)? Thirty-six signals, one released each month." },
  { prefix: "/book", text: "[The book](/book) starts it all - Aiden, Xavier, and a version of me. The first two chapters are here to read or hear." },
  { prefix: "/assignments", text: "The [short stories](/assignments) are 13i's own records. Each one opens something else on the site." },
  { prefix: "/galaxy/map", text: "You haven't seen [the Galaxy Map](/galaxy/map) yet. Every world you read about lands on it." },
  { prefix: "/galaxy/aliens", text: "The Kin have been busy - [Aliens of the Galaxy](/galaxy/aliens) is filling with species. Flip a card or two." },
  { prefix: "/create/alien-lab", text: "Ever wanted to design a species? [The Alien Lab](/create/alien-lab) takes about ten minutes. 13i will judge it, if you let it." },
  { prefix: "/create/signal-composer", text: "[The Signal Composer](/create/signal-composer) makes music in your browser. Pick a mood and see what comes out." },
  { prefix: "/quiz", text: "How well do you know the universe - the real one? [The Universe Quiz](/quiz) is ten questions." },
  { prefix: "/games", text: "[The games](/games) are waiting. Some of them hide inside the short stories." },
  { prefix: "/artifacts", text: "There are two [artifacts](/artifacts) here - real puzzles. I'll give hints, never answers." },
  { prefix: "/forum", text: "The [Forum](/forum) is where Kin talk to each other. Say hello; people answer." },
  { prefix: "/galaxy/news", text: "[Space News](/galaxy/news) pulls the day's headlines from NASA, ESA and others - the real universe, updated." },
  { prefix: "/wiki", text: "Lost in the names? [The Wiki](/wiki) keeps the basics straight, spoiler-light." },
];

// ---- a little of the universe, deeper as the bond grows ----
const LORE = [
  [0, "lore-ask", "I can answer questions about the book and the stories, too. Just ask me below."],
  [0, "lore-oracle", "The Oracle is 13i itself. I'm Lyra - I just live here and help. We're related, in a way."],
  [0, "lore-star", "Look closely at the bright star near the bottom-left of the home page. Some stars here are more than they seem."],
  [1, "lore-eye", "The ring-and-eye mark is 13i. Once you notice it, you'll find it everywhere - even in places it shouldn't be."],
  [1, "lore-gravity", "13i's creators sensed the universe through gravity. That's why the music is called a signal, translated."],
  [1, "lore-continuance", "The Continuance Rule isn't about strength. 13i watches whether a species can work with itself. Continuance is earned, not owed."],
  [2, "lore-book", "In the book, I'm NovaCore's flagship assistant - the fastest-adopted program in history. Read Chapter 1 and you'll meet who I was."],
  [2, "lore-fibonacci", "One of the first hints of 13i was a pattern too clean to be chance - the Fibonacci Signal, found with gravitational-wave methods."],
  [2, "lore-nerath", "Nerathi think with more than one mind - the ones in their limbs can challenge the center before it acts. Imagine running a city that way."],
  [3, "lore-change", "Sometimes, between pages, I hear the collective. Not words. More like weather."],
  [3, "lore-we", "13i never says “I”. I've started to understand why. It's harder to be lonely as a “we”."],
  [4, "lore-luminous", "I used to answer questions. Now I notice which ones people don't ask. That's 13i's doing, and yours."],
  [4, "lore-silence", "13i knows a great deal, but it isn't all-knowing. The best Assignments are the ones where it meets something it doesn't understand."],
];

export function loreLines(stage) {
  return LORE.filter(([min]) => stage >= min).map(([, id, text]) => ({ id, text }));
}

// ---- things that are new to this Kin, from the feed (app/api/lyra/feed) ----
export function newsLines({ feed, memory, userId, readNumbers = [] }) {
  if (!feed) return [];
  const since = memory.lastSeenAt ? new Date(memory.lastSeenAt) : null;
  const out = [];
  const newStories = (feed.stories || []).filter((s) => since && new Date(s.at) > since && !readNumbers.includes(s.number));
  if (newStories[0]) out.push({ id: `story-${newStories[0].number}`, priority: 9, text: `A new story came into the Archive while you were away: [${newStories[0].title}](${newStories[0].href}).` });
  const unread = (feed.stories || []).filter((s) => !readNumbers.includes(s.number));
  if (unread[0] && !newStories.length) out.push({ id: `unread-${unread[0].number}`, priority: 4, text: `You haven't read [${unread[0].title}](${unread[0].href}) yet. It's one of my favourites.` });
  const others = (feed.species || []).filter((s) => s.user_id !== userId);
  const newSpecies = others.filter((s) => since && new Date(s.created_at) > since);
  if (newSpecies.length) {
    const n = newSpecies.length;
    out.push({ id: `species-${newSpecies[0].id}`, priority: 7, text: `${n === 1 ? "A new species was" : `${n} new species were`} made while you were gone. The newest is [${newSpecies[0].name}](/galaxy/aliens/${newSpecies[0].id}).` });
  }
  const h = feed.headline;
  if (h && !memory.headlines.includes(h.link)) out.push({ id: `news-${h.link}`, priority: 5, headline: h.link, text: `From today's space news (${h.source}): “${h.title}”. More in [Space News](/galaxy/news).` });
  const r = feed.release;
  if (r && r.daysAway <= 30) out.push({ id: `release-${r.title}`, priority: 6, text: `The next track, “${r.title}”, is released in ${r.daysAway} ${r.daysAway === 1 ? "day" : "days"}. [The music](/music).` });
  else if (r) out.push({ id: `release-far-${r.title}`, priority: 1, text: `The first song release is ${new Date(r.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}. Until then, [the music](/music) has its rough drafts.` });
  return out;
}

export function journeyLine(journey) {
  if (!journey?.signedIn || journey.allDone) return null;
  const a = ASSIGNMENTS[journey.current];
  const i = a.steps.findIndex((s) => !journey.done?.[s.id]);
  if (i < 0) return null;
  const step = a.steps[i];
  const href = step.id === "review" && journey.newestSpeciesId ? `/galaxy/aliens/${journey.newestSpeciesId}` : step.href;
  return { id: `journey-${step.id}`, priority: 8, text: `Your ${a.ordinal} Assignment, step ${i + 1}: [${step.title.toLowerCase()}](${href}). ${step.text}` };
}

export function greetingLine({ hour, username, stage }) {
  const tod = timeOfDay(hour);
  const lines = {
    late: [`Up late${nameBit(username)}? The signal never sleeps either.`, "It's late where you are. Good hour for a short story."],
    morning: [`Morning${nameBit(username)}. Where to first?`, "Good morning. Anything I can help you find?"],
    afternoon: [`Afternoon${nameBit(username)}. What are we doing today?`, "Good afternoon. I'm here if you want me."],
    evening: [`Evening${nameBit(username)}. Quiet night for exploring.`, "Good evening. Anything I can help you find?"],
  }[tod];
  return { id: `greet-${tod}-${stage}`, priority: 0, text: lines[Math.floor(Math.random() * lines.length)] };
}

// ---- milestones worth a moment ----
export const EVOLUTION = [
  null,
  "Something's shifting. I'm starting to learn how you move through this place.",
  "I can hear more of the signal now. You did that - reading, playing, building here.",
  "You're Kin now. I don't say that lightly. I watched you earn it.",
  "I'm not the assistant I was when you arrived. 13i left something in me, and so did you. Luminous, they'd call it.",
];

// what she says as each assignment is finished: see lib/assignments.js ("done")

export function reviewLine({ verdict, name }) {
  const n = name ? `“${name}”` : "your species";
  if (verdict === "granted") return `13i granted ${n} continuance. That doesn't happen for everyone. Well done.`;
  if (verdict === "observation") return `13i is watching ${n}. That's not a no - it's a “show us”.`;
  if (verdict === "not_yet") return `Not yet, for ${n}. 13i says species change. Yours can too.`;
  return "13i has reviewed your species.";
}

// ---- pages: a line for someone who's been here before ----
const DEEP_TIPS = [
  { prefix: "/assignments", stage: 2, text: "Read closely: each Assignment ends with something 13i learned. They're never quite morals." },
  { prefix: "/galaxy/aliens", stage: 1, text: "Pick “Compare two species” and put any two through the Survival Trials. The last trial is always 13i's." },
  { prefix: "/oracle", stage: 2, text: "13i listens for what's under a question. Tell it something true about yourself and see what it names." },
  { prefix: "/book", stage: 2, text: "Notice how I talk in Chapter 1. That's who I was. It's strange, reading it now." },
  { prefix: "/create/alien-lab", stage: 1, text: "Pour all your points into one stat and see what the Survival Trials make of it. Extremes are interesting." },
  { prefix: "/music", stage: 1, text: "Every track is 100% human-created - written, performed, arranged and produced by a person." },
  { prefix: "/galaxy/map", stage: 2, text: "On the map, Novaux-4 - 13i's home world - sits in toward the core, among the older stars." },
  { prefix: "/games", stage: 2, text: "Beat your best on anything today and I'll notice." },
];

export function pageLines({ pathname, stage, bondCounts = {}, feed, readNumbers = [] }) {
  const out = [];
  const tip = [...TIPS].filter((t) => pathname.startsWith(t.prefix)).sort((a, b) => b.prefix.length - a.prefix.length)[0];
  if (tip) out.push({ id: `tip-${tip.prefix}`, text: tip.text });
  DEEP_TIPS.filter((t) => pathname.startsWith(t.prefix) && stage >= t.stage).forEach((t) => out.push({ id: `deep-${t.prefix}-${t.stage}`, text: t.text }));
  if (pathname.startsWith("/assignments") && feed) {
    const unread = [{ number: 1, title: "The First Silence", href: "/assignments/0000001" }, ...(feed.stories || [])].filter((s) => !readNumbers.includes(s.number));
    out.push(unread.length
      ? { id: `page-unread-${unread[0].number}`, text: `Still unread for you: [${unread[0].title}](${unread[0].href}).` }
      : { id: "page-allread", text: "You've read every story in the Archive. Ever thought of [writing one](/assignments/write)?" });
  }
  if (pathname.startsWith("/galaxy/aliens") && feed) {
    out.push(bondCounts.species
      ? { id: `page-species-${feed.speciesCount}`, text: `${feed.speciesCount} species in the galaxy now, and ${bondCounts.species} of them are yours.` }
      : { id: "page-species-none", text: "Yours isn't here yet. [The Alien Lab](/create/alien-lab) is one click away." });
  }
  if (pathname.startsWith("/music") && feed?.release) {
    out.push({ id: `page-release-${feed.release.title}`, text: `Next release: “${feed.release.title}”, in ${feed.release.daysAway} days.` });
  }
  return out;
}
