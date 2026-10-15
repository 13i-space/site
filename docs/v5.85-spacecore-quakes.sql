-- Update 5.85: SpaceCore Marsquakes, radiation and magma.
-- Safe to run more than once. It does NOT clear anything right now: the first
-- Marsquake happens at the next scheduled time (every two days, 20:00 UTC).
-- Run once in Supabase (SQL Editor > New query > paste > Run).
--
-- What it changes:
--  1. The shared world accepts the Support strut (tile code 43).
--  2. spacecore_quake(): when a Marsquake is due, every dug tunnel (and backfill)
--     that isn't braced collapses back to natural rock. Braced = within 2 blocks
--     of anything built, or within 4 blocks of a Support strut. The first player
--     online after the quake time sets it off; it only ever runs once per quake.
--  3. spacecore_version() becomes 585.

-- 1. The colony remembers which quake it has had ------------------------------
alter table spacecore_colony add column if not exists quake_slot int;
update spacecore_colony
  set quake_slot = floor((extract(epoch from now()) * 1000 - 72000000) / 172800000)::int
  where id = 1 and quake_slot is null;

-- 2. Tiles: same rules as 5.61, plus the strut (43) ---------------------------
create or replace function spacecore_set_tiles(p_tiles jsonb) returns int
language plpgsql security definer set search_path = public as $$
declare
  r jsonb;
  nx int; ny int; nt int;
  cur spacecore_tiles%rowtype;
  n int := 0;
  built int;
  was_built boolean;
begin
  if auth.uid() is null then return 0; end if;
  if jsonb_typeof(p_tiles) <> 'array' or jsonb_array_length(p_tiles) > 500 then return 0; end if;
  select count(*) into built from spacecore_tiles where owner = auth.uid() and t >= 10;
  for r in select * from jsonb_array_elements(p_tiles) loop
    nx := (r->>0)::int; ny := (r->>1)::int; nt := (r->>2)::int;
    if nx < 1 or nx > 510 or ny < 10 or ny > 197 then continue; end if;
    if not (nt in (1, 7) or nt between 10 and 16 or nt between 20 and 27 or nt between 30 and 43) then continue; end if;
    select * into cur from spacecore_tiles where x = nx and y = ny;
    if found and cur.owner is distinct from auth.uid() then
      continue; -- someone else dug or built here: it stays theirs
    end if;
    was_built := found and cur.t >= 10;
    -- the build limit: 1500 pieces per Kin (swapping one piece for another is fine)
    if nt >= 10 and not was_built then
      if built >= 1500 then continue; end if;
      built := built + 1;
    elsif nt < 10 and was_built then
      built := built - 1;
    end if;
    insert into spacecore_tiles (x, y, t, owner, updated_at)
      values (nx, ny, nt, auth.uid(), now())
      on conflict (x, y) do update set t = excluded.t, updated_at = now();
    n := n + 1;
  end loop;
  return n;
end $$;

-- 3. Marsquakes ---------------------------------------------------------------
create or replace function spacecore_quake() returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  cur int;
  slot int;
  n int := 0;
begin
  if auth.uid() is null then return null; end if;
  slot := floor((extract(epoch from now()) * 1000 - 72000000) / 172800000)::int;
  select quake_slot into cur from spacecore_colony where id = 1 for update;
  if cur is not null and cur >= slot then
    return jsonb_build_object('slot', cur, 'ran', false);
  end if;
  with gone as (
    delete from spacecore_tiles d
    where d.t in (1, 7)
      and not exists (
        select 1 from spacecore_tiles b
        where b.x between d.x - 2 and d.x + 2 and b.y between d.y - 2 and d.y + 2
          and b.t >= 10)
      and not exists (
        select 1 from spacecore_tiles s
        where s.x between d.x - 4 and d.x + 4 and s.y between d.y - 4 and d.y + 4
          and s.t = 43)
    returning 1)
  select count(*) into n from gone;
  update spacecore_colony set quake_slot = slot, updated_at = now() where id = 1;
  insert into spacecore_log (username, kind, text)
    values ('Mars', 'quake', 'Marsquake! ' || n || ' blocks of unbraced tunnel collapsed. Braced tunnels held.');
  return jsonb_build_object('slot', slot, 'ran', true, 'collapsed', n);
end $$;
grant execute on function spacecore_quake() to authenticated;

-- 4. Version --------------------------------------------------------------------
create or replace function spacecore_version() returns int
language sql immutable as $$ select 585 $$;
grant execute on function spacecore_version() to authenticated, anon;
