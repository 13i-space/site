// Story of Self: Units 2–7 (Lessons 5–22), built from Aaron's Build Foundation
// Sessions 3–24 and Story Guide Units 2–7. Client-safe: steps and card layouts only.
// The Champion's instructions for these lessons live in lessonPrompts2.js (server-only).
//
// card.fields: [capturedKey, label, kind]  kind = "big" | "text" | "list" | "draft"

const L = (n, unit, id, title, tagline, steps, card, extra = {}) => ({
  id,
  slug: `lesson-${n}`,
  number: n,
  unit,
  title,
  tagline,
  steps: steps.map(([sid, label]) => ({ id: sid, label })),
  card,
  ...extra,
});

const U2 = "Unit 2 · Challenge";
const U3 = "Unit 3 · Choice";
const U4 = "Unit 4 · Cave";
const U5 = "Unit 5 · Change";
const U6 = "Unit 6 · Create";
const U7 = "Unit 7 · Close the Circle";

export const LESSONS_2_TO_7 = [
  // ---------------- Unit 2 · Challenge ----------------
  L(5, U2, "unit2-lesson5", "How We See", "We don't see the world as it is. We see it as a story.",
    [["connector", "Arrive"], ["victim_hero", "Victim or Hero"], ["circle", "Known & Unknown"], ["seeing", "Seeing Story"], ["meaning", "A Meaningful Thing"], ["change_see", "Seeing Differently"], ["close", "How I See"]],
    { label: "How I See", fields: [
      ["certainty", "Where I have certainty", "text"], ["uncertainty", "Where I have uncertainty", "text"],
      ["victim_when", "I feel like the victim when", "text"], ["hero_when", "I feel like the hero when", "text"],
      ["object_meaning", "Something meaningful I own, and why", "text"],
      ["see_self_differently", "A part of myself I want to see differently", "big"],
    ] }),
  L(6, U2, "unit2-lesson6", "Emotions", "Shifting from threat to opportunity.",
    [["connector", "Arrive"], ["challenge_now", "My Challenge"], ["think_do_feel", "Think · Do · Feel"], ["threat", "Threat"], ["opportunity", "Opportunity"], ["growth", "Room to Grow"], ["close", "Threat to Opportunity"]],
    { label: "Threat to Opportunity", fields: [
      ["current_challenge", "The challenge I face right now", "big"],
      ["challenge_feel", "How it makes me feel", "text"],
      ["fear", "Threat · Fear", "text"], ["sad", "Threat · Sadness", "text"], ["anger", "Threat · Anger", "text"],
      ["explore", "Opportunity · Explore", "text"], ["play", "Opportunity · Play", "text"], ["create", "Opportunity · Create", "text"],
      ["growth_opportunity", "The opportunity to grow", "big"],
    ] }, { pauseAfter: true }),
  L(7, U2, "unit2-lesson7", "The Defining Moment", "The moment your world changed.",
    [["connector", "Arrive"], ["what_is", "What It Is"], ["five_titles", "5 Moments"], ["find_one", "Finding the One"], ["feel", "What You Felt"], ["draft", "Write It"], ["close", "My Moment"]],
    { label: "The Defining Moment", fields: [
      ["dm_titles", "Five moments", "list"],
      ["defining_moment_title", "My Defining Moment", "big"],
      ["draft_defining_moment", "Draft · Defining Moment", "draft"],
    ] }),
  L(8, U2, "unit2-lesson8", "Hidden Value & Ordinary World", "What that moment made you believe.",
    [["connector", "In One Sentence"], ["hidden_value", "I Am…"], ["name_it", "Naming It"], ["ordinary_world", "The World Before"], ["intro_draft", "Your Introduction"], ["close", "Unit Complete"]],
    { label: "Introduction", fields: [
      ["dm_one_sentence", "My Defining Moment, in one sentence", "text"],
      ["hidden_value", "My Hidden Value", "big"],
      ["draft_ordinary_world", "Draft · Ordinary World", "draft"],
      ["draft_defining_moment", "Draft · Defining Moment", "draft"],
    ] }, { pauseAfter: true, unitEnd: true }),

  // ---------------- Unit 3 · Choice ----------------
  L(9, U3, "unit3-lesson9", "Which Cup Do You Fill?", "You hit what you aim at.",
    [["connector", "What I Want"], ["anxiety", "Between Two Worlds"], ["external", "External Cups"], ["internal", "Internal Cups"], ["victim_hero", "Victim or Hero"], ["close", "My Cups"]],
    { label: "My Cups", fields: [
      ["want_for_self", "What I want for myself", "big"],
      ["power_no_choice", "External · Power: where I feel I have no choice", "text"],
      ["people_first", "External · People: where I put others before myself", "text"],
      ["higher_aim", "Internal · A higher aim", "text"], ["potential", "Internal · Potential: what I'm growing", "text"],
      ["personal", "Internal · Personal: how I'll value myself", "text"],
      ["aim_reflection", "Where I'm aiming", "text"],
    ] }),
  L(10, U3, "unit3-lesson10", "The Fall: Defiance & Disruption", "How the Hidden Value takes control of the story.",
    [["connector", "Arrive"], ["four_ds", "The Fall"], ["defiance", "Defiance"], ["draft_defiance", "Write Defiance"], ["disruption", "Disruption"], ["draft_disruption", "Write Disruption"], ["close", "Two D's"]],
    { label: "The Fall, Part 1", fields: [
      ["defy_reject", "How I hide it (reject)", "list"], ["defy_accept", "How I give in to it (accept)", "list"],
      ["draft_defiance", "Draft · Defiance", "draft"],
      ["disruption_feel", "What it feels like to be me", "list"],
      ["draft_disruption", "Draft · Disruption", "draft"],
    ] }),
  L(11, U3, "unit3-lesson11", "The Fall: Destruction", "When the tension breaks.",
    [["connector", "The Tension"], ["destruction", "Where Pain Goes"], ["draft_destruction", "Write Destruction"], ["fall_view", "The Whole Fall"], ["close", "Unit Complete"]],
    { label: "The Fall, Part 2", fields: [
      ["destruction_out", "When it goes outward", "text"], ["destruction_in", "When it turns inward", "text"],
      ["draft_destruction", "Draft · Destruction", "draft"],
      ["fall_pattern", "The pattern I see", "big"],
    ] }, { pauseAfter: true, unitEnd: true }),

  // ---------------- Unit 4 · Cave ----------------
  L(12, U4, "unit4-lesson12", "A Rite of Passage", "Every real change has a cave.",
    [["connector", "Arrive"], ["rite", "Leaving · Between · Growing"], ["guides", "My Guides"], ["belly", "Belly of the Beast"], ["let_die", "Letting Go"], ["close", "My Rite of Passage"]],
    { label: "My Rite of Passage", fields: [
      ["separation", "What I'm leaving behind", "text"], ["liminality", "Where I'm in-between", "text"], ["incorporation", "Where I'm growing", "text"],
      ["guide_been", "A guide who's been through it", "text"], ["guide_in", "Someone in it with me", "text"],
      ["need_let_go", "What I need to let go of", "big"],
      ["let_die_become", "Who I can become if the old story dies", "text"],
    ] }),
  L(13, U4, "unit4-lesson13", "Despair", "The lowest point, where the shift begins.",
    [["checkin", "Check In"], ["despair_prompts", "The Low Point"], ["moment", "The Moment"], ["draft_despair", "Write It"], ["close", "Toward Hope"]],
    { label: "Despair", fields: [["draft_despair", "Draft · Despair", "draft"]] },
    { holdNext: true }),
  L(14, U4, "unit4-lesson14", "The Monster & Hope", "In the darkest place, a spark.",
    [["connector", "Arrive"], ["monster", "The Monster"], ["courage", "Evidence of Courage"], ["becoming", "Becoming"], ["hope", "Hope"], ["draft_hope", "Write Hope"], ["close", "Unit Complete"]],
    { label: "The Impossible Shift", fields: [
      ["monster", "How my fear becomes a monster", "text"],
      ["courage_evidence", "Evidence of my courage", "list"],
      ["hope_found", "Where I found hope", "big"],
      ["draft_hope", "Draft · Hope", "draft"],
    ] }, { pauseAfter: true, unitEnd: true }),

  // ---------------- Unit 5 · Change ----------------
  L(15, U5, "unit5-lesson15", "Seeing a New Story", "We don't see the world as it is. We see it as we are.",
    [["connector", "Overcome"], ["threat_opp", "Threat → Opportunity"], ["focus", "Focus & Filter"], ["here_there", "Here to There"], ["braveheart", "Changing the View"], ["close", "A New View"]],
    { label: "Seeing a New Story", fields: [
      ["overcome", "A challenge I've already overcome", "text"],
      ["fear_focus", "My fear makes me focus on", "text"], ["courage_focus", "Courage makes me focus on", "text"],
      ["need_focus", "What I need to focus on now", "text"],
      ["here_unacceptable", "Here: what I can't continue", "text"], ["there_vision", "There: who I'm becoming", "big"],
    ] }),
  L(16, U5, "unit5-lesson16", "The Meaningful Moment", "The memory that points to who you really are.",
    [["connector", "Arrive"], ["finding_meaning", "Finding Meaning"], ["childhood", "Happiest Memory"], ["five_whys", "5 Whys"], ["one_word", "One Word"], ["proof", "Proof"], ["close", "My Meaningful Moment"]],
    { label: "The Meaningful Moment", fields: [
      ["happiest_memory", "My earliest, happiest memory", "text"],
      ["best_when", "I'm at my absolute best when", "text"], ["fight_for", "The one thing I'll always fight for", "text"],
      ["five_whys", "Why it matters (5 Whys)", "list"],
      ["meaningful_word", "Me, in that moment", "big"],
      ["proof_story", "A recent moment that proves my Hidden Value wrong", "text"],
    ] }),
  L(17, U5, "unit5-lesson17", "Insight & Higher Value", "Your Hidden Value might be true, but it is not ONLY true.",
    [["connector", "Arrive"], ["higher_value", "I Am…"], ["actions", "Two Columns"], ["insight", "The Insight"], ["draft_insight", "Write the Rise"], ["close", "Unit Complete"]],
    { label: "The Rise", fields: [
      ["hidden_value", "Hidden Value", "text"],
      ["higher_value", "Higher Value", "big"],
      ["hv_actions", "Living from my Hidden Value", "list"], ["higher_actions", "Living from my Higher Value", "list"],
      ["draft_insight", "Draft · Insight & Higher Value", "draft"],
    ] }, { pauseAfter: true, unitEnd: true }),

  // ---------------- Unit 6 · Create ----------------
  L(18, U6, "unit6-lesson18", "The Treasure & A New Self", "What you can see in yourself now that you couldn't before.",
    [["connector", "Arrive"], ["treasure", "The Treasure"], ["new_self", "Three Questions"], ["sentences_old", "Old Story"], ["sentences_new", "New Story"], ["close", "My Story in Sentences"]],
    { label: "My Story in Sentences", fields: [
      ["treasure", "The treasure I found", "big"],
      ["s_ordinary", "Once upon a time, my story began…", "text"], ["s_moment", "Everything changed when…", "text"],
      ["s_hidden", "This was the moment I began to believe I was…", "text"], ["s_fall", "I wanted others to believe… but inwardly I felt…", "text"],
      ["s_despair", "The pain finally peaked when…", "text"], ["s_hope", "But with nothing else left, I still had hope that…", "text"],
      ["s_insight", "I had an experience that showed me I really am…", "text"], ["s_innovate", "I will choose the courage to live my own story by…", "text"],
      ["s_involve", "I will give value by…", "text"], ["s_inspire", "So that my life and the lives of others…", "text"],
    ] }),
  L(19, U6, "unit6-lesson19", "Innovate & Involve", "Your Higher Value, in action.",
    [["connector", "Our Deepest Fear"], ["innovate_prompts", "A New Self"], ["draft_innovate", "Write Innovate"], ["nobody_everybody", "Nobody · Everybody"], ["involve_prompts", "A Call to Others"], ["draft_involve", "Write Involve"], ["close", "My Call"]],
    { label: "The Call, Part 1", fields: [
      ["poem_line", "The line that speaks to me", "big"],
      ["draft_innovate", "Draft · Innovate", "draft"],
      ["nobody_deserves", "Nobody deserves…", "text"], ["everybody_needs", "Everybody needs…", "text"],
      ["draft_involve", "Draft · Involve", "draft"],
    ] }),
  L(20, U6, "unit6-lesson20", "Inspire", "The last paragraph is a gift to yourself.",
    [["connector", "Arrive"], ["legacy", "Legacy"], ["draft_inspire", "Write Inspire"], ["call", "The Whole Call"], ["close", "Unit Complete"]],
    { label: "The Call, Part 2", fields: [
      ["loved_ones_say", "What I want the people who love me to say", "text"],
      ["choosing_to_be", "Who I'm choosing to be", "big"],
      ["commitments", "My commitments", "text"],
      ["draft_inspire", "Draft · Inspire", "draft"],
    ] }, { pauseAfter: true, unitEnd: true }),

  // ---------------- Unit 7 · Close the Circle ----------------
  L(21, U7, "unit7-lesson21", "Close the Circle", "Finish first, edit last.",
    [["checkin", "Where You Are"], ["rules", "Five Rules"], ["intro_review", "Introduction"], ["fall_review", "The Fall"], ["shift_review", "Impossible Shift"], ["rise_review", "The Rise"], ["call_review", "The Call"], ["close", "Story Complete"]],
    { label: "Close the Circle", fields: [["story_title", "My story's title", "big"], ["revision_note", "What changed as I edited", "text"]] },
    { storyWrite: true }),
  L(22, U7, "unit7-lesson22", "Telling Your Story", "Your story is not yours until you give it away.",
    [["connector", "How It Feels"], ["telling_rules", "Telling Rules"], ["audience", "Who You'll Tell"], ["read_through", "Read It Aloud"], ["celebrate", "Celebrating Courage"], ["close", "Story Mark"]],
    { label: "Story Mark", fields: [
      ["audience", "Who I'll tell my story to", "text"],
      ["learned_most", "The most important thing I learned about myself", "big"],
      ["one_word_now", "Me, in one word, now", "big"],
    ] }, { pauseAfter: true, unitEnd: true, finale: true }),
];

