// Story of Self: the lessons and their steps, shared by the server and the
// browser. (The Champion's full instructions live in championPrompt.js, which is
// server-only so Aaron's method never ships to the browser.)

export const LESSONS = {
  "unit1-lesson1": {
    id: "unit1-lesson1",
    slug: "lesson-1",
    number: 1,
    unit: "Unit 1 · Character",
    title: "You: The Science & The Story",
    tagline: "A character is born. A story begins.",
    steps: [
      { id: "connector", label: "Arrive" },
      { id: "five_words", label: "5 Words" },
      { id: "one_word", label: "One Word" },
      { id: "five_events", label: "5 Moments" },
      { id: "unique", label: "The Only You" },
      { id: "close", label: "Snapshot" },
    ],
    next: "unit1-lesson2",
  },
  "unit1-lesson2": {
    id: "unit1-lesson2",
    slug: "lesson-2",
    number: 2,
    unit: "Unit 1 · Character",
    title: "A Life in Stages",
    tagline: "Every story moves through chapters. Here are yours.",
    steps: [
      { id: "connector", label: "Arrive" },
      { id: "stage_0_5", label: "0–5" },
      { id: "stage_5_12", label: "5–12" },
      { id: "stage_12_18", label: "12–18" },
      { id: "stage_18_26", label: "18–26" },
      { id: "impact", label: "Biggest Impact" },
      { id: "ordinary_world", label: "Your World" },
      { id: "close", label: "Your Stages" },
    ],
    requires: "unit1-lesson1",
    next: "unit1-lesson3",
  },
  "unit1-lesson3": {
    id: "unit1-lesson3",
    slug: "lesson-3",
    number: 3,
    unit: "Unit 1 · Character",
    title: "Expected to Exceptional",
    tagline: "What you expect from life, and what would make it exceptional.",
    steps: [
      { id: "connector", label: "Arrive" },
      { id: "expected", label: "Expected" },
      { id: "expectations", label: "The Catch" },
      { id: "exceptional", label: "Exceptional" },
      { id: "contrast", label: "Two Aims" },
      { id: "choice", label: "Your Choice" },
      { id: "close", label: "Your Aim" },
    ],
    requires: "unit1-lesson2",
    next: "unit1-lesson4",
  },
  "unit1-lesson4": {
    id: "unit1-lesson4",
    slug: "lesson-4",
    number: 4,
    unit: "Unit 1 · Character",
    title: "The Call to Adventure",
    tagline: "Rewrite your story, rewrite your life.",
    steps: [
      { id: "connector", label: "Arrive" },
      { id: "today", label: "Who I Am" },
      { id: "become", label: "Who I'll Become" },
      { id: "legacy", label: "Legacy" },
      { id: "challenge", label: "The Call" },
      { id: "grow", label: "Grow & Let Go" },
      { id: "circle", label: "Here to There" },
      { id: "close", label: "Unit Complete" },
    ],
    requires: "unit1-lesson3",
    next: null,
  },
};

// The lessons that make up Unit 1 (for the "My Character" summary page).
export const UNIT_1 = ["unit1-lesson1", "unit1-lesson2", "unit1-lesson3", "unit1-lesson4"];

// Shown on the My Story page as what's coming (not built yet).
export const COMING_SOON = [
  { number: "II", title: "Unit 2 · Challenge", tagline: "A character faces a challenge. Discovering your defining moment." },
];

export const LESSON_ORDER = Object.keys(LESSONS);

export function getLesson(id) {
  return LESSONS[id] || null;
}

export function stepIds(lessonId) {
  const l = LESSONS[lessonId];
  return l ? [...l.steps.map((s) => s.id), "complete"] : ["complete"];
}

export function stepIndex(lessonId, step) {
  const ids = stepIds(lessonId);
  const i = ids.indexOf(step);
  return i === -1 ? 0 : i;
}
