-- Update 5.99: XenoKlash unlock progress, so it follows a Kin across devices.
-- Plays, best scores and the daily leaderboard already work through the
-- existing game_plays / high_scores / daily_scores tables (game = 'xenoklash').
-- Paste this whole file into Supabase > SQL Editor > New query > Run.
create table if not exists xk_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  tournaments_won int not null default 0,
  unlocked text[] not null default '{}',
  champions jsonb not null default '{}'::jsonb,
  best_score int not null default 0,
  updated_at timestamptz not null default now()
);
alter table xk_progress enable row level security;
drop policy if exists "users manage their own xenoklash progress" on xk_progress;
create policy "users manage their own xenoklash progress" on xk_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
