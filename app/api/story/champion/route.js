// Story of Self: the AI Champion.
// GET  -> the student's saved conversation + progress for Lesson 1
// POST -> { start: true } to begin (or resume), or { message: "..." } to reply
//
// Runs on the server only, so the Anthropic key and the Champion's
// instructions never reach the browser.
import { CHAMPION_SYSTEM_PROMPT, parseChampionReply } from "../../../../lib/story/championPrompt";
import { getStoryUserFromRequest, storyConfigured } from "../../../../lib/story/storySupabase";
import { LESSON_ID, STEP_IDS, stepIndex } from "../../../../lib/story/lessonSteps";

export const dynamic = "force-dynamic";

const num = (name, fallback) => {
  const v = Number(process.env[name]);
  return Number.isFinite(v) && v > 0 ? v : fallback;
};
// Set STORY_MODEL in Vercel to change the Champion's model (e.g. "claude-sonnet-4-6" to save cost).
const MODEL = () => process.env.STORY_MODEL || "claude-opus-5-5";
const DAILY_LIMIT = () => num("STORY_DAILY_MESSAGES", 80);
const MAX_TOKENS = 700;
const MAX_HISTORY = 40;
const MAX_MESSAGE_CHARS = 2000;

const RESTING = "Your guide is resting right now. Your story is saved, so come back a little later and we'll pick up right where we left off.";
const CAPPED = "That's a lot of good work for one day. Let it sit with you (Aaron calls it \"let it eat\"), and come back tomorrow to keep going. Everything is saved.";

const json = (body, status = 200) => Response.json(body, { status });

async function loadState(supabase, userId) {
  const [{ data: messages }, { data: progress }, { data: profile }] = await Promise.all([
    supabase
      .from("story_messages")
      .select("role, content, created_at")
      .eq("user_id", userId)
      .eq("lesson", LESSON_ID)
      .order("created_at", { ascending: true })
      .order("id", { ascending: true })
      .limit(500),
    supabase.from("story_progress").select("*").eq("user_id", userId).eq("lesson", LESSON_ID).maybeSingle(),
    supabase.from("story_profiles").select("first_name").eq("id", userId).maybeSingle(),
  ]);
  return { messages: messages || [], progress: progress || null, firstName: profile?.first_name || "" };
}

function publicProgress(p) {
  return {
    step: p?.step || "connector",
    captured: p?.captured || {},
    safety: Boolean(p?.safety_flag),
    completed: Boolean(p?.completed_at),
  };
}

// Merge the newly captured details into what's already saved.
function mergeCaptured(old, add) {
  const out = { ...(old || {}) };
  if (!add || typeof add !== "object") return out;
  for (const [k, v] of Object.entries(add)) {
    if (Array.isArray(v)) {
      const clean = v.filter((x) => typeof x === "string" && x.trim()).map((x) => x.trim().slice(0, 140)).slice(0, 5);
      if (clean.length) out[k] = clean;
    } else if (typeof v === "string" && v.trim()) {
      out[k] = v.trim().slice(0, 400);
    }
  }
  return out;
}

// The Messages API wants alternating turns; fold any repeats together.
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
    .gte("created_at", since.toISOString());
  return error ? 0 : count || 0;
}

export async function GET(request) {
  if (!storyConfigured) return json({ error: "not_configured" }, 503);
  const auth = await getStoryUserFromRequest(request);
  if (!auth) return json({ error: "signed_out" }, 401);
  const { messages, progress, firstName } = await loadState(auth.supabase, auth.user.id);
  return json({ messages, progress: publicProgress(progress), firstName: firstName || auth.user.user_metadata?.first_name || "" });
}

