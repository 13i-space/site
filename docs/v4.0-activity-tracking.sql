-- Version 4.0: the Node's activity tracking layer. Three focused tables
-- rather than one catch-all - easier to query, easier for Lyra to read
-- from later, easier to extend.

create table high_scores (
  user_id uuid not null references profiles(id) on delete cascade,
  game text not null,
  score integer not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, game)
);
alter table high_scores enable row level security;
create policy "high scores are viewable by everyone" on high_scores for select using (true);
create policy "users manage their own high scores" on high_scores
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table reading_progress (
  user_id uuid not null references profiles(id) on delete cascade,
  assignment_number integer not null,
  read_at timestamptz not null default now(),
  primary key (user_id, assignment_number)
);
alter table reading_progress enable row level security;
create policy "users manage their own reading progress" on reading_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table game_plays (
  user_id uuid not null references profiles(id) on delete cascade,
  game text not null,
  play_count integer not null default 1,
  last_played_at timestamptz not null default now(),
  primary key (user_id, game)
);
alter table game_plays enable row level security;
create policy "users manage their own game plays" on game_plays
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
