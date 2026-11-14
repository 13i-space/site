# Virtual GM demo at 13i.space/gm

A demo of Paul's AI front office for minor-league soccer clubs (working name: Virtual GM). It shares nothing
with 13i: its own styles (scoped under `.gm`), fonts and colors, like Story of Self at `/story`.

- Code: `app/gm` (screens), `lib/gm` (agents, store, actions). Agent skills live in `lib/gm/skills.js`.
- Not indexed, not linked from the 13i nav.
- Claude key: `GM_ANTHROPIC_API_KEY`, else `STORY_ANTHROPIC_API_KEY`, else `ANTHROPIC_API_KEY` (same key as Story of Self). Model: `GM_MODEL`, default `claude-sonnet-5-5`. Usage is recorded as `virtual-gm-*` in api_usage.
- Without a key every screen works in demo mode and agents replay canned steps.

## Optional environment variables (Vercel)

| Name | What it does | Default |
|---|---|---|
| `GM_PASSCODE` | Visitors must enter this once. Unset means the demo is open. | open |
| `GM_RUNS_PER_HOUR` | Agent runs per visitor per hour | 8 |
| `GM_SETUPS_PER_HOUR` | New-club setups per visitor per hour | 3 |
| `GM_DAILY_CALLS` | Total live Claude calls per server instance per day | 120 |
| `GM_MODEL` | Claude model | claude-sonnet-5-5 |
| `CRON_SECRET` | Lets the morning cron call `/gm/api/cron`. Without it the cron does nothing. | unset |
| `GM_AUTORUN` | Set to `off` to stop agents running when the office opens | on |

## Limits of the demo

- Club data is saved in the server's temporary storage on Vercel, so it can reset. Fine for looking around.
- Nothing is ever sent. Approved drafts move to an on-screen outbox.
- No sign-in. A cookie picks the club.

## Overnight runs and saving data (one-time, in Supabase)

Scheduled agents run when the office is opened. To also run every morning by themselves, and to stop the demo
resetting, create this table once (Supabase > SQL editor > paste > Run). The site already has `SUPABASE_URL` and
`SUPABASE_SERVICE_ROLE_KEY`. Then add `CRON_SECRET` (any long random string) in Vercel and redeploy.

```sql
create table if not exists gm_clubs (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);
alter table gm_clubs enable row level security;
```

`vercel.json` calls `/gm/api/cron` daily at 12:00 UTC (6am Central in winter, 7am in summer). The footer of the
office shows "Saved to database" once the table works, otherwise "Temporary storage".

## How the lead sprint works

Sponsorship and Tickets each run several searches side by side (see `lib/gm/lanes.js`), merge and de-duplicate the
results, and keep up to the daily goal (5 to 20). An email counts only if the agent saw it on a public page and
recorded the page; otherwise the lead falls back to a form message or call script. Tickets starts in the ring
nearest the stadium and widens to the next ring once the current one holds 40 leads.
