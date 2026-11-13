// Keeps a public demo from running up the Claude bill. Counts live in memory per
// server instance, so they are a speed bump and not a hard wall. The hard wall is
// the budget Sentinel-X already watches (lib/apiUsage.js).
import { headers } from "next/headers";

const hits = new Map();
const LIMITS = {
  run: () => Number(process.env.GM_RUNS_PER_HOUR) || 8,
  setup: () => Number(process.env.GM_SETUPS_PER_HOUR) || 3,
};
const DAY_CAP = () => Number(process.env.GM_DAILY_CALLS) || 120;

export async function allow(kind) {
  const h = await headers();
  const ip = (h.get("x-forwarded-for") || "local").split(",")[0].trim();
  const now = Date.now();
  const mine = (hits.get(kind + ip) || []).filter((t) => now - t < 3600e3);
  const all = (hits.get("all") || []).filter((t) => now - t < 24 * 3600e3);
  if (mine.length >= LIMITS[kind]() || all.length >= DAY_CAP()) return false;
  mine.push(now); all.push(now);
  hits.set(kind + ip, mine); hits.set("all", all);
  return true;
}
