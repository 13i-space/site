-- Update 6.01: XenoWing progress (pilots unlocked, missions done, difficulties that beat the Methane Wyrm).
-- Plays, scores and the daily leaderboard use the existing tables (game = 'xenowing').
-- Safe to re-run.
create table if not exists xwing_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  unlocked text[] not null default '{}',
  done text[] not null default '{}',
  beat text[] not null default '{}',
  updated_at timestamptz not null default now()
);
alter table xwing_progress enable row level security;
drop policy if exists "users manage their own xenowing progress" on xwing_progress;
create policy "users manage their own xenowing progress" on xwing_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
