-- Update 5.59: NOT NEEDED YET. For later, when the weekly tournament runs on
-- the season calendar: one row per finished tournament's champion, written
-- by the server from lib/survivalEngine.js championRecord(). Week 13's
-- THE CHAMPIONS' CONTINUANCE reads the twelve weekly rows for its season.
create table if not exists survival_champions (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  tournament_id text not null unique,
  kind text not null default 'weekly',      -- weekly | champions | open
  season int,
  week int,
  champion_id text not null,                -- alien_species.id, or archive-<n>
  champion_name text not null,
  continuance_index int,
  record text,                              -- e.g. "4-0"
  trials_won int,
  seed text not null                        -- replays the whole tournament exactly
);
alter table survival_champions enable row level security;
create policy "champions are public" on survival_champions for select using (true);
-- (writes: service role only)
