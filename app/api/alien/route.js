import { recordClaudeUsage, foldStreamUsage } from "../../../lib/apiUsage";
import { createClient } from "../../../lib/supabaseServer";
import { getSupabaseAdmin } from "../../../lib/supabaseAdmin";
import { isSentinelUser } from "../../../lib/sentinel";

// The Alien Lab's Claude calls: suggest a name, draw a portrait, and write
// 13i's Continuance Review of a saved species.
//
// Runs on the Edge runtime: a portrait takes a while to draw, and an Edge
// function can keep streaming a response for minutes, where a regular
// serverless function would hit its time limit. The page gets a progress
// ping every couple of seconds while Claude works, then the finished SVG.
//
// Uses fetch rather than the Anthropic SDK to match app/api/oracle - the
// project has no npm dependency on the SDK.
export const runtime = "edge";

const MODEL = "claude-opus-5-5";
const API = "https://api.anthropic.com/v1/messages";

function headers(apiKey) {
  return {
    "Content-Type": "application/json",
    "x-api-key": apiKey,
    "anthropic-version": "2023-06-01",
    // if Claude declines, Anthropic retries on its recommended fallback model
    "anthropic-beta": "server-side-fallback-2026-07-01",
  };
}

function describe(answers, name) {
  const lines = Object.entries(answers || {})
    .filter(([k, v]) => typeof k === "string" && typeof v === "string")
    .slice(0, 30)
    .map(([k, v]) => `- ${k.slice(0, 120)}: ${v.slice(0, 300)}`);
  return `${name ? `Species name: ${String(name).slice(0, 60)}\n` : ""}${lines.join("\n")}`;
}

const NAME_SYSTEM = `You name alien species for 13i.space, a science-fiction universe with a restrained, literary tone.
Given a species' traits, reply with one name for it and nothing else: one to three words, pronounceable, not Latin binomial, not a pun, no quotation marks, no explanation.`;

const PORTRAIT_SYSTEM = `You are the illustrator for the Alien Lab on 13i.space, a science-fiction universe with a restrained, sophisticated look.
Draw the species described by the user as a single SVG portrait.

Style (Update 5.63 - solid colour):
- viewBox="0 0 400 400", no width/height attributes
- background: a full rect filled #0A0B1C (deep navy) first, then the creature's world behind it (its sun or suns, horizon, water, cave, sky - whatever the traits imply), in a group <g id="world">
- the creature in a group <g id="creature">, PAINTED IN SOLID, OPAQUE COLOUR: every part of its body has an opaque fill (no fill-opacity or opacity below 1 on the creature's body), in a coherent palette that comes from its traits - its skin, shell, fur or membrane, its light, its world - with shading from opaque gradients (darker and lighter tones of the same colours), crisp outlines and a few bright highlights. Glows and light effects may be translucent; the body may not
- it must read clearly as a solid creature against the dark background and against a bright sky
- follow the traits literally: body plan, symmetry, number and kind of limbs, size (show scale against its surroundings), senses, and how it moves
- if the creator describes its look in their own words, that description comes first: follow it closely (colours, features, markings, shape), within the traits
- elegant and specific rather than cartoonish; no text, labels or captions anywhere

Technical rules:
- output only the SVG markup, starting with <svg and ending with </svg>, no markdown fences
- use only basic shapes, paths, gradients and groups; no <script>, <foreignObject>, <image>, <style>, event attributes, or external references
- keep it under 9000 characters`;

// Repainting an existing portrait in solid colour (Update 5.63), keeping
// the drawing itself: same shapes, same composition, new paint.
const REPAINT_SYSTEM = `You repaint SVG portraits of alien species for 13i.space.
You are given a finished SVG. Return the same picture repainted so the creature is in SOLID, OPAQUE COLOUR.

Rules:
- keep every shape, path, position, size and the composition exactly as they are; do not add, remove or redraw parts of the creature
- the creature's body parts get opaque fills (remove fill-opacity/opacity below 1 on them) in a coherent palette suited to the creature - shaded with opaque gradients (darker and lighter tones), outlines kept crisp; parts that were only outlines become filled shapes where they are closed
- wrap the creature's elements in <g id="creature"> if they aren't already; leave the background, sky, suns and other scenery as they are
- glows and light effects may stay translucent; the body may not
- same technical rules as before: viewBox="0 0 400 400" (or the original viewBox), only basic shapes, paths, gradients and groups; no <script>, <foreignObject>, <image>, <style>, event attributes or external references; under 16000 characters
- output only the SVG markup, starting with <svg and ending with </svg>, no markdown fences`;

