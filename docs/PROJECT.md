# PROJECT.md — Technical Overview of 13i.space

Verified against the actual repository. Where something couldn't be
confirmed from code, it's marked accordingly rather than assumed.

## Stack
- **Framework**: Next.js (App Router), deployed on **Vercel**
- **Database/Auth/Storage**: **Supabase** — Postgres with row-level security,
  built-in auth (email/password + magic link), Storage for uploaded images
- **AI**: Anthropic API (Claude): the Oracle (which now knows what a
  signed-in visitor has read, played and made), and the Alien Lab's names,
  portraits and Continuance Reviews (`app/api/alien`)
- **Email**: Buttondown, for the pre-launch newsletter signup only (no
  transactional email service is in use — Resend was deliberately removed)
- **Sound**: Web Audio API, synthesized in-browser via `lib/sfx.js` — no
  audio files or sound libraries
- **Local dev**: Paul uses GitHub Desktop on macOS, not the command line

## Repository structure
```
app/
  page.js                    root "/" — the countdown page (standalone, no Nav/Footer)
  layout.js                  root layout (fonts, globals.css)
  globals.css                site-wide styles, design tokens, .panel/.launch-card/.book-page classes
  icon.svg, icon.png, apple-icon.png    favicon (ring-eye mark)
  auth/callback/route.js     magic-link auth callback (redirects to /account by default, or ?next=)
  auth/reset-callback/route.js   dedicated password-recovery callback (no query string, for allow-list reliability)
  api/                       route handlers - see "API routes" below
  preview/, preview1..preview13/    look-lab pages, see DESIGN.md
  (site)/                    route group sharing Nav + Footer + Lyra + ThemedBackground
    layout.js                mounts Nav, Footer, LyraCompanion, ThemedBackground
    launch/                  the real homepage (behind the countdown), plays Big Bang on load
    explore/, play/, create/, kinship/   the four mode landing pages
    book/, book/chapter-1/
    music/
    oracle/
    games/, games/nemesis-command/, games/asteroid-belt/, games/13i-vs-nemesis/
    artifacts/, artifacts/ninefold/, artifacts/cryptex/
    wiki/
    galaxy/, galaxy/map/, galaxy/facts/, galaxy/quiz/
    assignments/, assignments/write/, assignments/0000001/, assignments/[number]/
    forum/, forum/[space]/, forum/[space]/new/, forum/[space]/[threadId]/
    guestbook/
    kin/[username]/           public Kin profile
    account/, account/reset-password/
    login/
    about/, contact/, privacy/, terms/
    create/alien-lab/
components/     ~50 files - see "Major components" below
lib/            Supabase clients, theme system, tracking helpers, data files
public/
  covers/       assignment cover images (full + thumb JPGs)
  downloads/    PDFs (book rough draft, Assignment 0000001)
  games/13i-vs-nemesis.html    standalone HTML/Canvas game, embedded via iframe
docs/           SQL migration files, run manually in Supabase's SQL Editor (not auto-applied)
```

## Routing conventions
- The **root `/`** is the pre-launch countdown page — standalone, no Nav.
- **`/launch`** is the real homepage once behind the countdown.
- The **`(site)` route group** wraps everything else in a shared layout
  (Nav, Footer, Lyra, ambient background) without adding a URL segment.
- **Dynamic assignment reader**: `/assignments/[number]` reads a story from
  the database and auto-paginates it. `/assignments/0000001` is a separate,
  hand-coded static route for the canon origin story (predates the
  database-driven system) — Next.js resolves the static route in
  preference to the dynamic one for that exact path, so there's no
  conflict, but it means Assignment 1's content lives in `lib/assignment1.js`
  rather than the database, unlike every story added since.
- **Look-lab previews** (`/preview`, `/preview1`...`/preview13`) are
  permanent, numbered, never overwritten — `/preview` itself is an index
  page listing all of them. Since Update 5.8 only Sentinel-X accounts can
  open them (checked in `middleware.js`); everyone else gets a 404.
