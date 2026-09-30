-- Update 5.12: forum order, the private Alpha forum, and private messages.
-- Run once in the Supabase SQL Editor (after v5.10). Safe to run again.

-- 1. Forum order and names
update forum_spaces set sort_order = 0, name = '13i Universe', description = 'Talk about anything in the universe.' where slug = '13i';
update forum_spaces set sort_order = 1 where slug = 'general';
update forum_spaces set sort_order = 2 where slug = 'book';
update forum_spaces set sort_order = 3 where slug = 'music';
update forum_spaces set sort_order = 4, name = 'Alpha Users Private Forum' where slug = 'alpha';

-- 2. The Alpha forum is private: only Alpha Users can read it too
drop policy if exists "threads are viewable by everyone" on forum_threads;
create policy "threads are viewable by everyone" on forum_threads for select
  using (not coalesce((select alpha_only from forum_spaces where id = space_id), false) or is_alpha(auth.uid()));

drop policy if exists "replies are viewable by everyone" on forum_replies;
create policy "replies are viewable by everyone" on forum_replies for select
  using (
    not coalesce((select s.alpha_only from forum_threads t join forum_spaces s on s.id = t.space_id where t.id = thread_id), false)
    or is_alpha(auth.uid())
  );

-- 3. Private messages between Kin
create table if not exists direct_messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references profiles(id) on delete cascade,
  recipient_id uuid not null references profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now(),
  read_at timestamptz,
  check (sender_id <> recipient_id)
);
create index if not exists direct_messages_recipient on direct_messages (recipient_id, created_at desc);
create index if not exists direct_messages_sender on direct_messages (sender_id, created_at desc);
alter table direct_messages enable row level security;

drop policy if exists "people read their own messages" on direct_messages;
create policy "people read their own messages" on direct_messages for select
  using (auth.uid() = sender_id or auth.uid() = recipient_id);
drop policy if exists "people send as themselves" on direct_messages;
create policy "people send as themselves" on direct_messages for insert
  with check (auth.uid() = sender_id);
drop policy if exists "recipients mark messages read" on direct_messages;
create policy "recipients mark messages read" on direct_messages for update
  using (auth.uid() = recipient_id) with check (auth.uid() = recipient_id);

-- a recipient can only change read_at, never the message itself
create or replace function protect_message() returns trigger
language plpgsql as $$
begin
  new.body := old.body;
  new.sender_id := old.sender_id;
  new.recipient_id := old.recipient_id;
  new.created_at := old.created_at;
  return new;
end $$;
drop trigger if exists message_protected on direct_messages;
create trigger message_protected before update on direct_messages
  for each row execute function protect_message();
