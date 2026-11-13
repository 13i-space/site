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

## Limits of the demo

- Club data is saved in the server's temporary storage on Vercel, so it can reset. Fine for looking around.
- Nothing is ever sent. Approved drafts move to an on-screen outbox.
- No sign-in. A cookie picks the club.
