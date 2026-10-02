-- Update 5.51: the Guestbook becomes the Kinbook.
-- Run once in Supabase: SQL Editor -> New query -> paste -> Run.

-- 1. Each message remembers which Kin wrote it (signed-in only from now on;
--    older messages keep a blank user_id).
alter table guestbook add column if not exists user_id uuid references profiles(id) on delete set null;

-- 2. Remove the message that was meant to be posted as 13i
--    ("Anonymous? Reveal yourself Kin.", 2 Oct 2026). Paul will repost it.
delete from guestbook where id = 4 and message = 'Anonymous? Reveal yourself Kin.';
