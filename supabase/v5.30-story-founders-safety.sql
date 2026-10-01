-- Update 5.30: the human safety net (Safety desk)
-- Run in the STORY OF SELF Supabase project (not 13i). Safe to run more than once.
-- When the Champion flags a safety concern, the server records an alert here.
-- Students can only ADD their own alert; only the Story team (through the
-- server's service-role key) can read or update alerts.

create table if not exists public.story_safety_alerts (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  email text,
  first_name text,
  lesson text not null,
  lesson_title text,
  excerpt text,
  status text not null default 'new' check (status in ('new', 'contacted', 'resolved')),
  team_note text,
  reviewed_by text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists story_safety_alerts_status on public.story_safety_alerts (status, created_at desc);

alter table public.story_safety_alerts enable row level security;

drop policy if exists "students add their own safety alert" on public.story_safety_alerts;
create policy "students add their own safety alert" on public.story_safety_alerts
  for insert to authenticated with check (auth.uid() = user_id);
