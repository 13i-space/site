# CLAUDE.md — Working Instructions for 13i.space

This file is the standing briefing for any Claude session working on this
repository. Read this, then CURRENT.md, before touching anything.

## Read order for a new session
1. **CLAUDE.md** (this file)
2. **CURRENT.md** — what's live, in progress, broken, and off-limits right now
3. **PROJECT.md**, **DESIGN.md**, **WORLD.md** — whichever are relevant to the task
4. The actual code for whatever you're about to change — never assume from docs alone
5. Make the change, minimally and without touching unrelated functionality
6. Update **CURRENT.md** and **CHANGELOG.md** if the change is significant

## Who you're working with
Paul is the sole developer-by-proxy on this project — a musician and author,
self-described novice with git/Vercel/dev tooling. He does not read or edit
code directly; he deploys by replacing folders in a local git-tracked
checkout via GitHub Desktop, then commits and pushes. This means:
- Every deliverable is a **complete zip** of the changed top-level folders
  (`app`, `components`, `lib`, `public`, plus any new folders), never a diff
  or a patch instruction.
- Instructions involving Supabase, Vercel, or GitHub Desktop need **explicit,
  numbered, click-by-click steps** — name the exact menu, tab, or button.
- New database schema changes should be handed over as copy-pasteable SQL,
  not a file path to open (a file-path instruction has caused confusion
  before — paste the SQL directly in the reply).

## Non-negotiable engineering rules
- **Global code degrades gracefully.** Anything that runs on every request
  (middleware, root layout, Nav, Footer) must treat missing config or a
  failed fetch as an expected state and pass through silently — never throw.
  A middleware crash once took the entire site down; this is the reason the
  guard exists, not a theoretical concern.
- **"Build now, connect key later."** Third-party integrations are wired so
  the code works the moment a key is added to Vercel env vars, and fails
  gracefully (a clear message, not a crash) when the key is absent.
- **Inspect before changing.** Several bugs in this project's history came
  from assuming what a file contained instead of reading it first (most
  notably: two different implementations of the same game existed
  simultaneously before anyone noticed only one was actually wired up — see
  PROJECT.md). Read the actual file before editing it, every time.
- **RLS-first data access.** Client-side reads/writes go through the
  anon-key browser client and rely on Postgres row-level-security policies,
  not application-level permission checks. The service-role key
  (`lib/supabaseAdmin.js`) is for server routes only, never imported into
  anything that ships to the browser.
- **No new third-party services without discussion.** Paul has explicitly
  pushed back on accumulating services/free-tiers to track. Default to
  Supabase (already in use) for anything that needs a backend, rather than
  reaching for a new provider. Flag it plainly if a task genuinely needs one
  (e.g. image generation for the Alien Lab does).
- **Keep things looking real, not stubbed.** Paul's stated preference,
  repeated many times over this project: thorough, working builds, not
  mockups or placeholders that need a second pass to become real.

## Design/product judgment defaults
- Favor the restrained, sophisticated aesthetic already established (see
  DESIGN.md) over "generic sci-fi dashboard" styling, *except* on explicit
  look-lab preview pages, which are meant to explore bolder directions.
- When a request is ambiguous, state the assumption and proceed rather than
  stalling — but flag genuinely large-scope work honestly before building
  it, rather than quietly cutting corners or quietly overbuilding.
- Give the honest scope assessment when something is bigger than it sounds
  (a recurring value Paul has praised) rather than downplaying it to seem
  more responsive.

## What NOT to do
- Don't invent lore to fill a gap — see WORLD.md's canon/developing/unknown
  distinction. An unanswered worldbuilding question is often intentional.
- Don't rename, renumber, or overwrite existing look-lab preview routes
  (`/preview`, `/preview1`...`/preview13`) — always add a new slug for a new
  design attempt; the catalog at `/preview` is meant to be a permanent,
  growing record.
- Don't reintroduce Resend or other removed dependencies without Paul
  raising it — assignment submissions were deliberately moved to an
  in-house Supabase-only flow.
- Don't assume a file's purpose from its name alone (see the
  `ThirteenIVsNemesis.js` situation in PROJECT.md) — confirm what's actually
  wired into a live route before treating something as current behavior.
