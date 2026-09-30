-- Update 5.2: Alien Lab portraits.
-- Stores each saved species' Claude-drawn portrait (SVG markup) alongside it.
-- Existing row-level-security policies on alien_species already cover the new column.
alter table alien_species add column if not exists portrait_svg text;
