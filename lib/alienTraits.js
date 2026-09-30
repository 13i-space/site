// Turns a saved species' answers (keyed "Category / question text", see
// components/AlienCreator.js) into the short labelled traits a card shows.

import { ALIEN_QUESTIONS } from "./alienQuestions";

// Which questions make the card, in order, and what each is called there.
// Six, like the stats on a trading card - the full answers stay on the
// species' saved record.
const CARD_TRAITS = [
  ["terrain", "Habitat"],
  ["size", "Size"],
  ["locomotion", "Moves by"],
  ["primary_sense", "Senses by"],
  ["temperament", "Nature"],
  ["tech_level", "Technology"],
];

export const keyFor = (id) => {
  const q = ALIEN_QUESTIONS.find((x) => x.id === id);
  return q ? `${q.category} / ${q.question}` : null;
};

// "Large — twice human height or more" -> "Large"
const short = (value) => String(value || "").split(/\s+[—–-]\s+/)[0].trim();

// The fuller list for the back of the card, under the stats graphic.
const BACK_TRAITS = [
  ["terrain", "Habitat"],
  ["size", "Size"],
  ["locomotion", "Moves by"],
  ["primary_sense", "Senses by"],
  ["temperament", "Nature"],
  ["social_structure", "Society"],
  ["core_value", "Values"],
  ["tech_level", "Technology"],
];

export function cardTraits(answers = {}, list = CARD_TRAITS) {
  return list.map(([id, label]) => {
    const value = answers[keyFor(id)];
    return value ? { label, value: short(value) } : null;
  }).filter(Boolean);
}

export const backTraits = (answers) => cardTraits(answers, BACK_TRAITS);

// One line of card flavour text, built only from what the creator chose.
export function cardTagline(answers = {}) {
  const get = (id) => short(answers[keyFor(id)]).toLowerCase();
  const nature = get("temperament");
  const size = get("size");
  const terrain = get("terrain").split(",")[0]; // "ocean, almost entirely" -> "ocean"
  const bits = [nature, size && size !== "about human-sized" ? size : ""].filter(Boolean).join(", ");
  if (!bits && !terrain) return "";
  const lead = bits || "curious";
  const article = /^[aeiou]/.test(lead) ? "An" : "A";
  return `${article} ${lead} species${terrain ? ` of ${terrain}` : ""}.`;
}

// Short card number from the species' id, e.g. "No. 3F2A" ("NEW" before it's saved)
export function cardNumber(id) {
  if (!id) return "NEW";
  return `No. ${String(id).replace(/[^0-9a-f]/gi, "").slice(0, 4).toUpperCase() || "0000"}`;
}