- **Link previews**: `app/og/route.js` (site default), `app/og/species/[id]`
  and `app/og/story/[number]` draw the 1200×630 images shown when a link is
  shared. Pages point at them from their metadata; `metadataBase` in
  `app/layout.js` (`NEXT_PUBLIC_SITE_URL`, default https://13i.space)
  makes them absolute. The image renderer needs `display: flex` on any div
  with more than one child, and text (not bare numbers) as children.

## Database schema (Supabase / Postgres)
Schema history lives in `docs/*.sql`, applied manually and cumulatively.
Tables that exist as of this writing:

| Table | Purpose | Key columns |
|---|---|---|
| `profiles` | Username/bio/avatar, one row per auth user | `id` (= auth.users.id), `username`, `bio`, `avatar_url` |
| `assignment_submissions` | All readable/submitted short stories | `assignment_number`, `designation` (title), `story`, `name`, `email`, `type` ('human'\|'ai'), `status` ('submitted'\|'archived'\|'canon'), `cover_url`, `thumb_url` |
| `assignment_drafts` | One in-progress draft per user for the writer | `user_id` (PK), `assignment_number`, `title`, `story` |
| `forum_spaces` | Seeded, not user-created | `slug`, `name`, `description`, `sort_order` |
| `forum_threads` / `forum_replies` | Forum content | `space_id`/`thread_id`, `author_id` (→ profiles), `title`/`body` |
| `guestbook` | Guestbook wall entries | (pre-dates this documentation pass; schema not re-verified) |
| `high_scores` | Best score per user per game | `user_id`, `game`, `score` (PK: user_id+game) |
| `daily_scores` | Leaderboard, resets 00:00 UTC | `user_id`, `game`, `period_start`, `score` (PK: all three) |
| `reading_progress` | Which stories a user has read | `user_id`, `assignment_number`, `read_at` |
| `game_plays` | Play counts per user per game | `user_id`, `game`, `play_count`, `last_played_at` |
| `alien_species` | Saved Alien Lab creations | `user_id`, `name`, `answers` (jsonb) |

**RLS pattern used throughout**: public tables (forum, high scores, daily
scores, assignments) have a `select using (true)` or status-scoped policy
for public read, and a `for all using (auth.uid() = user_id)` policy so
users can only write their own rows. `assignment_submissions` writes go
through the service-role key in the API route, not client-side RLS.

**Storage buckets**: `avatars` (public, user-scoped upload paths),
`assignment-covers` (public, user-scoped upload paths for human-submitted
story covers).

## Authentication
Three Supabase client wrappers in `lib/`:
- `supabaseBrowser.js` — anon key, for client components (`"use client"`)
- `supabaseServer.js` — anon key + cookies via `@supabase/ssr`, for server
  components and route handlers; respects RLS as the signed-in user
- `supabaseAdmin.js` — service-role key, **server-only**, bypasses RLS;
  used for admin-style writes (e.g. seeding assignment content, the
  claim-username flow's uniqueness check)

Sign-in methods: email/password (with a signup flow that also creates the
`profiles` row), a magic-link fallback, and password recovery via a
**dedicated** callback route (`/auth/reset-callback`) rather than the
general one, specifically because Supabase's redirect-URL allow-list
matching proved unreliable with a query string attached — this dedicated
route takes no parameters and must be added to Supabase's allow-list as its
own exact entry.

`middleware.js` refreshes the auth session on every request and is wrapped
in try/catch so a malformed env var or a Supabase hiccup can never take
the whole site down (this happened once, pre-hardening).

## Third-party integrations
| Service | Used for | Status |
|---|---|---|
| Anthropic API | The Oracle | Active, key set in Vercel |
| Buttondown | Pre-launch email signup | Active; hidden from the UI once a visitor is logged in |
| Supabase | Everything else backend | Active |
| Resend | ~~Assignment email notifications~~ | **Removed** — deliberately, to avoid tracking another service; submissions are in-house only |

## Key API routes (`app/api/`)
- `oracle/` — proxies to Anthropic, fails gracefully without a key
- `subscribe/` — Buttondown signup (field is `email_address`, not `email` — Buttondown renamed it)
- `submit-assignment/` — requires login; writes to `assignment_submissions` via the admin client
- `auth/signup/`, `auth/resolve-username/`, `auth/claim-username/` — username/profile creation helpers around Supabase Auth
- `lyra/` — Lyra's conversation (signed in; model `claude-sonnet-5-5`, knowledge block prompt-cached). `lyra/feed` — what's new, cached 30 min. Her canon is `lib/lyraCanon.js`, a copy of docs/WORLD.md: **paste the new WORLD.md in whenever it changes**.
- `alien/` — Alien Lab: `name`, `portrait` (streamed), `review` (13i's Continuance Review, owner only)
- The one-time `admin/seed-assignment-*` story loaders were removed in Update 5.8 (they were unauthenticated GET routes). Load future stories the same way if needed, then delete the route straight after.

## Theming system
`lib/theme.js` exports `ACTIVE_THEME`, a single string controlling the
site-wide look. `ThemedBackground.js` (ambient, non-hero pages) and
`ThemedHero.js` (logo + background together, for the countdown/launch
hero) both switch on this value. Changing the live look is a one-line edit
— see DESIGN.md for the full list of themes.

## Known discrepancy worth resolving
`components/ThirteenIVsNemesis.js` is a React reimplementation of the 13i
vs NEMESIS game that is **not wired into any route**. The live game at
`/games/13i-vs-nemesis` uses an iframe to the standalone
`public/games/13i-vs-nemesis.html` file instead. Unclear whether the React
version is an abandoned earlier attempt or intended for a future swap —
flagged here rather than assumed either way.

## Deployment
Claude builds/edits in a sandboxed copy of this repo → zips the changed
top-level folders → Paul downloads, deletes the old folders in his local
checkout, replaces them wholesale (folder merges have caused partial-update
bugs before) → commits and pushes via GitHub Desktop → Vercel auto-deploys.
Any new Supabase schema is handed over as plain SQL to paste into the SQL
Editor, since it isn't part of the deployed code.
