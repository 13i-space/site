-- Update 5.23: Aaron's Story of Self briefing (/story/aaron)
-- Run this in the 13i Supabase project (the same one as profiles, forum, etc.),
-- NOT the separate Story of Self project. It stores the answers Aaron types
-- into the "Guidance needed" section. Safe to run more than once.

create table if not exists public.story_brief_answers (
  user_id uuid not null references auth.users(id) on delete cascade,
  username text,
  item_key text not null,
  status text check (status in ('keep', 'change', 'talk')),
  answer text not null default '',
  updated_at timestamptz not null default now(),
  primary key (user_id, item_key)
);

alter table public.story_brief_answers enable row level security;

drop policy if exists "brief: read own answers" on public.story_brief_answers;
create policy "brief: read own answers" on public.story_brief_answers
  for select using (auth.uid() = user_id);

drop policy if exists "brief: add own answers" on public.story_brief_answers;
create policy "brief: add own answers" on public.story_brief_answers
  for insert with check (auth.uid() = user_id);

drop policy if exists "brief: change own answers" on public.story_brief_answers;
create policy "brief: change own answers" on public.story_brief_answers
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Paul's "Responses" view on /story/aaron reads every row with the server's
-- service-role key, so no extra policy is needed for that.
