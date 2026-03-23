-- ============================================================
-- DnD Character Builder - Seed Data (opcional)
-- Solo ejecutar en desarrollo para tener datos de ejemplo
-- ============================================================

-- Nota: Este seed asume que ya existe al menos un usuario.
-- Reemplazá 'YOUR_USER_ID_HERE' con un UUID real de auth.users

-- Ejemplo de inserción de personaje de prueba:
/*
INSERT INTO characters (
  user_id,
  name, species, background, character_class, subclass, level,
  strength, dexterity, constitution, intelligence, wisdom, charisma,
  hit_points_max, hit_points_current, armor_class, speed,
  alignment, personality_traits, ideals, bonds, flaws,
  saving_throw_proficiencies, skill_proficiencies,
  spellcasting_ability,
  is_public
) VALUES (
  'YOUR_USER_ID_HERE',
  'Thalindra Moonwhisper',
  'Elf',
  'Sage',
  'Wizard',
  'Evoker',
  5,
  8, 14, 12, 18, 16, 10,
  22, 22, 12, 30,
  'True Neutral',
  'Analizo todo metódicamente antes de actuar.',
  'El conocimiento es poder, y el poder trae responsabilidad.',
  'Mi antigua biblioteca y los textos que contiene.',
  'A veces me obsesiono tanto con el conocimiento que olvido a las personas.',
  ARRAY['intelligence', 'wisdom'],
  '{"arcana": "expert", "history": "proficient", "investigation": "proficient", "perception": "proficient", "insight": "none", "athletics": "none", "acrobatics": "none", "stealth": "none", "deception": "none", "persuasion": "none", "intimidation": "none", "performance": "none", "sleight_of_hand": "none", "animal_handling": "none", "medicine": "none", "nature": "none", "religion": "proficient", "survival": "none"}'::jsonb,
  'intelligence',
  true
);
*/

-- View to get character summary with computed fields
CREATE OR REPLACE VIEW character_summary AS
SELECT
  c.id,
  c.user_id,
  c.name,
  c.species,
  c.character_class,
  c.subclass,
  c.level,
  c.hit_points_current,
  c.hit_points_max,
  c.armor_class,
  c.is_public,
  c.share_token,
  c.portrait_url,
  c.updated_at,
  p.display_name AS owner_name
FROM characters c
LEFT JOIN profiles p ON c.user_id = p.id;

-- Grant select on view
GRANT SELECT ON character_summary TO authenticated;
GRANT SELECT ON character_summary TO anon;
