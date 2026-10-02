-- Update 5.39: SpaceCore (Create > SpaceCore), Mission One: Mars.
-- One shared world every Kin digs into, one shared colony every Kin builds.
-- Run this whole file once in Supabase (SQL Editor > New query > paste > Run).
-- Safe to run again: everything is "if not exists" / "or replace".

-- 1. Each Kin's crew member: their own progress (resources, attributes,
--    auto-drills, Lyra's missions...). Only they can read or change it.
create table if not exists spacecore_players (
  user_id uuid primary key references profiles(id) on delete cascade,
  username text,
  state jsonb not null default '{}'::jsonb,
  summary jsonb not null default '{}'::jsonb,
  px int,
  py int,
  updated_at timestamptz not null default now()
);
alter table spacecore_players enable row level security;
drop policy if exists "kin manage their own spacecore crew" on spacecore_players;
create policy "kin manage their own spacecore crew" on spacecore_players
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 2. The colony: one row. Which Great Work is being built, what has been
--    sent to it, and how much every Kin has mined in total (the Commons).
--    Nobody writes it directly - only the functions below.
create table if not exists spacecore_colony (
  id int primary key default 1 check (id = 1),
  season int not null default 1,
  stage int not null default 0,
  have jsonb not null default '{"iron":0,"silicon":0,"ice":0,"rare":0}'::jsonb,
  mined jsonb not null default '{"iron":0,"silicon":0,"ice":0,"rare":0,"food":0}'::jsonb,
  updated_at timestamptz not null default now()
);
insert into spacecore_colony (id) values (1) on conflict (id) do nothing;
alter table spacecore_colony enable row level security;
drop policy if exists "the colony is visible to everyone" on spacecore_colony;
create policy "the colony is visible to everyone" on spacecore_colony for select using (true);

-- 3. Colony news ("Aaron sent 40 Ice to the Landing Base").
create table if not exists spacecore_log (
  id bigint generated always as identity primary key,
  user_id uuid references profiles(id) on delete set null,
  username text,
  kind text not null,
  text text not null,
  created_at timestamptz not null default now()
);
alter table spacecore_log enable row level security;
drop policy if exists "colony news is visible to everyone" on spacecore_log;
create policy "colony news is visible to everyone" on spacecore_log for select using (true);

-- 4. The shared underground. The rock itself is generated the same way in
--    every browser; this table only holds what Kin have changed (dug
--    tunnels and built blocks), and who changed it.
create table if not exists spacecore_tiles (
  x int not null,
  y int not null,
  t smallint not null,
  owner uuid references profiles(id) on delete set null,
  updated_at timestamptz not null default now(),
  primary key (x, y)
);
create index if not exists spacecore_tiles_updated on spacecore_tiles (updated_at);
alter table spacecore_tiles enable row level security;
drop policy if exists "the shared world is visible to everyone" on spacecore_tiles;
create policy "the shared world is visible to everyone" on spacecore_tiles for select using (true);

-- Great Work requirements, stage by stage (must match lib/spacecore.js and
-- the game file public/games/spacecore/index.html).
create or replace function spacecore_needs(p_stage int) returns jsonb
language sql immutable as $$
  select (array[
    '{"iron":800,"silicon":500,"ice":200,"rare":0}'::jsonb,
    '{"iron":2000,"silicon":1600,"ice":800,"rare":40}'::jsonb,
    '{"iron":1800,"silicon":2400,"ice":1500,"rare":40}'::jsonb,
    '{"iron":2800,"silicon":1800,"ice":2400,"rare":80}'::jsonb,
    '{"iron":5000,"silicon":4000,"ice":2000,"rare":300}'::jsonb
  ])[p_stage + 1]
$$;

create or replace function spacecore_stage_name(p_stage int) returns text
language sql immutable as $$
  select (array['Landing Base','Habitat Dome','Greenhouse Ring','Oxygen Plant','Launch Facility'])[p_stage + 1]
$$;

-- Send resources to the current Great Work. Returns what was accepted (never
-- more than is still needed) and the colony afterwards. Finishing a Great
-- Work moves the colony to the next one.
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
  if c.stage >= 5 then
    return jsonb_build_object('accepted', 0, 'completed', false, 'colony', to_jsonb(c));
  end if;

  needs := spacecore_needs(c.stage);
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

-- Add what a Kin has mined since their last check-in to the colony total.
-- 10% of everyone else's mining reaches each Kin as the Commons dividend
-- (worked out in the game from these totals).
create or replace function spacecore_sync(p_mined jsonb) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  k text;
  m jsonb;
begin
  if auth.uid() is null then return null; end if;
  select mined into m from spacecore_colony where id = 1 for update;
  foreach k in array array['iron','silicon','ice','rare','food'] loop
    m := jsonb_set(m, array[k], to_jsonb(coalesce((m->>k)::numeric, 0)
      + least(greatest(coalesce((p_mined->>k)::numeric, 0), 0), 5000)));
  end loop;
  update spacecore_colony set mined = m, updated_at = now() where id = 1;
  return (select to_jsonb(x) from spacecore_colony x where id = 1);
end $$;

-- Save dug tunnels and built blocks. Rules: you can dig any rock; you can
-- only build in tunnels you dug; nobody can change someone else's blocks.
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
    if nx < 1 or nx > 126 or ny < 10 or ny > 93 then continue; end if;
    if nt not in (1, 10, 11, 12, 13, 14, 15, 16) then continue; end if;
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

-- Who is on Mars: names, levels and where their borers are parked.
create or replace function spacecore_crews() returns table (
  user_id uuid, username text, level int, px int, py int, updated_at timestamptz
) language sql security definer set search_path = public as $$
  select p.user_id, p.username, coalesce((p.summary->>'level')::int, 1), p.px, p.py, p.updated_at
  from spacecore_players p
  order by p.updated_at desc
  limit 300
$$;

grant execute on function spacecore_contribute(text, numeric) to authenticated;
grant execute on function spacecore_sync(jsonb) to authenticated;
grant execute on function spacecore_set_tiles(jsonb) to authenticated;
grant execute on function spacecore_crews() to authenticated;
