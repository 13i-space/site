-- Update 5.42: SpaceCore saving safeguards.
-- Safe to run more than once, and safe whether or not v5.40 was run: it does
-- NOT clear anything. It installs the v5.40 rules for the big world (in case
-- that step didn't take) and a version number the site checks before it lets
-- anyone play, so the game can never run against older database rules again.
-- Run once in Supabase (SQL Editor > New query > paste > Run).

create or replace function spacecore_set_tiles(p_tiles jsonb) returns int
language plpgsql security definer set search_path = public as $$
declare
  r jsonb;
  nx int; ny int; nt int;
  cur spacecore_tiles%rowtype;
  n int := 0;
begin
  if auth.uid() is null then return 0; end if;
  if jsonb_typeof(p_tiles) <> 'array' or jsonb_array_length(p_tiles) > 500 then return 0; end if;
  for r in select * from jsonb_array_elements(p_tiles) loop
    nx := (r->>0)::int; ny := (r->>1)::int; nt := (r->>2)::int;
    if nx < 1 or nx > 510 or ny < 10 or ny > 197 then continue; end if;
    if not (nt in (1, 7) or nt between 10 and 16 or nt between 20 and 27 or nt between 30 and 34) then continue; end if;
    select * into cur from spacecore_tiles where x = nx and y = ny;
    if found and cur.owner is distinct from auth.uid() then
      continue; -- someone else dug or built here: it stays theirs
    end if;
    insert into spacecore_tiles (x, y, t, owner, updated_at)
      values (nx, ny, nt, auth.uid(), now())
      on conflict (x, y) do update set t = excluded.t, updated_at = now();
    n := n + 1;
  end loop;
  return n;
end $$;

-- The site compares this with SCHEMA_VERSION in components/SpaceCoreGame.js.
create or replace function spacecore_version() returns int
language sql immutable as $$ select 542 $$;

grant execute on function spacecore_set_tiles(jsonb) to authenticated;
grant execute on function spacecore_version() to authenticated, anon;
