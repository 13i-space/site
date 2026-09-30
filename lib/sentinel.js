// Who can open Sentinel-X, the site dashboard.
//
// Access follows the account's username (case-insensitive). Paul's two
// Nodes, "Paul" and "13i", are the default. To change the list without a
// code change, set SENTINEL_USERNAMES in Vercel's environment variables to
// a comma-separated list (e.g. "Paul,13i").
const DEFAULT_USERNAMES = ["paul", "13i"];

export function sentinelUsernames() {
  const fromEnv = (process.env.SENTINEL_USERNAMES || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return fromEnv.length ? fromEnv : DEFAULT_USERNAMES;
}

export function isSentinelUser(username) {
  return !!username && sentinelUsernames().includes(String(username).toLowerCase());
}
