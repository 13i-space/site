-- Update 5.56: the site's own Claude usage log, for Sentinel-X.
-- Run once in Supabase: SQL Editor -> New query -> paste -> Run.
-- Every Claude call the site makes (Oracle, Alien Lab, Lyra, the Signal
-- Composer, Story of Self) adds one row. Only the server can read or write it.
create table if not exists api_usage (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  feature text not null,
  model text,
  input_tokens integer not null default 0,
  output_tokens integer not null default 0,
  cache_read_tokens integer not null default 0,
  cache_write_tokens integer not null default 0,
  cost_usd numeric(10, 6) not null default 0
);
create index if not exists api_usage_created_at on api_usage (created_at desc);
alter table api_usage enable row level security;
-- (no policies on purpose: only the service role touches it)
