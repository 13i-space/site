-- Update 5.4: Universe Quiz results.
-- One row per Kin: their latest attempt (a retake replaces it).
create table if not exists quiz_results (
  user_id uuid primary key references profiles(id) on delete cascade,
  quiz_id text not null,
  score int not null,
  total int not null,
  grade text not null,
  taken_at timestamptz not null default now()
);
alter table quiz_results enable row level security;
create policy "users manage their own quiz results" on quiz_results
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
