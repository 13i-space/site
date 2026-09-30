-- Update 5.8: 13i's Continuance Review, and Your First Assignment.
-- Run once in the Supabase SQL Editor. Safe to run again.

-- 1. The Continuance Review 13i writes for a species:
--    { verdict: "granted" | "observation" | "not_yet", text, learned, at }
--    Written by app/api/alien (action "review") through the owner's own
--    session, so the existing "users manage their own species" policy covers it.
alter table alien_species add column if not exists review jsonb;

-- 2. Milestones on a Kin's first journey that no other table records
--    (spoke with the Oracle, found their species on the Galaxy Map).
--    See lib/milestones.js and components/FirstAssignment.js.
create table if not exists kin_milestones (
  user_id uuid not null references profiles(id) on delete cascade,
  milestone text not null,
  reached_at timestamptz not null default now(),
  primary key (user_id, milestone)
);
alter table kin_milestones enable row level security;
drop policy if exists "kin read their own milestones" on kin_milestones;
create policy "kin read their own milestones" on kin_milestones
  for select using (auth.uid() = user_id);
drop policy if exists "kin record their own milestones" on kin_milestones;
create policy "kin record their own milestones" on kin_milestones
  for insert with check (auth.uid() = user_id);
