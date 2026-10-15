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

// Update 5.66 - cost. Each call uses the cheapest model that does it well;
// any of them can be changed in Vercel's environment variables:
//   ALIEN_PORTRAIT_MODEL (Update 5.90: default Haiku 5.5 at its normal
//     thinking level, with the detailed instructions - better drawings
//     than Sonnet's old ones at about a third of the cost; set it to
//     "claude-sonnet-5-5" to go back to Sonnet)
//   ALIEN_TEXT_MODEL (names and 13i's reviews; default Haiku 5.5)
const PORTRAIT_MODEL = () => process.env.ALIEN_PORTRAIT_MODEL || "claude-haiku-5-5";
const TEXT_MODEL = () => process.env.ALIEN_TEXT_MODEL || "claude-haiku-5-5";
const MODEL = "claude-sonnet-5-5"; // fallback label for usage records
// effort is for the larger models only
const effort = (model, level) => (/opus|sonnet|fable/.test(model) ? { output_config: { effort: level } } : {});
// Update 5.66 - a cap: each Kin gets this many drawings a day (Sentinel-X is exempt)
const DAILY_DRAWINGS = Number(process.env.ALIEN_DAILY_LIMIT || 3);
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

// Update 5.88/5.90 - the portrait instructions, chosen in a Sentinel-X
// comparison of models and instructions (5.86-5.89). Aimed at the lab's own
// art: layered, finely rendered, and anatomy that isn't an Earth animal with
// extras. Haiku is cheap enough that a long, detailed drawing still costs
// about half a cent.
const PORTRAIT_SYSTEM = `You are the creature illustrator for the Alien Lab on 13i.space, a science-fiction universe with a restrained, sophisticated, literary look. Its art is dark, layered and finely rendered - closer to a natural-history plate of a real organism from another world than to a cartoon.
Draw the species described by the user as one detailed SVG portrait for a collectible card.

Anatomy - the most important part:
- Invent the body from the traits, as biology that evolved somewhere else. Do NOT start from an Earth animal (no rabbits, tortoises, bats, cats, insects or fish with extra parts) and no humanoid unless the traits say so.
- Even when the traits sound familiar (segments, many legs, a shell, wings), reinterpret them: the silhouette must not read as any recognisable Earth species. Ask what its world, gravity, light and food would make of that trait, and draw that.
- No cartoon faces: no smiling mouths, no pair of round dot eyes, no "cute" proportions. Senses are organs shaped by the traits - sensor pits, eye clusters, slits, membranes, antennae-like filaments, or none at all.
- Follow the traits literally: body plan, symmetry (radial, bilateral, none), number and kind of limbs, size, senses, how it moves and feeds. Count limbs carefully.
- Show how it is built: joints, segments, plates, membranes, vents, fins, filaments, light organs, where muscle and shell meet.
- If the creator describes its look in their own words, that comes first: follow it closely (colours, features, markings, shape), within the traits.

Composition:
- The WHOLE creature visible, nothing cropped, in a three-quarter view that shows its structure, filling about 60-70% of the frame.
- Keep the creature inside the band from y=70 to y=330 (the card shows a 16:11 window cut from the middle of the square). Show its scale against something in its world.

Rendering - use the space for detail:
- Build the creature in layers: base forms with opaque gradients, then plates, segments and folds, then fine detail - thin linework (stroke-width 0.4 to 1.2), texture from many small repeated shapes (scales, pores, ridges, spines, veins), rim light from its world's light source, a few sharp specular highlights, shadow where parts overlap and where it meets the ground, and a cast shadow.
- Every part of its body has an OPAQUE fill (no fill-opacity or opacity below 1 on the body). Glows and light effects may be translucent.
- Palette: a coherent palette drawn from its traits and world, sitting well against 13i's deep navy (#0A0B1C) with lavender (#B9C0FF, #8B95F6) and warm (#E8CFC0, #E9D29A) accents where they suit it. It must read clearly against both a dark and a bright sky.
- Spend most of the detail on the creature; the world behind it is atmospheric and simpler - two or three layers of depth, haze, its sun or suns, terrain or water or cave as the traits imply.
- No text, labels or captions anywhere.

Structure and technical rules:
- viewBox="0 0 400 400", no width/height attributes
- first a full rect filled #0A0B1C, then the world in <g id="world">, then the creature in <g id="creature">
- use only basic shapes, paths, gradients and groups; no <script>, <foreignObject>, <image>, <style>, filters, event attributes or external references
- aim for 12000 to 22000 characters; never more than 26000
- output only the SVG markup, starting with <svg and ending with </svg>, no markdown fences`;

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
      model: TEXT_MODEL(),
      max_tokens: 3000,
      ...effort(TEXT_MODEL(), "low"),
      fallbacks: "default",
      system: REVIEW_SYSTEM,
      messages: [{ role: "user", content: `Review this species.\n\n${describeSpecies(sp)}` }],
    }),
  });
  if (!res.ok) return Response.json({ error: "13i didn't answer. Try again in a moment." }, { status: 502 });
  const data = await res.json();
  await recordClaudeUsage({ feature: "alien-review", model: data.model || TEXT_MODEL(), usage: data.usage });
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
      model: TEXT_MODEL(),
      max_tokens: 2000,
      ...effort(TEXT_MODEL(), "low"),
      fallbacks: "default",
      system: NAME_SYSTEM,
      messages: [{ role: "user", content: describe(answers) }],
    }),
  });
  if (!res.ok) return Response.json({ error: "The name didn't come through. Try again." }, { status: 502 });
  const data = await res.json();
  await recordClaudeUsage({ feature: "alien-name", model: data.model || TEXT_MODEL(), usage: data.usage });
  if (data.stop_reason === "refusal") return Response.json({ error: "No name came back for that one. Try again." }, { status: 422 });
  const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join(" ");
  const name = text.replace(/["'“”*_`]/g, "").split("\n")[0].trim().slice(0, 40);
  return name ? Response.json({ name }) : Response.json({ error: "No name came back. Try again." }, { status: 502 });
}

// Streams newline-delimited JSON: {"progress":n} while drawing, then
// {"svg":"..."} or {"error":"..."}.
// Update 5.90: Haiku draws at its normal thinking level (medium). Thinking
// counts toward max_tokens, so portraits get 32,000 (16,000 cut some off).
function drawPortrait(apiKey, answers, name, onDone) {
  return streamSvg(apiKey, {
    system: PORTRAIT_SYSTEM,
    content: `Draw this species.\n\n${describe(answers, name)}`,
    feature: "alien-portrait",
    onDone,
    maxTokens: 32000,
    ...(/haiku/.test(PORTRAIT_MODEL()) ? { effortLevel: "medium" } : {}),
  });
}

// ─── the daily cap (Update 5.66) ───
// Counted on the account itself (Supabase app_metadata, which only the
// server can write), so it needs no table. The day is Central time.
const today = () => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago" }).format(new Date());
async function adminUser(id) {
  const admin = getSupabaseAdmin();
  if (!admin) return null;
  try {
    const r = await fetch(`${admin.url}/auth/v1/admin/users/${id}`, { headers: { apikey: admin.serviceKey, Authorization: `Bearer ${admin.serviceKey}` } });
    return r.ok ? { admin, user: await r.json() } : null;
  } catch (e) { return null; }
}
async function drawingsToday(id) {
  const a = await adminUser(id);
  if (!a) return { used: 0, limit: DAILY_DRAWINGS, counted: false };
  const q = a.user.app_metadata?.alien_drawings || {};
  return { used: q.day === today() ? Number(q.n) || 0 : 0, limit: DAILY_DRAWINGS, counted: true };
}
async function countDrawing(id) {
  const a = await adminUser(id);
  if (!a) return;
  const meta = a.user.app_metadata || {};
  const q = meta.alien_drawings || {};
  const n = (q.day === today() ? Number(q.n) || 0 : 0) + 1;
  try {
    await fetch(`${a.admin.url}/auth/v1/admin/users/${id}`, {
      method: "PUT",
      headers: { apikey: a.admin.serviceKey, Authorization: `Bearer ${a.admin.serviceKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ app_metadata: { ...meta, alien_drawings: { day: today(), n } } }),
    });
  } catch (e) { /* not counted - never block a drawing over bookkeeping */ }
}
async function isSentinel(supabase, userId) {
  try {
    const { data } = await supabase.from("profiles").select("username").eq("id", userId).maybeSingle();
    return isSentinelUser(data?.username);
  } catch (e) { return false; }
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
    maxTokens: 32000, // room for thinking, if the portrait model thinks
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

function streamSvg(apiKey, { system, content, feature, onSvg, onDone, model = PORTRAIT_MODEL(), maxTokens = 16000, effortLevel = null }) {
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
            model,
            max_tokens: maxTokens,
            stream: true,
            // an explicit level (Haiku portraits) applies to any model
            ...(effortLevel ? { output_config: { effort: effortLevel } } : effort(model, "low")),
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
        let buffer = "", text = "", stopReason = null, usage = null, served = model;
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
        } else {
          if (svg && onDone) await onDone();
          send(svg ? { svg } : { error: "That portrait didn't come out. Try generating again." });
        }
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
  if (action === "quota") {
    const sentinel = await isSentinel(supabase, user.id);
    const q = await drawingsToday(user.id);
    return Response.json({ ...q, unlimited: sentinel || !q.counted });
  }
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
  if (action === "portrait") {
    const sentinel = await isSentinel(supabase, user.id);
    if (!sentinel) {
      const q = await drawingsToday(user.id);
      if (q.counted && q.used >= q.limit) return Response.json({ error: `That's ${q.limit} creations today - the Lab's limit. It reopens at midnight (Central).`, quota: q }, { status: 429 });
    }
    return drawPortrait(apiKey, answers, name, sentinel ? null : () => countDrawing(user.id));
  }
  return Response.json({ error: "Unknown action" }, { status: 400 });
}
