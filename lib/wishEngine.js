// The Wish Engine's answers (Update 5.58). Varrow reads what kind of
// question it's been asked and answers in kind; 13i translates. Answers are
// picked by a hash of the question plus the moment, so the same question
// asked twice may not get the same answer (Varrow is like that).

const YESNO = [
  ["Yes. The pull is already turning toward it.", "yes"],
  ["Yes, but not in the shape you are picturing.", "yes"],
  ["Every path we can see bends that way. Yes.", "yes"],
  ["Yes. Ask again only if you want to hear it twice.", "yes"],
  ["Yes, if you are the one who moves first.", "yes"],
  ["No. And the no is a door, not a wall.", "no"],
  ["Not this orbit. Perhaps the next.", "no"],
  ["No. Something better is already falling toward you.", "no"],
  ["The weight of it says no. The light of it says wait.", "no"],
  ["It is undecided. You are part of the deciding.", "maybe"],
  ["Both answers are true from where we stand. Choose the one you can carry.", "maybe"],
  ["The signal is clear but the meaning is not. Ask once more, slowly.", "maybe"],
  ["Varrow laughs (this is the sound of three eyes closing). That means yes.", "yes"],
  ["Varrow will not say. It tilts its head toward the person nearest you.", "maybe"],
];
const WHEN = [
  "Sooner than you are ready, later than you would like.",
  "After the next time you choose kindness when it costs you something.",
  "When the thing you are waiting for stops being the thing you are waiting for.",
  "Within thirteen of your turnings. Varrow counts in turnings.",
  "It has already begun. You will recognize it looking back.",
  "When you say it out loud to someone. Not before.",
  "At the next new moon of your world, or the one after. Varrow is not good with your moons.",
];
const WHO = [
  "The one who notices you when you are quiet.",
  "Someone you have not met, who has already heard of you.",
  "You. Varrow is surprised you had to ask.",
  "The person you were three years ago would know. Ask them.",
  "Someone who would say the same about you.",
];
const WHAT = [
  "The thing you keep almost saying.",
  "A small thing done every day, which nobody sees, which holds everything up.",
  "Less than you fear, more than you hope.",
  "A question disguised as an answer. Look at it again tomorrow.",
  "Something you will have to make, because it does not exist yet.",
  "What you are already doing, a little braver.",
];
const WHY = [
  "So that you would ask. That was most of it.",
  "Because two things wanted to be near each other, and that is how everything starts.",
  "No reason that would satisfy you. Several that would satisfy a star.",
  "Because you are the kind who wonders why. That is not nothing.",
  "To teach you what it feels like when it isn't so.",
];
const OPEN = [
  "Keep your eyes on the small lights. The large ones are farther than they look.",
  "Something is falling toward you that you will want to catch.",
  "Be generous with the stranger this week. One of them is not a stranger.",
  "The universe is enormous and it is paying attention to you, slightly.",
  "Varrow sees a door, a stair, and a song. In that order.",
  "You will be understood by someone who does not share your language.",
  "Put the heavy thing down for one evening. It will still be there, and lighter.",
];
const WISH = [
  "Your wish is granted. Varrow asks that you do not waste it on being taller.",
  "Your wish is granted. It will arrive the long way round. Be home when it does.",
  "Your wish is granted, mostly. The part that was not granted was not good for you.",
  "Your wish is granted. Varrow has filed the paperwork with gravity.",
  "Your wish is heard. Varrow cannot grant it, but it has told the one who can.",
];

function hash(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

export function kindOf(q) {
  const s = q.trim().toLowerCase();
  if (/^(i\s+wish|i\s+want|i\s+hope|make\s+me|grant)/.test(s)) return "wish";
  if (/^(when|how\s+long|how\s+soon)\b/.test(s)) return "when";
  if (/^(who|whom|whose)\b/.test(s)) return "who";
  if (/^(why)\b/.test(s)) return "why";
  if (/^(what|which|where|how)\b/.test(s)) return "what";
  if (/^(will|would|should|shall|is|are|am|was|were|do|does|did|can|could|may|might|must|have|has)\b/.test(s)) return "yesno";
  return "open";
}

export function answerFor(q) {
  const kind = kindOf(q);
  const h = hash(q.trim().toLowerCase() + ":" + Math.floor(Date.now() / 60000));
  const pick = (list) => list[h % list.length];
  if (kind === "yesno") { const [text, tone] = pick(YESNO); return { kind, text, tone }; }
  const list = { when: WHEN, who: WHO, what: WHAT, why: WHY, wish: WISH, open: OPEN }[kind];
  return { kind, text: pick(list), tone: kind === "wish" ? "wish" : "open", number: (h % 9000) + 1000 };
}

// Varrow's own writing, for the card: one mark per letter, stable per text
const MARKS = "ᚠᚢᚦᚱᚷᛁᛇᛒᛗᛟⲀⲂⲄⲊⲎⲒⲚⲠⲨⲰ";
export function inVarrow(text) {
  let h = hash(text);
  return text.split(" ").slice(0, 9).map((w) => w.split("").slice(0, 6).map(() => { h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0; return MARKS[h % MARKS.length]; }).join("")).join(" ");
}
