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
    next: null,
  },
};

// Shown on the My Story page as what's coming (not built yet).
export const COMING_SOON = [
  { number: 3, title: "Expected to Exceptional", tagline: "What you expect from life, and what would make it exceptional." },
  { number: 4, title: "The Call to Adventure", tagline: "Who you are today, and who you want to become." },
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
