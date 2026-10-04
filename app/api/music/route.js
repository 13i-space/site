import { recordClaudeUsage } from "../../../lib/apiUsage";
import { createClient } from "../../../lib/supabaseServer";

// The Signal Composer's "compose from words": Claude turns a description
// into a composition for the in-browser synth (lib/musicEngine.js) - tempo,
// key, scale, chords, patterns and a mix. The page checks and clamps every
// field (sanitizeSong) before playing anything.
//
// Edge runtime + a ping every two seconds, like app/api/alien, so a slow
// reply can't hit a serverless time limit.
export const runtime = "edge";

const MODEL = "claude-opus-5-5";

const SYSTEM = `You compose short loops for the Signal Composer on 13i.space - a synthesizer that plays four bars of sixteen 16th-note steps, looping. Its sound: synthesized, atmospheric, cinematic, "a signal, translated".
Given a description, reply with one JSON object and nothing else (no markdown fences):
{
  "note": one short sentence (under 90 characters) describing what you made,
  "mood": one of "signal", "drift", "pulse", "descent", "aurora",
  "tempo": integer 50-160,
  "root": integer 0-11 (0 = C, 1 = C#, ... 11 = B),
  "scale": one of "minor", "dorian", "phrygian", "lydian", "major", "pentatonic",
  "progression": array of 4 integers 0-6 (scale degree of each bar's chord),
  "layers": { "drone", "pad", "arp", "bass", "drums", "texture": each {"on": boolean, "vol": number 0-1} },
  "arp": array of 16 integers, each -1 (rest) or 0-3 (which chord tone; 3 is an octave up),
  "bass": array of 16 booleans,
  "kick": array of 16 booleans,
  "snare": array of 16 booleans,
  "hat": array of 16 booleans
}
Make real musical choices that fit the description: sparse and slow for stillness, busy and driving for tension. Leave drums off entirely when they'd break the mood.`;

function extractJson(text) {
  const start = text.indexOf("{"), end = text.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try { return JSON.parse(text.slice(start, end + 1)); } catch { return null; }
}

export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return Response.json({ error: "Composing isn't switched on yet (no ANTHROPIC_API_KEY)." }, { status: 500 });

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Response.json({ error: "Sign in to compose from words." }, { status: 401 });
  } catch (e) {
    return Response.json({ error: "Couldn't confirm you're signed in." }, { status: 401 });
  }

  let prompt = "";
  try { prompt = String((await request.json()).prompt || "").slice(0, 400).trim(); } catch { prompt = ""; }
  if (!prompt) return Response.json({ error: "Describe what you want to hear." }, { status: 400 });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj) => controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));
      let ticks = 0;
      const ping = setInterval(() => send({ progress: ++ticks }), 2000);
      try {
        send({ progress: 0 });
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
            "anthropic-beta": "server-side-fallback-2026-07-01",
          },
          body: JSON.stringify({
            model: MODEL,
            max_tokens: 8000,
            output_config: { effort: "low" },
            fallbacks: "default",
            system: SYSTEM,
            messages: [{ role: "user", content: prompt }],
          }),
        });
        if (!res.ok) { send({ error: "The composer couldn't be reached. Try again in a moment." }); return; }
        const data = await res.json();
        await recordClaudeUsage({ feature: "music", model: data.model || MODEL, usage: data.usage });
        if (data.stop_reason === "refusal") { send({ error: "No composition came back for that. Try describing it differently." }); return; }
        const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("");
        const song = extractJson(text);
        if (!song) { send({ error: "That composition came back garbled. Try again." }); return; }
        const note = typeof song.note === "string" ? song.note.slice(0, 120) : "";
        delete song.note;
        send({ song, note });
      } catch (e) {
        send({ error: "The connection dropped while composing. Try again." });
      } finally {
        clearInterval(ping);
        controller.close();
      }
    },
  });
  return new Response(stream, { headers: { "Content-Type": "application/x-ndjson", "Cache-Control": "no-store" } });
}
