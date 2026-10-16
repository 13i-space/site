// Who can open the family game, Lights Out at Donaghy Castle (/donaghy-castle).
//
// Access follows the 13i account's username (case-insensitive): Paul's
// Sentinel accounts (lib/sentinel.js) always, plus the family names below.
// Everyone else gets an ordinary 404, so the page doesn't advertise itself.
//
// As more of the family sign up on 13i.space, add their usernames here (or
// set FAMILY_GAME_USERNAMES in Vercel to a comma-separated list). Anyone on
// the list also sees the castle's button on their Node.
import { isSentinelUser } from "./sentinel";

const FAMILY = [
  "aaron", // Aaron Donaghy's 13i Node
];

export function familyGuests() {
  const fromEnv = (process.env.FAMILY_GAME_USERNAMES || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return fromEnv.length ? fromEnv : FAMILY.map((s) => s.toLowerCase());
}

export function isFamilyPlayer(username) {
  if (!username) return false;
  return isSentinelUser(username) || familyGuests().includes(String(username).toLowerCase());
}
