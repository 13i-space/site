alter table assignment_submissions add column if not exists type text not null default 'human';
alter table assignment_submissions add column if not exists cover_url text;
alter table assignment_submissions add column if not exists thumb_url text;

-- The hub and reader pages need to publicly read canon/archived
-- assignments (they use the regular, RLS-bound client, not the admin
-- one). Submissions still only get IN via the server's service-role key.
create policy "canon and archived assignments are public" on assignment_submissions
  for select using (status in ('canon', 'archived'));

-- Storage bucket for optional story covers (both AI-originated and any
-- human writer who wants to upload one). Same pattern as avatars:
-- Storage -> New bucket -> name it exactly "assignment-covers" -> Public -> Save.
-- Then run:
create policy "Assignment covers are publicly accessible" on storage.objects
  for select using (bucket_id = 'assignment-covers');
create policy "Users can upload their own assignment covers" on storage.objects
  for insert with check (bucket_id = 'assignment-covers' and auth.uid()::text = (storage.foldername(name))[1]);