export const UNITS = [
  { n: 1, name: "Character", slug: "unit-1", tagline: "A character has a call to adventure.", lessons: ["unit1-lesson1", "unit1-lesson2", "unit1-lesson3", "unit1-lesson4"] },
  { n: 2, name: "Challenge", slug: "unit-2", tagline: "A character faces a challenge.", lessons: ["unit2-lesson5", "unit2-lesson6", "unit2-lesson7", "unit2-lesson8"] },
  { n: 3, name: "Choice", slug: "unit-3", tagline: "A character facing a challenge makes a choice.", lessons: ["unit3-lesson9", "unit3-lesson10", "unit3-lesson11"] },
  { n: 4, name: "Cave", slug: "unit-4", tagline: "The true challenge is to enter the cave.", lessons: ["unit4-lesson12", "unit4-lesson13", "unit4-lesson14"] },
  { n: 5, name: "Change", slug: "unit-5", tagline: "A character makes a choice to change.", lessons: ["unit5-lesson15", "unit5-lesson16", "unit5-lesson17"] },
  { n: 6, name: "Create", slug: "unit-6", tagline: "A changed character is called to create a new world.", lessons: ["unit6-lesson18", "unit6-lesson19", "unit6-lesson20"] },
  { n: 7, name: "Close the Circle", slug: "unit-7", tagline: "Become the hero of your own story.", lessons: ["unit7-lesson21", "unit7-lesson22"] },
];

