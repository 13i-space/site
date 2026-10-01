-- Update 5.27: Story of Self contact form (/story/contact)
-- Run in the STORY OF SELF Supabase project (not 13i). Safe to run more than once.
-- Anyone can SEND a message; nobody can read messages through the website.
-- Read them in Supabase: Table Editor -> story_contact.

create table if not exists public.story_contact (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 200),
  topic text,
  message text not null check (char_length(message) between 1 and 5000),
  created_at timestamptz not null default now()
);

alter table public.story_contact enable row level security;

drop policy if exists "anyone can send a contact message" on public.story_contact;
create policy "anyone can send a contact message" on public.story_contact
  for insert to anon, authenticated with check (true);
