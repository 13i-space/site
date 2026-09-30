-- Update 5.7: Alien Lab attribute points.
-- Each species saves how its creator split the points: Physical 100
-- (strength, endurance, agility, durability), Mental 100 (problem_solving,
-- memory, social, adaptability), Ecological & Sensory 50 (sensory,
-- specialization). Species saved before this get estimated stats from
-- their answers on the card (lib/alienStats.js).
-- Existing row-level-security policies on alien_species already cover the new column.
alter table alien_species add column if not exists stats jsonb;
