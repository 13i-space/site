-- Story of Self prototype: database setup
-- Run this ONCE in the NEW Story of Self Supabase project (not the 13i one):
-- Supabase dashboard -> SQL Editor -> New query -> paste all of this -> Run.

-- 1. Profile: one row per signed-in person
create table if not exists public.story_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  created_at timestamptz not null default now()
);

-- 2. Progress: one row per person per lesson (holds the Snapshot data)
create table if not exists public.story_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson text not null,                 -- e.g. 'unit1-lesson1'
  step text not null default 'connector',
  captured jsonb not null default '{}'::jsonb,   -- five_words, one_word, five_events, ...
  intro_done boolean not null default false,
  safety_flag boolean not null default false,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, lesson)
);

-- 3. Conversation: every message with the Champion
create table if not exists public.story_messages (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson text not null,
  role text not null check (role in ('user','assistant')),
  content text not null,
  created_at timestamptz not null default now()
);
create index if not exists story_messages_user_lesson
  on public.story_messages (user_id, lesson, created_at);

-- 4. Row Level Security: each person can only ever see their own rows
alter table public.story_profiles enable row level security;
alter table public.story_progress enable row level security;
alter table public.story_messages enable row level security;

create policy "own profile" on public.story_profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "own progress" on public.story_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own messages" on public.story_messages
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
