// Assemble a student's Story of Self from every lesson's saved drafts.
// Priority: their own edits on the Story Write page > the latest lesson that captured it.
import { LESSON_ORDER, STORY_WRITE } from "./lessonSteps";

export const STORY_WRITE_ID = "story-write";
export const STORY_KEYS = STORY_WRITE.flatMap((p) => p.sections.map((s) => s.key));

export function assembleStory(rows = []) {
  const out = {};
  const ordered = [...rows]
    .filter((r) => LESSON_ORDER.includes(r.lesson))
    .sort((a, b) => LESSON_ORDER.indexOf(a.lesson) - LESSON_ORDER.indexOf(b.lesson));
  for (const r of ordered) {
    for (const k of STORY_KEYS) if (r.captured?.[k]) out[k] = r.captured[k];
  }
  const edits = rows.find((r) => r.lesson === STORY_WRITE_ID);
  for (const k of STORY_KEYS) if (edits?.captured?.[k]) out[k] = edits.captured[k];
  const title = edits?.captured?.story_title || rows.find((r) => r.lesson === "unit7-lesson21")?.captured?.story_title || "";
  return { sections: out, title };
}

export const wordCount = (t) => (String(t || "").trim().match(/\S+/g) || []).length;
