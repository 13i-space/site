// Lyra's bond with a Kin - how far along they are, which sets how Lyra
// looks and talks to them. In the book Lyra begins as a fairly ordinary AI
// and is changed by contact with 13i; on the site she changes the same way,
// through you. Pure function: the same counts give the same stage on the
// server (app/api/lyra) and in the browser (components/LyraCompanion).
export const STAGES = [
  { name: "Listening", min: 0 },
  { name: "Tuning in", min: 4 },
  { name: "Resonant", min: 10 },
  { name: "Kin", min: 18 },
  { name: "Luminous", min: 30 },
];

// assignmentsDone: 0-3 of the Kin's assignments (lib/assignments.js).
export function computeBond({ reads = 0, games = 0, species = 0, reviews = 0, quiz = null, assignmentsDone = 0, visitDays = 0 } = {}) {
  const score =
    Math.min(reads, 10) * 2 +
    Math.min(games, 8) * 1.5 +
    Math.min(species, 5) * 2 +
    Math.min(reviews, 5) +
    (quiz ? 1 + (/^A/.test(quiz) ? 1 : 0) : 0) +
    assignmentsDone * 2 + (assignmentsDone >= 3 ? 2 : 0) +
    Math.min(visitDays, 20) * 0.5;
  let stage = 0;
  STAGES.forEach((s, i) => { if (score >= s.min) stage = i; });
  const next = STAGES[stage + 1];
  return { score, stage, name: STAGES[stage].name, toNext: next ? Math.max(0, next.min - score) : 0 };
}
