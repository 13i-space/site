// What the site spends on Claude (Update 5.56). Every server route that calls
// the Anthropic API records the call here - feature, model, tokens and an
// estimated cost - in the api_usage table (docs/v5.56-api-usage.sql), so
// Sentinel-X can show spend this week and this month against the budget in
// CLAUDE_MONTHLY_BUDGET_USD (and a prepaid balance, if CLAUDE_CREDIT_USD is
// set). Anthropic doesn't publish a credit-balance API, and its own usage
// reports need an Admin key that individual accounts can't create - so the
// site keeps its own count.
//
// Server-only (it uses the service-role key). Never throws: if the table
// isn't there yet, the call simply isn't recorded.

import { getSupabaseAdmin } from "./supabaseAdmin";

// USD per million tokens: [input, output, cache read]. Cache writes are
// billed at 1.25x input (5-minute cache). Unknown models fall back to Opus 5.5.
const PRICES = {
  "claude-fable-5-1": [10, 50, 0.25],
  "claude-fable-5": [10, 50, 1],
  "claude-opus-5-5": [4, 20, 0.2],
  "claude-opus-5": [5, 25, 0.5],
  "claude-opus-4-8": [5, 25, 0.5],
  "claude-opus-4-7": [5, 25, 0.5],
  "claude-opus-4-6": [5, 25, 0.5],
  "claude-sonnet-5-5": [2, 10, 0.2],
  "claude-sonnet-5": [2, 10, 0.2],
  "claude-sonnet-4-6": [3, 15, 0.3],
  "claude-haiku-5-5": [0.1, 0.5, 0.01],
  "claude-haiku-4-5": [1, 5, 0.1],
};

export function estimateCost(model, usage = {}) {
  const [inp, out, read] = PRICES[model] || PRICES["claude-opus-5-5"];
  const u = usage || {};
  const write = Number(u.cache_creation_input_tokens) || 0;
  return (
    ((Number(u.input_tokens) || 0) * inp +
      (Number(u.output_tokens) || 0) * out +
      write * inp * 1.25 +
      (Number(u.cache_read_input_tokens) || 0) * read) /
    1e6
  );
}

// feature: "oracle" | "alien-name" | "alien-portrait" | "alien-review" | "lyra" | "music" | "story-champion" | "story-academy"
export async function recordClaudeUsage({ feature, model, usage }) {
  try {
    const admin = getSupabaseAdmin();
    if (!admin || !usage) return;
    const row = {
      feature: String(feature || "other").slice(0, 40),
      model: String(model || "").slice(0, 60),
      input_tokens: Number(usage.input_tokens) || 0,
      output_tokens: Number(usage.output_tokens) || 0,
      cache_read_tokens: Number(usage.cache_read_input_tokens) || 0,
      cache_write_tokens: Number(usage.cache_creation_input_tokens) || 0,
      cost_usd: Number(estimateCost(model, usage).toFixed(6)),
    };
    await admin.query("api_usage", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify(row) });
  } catch (e) {
    // not recorded - never let bookkeeping break a feature
  }
}

// For streamed responses: fold the usage numbers out of SSE events.
// message_start carries input/cache counts; message_delta carries output.
export function foldStreamUsage(acc, evt) {
  const u = (evt && evt.type === "message_start" && evt.message && evt.message.usage) || (evt && evt.type === "message_delta" && evt.usage) || null;
  if (!u) return acc;
  const out = { ...(acc || {}) };
  ["input_tokens", "cache_read_input_tokens", "cache_creation_input_tokens"].forEach((k) => { if (u[k] !== undefined) out[k] = u[k]; });
  if (u.output_tokens !== undefined) out.output_tokens = u.output_tokens;
  return out;
}