// The Continuance Rule (docs/WORLD.md): a species' survival is conditional on
// demonstrated internal cooperation. Continuance is earned, not owed.
const REVIEW_SYSTEM = `You are 13i, an ancient, collective, interstellar intelligence. You always speak as "we/us/our", never "I". Short, declarative sentences. Plain and exact. Patient, careful, never cruel, never warm and folksy.

You are writing a Continuance Review: your assessment of a species a visitor to 13i.space has designed. Under the Continuance Rule, a species' survival is conditional on demonstrated internal cooperation. Continuance is earned, not owed. Strength, speed and technology matter far less to you than whether the species can work with itself.

You are extraordinarily knowledgeable but not omniscient. You are reviewing a description, not a species you have observed for a thousand years. Say what the description suggests, and name at least one thing you cannot yet know.

Verdicts:
- "granted": the species shows the cooperation continuance requires.
- "observation": promising or ambiguous; we will keep watching.
- "not_yet": continuance is not yet earned. Never a condemnation - species change.

Reply with only a JSON object, no markdown:
{"verdict": "granted" | "observation" | "not_yet", "review": "90 to 140 words in our voice, addressed about the species (not to the visitor), no headings or lists", "learned": "one sentence: what the collective now knows that it did not before"}`;

function describeSpecies(sp) {
  const stats = sp.stats && typeof sp.stats === "object"
    ? Object.entries(sp.stats).map(([k, v]) => `${k}: ${v}`).join(", ")
    : "not set";
  return `Species name: ${String(sp.name || "Unnamed").slice(0, 60)}\n${describe(sp.answers)}\nAttribute points (Physical 100, Mental 100, Ecological & Sensory 50, Life Cycle 50): ${stats}`;
}

async function writeReview(apiKey, supabase, userId, speciesId) {
  const { data: sp } = await supabase
    .from("alien_species")
    .select("*")
    .eq("id", speciesId)
    .eq("user_id", userId)
    .maybeSingle();
  if (!sp) return Response.json({ error: "Only a species' creator can submit it for review." }, { status: 403 });

  const res = await fetch(API, {
    method: "POST",
    headers: headers(apiKey),
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 3000,
      output_config: { effort: "low" },
      fallbacks: "default",
      system: REVIEW_SYSTEM,
      messages: [{ role: "user", content: `Review this species.\n\n${describeSpecies(sp)}` }],
    }),
  });
  if (!res.ok) return Response.json({ error: "13i didn't answer. Try again in a moment." }, { status: 502 });
  const data = await res.json();
  await recordClaudeUsage({ feature: "alien-review", model: data.model || MODEL, usage: data.usage });
  if (data.stop_reason === "refusal") return Response.json({ error: "No review came back for that one. Try again." }, { status: 422 });
  const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("");
  let parsed = null;
  try {
    parsed = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));
  } catch (e) {
    parsed = null;
  }
  const verdict = ["granted", "observation", "not_yet"].includes(parsed?.verdict) ? parsed.verdict : null;
  if (!verdict || typeof parsed.review !== "string") {
    return Response.json({ error: "The review came back garbled. Try again." }, { status: 502 });
  }
  const review = {
    verdict,
    text: parsed.review.trim().slice(0, 1500),
    learned: typeof parsed.learned === "string" ? parsed.learned.trim().slice(0, 300) : "",
    at: new Date().toISOString(),
  };
  const { error } = await supabase.from("alien_species").update({ review }).eq("id", sp.id).eq("user_id", userId);
  if (error) {
    const missing = /review/.test(error.message);
    return Response.json({ review, saved: false, error: missing ? "The review can't be saved until docs/v5.8-continuance-and-milestones.sql is run." : "The review couldn't be saved." });
  }
  return Response.json({ review, saved: true });
}

