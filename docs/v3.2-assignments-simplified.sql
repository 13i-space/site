alter table assignment_submissions add column if not exists designation text;
alter table assignment_submissions add column if not exists assignment_number integer;
alter table assignment_submissions add column if not exists status text not null default 'submitted';

create table if not exists assignment_drafts (
  user_id uuid primary key references profiles(id) on delete cascade,
  assignment_number integer not null,
  title text,
  story text,
  updated_at timestamptz not null default now()
);
alter table assignment_drafts enable row level security;
create policy "users manage their own drafts" on assignment_drafts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
