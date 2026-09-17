-- Adds the guided-builder fields to assignment_submissions, plus a
-- status column for the submitted -> archived -> canon curation pipeline
-- (curation itself is just editing this column directly in Table Editor
-- for now - no admin UI yet).
alter table assignment_submissions add column if not exists designation text;
alter table assignment_submissions add column if not exists origin text;
alter table assignment_submissions add column if not exists destination text;
alter table assignment_submissions add column if not exists era text;
alter table assignment_submissions add column if not exists category text;
alter table assignment_submissions add column if not exists objective text;
alter table assignment_submissions add column if not exists status text not null default 'submitted';