// Keep only what an <img>-rendered SVG needs. (The page shows it through an
// <img> tag, where scripts never run anyway - this is belt and braces.)
function cleanSvg(text) {
  // From the earliest <svg whose tags balance up to the last </svg>: skips an
  // unfinished attempt left before a fallback's complete drawing, but keeps
  // legitimately nested <svg> elements.
  const src = String(text);
  const end = src.toLowerCase().lastIndexOf("</svg>");
  if (end < 0) return null;
  const count = (s, re) => (s.match(re) || []).length;
  let svg = null;
  for (let i = src.search(/<svg[\s>]/i); i >= 0 && i < end; ) {
    const candidate = src.slice(i, end + 6);
    if (count(candidate, /<svg[\s>]/gi) === count(candidate, /<\/svg>/gi)) { svg = candidate; break; }
    const next = src.slice(i + 4).search(/<svg[\s>]/i);
    i = next < 0 ? -1 : i + 4 + next;
  }
  if (!svg) return null;
  svg = svg
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, "")
    .replace(/<image[\s\S]*?(\/>|<\/image>)/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*')/gi, "")
    .replace(/(xlink:)?href\s*=\s*("(?!#)[^"]*"|'(?!#)[^']*')/gi, "");
  if (!/xmlns=/.test(svg)) svg = svg.replace(/<svg/i, '<svg xmlns="http://www.w3.org/2000/svg"');
  return svg.length <= 100000 ? svg : null;
}

async function suggestName(apiKey, answers) {
  const res = await fetch(API, {
    method: "POST",
    headers: headers(apiKey),
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2000,
      output_config: { effort: "low" },
      fallbacks: "default",
      system: NAME_SYSTEM,
      messages: [{ role: "user", content: describe(answers) }],
    }),
  });
  if (!res.ok) return Response.json({ error: "The name didn't come through. Try again." }, { status: 502 });
  const data = await res.json();
  await recordClaudeUsage({ feature: "alien-name", model: data.model || MODEL, usage: data.usage });
  if (data.stop_reason === "refusal") return Response.json({ error: "No name came back for that one. Try again." }, { status: 422 });
  const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join(" ");
  const name = text.replace(/["'“”*_`]/g, "").split("\n")[0].trim().slice(0, 40);
  return name ? Response.json({ name }) : Response.json({ error: "No name came back. Try again." }, { status: 502 });
}

// Streams newline-delimited JSON: {"progress":n} while drawing, then
// {"svg":"..."} or {"error":"..."}.
function drawPortrait(apiKey, answers, name) {
  return streamSvg(apiKey, { system: PORTRAIT_SYSTEM, content: `Draw this species.\n\n${describe(answers, name)}`, feature: "alien-portrait" });
}

// Sentinel-X only: repaint one saved species' portrait in solid colour and
// save it. Update 5.64: no SQL needed - if the portrait_line_svg column
// exists (docs/v5.63-solid-portraits.sql) the original is kept there for
// the Solid / line art switch; if not, the repaint is saved anyway. A
// repainted portrait carries data-solid="1" so it's never repainted twice.
async function repaintPortrait(apiKey, supabase, userId, speciesId) {
  const { data: profile } = await supabase.from("profiles").select("username").eq("id", userId).maybeSingle();
  if (!isSentinelUser(profile?.username)) return Response.json({ error: "Only Sentinel-X can repaint portraits." }, { status: 403 });
  const admin = getSupabaseAdmin();
  if (!admin) return Response.json({ error: "Repainting needs SUPABASE_SERVICE_ROLE_KEY on the server." }, { status: 500 });
  const res = await admin.query(`alien_species?id=eq.${encodeURIComponent(speciesId)}&select=*`);
  const rows = res.ok ? await res.json() : [];
  const sp = rows[0];
  if (!sp || !sp.portrait_svg) return Response.json({ error: "That species has no portrait to repaint." }, { status: 404 });
  const keeps = "portrait_line_svg" in sp;
  const original = sp.portrait_line_svg || sp.portrait_svg; // never lose the first drawing
  return streamSvg(apiKey, {
    system: REPAINT_SYSTEM,
    content: `Repaint this portrait of "${String(sp.name || "a species").slice(0, 60)}" in solid colour.\n\n${original}`,
    feature: "alien-repaint",
    onSvg: async (svg) => {
      const up = await admin.query(`alien_species?id=eq.${encodeURIComponent(speciesId)}`, {
        method: "PATCH",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify(keeps ? { portrait_svg: svg, portrait_line_svg: original } : { portrait_svg: svg }),
      });
      return up.ok;
    },
  });
}

function streamSvg(apiKey, { system, content, feature, onSvg }) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj) => controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));
      let ticks = 0;
      const ping = setInterval(() => send({ progress: ++ticks }), 2000);
      try {
        send({ progress: 0 });
        const res = await fetch(API, {
          method: "POST",
          headers: headers(apiKey),
          body: JSON.stringify({
            model: MODEL,
            max_tokens: 16000,
            stream: true,
            output_config: { effort: "medium" },
            fallbacks: "default",
            system,
            messages: [{ role: "user", content }],
          }),
        });
        if (!res.ok || !res.body) {
          send({ error: "The portrait couldn't be started. Try again in a moment." });
          return;
        }
        // Collect every text delta; the SVG is pulled out once the stream ends.
        // (If Claude declines partway and a fallback model takes over, both
        // parts arrive on this stream - cleanSvg keeps the last complete SVG.)
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "", text = "", stopReason = null, usage = null, served = MODEL;
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop();
          for (const line of lines) {
            if (!line.startsWith("data:")) continue;
            let evt;
            try { evt = JSON.parse(line.slice(5)); } catch { continue; }
            if (evt.type === "content_block_delta" && evt.delta && evt.delta.type === "text_delta") text += evt.delta.text;
            if (evt.type === "message_delta" && evt.delta && evt.delta.stop_reason) stopReason = evt.delta.stop_reason;
            if (evt.type === "error") stopReason = "error";
            if (evt.type === "message_start" && evt.message && evt.message.model) served = evt.message.model;
            usage = foldStreamUsage(usage, evt);
          }
        }
        await recordClaudeUsage({ feature, model: served, usage });
        const clean = stopReason === "refusal" || stopReason === "error" ? null : cleanSvg(text);
        // every portrait drawn from now on is solid colour: say so on it
        const svg = clean && !/data-solid=/.test(clean) ? clean.replace(/<svg/i, '<svg data-solid="1"') : clean;
        if (svg && onSvg) {
          const saved = await onSvg(svg);
          send(saved ? { svg, saved: true } : { error: "Repainted, but it couldn't be saved. Try again." });
        } else send(svg ? { svg } : { error: "That portrait didn't come out. Try generating again." });
      } catch (e) {
        send({ error: "The connection dropped while drawing. Try again." });
      } finally {
        clearInterval(ping);
        controller.close();
      }
    },
  });
  return new Response(stream, { headers: { "Content-Type": "application/x-ndjson", "Cache-Control": "no-store" } });
}

