-- Update 5.14: Oracle usage log, for daily caps and cost tracking.
-- One row per Oracle reply: who (account, or a salted hash of a guest's
-- network address - never the raw IP), which model, and token counts.
-- No message content is ever stored.
-- Only the server's service-role key reads or writes it (RLS on, no policies).
-- Run once in the Supabase SQL Editor. Safe to run again.

create table if not exists oracle_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  ip_hash text,
  model text not null,
  input_tokens integer not null default 0,
  output_tokens integer not null default 0,
  created_at timestamptz not null default now()
);

alter table oracle_usage enable row level security;
-- (deliberately no policies: the public anon and signed-in keys can't touch it)

create index if not exists oracle_usage_user_created on oracle_usage (user_id, created_at);
create index if not exists oracle_usage_ip_created on oracle_usage (ip_hash, created_at);

-- Per-day totals (days in UTC, matching the caps and the game leaderboards).
-- security_invoker makes the view obey the table's RLS, so it's private too.
create or replace view oracle_usage_daily with (security_invoker = true) as
select
  (created_at at time zone 'utc')::date as day,
  count(*) as messages,
  count(distinct user_id) as unique_users,
  count(distinct ip_hash) filter (where user_id is null) as unique_guests,
  coalesce(sum(input_tokens), 0) as input_tokens,
  coalesce(sum(output_tokens), 0) as output_tokens
from oracle_usage
group by 1
order by 1 desc;

revoke all on oracle_usage_daily from anon, authenticated;
