-- ===== Kin profile v2: bio + avatar =====
alter table profiles add column bio text;
alter table profiles add column avatar_url text;

create policy "users can update own profile" on profiles
  for update using (auth.uid() = id);

-- ===== Forum: spaces, threads, replies =====
create table forum_spaces (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  sort_order int not null default 0
);
alter table forum_spaces enable row level security;
create policy "spaces are viewable by everyone" on forum_spaces for select using (true);

insert into forum_spaces (slug, name, description, sort_order) values
  ('general', 'The Signal Fire', 'General talk. Introduce yourself, life, whatever''s on your mind.', 0),
  ('book', 'Book Talk', 'Chapter One, theories, reactions - spoiler-light please.', 1),
  ('music', 'Music Talk', 'The albums, the songs, the sound.', 2),
  ('13i', '13i General', 'Everything else about the universe.', 3);

create table forum_threads (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references forum_spaces(id) on delete cascade,
  author_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  body text not null,
  created_at timestamptz not null default now()
);
alter table forum_threads enable row level security;
create policy "threads are viewable by everyone" on forum_threads for select using (true);
create policy "signed-in users can create threads" on forum_threads for insert with check (auth.uid() = author_id);

create table forum_replies (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references forum_threads(id) on delete cascade,
  author_id uuid not null references profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);
alter table forum_replies enable row level security;
create policy "replies are viewable by everyone" on forum_replies for select using (true);
create policy "signed-in users can reply" on forum_replies for insert with check (auth.uid() = author_id);

-- ===== Avatar storage =====
-- Also requires one manual step in the dashboard (SQL alone can't do this part):
-- Storage -> New bucket -> name it exactly "avatars" -> toggle Public -> Save.
-- Then run the policies below.
create policy "Avatar images are publicly accessible" on storage.objects
  for select using (bucket_id = 'avatars');
create policy "Users can upload their own avatar" on storage.objects
  for insert with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Users can update their own avatar" on storage.objects
  for update using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
