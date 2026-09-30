-- Update 5.10: Alpha Users - everyone who joins in 2026, before Beta, plus
-- Paul's two accounts ("Paul" and "13i"). Each gets an Alpha number in
-- join order, and a forum space only they can post in.
-- Run once in the Supabase SQL Editor. Safe to run again.

-- 1. The flag and the number
alter table profiles add column if not exists alpha boolean not null default false;
alter table profiles add column if not exists alpha_number int;

update profiles set alpha = true
  where created_at < '2027-01-01' or lower(username) in ('paul', '13i');

with ranked as (
  select id, row_number() over (order by created_at, id) as n
  from profiles where alpha and alpha_number is null
), base as (
  select coalesce(max(alpha_number), 0) as m from profiles
)
update profiles p set alpha_number = base.m + ranked.n
  from ranked, base where p.id = ranked.id;

-- 2. New profiles made before 2027 become Alpha automatically, numbered next
create or replace function set_alpha_on_join() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  new.alpha := now() < '2027-01-01' or lower(coalesce(new.username, '')) in ('paul', '13i');
  if new.alpha then
    select coalesce(max(alpha_number), 0) + 1 into new.alpha_number from profiles;
  else
    new.alpha_number := null;
  end if;
  return new;
end $$;
drop trigger if exists alpha_on_join on profiles;
create trigger alpha_on_join before insert on profiles
  for each row execute function set_alpha_on_join();

-- 3. Nobody can make themselves Alpha from the website (their own profile
--    is otherwise editable by them). Edits here in the SQL Editor still work.
create or replace function protect_alpha() returns trigger
language plpgsql as $$
begin
  if current_user in ('authenticated', 'anon') then
    new.alpha := old.alpha;
    new.alpha_number := old.alpha_number;
  end if;
  return new;
end $$;
drop trigger if exists alpha_protected on profiles;
create trigger alpha_protected before update on profiles
  for each row execute function protect_alpha();

-- 4. The Alpha Users forum space: everyone can read it, only Alphas post
alter table forum_spaces add column if not exists alpha_only boolean not null default false;
insert into forum_spaces (slug, name, description, sort_order, alpha_only) values
  ('alpha', 'Alpha Users', 'For the first Kin, testing 13i before Beta. Suggest changes, report what''s broken, shape what comes next.', 4, true)
  on conflict (slug) do update set name = excluded.name, description = excluded.description, alpha_only = true;

create or replace function is_alpha(uid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select alpha from profiles where id = uid), false)
$$;

drop policy if exists "signed-in users can create threads" on forum_threads;
create policy "signed-in users can create threads" on forum_threads for insert
  with check (
    auth.uid() = author_id
    and (not coalesce((select alpha_only from forum_spaces where id = space_id), false) or is_alpha(auth.uid()))
  );

drop policy if exists "signed-in users can reply" on forum_replies;
create policy "signed-in users can reply" on forum_replies for insert
  with check (
    auth.uid() = author_id
    and (
      not coalesce((select s.alpha_only from forum_threads t join forum_spaces s on s.id = t.space_id where t.id = thread_id), false)
      or is_alpha(auth.uid())
    )
  );
