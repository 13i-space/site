-- Update 6.00: XenoKart progress (Voraxx unlock, best lap per track, Grand Prix wins).
-- Plays, scores and the daily leaderboard use the existing tables (game = 'xenokart').
-- Safe to re-run.
create table if not exists xkart_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  unlocked text[] not null default '{}',
  best_laps jsonb not null default '{}'::jsonb,
  gp_wins int not null default 0,
  updated_at timestamptz not null default now()
);
alter table xkart_progress enable row level security;
drop policy if exists "users manage their own xenokart progress" on xkart_progress;
create policy "users manage their own xenokart progress" on xkart_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
