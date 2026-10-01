-- Update 5.32: the launch list (waitlist) for Story of Self.
-- Run in the STORY OF SELF Supabase project (not 13i). Safe to run more than once.
-- People join through the website's server (/api/story/waitlist), which uses the
-- service-role key. Nobody can read or change the list from a browser; founders
-- see it on the Lighthouse dashboard (/story/team).

create table if not exists public.story_waitlist (
  id bigint generated always as identity primary key,
  email text not null unique check (char_length(email) between 3 and 200),
  first_name text check (char_length(first_name) <= 60),
  role text not null default 'student' check (role in ('student', 'parent', 'champion', 'educator', 'other')),
  grad_year int check (grad_year between 2020 and 2035),
  ref_code text not null unique,
  referred_by text,
  source text,
  created_at timestamptz not null default now()
);
create index if not exists story_waitlist_created on public.story_waitlist (created_at);
create index if not exists story_waitlist_referred on public.story_waitlist (referred_by);

-- Row level security on, with no policies: only the server can touch it.
alter table public.story_waitlist enable row level security;
