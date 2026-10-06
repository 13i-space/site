-- Update 5.61: SpaceCore survival update (power, comforts, Season projects).
-- Safe to run more than once. It does NOT clear anything: every tunnel, build,
-- crew and the colony stay exactly as they are.
-- Run once in Supabase (SQL Editor > New query > paste > Run).
--
-- What it changes:
--  1. The shared world accepts the new pieces (solar panel, geothermal tap,
--     battery, wire, galley, bunk, floor hatch, standing lamp: tile codes 35-42)
--     and caps each Kin at 1500 built pieces (blocks + equipment).
--  2. After the Launch Facility, the colony keeps going with six Season
--     projects (ship upgrades and base improvements) instead of stopping.
--  3. spacecore_crews also returns each crew's borer colors, so everyone sees
--     everyone else's paint job.
--  4. spacecore_version() becomes 561, which the site checks before it lets
--     anyone play the new version.

-- 1. Tiles --------------------------------------------------------------------
create index if not exists spacecore_tiles_owner on spacecore_tiles (owner);

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
    if not (nt in (1, 7) or nt between 10 and 16 or nt between 20 and 27 or nt between 30 and 42) then continue; end if;
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

-- 2. Great Works, then Season projects (must match lib/spacecore.js and the
--    STAGES list in public/games/spacecore/index.html) -------------------------
create or replace function spacecore_needs(p_stage int) returns jsonb
language sql immutable as $$
  select (array[
    '{"iron":800,"silicon":500,"ice":200,"rare":0}'::jsonb,
    '{"iron":2000,"silicon":1600,"ice":800,"rare":40}'::jsonb,
    '{"iron":1800,"silicon":2400,"ice":1500,"rare":40}'::jsonb,
    '{"iron":2800,"silicon":1800,"ice":2400,"rare":80}'::jsonb,
    '{"iron":5000,"silicon":4000,"ice":2000,"rare":300}'::jsonb,
    '{"iron":1500,"silicon":1200,"ice":0,"rare":60}'::jsonb,
    '{"iron":1200,"silicon":2500,"ice":300,"rare":20}'::jsonb,
    '{"iron":2500,"silicon":1500,"ice":500,"rare":80}'::jsonb,
    '{"iron":1800,"silicon":1800,"ice":200,"rare":120}'::jsonb,
    '{"iron":3000,"silicon":2500,"ice":1500,"rare":200}'::jsonb,
    '{"iron":2000,"silicon":3000,"ice":800,"rare":150}'::jsonb
  ])[p_stage + 1]
$$;

create or replace function spacecore_stage_name(p_stage int) returns text
language sql immutable as $$
  select (array['Landing Base','Habitat Dome','Greenhouse Ring','Oxygen Plant','Launch Facility',
    'Ship: Heat Shield','Base: Solar Farm','Ship: Cargo Bay','Base: Comms Tower','Ship: Ion Drive','Base: Observatory'])[p_stage + 1]
$$;

create or replace function spacecore_contribute(p_res text, p_amount numeric) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  c spacecore_colony%rowtype;
  needs jsonb;
  have numeric;
  need numeric;
  take numeric;
  uname text;
  rname text;
  done boolean := true;
  k text;
begin
  if auth.uid() is null then raise exception 'sign in first'; end if;
  if p_res not in ('iron','silicon','ice','rare') then raise exception 'unknown resource'; end if;
  if p_amount is null or p_amount <= 0 or p_amount > 5000 then raise exception 'bad amount'; end if;

  select * into c from spacecore_colony where id = 1 for update;
  needs := spacecore_needs(c.stage);
  if needs is null then
    return jsonb_build_object('accepted', 0, 'completed', false, 'colony', to_jsonb(c));
  end if;

  need := coalesce((needs->>p_res)::numeric, 0);
  have := coalesce((c.have->>p_res)::numeric, 0);
  take := least(p_amount, greatest(need - have, 0));
  if take <= 0 then
    return jsonb_build_object('accepted', 0, 'completed', false, 'colony', to_jsonb(c));
  end if;

  c.have := jsonb_set(c.have, array[p_res], to_jsonb(have + take));
  select username into uname from profiles where id = auth.uid();
  rname := case p_res when 'iron' then 'Iron' when 'silicon' then 'Silicon' when 'ice' then 'Ice' else 'Rare metals' end;
  insert into spacecore_log (user_id, username, kind, text)
    values (auth.uid(), uname, 'give', format('%s sent %s %s to the %s.', coalesce(uname, 'A Kin'), floor(take)::int, rname, spacecore_stage_name(c.stage)));

  for k in select jsonb_object_keys(needs) loop
    if coalesce((c.have->>k)::numeric, 0) < (needs->>k)::numeric then done := false; end if;
  end loop;

  if done then
    insert into spacecore_log (user_id, username, kind, text)
      values (auth.uid(), uname, 'stage', format('The %s is complete. Every crew on Mars helped build it.', spacecore_stage_name(c.stage)));
    c.stage := c.stage + 1;
    c.have := '{"iron":0,"silicon":0,"ice":0,"rare":0}'::jsonb;
  end if;

  update spacecore_colony set stage = c.stage, have = c.have, updated_at = now() where id = 1;
  return jsonb_build_object('accepted', take, 'completed', done,
    'colony', (select to_jsonb(x) from spacecore_colony x where id = 1));
end $$;

-- 3. Crews, now with their borer colors --------------------------------------
drop function if exists spacecore_crews();
create or replace function spacecore_crews() returns table (
  user_id uuid, username text, level int, px int, py int, updated_at timestamptz, look jsonb
) language sql security definer set search_path = public as $$
  select p.user_id, p.username, coalesce((p.summary->>'level')::int, 1), p.px, p.py, p.updated_at, p.summary->'look'
  from spacecore_players p
  order by p.updated_at desc
  limit 300
$$;

-- 4. Version -------------------------------------------------------------------
create or replace function spacecore_version() returns int
language sql immutable as $$ select 561 $$;

grant execute on function spacecore_set_tiles(jsonb) to authenticated;
grant execute on function spacecore_contribute(text, numeric) to authenticated;
grant execute on function spacecore_crews() to authenticated;
grant execute on function spacecore_version() to authenticated, anon;
