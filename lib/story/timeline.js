// The Life Timeline (Story Guide pp. 20-23): good moments above the line, hard
// ones below, the height showing how much each one mattered. Saved as its own
// row in story_progress (lesson "life-timeline"), next to the lessons.

export const TIMELINE_ID = "life-timeline";
export const GOAL_MOMENTS = 10;
export const MAX_MOMENTS = 40;

export const STAGES = [
  { from: 0, to: 5, label: "0–5", name: "Family First" },
  { from: 5, to: 12, label: "5–12", name: "Family & Friends" },
  { from: 12, to: 18, label: "12–18", name: "Friends & Family" },
  { from: 18, to: 26, label: "18–26", name: "World, Work & Family" },
  { from: 26, to: 99, label: "26+", name: "Family First" },
];

// The stages a person of this age has lived (at least partly).
export const livedStages = (age) => STAGES.filter((s) => s.from < Math.max(age, 0.5));

export const stageOf = (age) => STAGES.find((s) => age >= s.from && age < s.to) || STAGES[STAGES.length - 1];

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

// Keep stored data tidy and bounded, whatever the browser sent.
export function cleanTimeline(raw = {}) {
  const age = clamp(Math.round(Number(raw.age) || 18), 13, 80);
  const moments = (Array.isArray(raw.moments) ? raw.moments : [])
    .slice(0, MAX_MOMENTS)
    .map((m, i) => {
      let v = clamp(Math.round(Number(m.v) || 0), -5, 5);
      if (v === 0) v = 1;
      return {
        id: String(m.id || `m${i}`).slice(0, 24),
        age: clamp(Math.round((Number(m.age) || 0) * 2) / 2, 0, age),
        v,
        text: String(m.text || "").slice(0, 120),
      };
    })
    .filter((m) => m.text.trim());
  return { age, moments };
}

// A short summary for the Champion (sorted by age).
export function timelineSummary(raw) {
  const t = cleanTimeline(raw);
  if (!t.moments.length) return "";
  return [...t.moments]
    .sort((a, b) => a.age - b.age)
    .map((m) => `age ${m.age}: ${m.text} (${m.v > 0 ? "+" : ""}${m.v})`)
    .join("; ");
}
