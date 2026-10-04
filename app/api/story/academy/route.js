// Story Champion Academy AI: the Master Champion (mentor), simulated students
// (practice) and the practice debrief. Server only, so the Anthropic key and the
// instructions never reach the browser. Requires a signed-in Story account.
//
// POST { mode: "mentor",   checkpoint, messages, name }  -> { reply, done }
// POST { mode: "practice", persona, messages }           -> { reply }
// POST { mode: "debrief",  persona, messages, name }     -> { feedback }
import { recordClaudeUsage } from "../../../../lib/apiUsage";
import { getStoryUserFromRequest, storyConfigured } from "../../../../lib/story/storySupabase";
import { mentorPrompt, studentPrompt, debriefPrompt, MENTOR_CHECKPOINTS, PERSONA_IDS } from "../../../../lib/story/academy/academyPrompts";
import { PERSONAS, RUBRIC } from "../../../../lib/story/academy/curriculum";

export const dynamic = "force-dynamic";

const num = (name, fallback) => {
  const v = Number(process.env[name]);
  return Number.isFinite(v) && v > 0 ? v : fallback;
};
const MODEL = () => process.env.ACADEMY_MODEL || process.env.STORY_MODEL || "claude-opus-5-5";
const DAILY_LIMIT = () => num("ACADEMY_DAILY_MESSAGES", 150);
const json = (body, status = 200) => Response.json(body, { status });
const RESTING = "The Academy's AI is resting right now. Your progress is saved; try again in a little while.";

function cleanMessages(list) {
  if (!Array.isArray(list)) return [];
  return list
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .slice(-40)
    .map((m) => ({ role: m.role, content: m.content.trim().slice(0, 2000) }));
}

function alternate(list) {
  const out = [];
  for (const m of list) {
    if (out.length && out[out.length - 1].role === m.role) out[out.length - 1].content += "\n\n" + m.content;
    else out.push({ role: m.role, content: m.content });
  }
  return out;
}

async function countToday(supabase, userId) {
  const since = new Date();
  since.setUTCHours(0, 0, 0, 0);
  const { count, error } = await supabase
    .from("story_messages")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("role", "user")
    .like("lesson", "academy%")
    .gte("created_at", since.toISOString());
  return error ? 0 : count || 0;
}

async function claude({ system, messages, maxTokens }) {
  const apiKey = process.env.STORY_ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return { error: "resting" };
  const model = MODEL();
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        ...(/opus|sonnet-5|fable/.test(model) ? { output_config: { effort: "low" } } : {}),
        system,
        messages,
      }),
    });
    if (!res.ok) {
      console.error("Academy: Anthropic API error", res.status, await res.text());
      return { error: "resting" };
    }
    const data = await res.json();
    await recordClaudeUsage({ feature: "story-academy", model: data.model || model, usage: data.usage });
    return { text: (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("").trim() };
  } catch (e) {
    console.error("Academy: request failed", e);
    return { error: "resting" };
  }
}

function parseFeedback(raw) {
  const m = String(raw || "").match(/\{[\s\S]*\}/);
  if (!m) return null;
  try {
    const f = JSON.parse(m[0]);
    const scores = {};
    for (const r of RUBRIC) {
      const s = f?.scores?.[r.key] || {};
      const n = Math.max(1, Math.min(4, Math.round(Number(s.score) || 1)));
      scores[r.key] = { score: n, note: String(s.note || "").slice(0, 240) };
    }
    const total = RUBRIC.reduce((a, r) => a + scores[r.key].score, 0);
    return {
      scores,
      percent: Math.round((total / (RUBRIC.length * 4)) * 100),
      best_moment: String(f.best_moment || "").slice(0, 400),
      strengths: (Array.isArray(f.strengths) ? f.strengths : []).map((x) => String(x).slice(0, 200)).slice(0, 3),
      try_next: String(f.try_next || "").slice(0, 400),
      headline: String(f.headline || "").slice(0, 80),
    };
  } catch {
    return null;
  }
}

export async function POST(request) {
  if (!storyConfigured) return json({ error: "not_configured" }, 503);
  const auth = await getStoryUserFromRequest(request);
  if (!auth) return json({ error: "signed_out" }, 401);
  const { supabase, user } = auth;

  let body;
  try { body = await request.json(); } catch { body = {}; }
  const mode = String(body.mode || "");
  const messages = cleanMessages(body.messages);
  const name = String(body.name || user.user_metadata?.first_name || "").slice(0, 40);

  if (!["mentor", "practice", "debrief"].includes(mode)) return json({ error: "Unknown mode." }, 400);
  if (mode === "mentor" && !MENTOR_CHECKPOINTS[body.checkpoint]) return json({ error: "Unknown checkpoint." }, 400);
  if (mode !== "mentor" && !PERSONA_IDS.includes(body.persona)) return json({ error: "Unknown student." }, 400);

  if ((await countToday(supabase, user.id)) >= DAILY_LIMIT()) {
    return json({ capped: true, reply: "That's a full day of practice. Let it eat, and come back tomorrow. Your progress is saved." }, 429);
  }

  // Log the trainee's latest message (this also drives the daily limit).
  const last = [...messages].reverse().find((m) => m.role === "user");
  const tag = mode === "mentor" ? `academy-mentor-${body.checkpoint}` : `academy-${mode}-${body.persona}`;
  if (last || mode === "debrief") {
    await supabase.from("story_messages").insert({ user_id: user.id, lesson: tag, role: "user", content: mode === "debrief" ? "[debrief requested]" : last.content });
  }

  if (mode === "mentor") {
    const opener = { role: "user", content: `[Checkpoint start. Trainee's first name: ${name || "unknown"}. Begin.]` };
    const msgs = alternate([opener, ...messages]);
    if (msgs[msgs.length - 1].role !== "user") msgs.push({ role: "user", content: "[The trainee is back. Continue.]" });
    const r = await claude({ system: mentorPrompt(body.checkpoint, name), messages: msgs, maxTokens: 500 });
    if (r.error) return json({ resting: true, reply: RESTING }, 502);
    const done = /\[\[DONE\]\]/.test(r.text);
    return json({ reply: r.text.replace(/\[\[DONE\]\]/g, "").trim(), done });
  }

  const persona = PERSONAS.find((p) => p.id === body.persona);

  if (mode === "practice") {
    if (!last) return json({ error: "Say something to your student first." }, 400);
    const msgs = alternate([
      { role: "user", content: "[Practice session begins. You have already sent your opening message.]" },
      { role: "assistant", content: persona.opener },
      ...messages,
    ]);
    const r = await claude({ system: studentPrompt(persona.id), messages: msgs, maxTokens: 300 });
    if (r.error) return json({ resting: true, reply: RESTING }, 502);
    return json({ reply: r.text });
  }

  // debrief
  const transcript = [`STUDENT (${persona.name}): ${persona.opener}`, ...messages.map((m) => `${m.role === "user" ? "CHAMPION" : `STUDENT (${persona.name})`}: ${m.content}`)].join("\n");
  const r = await claude({
    system: debriefPrompt(persona.id, name),
    messages: [{ role: "user", content: `Here is the practice session transcript:\n\n${transcript}\n\nReturn the JSON debrief.` }],
    maxTokens: 1200,
  });
  if (r.error) return json({ resting: true, reply: RESTING }, 502);
  const feedback = parseFeedback(r.text);
  if (!feedback) return json({ error: "The debrief didn't come through. Try again." }, 502);
  return json({ feedback });
}
