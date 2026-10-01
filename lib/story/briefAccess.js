// Who can open the Story of Self briefing for Aaron (/story/aaron).
//
// Access follows the 13i account's username (case-insensitive): Paul's
// Sentinel accounts (lib/sentinel.js) always, plus the names below.
// Everyone else gets an ordinary 404, so the page doesn't advertise itself.
//
// When Aaron has signed up on 13i.space, add his username here (or set
// STORY_BRIEF_USERNAMES in Vercel to a comma-separated list). That also makes
// the hidden "Story of Self" panel appear on his Node.
import { isSentinelUser } from "../sentinel";

const BRIEF_GUESTS = [
  // "aaron",
];

export function briefGuests() {
  const fromEnv = (process.env.STORY_BRIEF_USERNAMES || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return fromEnv.length ? fromEnv : BRIEF_GUESTS.map((s) => s.toLowerCase());
}

export function isBriefUser(username) {
  if (!username) return false;
  return isSentinelUser(username) || briefGuests().includes(String(username).toLowerCase());
}
