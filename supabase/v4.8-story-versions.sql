-- v4.8 — short story versions (e-book, audio, comic)
--
-- Run this once in the Supabase SQL Editor (Supabase dashboard → SQL Editor
-- → paste → Run). If you already keep migration files in a specific folder
-- in the repo, drop this one alongside them too — the filename doesn't
-- matter to Supabase, only running the SQL does.
--
-- Adds a `slug` (matches the folder name under public/stories/<slug>/) and
-- three booleans so each story's page only shows tabs for versions that
-- actually exist yet, rather than linking to files that aren't there.

alter table assignment_submissions
  add column if not exists slug text,
  add column if not exists has_ebook boolean not null default false,
  add column if not exists has_audio boolean not null default false,
  add column if not exists has_comic boolean not null default false;

-- Seed the three stories that have versions today. Matched by title
-- (designation) rather than assignment_number, since I'm not fully certain
-- which number belongs to which title — double-check these three rows
-- after running, in Table Editor, and fix the slug/designation match if
-- anything looks off.

update assignment_submissions
  set slug = 'first-silence', has_audio = true
  where designation = 'The First Silence';

update assignment_submissions
  set slug = 'deep-walkers', has_audio = true
  where designation = 'The Deep Walkers';

update assignment_submissions
  set slug = 'neraths-secret', has_audio = true, has_comic = true
  where designation = 'Nerath''s Secret';

-- has_ebook is left false for all three for now — flip it to true (in
-- Table Editor) once you've actually dropped an ebook.pdf in that story's
-- public/stories/<slug>/ folder.
