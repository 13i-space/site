// Story of Self: the steps of Unit 1 / Lesson 1, shared by the server and the
// browser. (The Champion's full instructions live in championPrompt.js, which is
// server-only so Aaron's method never ships to the browser.)

export const LESSON_ID = "unit1-lesson1";

export const LESSON_STEPS = [
  { id: "connector", label: "Arrive" },
  { id: "five_words", label: "5 Words" },
  { id: "one_word", label: "One Word" },
  { id: "five_events", label: "5 Moments" },
  { id: "unique", label: "The Only You" },
  { id: "close", label: "Snapshot" },
];

export const STEP_IDS = [...LESSON_STEPS.map((s) => s.id), "complete"];

export function stepIndex(step) {
  const i = STEP_IDS.indexOf(step);
  return i === -1 ? 0 : i;
}
