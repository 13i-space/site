# Beta sign-up (Update 5.55, simplified in 5.57)

**5.57: no email service.** Paul chose not to add Resend. Requests are saved
in Supabase and listed on **Sentinel-X → Beta sign-ups** (with every email in
one copyable box). The only setup is the table, already created.

The rest of this file is kept for reference, in case email is wanted later.

# Beta sign-up: one-time setup (Update 5.55)

The countdown page (`/`) now has a "Become a Beta Kin" card. Each request is
saved in Supabase and emailed to pjdonaghy@gmail.com. Two things to do, once.

## 1. Create the table (Supabase, 2 minutes)
1. Open supabase.com -> your 13i project -> **SQL Editor** -> **New query**.
2. Paste the top half of `docs/v5.55-beta-and-kinbook.sql` (section 1,
   the `create table beta_requests ...` part) and press **Run**.

## 2. Turn on the email (Resend, about 5 minutes)
1. Go to **resend.com** and sign up **with pjdonaghy@gmail.com** (important:
   until you verify a domain, Resend can only deliver to the email you signed
   up with - which is exactly where these should go).
2. In Resend, left menu -> **API Keys** -> **Create API Key**.
   Name it `13i beta`, permission **Sending access**, domain **All domains**.
   Copy the key (starts with `re_`). You only see it once.
3. Open **vercel.com** -> the 13i project -> **Settings** ->
   **Environment Variables**. Add:
   - Key: `RESEND_API_KEY`  Value: the `re_...` key  Environments: all three ticked.
4. Vercel only picks up new variables on a new deploy: go to **Deployments**,
   open the "..." menu on the latest one and choose **Redeploy**.
5. Test it: open 13i.space, press **Request beta access**, use any email.
   You should get "13i beta request: ..." in your Gmail within a minute
   (check Spam the first time and mark it "Not spam").

Optional, later: verify 13i.space as a domain in Resend (Domains -> Add) and
set `BETA_NOTIFY_FROM` to e.g. `13i <beta@13i.space>` so it sends from your
own address.

## Seeing everyone who asked
Supabase -> SQL Editor:
`select email, name, why, created_at from beta_requests order by created_at desc;`
Each email also has Reply-To set to the person, so you can just hit Reply.

## Kinbook: the two anonymous messages
They're already hidden on the site. To delete them for good, run section 2
of `docs/v5.55-beta-and-kinbook.sql`: first the `select` (it should list
exactly the two), then remove the `-- ` from the `delete` lines and run them.