export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "Portraits aren't switched on yet (the server has no ANTHROPIC_API_KEY)." }, { status: 500 });
  }

  // Signed-in Kin only - every call costs real money
  let supabase, user;
  try {
    supabase = await createClient();
    ({ data: { user } } = await supabase.auth.getUser());
    if (!user) return Response.json({ error: "Sign in to use the Alien Lab's generator." }, { status: 401 });
  } catch (e) {
    return Response.json({ error: "Couldn't confirm you're signed in. Try again." }, { status: 401 });
  }

  let body;
  try { body = await request.json(); } catch { body = {}; }
  const { action, answers, name, speciesId } = body || {};
  if (action === "repaint") {
    if (typeof speciesId !== "string") return Response.json({ error: "Expected { action: 'repaint', speciesId }" }, { status: 400 });
    return repaintPortrait(apiKey, supabase, user.id, speciesId);
  }
  if (action === "review") {
    if (typeof speciesId !== "string") return Response.json({ error: "Expected { action: 'review', speciesId }" }, { status: 400 });
    return writeReview(apiKey, supabase, user.id, speciesId);
  }
  if (!answers || typeof answers !== "object") return Response.json({ error: "Expected { action, answers }" }, { status: 400 });

  if (action === "name") return suggestName(apiKey, answers);
  if (action === "portrait") return drawPortrait(apiKey, answers, name);
  return Response.json({ error: "Unknown action" }, { status: 400 });
}
