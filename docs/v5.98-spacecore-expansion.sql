-- Update 5.98: SpaceCore expansion. Olympus Mons (Beta), the Expedition, processing,
-- borer modules, the Colony roll. Run once in Supabase (SQL Editor > New query > paste > Run).
-- Safe to run more than once. It does NOT clear or change anyone's progress, tunnels,
-- builds or the colony's Great Works. Needs the 5.85 file to have been run first.
--
-- What it changes:
--  1. The colony row gains the Beta works (beta_stage, beta_have) and the Expedition.
--  2. spacecore_set_tiles accepts Olympus Mons tiles (stored at x + 1024), the Smelter (45),
--     Electrolyser (46) and Obsidian block (47).
--  3. spacecore_contribute2: sending to the Beta works or the Expedition. The old
--     spacecore_contribute (Alpha's Great Works) is untouched.
--  4. spacecore_crews also returns each crew's public stats for the Colony roll and titles.
--  5. spacecore_version() becomes 598.

-- 1. Colony ---------------------------------------------------------------------
alter table spacecore_colony add column if not exists beta_stage int not null default 0;
alter table spacecore_colony add column if not exists beta_have jsonb not null default '{}'::jsonb;
alter table spacecore_colony add column if not exists expedition jsonb not null default '{"have":{},"done":false}'::jsonb;

-- 2. Tiles ----------------------------------------------------------------------
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
    if nx >= 1024 then
      -- Olympus Mons (Beta): 512 x 300, stored at x + 1024. The mountain rises above the
      -- datum (row 110), so there is no single surface row; only the Beta Camp ring (x 30-132
      -- above the datum) is kept clear for the Beta works.
      if nx < 1025 or nx > 1534 or ny < 2 or ny > 297 then continue; end if;
      if ny < 110 and nx between 1054 and 1156 then continue; end if;
    else
      if nx < 1 or nx > 510 or ny < 2 or ny > 197 then continue; end if;
      -- surface building (rows 2-9): never in the colony ring around Landing Site Alpha (x 212-326)
      if ny < 10 and nx between 212 and 326 then continue; end if;
    end if;
    -- 0 = clearing your own surface build back to open air
    if nt = 0 then
      if ny < 10 or nx >= 1024 then
        delete from spacecore_tiles where x = nx and y = ny and owner = auth.uid();
        if found then n := n + 1; end if;
      end if;
      continue;
    end if;
    if nx < 1024 and ny < 10 and nt < 10 then continue; end if;
    if not (nt in (1, 7) or nt between 10 and 16 or nt between 20 and 27 or nt between 30 and 47) then continue; end if;
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

-- 3. Beta works and the Expedition (must match BSTAGES / EXP_NEED in the game) -----
create or replace function spacecore_beta_needs(p_stage int) returns jsonb
language sql immutable as $$
  select (array[
    '{"iron":600,"silicon":400,"sulfur":120,"steel":40}'::jsonb,
    '{"iron":1200,"silicon":900,"obsidian":120,"steel":80}'::jsonb,
    '{"iron":900,"silicon":700,"sulfur":500,"circuits":40}'::jsonb,
    '{"steel":150,"circuits":80,"obsidian":250,"rare":60}'::jsonb,
    '{"steel":200,"circuits":120,"obsidian":500,"rare":100}'::jsonb
  ])[p_stage + 1]
$$;

create or replace function spacecore_beta_name(p_stage int) returns text
language sql immutable as $$
  select (array['Beta Camp','Tube Habitat','Sulfur Works','Summit Relay','Caldera Observatory'])[p_stage + 1]
$$;

create or replace function spacecore_contribute2(p_site text, p_res text, p_amount numeric) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  c spacecore_colony%rowtype;
  needs jsonb;
  have jsonb;
  cur numeric;
  need numeric;
  take numeric;
  uname text;
  done boolean := true;
  k text;
  label text;
begin
  if auth.uid() is null then raise exception 'sign in first'; end if;
  if p_site not in ('beta','exp') then raise exception 'unknown site'; end if;
  if p_res not in ('iron','silicon','ice','rare','food','steel','circuits','fuel','sulfur','obsidian') then raise exception 'unknown resource'; end if;
  if p_amount is null or p_amount <= 0 or p_amount > 5000 then raise exception 'bad amount'; end if;

  select * into c from spacecore_colony where id = 1 for update;
  select username into uname from profiles where id = auth.uid();

  if p_site = 'exp' then
    -- the Expedition opens with the Launch Facility (Great Work 5) and is funded once
    if c.stage < 5 or coalesce((c.expedition->>'done')::boolean, false) then
      return jsonb_build_object('accepted', 0, 'completed', false, 'colony', to_jsonb(c));
    end if;
    needs := '{"steel":300,"fuel":400,"circuits":80,"food":200}'::jsonb;
    have := coalesce(c.expedition->'have', '{}'::jsonb);
    label := 'the Expedition';
  else
    if not coalesce((c.expedition->>'done')::boolean, false) then
      return jsonb_build_object('accepted', 0, 'completed', false, 'colony', to_jsonb(c));
    end if;
    needs := spacecore_beta_needs(c.beta_stage);
    if needs is null then
      return jsonb_build_object('accepted', 0, 'completed', false, 'colony', to_jsonb(c));
    end if;
    have := coalesce(c.beta_have, '{}'::jsonb);
    label := 'the ' || spacecore_beta_name(c.beta_stage);
  end if;

  need := coalesce((needs->>p_res)::numeric, 0);
  cur := coalesce((have->>p_res)::numeric, 0);
  take := least(p_amount, greatest(need - cur, 0));
  if take <= 0 then
    return jsonb_build_object('accepted', 0, 'completed', false, 'colony', to_jsonb(c));
  end if;
  have := jsonb_set(have, array[p_res], to_jsonb(cur + take));
  insert into spacecore_log (user_id, username, kind, text)
    values (auth.uid(), uname, 'give', format('%s sent %s %s to %s.', coalesce(uname, 'A Kin'), floor(take)::int, initcap(p_res), label));

  for k in select jsonb_object_keys(needs) loop
    if coalesce((have->>k)::numeric, 0) < (needs->>k)::numeric then done := false; end if;
  end loop;

  if p_site = 'exp' then
    c.expedition := jsonb_build_object('have', have, 'done', done, 'at', case when done then to_jsonb(now()) else 'null'::jsonb end);
    if done then
      insert into spacecore_log (user_id, username, kind, text)
        values (auth.uid(), uname, 'stage', 'The Expedition is funded. The convoy road to Olympus Mons is open.');
    end if;
  else
    c.beta_have := have;
    if done then
      insert into spacecore_log (user_id, username, kind, text)
        values (auth.uid(), uname, 'stage', format('At Olympus Mons, %s is complete.', label));
      c.beta_stage := c.beta_stage + 1;
      c.beta_have := '{}'::jsonb;
    end if;
  end if;

  update spacecore_colony set beta_stage = c.beta_stage, beta_have = c.beta_have, expedition = c.expedition, updated_at = now() where id = 1;
  return jsonb_build_object('accepted', take, 'completed', done,
    'colony', (select to_jsonb(x) from spacecore_colony x where id = 1));
end $$;
grant execute on function spacecore_contribute2(text, text, numeric) to authenticated;

-- 4. Crews with their public stats (Colony roll, titles, which site they're at) -----
drop function if exists spacecore_crews();
create or replace function spacecore_crews() returns table (
  user_id uuid, username text, level int, px int, py int, updated_at timestamptz, look jsonb, stats jsonb
) language sql security definer set search_path = public as $$
  select p.user_id, p.username, coalesce((p.summary->>'level')::int, 1), p.px, p.py, p.updated_at, p.summary->'look',
    jsonb_build_object(
      'given', coalesce((p.summary->>'given')::numeric, 0),
      'maxDepth', coalesce((p.summary->>'maxDepth')::numeric, 0),
      'maxAlt', coalesce((p.summary->>'maxAlt')::numeric, 0),
      'maxHigh', coalesce((p.summary->>'maxHigh')::numeric, 0),
      'crewNo', coalesce((p.summary->>'crewNo')::int, 1),
      'quakes', coalesce((p.summary->>'quakes')::int, 0),
      'givenBy', coalesce(p.summary->'givenBy', '{}'::jsonb),
      'site', coalesce(p.summary->>'site', 'alpha'),
      'beta', coalesce((p.summary->>'beta')::boolean, false))
  from spacecore_players p
  order by p.updated_at desc
  limit 300
$$;
grant execute on function spacecore_crews() to authenticated;

-- 5. Version --------------------------------------------------------------------
create or replace function spacecore_version() returns int
language sql immutable as $$ select 598 $$;
grant execute on function spacecore_version() to authenticated, anon;
