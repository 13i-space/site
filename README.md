# 13i — website starter

A Next.js starter for the 13i site: countdown homepage, Book/Music placeholders,
and a working Oracle chatbot wired through a secure server-side route.

## Run it locally

```
npm install
npm run dev
```

Then open http://localhost:3000

The Oracle page will show a "missing ANTHROPIC_API_KEY" error until you add a key —
see below.

## Give the Oracle a real API key (local testing)

1. Copy `.env.local.example` to `.env.local`
2. Get a key at https://console.anthropic.com/settings/keys
3. Paste it into `.env.local` as `ANTHROPIC_API_KEY=sk-ant-...`
4. Restart `npm run dev`

`.env.local` is already in `.gitignore` — it will never get committed or pushed
to GitHub. This matters: never put an API key directly in a React component or
any file that ends up in the browser. The whole point of `app/api/oracle/route.js`
is that it runs on the server, so the key stays private.

## Push to GitHub

```
git init
git add .
git commit -m "13i site starter"
```

Then create a new repository on GitHub and follow its instructions to push
(`git remote add origin ...`, `git push -u origin main`).

## Deploy on Vercel

1. Go to vercel.com, sign in with your GitHub account.
2. "Add New Project" -> pick this repository. Vercel auto-detects Next.js;
   you don't need to configure anything.
3. Before the first deploy (or right after), go to Project Settings ->
   Environment Variables, and add `ANTHROPIC_API_KEY` with your real key.
   This is the production equivalent of the `.env.local` step above.
4. Deploy. You'll get a free `something.vercel.app` URL immediately.

## Point your real domain at it

Once you've bought your domain (e.g. 13i.space):

1. In the Vercel project, go to Settings -> Domains, add your domain.
2. Vercel will show you DNS records to add.
3. Go to wherever the domain is registered (e.g. GoDaddy), find its DNS
   settings, and add the records Vercel gave you.
4. DNS changes can take anywhere from a few minutes to a few hours to
   take effect.

From this point on: every time you push a change to GitHub, Vercel
automatically rebuilds and publishes the live site. No manual file uploads,
ever.

## What's here vs. what's next

- `app/page.js` — homepage with live countdown to 4/6/2027
- `app/book/page.js`, `app/music/page.js` — placeholders, ready to fill in
- `app/oracle/page.js` + `components/OracleWidget.js` — working chatbot
- `app/api/oracle/route.js` — the secure server-side proxy to Anthropic's API
- `lib/oracleSystemPrompt.js` — 13i's voice, pulled from the canon bible's
  Section 5. Edit this file to update how 13i speaks everywhere at once.

Not yet built: the Ninefold, the Cryptex, the Pyraminx, the community pages,
the wiki. Each of those React components we've already prototyped can be
dropped into this structure the same way the Oracle was — as a new page
under `app/`, with any code needing an API key going through a new route
under `app/api/` rather than calling anything directly from the browser.
