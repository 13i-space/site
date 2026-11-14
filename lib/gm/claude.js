// Virtual GM talks to Claude with plain fetch, like the rest of the site (no SDK).
// Same key as Story of Self: GM_ANTHROPIC_API_KEY first if you ever want a separate
// budget, then STORY_ANTHROPIC_API_KEY, then the site's ANTHROPIC_API_KEY.
import { recordClaudeUsage } from "../apiUsage";

export const MODEL = () => process.env.GM_MODEL || "claude-sonnet-5-5";
export const apiKey = () => process.env.GM_ANTHROPIC_API_KEY || process.env.STORY_ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY || "";
export const hasKey = () => !!apiKey();

export async function callClaude({ system, messages, tools, maxTokens = 4000, feature = "virtual-gm", timeoutMs = 55000 }) {
  const model = MODEL();
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": apiKey(), "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model, max_tokens: maxTokens, system, messages, ...(tools ? { tools } : {}) }),
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!res.ok) throw new Error(`Claude is unavailable right now (${res.status}).`);
  const data = await res.json();
  await recordClaudeUsage({ feature, model, usage: data.usage });
  return data;
}
