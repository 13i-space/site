// Who sees SalienT's play-test panel on their Node (Update 6.34): Paul's Sentinel accounts, plus
// the friends below (13i usernames, any case). The game itself is open to everyone in the
// Arcade; the panel is a shortcut with a note on playing online together.
// Add more usernames here, or set SALIENT_TESTERS in Vercel to a comma-separated list.
import { isSentinelUser } from "./sentinel";

const TESTERS = ["aaron", "giz"];

export function salientTesters() {
  const fromEnv = (process.env.SALIENT_TESTERS || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  return fromEnv.length ? fromEnv : TESTERS;
}

export function isSalientTester(username) {
  if (!username) return false;
  return isSentinelUser(username) || salientTesters().includes(String(username).toLowerCase());
}
