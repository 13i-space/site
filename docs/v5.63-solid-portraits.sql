-- Update 5.63: solid-colour portraits.
-- Keeps each species' original line-art portrait when it's repainted in
-- solid colour (Sentinel-X > Aliens of the Galaxy > Repaint), so the two
-- looks can be compared with the Solid / Line art switch on the gallery.
-- Safe to run more than once.
alter table public.alien_species add column if not exists portrait_line_svg text;
