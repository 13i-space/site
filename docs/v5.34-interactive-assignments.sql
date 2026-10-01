-- Version 5.34: Interactive Assignments.
-- One row each time a signed-in Kin reaches an ending of an Interactive
-- Assignment. Used for two things:
--   1. "Records found" follows a Kin across devices (they can read their own rows)
--   2. The ending screen's "what the Kin chose" numbers, which count each
--      Kin's FIRST time through only, via interactive_stats() below.
-- Nobody can read anyone else's rows; the stats function returns counts only.
-- Safe to run more than once.

create table if not exists interactive_runs (
  id bigint generated always as identity primary key,
  user_id uuid not null references profiles(id) on delete cascade,
  story integer not null,
  ending text not null,
  climax text,
  created_at timestamptz not null default now()
);
create index if not exists interactive_runs_story_user on interactive_runs (story, user_id, created_at);

alter table interactive_runs enable row level security;

drop policy if exists "kin read their own interactive runs" on interactive_runs;
create policy "kin read their own interactive runs" on interactive_runs
  for select using (auth.uid() = user_id);

drop policy if exists "kin record their own interactive runs" on interactive_runs;
create policy "kin record their own interactive runs" on interactive_runs
  for insert with check (auth.uid() = user_id);

-- Counts only (never who). kind = 'ending' or 'climax'; key = the ending id
-- or the climax choice; n = how many Kin got there on their first run.
create or replace function interactive_stats(p_story integer)
returns table (kind text, key text, n bigint)
language sql
security definer
set search_path = public
as $$
  with firsts as (
    select distinct on (user_id) ending, climax
    from interactive_runs
    where story = p_story
    order by user_id, created_at
  )
  select 'ending'::text, ending, count(*) from firsts group by ending
  union all
  select 'climax'::text, climax, count(*) from firsts where climax is not null group by climax;
$$;

grant execute on function interactive_stats(integer) to anon, authenticated;