export async function POST(request) {
  if (!storyConfigured) return json({ error: "not_configured" }, 503);
  const auth = await getStoryUserFromRequest(request);
  if (!auth) return json({ error: "signed_out" }, 401);
  const { supabase, user } = auth;

  let body;
  try { body = await request.json(); } catch { body = {}; }
  const isStart = body.start === true;
  const text = typeof body.message === "string" ? body.message.trim() : "";
  if (!isStart && !text) return json({ error: "Write something first." }, 400);
  if (text.length > MAX_MESSAGE_CHARS) return json({ error: "That's a lot at once. Try saying it in a shorter message." }, 400);

  const state = await loadState(supabase, user.id);
  if (!state.firstName) state.firstName = String(user.user_metadata?.first_name || "").slice(0, 40);
  const progress = state.progress;

  if (isStart && state.messages.length && state.messages[state.messages.length - 1].role === "assistant" && !body.resume) {
    // Already underway: nothing new to generate.
    return json({ messages: state.messages, progress: publicProgress(progress) });
  }

  if (!isStart) {
    if ((await countToday(supabase, user.id)) >= DAILY_LIMIT()) {
      return json({ capped: true, reply: CAPPED, progress: publicProgress(progress) }, 429);
    }
  }

  const apiKey = process.env.STORY_ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return json({ resting: true, reply: RESTING }, 503);

  // Save the student's message first, so it's never lost.
  if (text) {
    await supabase.from("story_messages").insert({ user_id: user.id, lesson: LESSON_ID, role: "user", content: text });
  }

  const returning = state.messages.length > 0 && isStart;
  const opener = `[Session start. Lesson: Unit 1 Character, Lesson 1. Student's first name: ${state.firstName || "unknown"}.${returning ? " They are RETURNING after a break; welcome them back and continue where you left off." : " This is their first time with you."}]`;
  const history = state.messages.slice(-MAX_HISTORY).map((m) => ({ role: m.role, content: m.content }));
  if (text) history.push({ role: "user", content: text });
  const messages = alternate([{ role: "user", content: opener }, ...history]);
  if (messages[messages.length - 1].role !== "user") {
    messages.push({ role: "user", content: "[The student is back. Continue.]" });
  }

  const p = publicProgress(progress);
  const system = `${CHAMPION_SYSTEM_PROMPT}\n\n# PROGRESS SO FAR\nCurrent step: ${p.step}\nAlready shared: ${JSON.stringify(p.captured)}`;
  const model = MODEL();

  let raw = "";
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model,
        max_tokens: MAX_TOKENS,
        ...(/opus|sonnet-5|fable/.test(model) ? { output_config: { effort: "low" } } : {}),
        system,
        messages,
      }),
    });
    if (!res.ok) {
      console.error("Story Champion: Anthropic API error", res.status, await res.text());
      return json({ resting: true, reply: RESTING, progress: p }, 502);
    }
    const data = await res.json();
    raw = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("").trim();
  } catch (e) {
    console.error("Story Champion: request failed", e);
    return json({ resting: true, reply: RESTING, progress: p }, 502);
  }

  const { reply, state: s } = parseChampionReply(raw);
  const finalReply = reply || "I'm here. Tell me a little more?";

  // Progress only moves forward (or stays put).
  let nextStep = p.step;
  if (s && STEP_IDS.includes(s.step) && stepIndex(s.step) >= stepIndex(p.step)) nextStep = s.step;
  const captured = mergeCaptured(p.captured, s?.captured);
  const safety = p.safety || s?.flag === "safety";
  const completedAt = progress?.completed_at || (nextStep === "complete" ? new Date().toISOString() : null);

  await supabase.from("story_messages").insert({ user_id: user.id, lesson: LESSON_ID, role: "assistant", content: finalReply });
  await supabase.from("story_progress").upsert(
    {
      user_id: user.id,
      lesson: LESSON_ID,
      step: nextStep,
      captured,
      intro_done: true,
      safety_flag: safety,
      completed_at: completedAt,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,lesson" }
  );

  return json({
    reply: finalReply,
    progress: { step: nextStep, captured, safety, completed: Boolean(completedAt) },
    flag: s?.flag === "safety" ? "safety" : null,
  });
}
