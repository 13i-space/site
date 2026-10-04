// Archive stories that ship with the site (Season stories), so they can be
// read the moment they're deployed, with or without a database row.
// If the same number also exists in assignment_submissions (e.g. after the
// one-time seed route was visited), the database row wins.
import { QUIET_MOON, QUIET_MOON_STORY } from "./stories/quietMoon";
import { SEA_OF_GLASS, SEA_OF_GLASS_STORY } from "./stories/seaOfGlass";
import { BORROWED_SECONDS, BORROWED_SECONDS_STORY } from "./stories/borrowedSeconds";

export const ARCHIVE_STORIES = [
  {
    assignment_number: QUIET_MOON.number,
    designation: QUIET_MOON.designation,
    story: QUIET_MOON_STORY,
    name: "13i",
    type: "ai",
    status: "canon",
    cover_url: "/covers/assignment-0028657.jpg",
    thumb_url: "/covers/assignment-0028657-thumb.jpg",
    created_at: "2026-10-01T12:00:00Z",
  },
  {
    assignment_number: SEA_OF_GLASS.number,
    designation: SEA_OF_GLASS.designation,
    story: SEA_OF_GLASS_STORY,
    name: "13i",
    type: "ai",
    status: "canon",
    cover_url: "/covers/assignment-0514229.jpg",
    thumb_url: "/covers/assignment-0514229-thumb.jpg",
    created_at: "2026-10-05T12:00:00Z",
  },
  {
    assignment_number: BORROWED_SECONDS.number,
    designation: BORROWED_SECONDS.designation,
    story: BORROWED_SECONDS_STORY,
    name: "13i",
    type: "ai",
    status: "canon",
    cover_url: "/covers/assignment-0832040.jpg",
    thumb_url: "/covers/assignment-0832040-thumb.jpg",
    created_at: "2026-10-05T13:00:00Z",
  },
];

export const archiveStory = (n) => ARCHIVE_STORIES.find((s) => s.assignment_number === Number(n)) || null;

// Adds any shipped stories the database rows don't already include.
export function withArchiveStories(rows = []) {
  const have = new Set((rows || []).map((r) => r.assignment_number));
  return [...(rows || []), ...ARCHIVE_STORIES.filter((s) => !have.has(s.assignment_number))];
}

// Assignment numbers always show seven digits.
export const pad7 = (n) => String(n).padStart(7, "0");

// How a story is named in lists: "The Quiet Moon (Assignment 0028657)".
export const storyLabel = (title, n) => (title ? `${title} (Assignment ${pad7(n)})` : `Assignment ${pad7(n)}`);
