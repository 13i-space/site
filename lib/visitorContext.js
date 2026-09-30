// What the site knows about the signed-in visitor, from what they've done
// here. Server-side (pass the request's Supabase server client). Used by
// the Oracle (13i) and Lyra to speak to a person, not just at them.
import { assignmentMeta } from "./assignment1";
import { VERDICTS } from "./continuance";
import { computeBond } from "./lyraBond";
import { isAlpha, alphaNumber } from "./alpha";
import { progressFrom } from "./assignments";

export const GAME_NAMES = {
  "nemesis-command": "NEMESIS Command",
  "asteroid-belt": "Asteroid Belt",
  "13i-vs-nemesis": "13i vs NEMESIS",
  "deep-signal": "13i: The Deep Signal",
  sixteen: "SIXTEEN",
};

// Kin-written text (names) goes into prompts as quoted data, trimmed.
export const quote = (s, n = 40) => `"${String(s || "").replace(/["\n\r]/g, " ").trim().slice(0, n)}"`;

// null when signed out
export async function gatherVisitor(supabase) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const [profile, reads, species, scores, plays, quiz, milestones, threads, replies] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("reading_progress").select("assignment_number").eq("user_id", user.id),
    supabase.from("alien_species").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(8),
    supabase.from("high_scores").select("game, score").eq("user_id", user.id),
    supabase.from("game_plays").select("game").eq("user_id", user.id),
    supabase.from("quiz_results").select("grade").eq("user_id", user.id).maybeSingle(),
    supabase.from("kin_milestones").select("milestone").eq("user_id", user.id),
    supabase.from("forum_threads").select("id").eq("author_id", user.id).limit(1),
    supabase.from("forum_replies").select("id").eq("author_id", user.id).limit(1),
  ]);
  const readNumbers = (reads.data || []).map((r) => r.assignment_number);
  let readTitles = [];
  if (readNumbers.length) {
    const { data: rows } = await supabase.from("assignment_submissions").select("assignment_number, designation").in("assignment_number", readNumbers);
    const byNumber = Object.fromEntries((rows || []).map((r) => [r.assignment_number, r.designation]));
    readTitles = readNumbers.map((n) => (n === 1 ? assignmentMeta.chapter : byNumber[n])).filter(Boolean);
  }
  const mine = species.data || [];
  const reached = new Set((milestones.data || []).map((m) => m.milestone));
  const gamesPlayed = new Set((plays.data || []).map((p) => p.game)).size;
  const bond = computeBond({
    reads: readNumbers.length,
    games: gamesPlayed,
    species: mine.length,
    reviews: mine.filter((s) => s.review).length,
    quiz: quiz.data?.grade || null,
    assignmentsDone: progressFrom({
      oracle: reached.has("oracle"),
      read: readNumbers.length > 0,
      play: gamesPlayed > 0, // close enough server-side: any game, not only a story's
      create: mine.length > 0,
      review: mine.some((s) => s.review) || reached.has("review"),
      map: reached.has("map"),
      avatar: !!profile.data?.avatar_url || reached.has("avatar"),
      trials: reached.has("trials"),
      forum: (threads.data || []).length + (replies.data || []).length > 0 || reached.has("forum"),
    }).completedCount,
  });
  return {
    userId: user.id,
    username: profile.data?.username || null,
    alpha: isAlpha({ ...(profile.data || {}), created_at: profile.data?.created_at || user.created_at }),
    alphaNumber: alphaNumber(profile.data),
    joinedAt: profile.data?.created_at || null,
    readNumbers,
    readTitles,
    species: mine,
    scores: scores.data || [],
    quizGrade: quiz.data?.grade || null,
    bond,
  };
}

// The visitor as lines of prompt text.
export function describeVisitor(v) {
  if (!v) return "The visitor is not signed in. You know nothing about them beyond this conversation.";
  const lines = [];
  if (v.username) lines.push(`- Their name here: ${quote(v.username, 30)}`);
  if (v.alpha) lines.push(`- They are an Alpha User${v.alphaNumber ? ` (${v.alphaNumber})` : ""}: one of the first Kin, testing the site before Beta. If they mention ideas, problems or changes for the site, thank them and point them to the Alpha Users Private Forum (/forum/alpha).`);
  lines.push(v.readTitles.length ? `- Stories they have read: ${v.readTitles.map((t) => quote(t, 60)).join(", ")}` : "- They have not read any of the stories yet.");
  if (v.species.length) {
    lines.push(`- Species they designed in the Alien Lab: ${v.species.map((s) => {
      const verdict = s.review && VERDICTS[s.review.verdict];
      return `${quote(s.name)}${verdict ? ` (13i's Continuance Review: ${verdict.label.toLowerCase()})` : " (not yet reviewed by 13i)"}`;
    }).join(", ")}`);
  }
  if (v.scores.length) lines.push(`- Games they have played, with best scores: ${v.scores.map((s) => `${GAME_NAMES[s.game] || s.game} ${s.score}`).join(", ")}`);
  if (v.quizGrade) lines.push(`- Their latest Universe Quiz grade: ${v.quizGrade}`);
  return lines.join("\n");
}