// The final Story of Self, in Aaron's Final Write order (Story Guide p. 123).
export const STORY_WRITE = [
  { part: "Introduction", target: "300 words", sections: [
    { key: "draft_ordinary_world", label: "Ordinary World", words: 100 },
    { key: "draft_defining_moment", label: "Defining Moment", words: 200 },
    { key: "hidden_value", label: "Hidden Value", words: 0, sentence: true },
  ] },
  { part: "The Fall", target: "300 words", sections: [
    { key: "draft_defiance", label: "Defiance", words: 100 },
    { key: "draft_disruption", label: "Disruption", words: 100 },
    { key: "draft_destruction", label: "Destruction", words: 100 },
  ] },
  { part: "The Impossible Shift", target: "200 words", sections: [
    { key: "draft_despair", label: "Despair", words: 100 },
    { key: "draft_hope", label: "Hope", words: 100 },
  ] },
  { part: "The Rise", target: "200 words", sections: [
    { key: "draft_insight", label: "Insight", words: 200 },
    { key: "higher_value", label: "Higher Value", words: 0, sentence: true },
  ] },
  { part: "The Call to Action", target: "200+ words", sections: [
    { key: "draft_innovate", label: "Innovate", words: 100 },
    { key: "draft_involve", label: "Involve", words: 100 },
    { key: "draft_inspire", label: "Inspire", words: 0 },
  ] },
];
