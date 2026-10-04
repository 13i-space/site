-- Update 5.55: beta requests + Kinbook cleanup.
-- Run once in Supabase: SQL Editor -> New query -> paste -> Run.

-- 1. Beta requests from the countdown page (/api/beta writes here with the
--    service role key; nobody else can read or write it).
create table if not exists beta_requests (
  id bigint generated always as identity primary key,
  email text not null unique,
  name text,
  why text,
  created_at timestamptz not null default now()
);
alter table beta_requests enable row level security;
-- (no policies on purpose: only the server, using the service role, can touch it)

-- To see who has asked:
--   select email, name, why, created_at from beta_requests order by created_at desc;

-- 2. Kinbook: remove the old anonymous messages (written before 5.51, when
--    signing in wasn't required). First LOOK at what will go:
select id, name, message, created_at
from guestbook
where user_id is null
  and (name is null or trim(name) = '' or name ilike 'anon%');

-- ...then, if that list is exactly the two you want gone, run:
-- delete from guestbook
-- where user_id is null
--   and (name is null or trim(name) = '' or name ilike 'anon%');
