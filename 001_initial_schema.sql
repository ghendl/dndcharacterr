-- ============================================================
-- DnD Character Builder - Database Schema (D&D 2024 Rules)
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CHARACTERS
-- ============================================================
CREATE TABLE characters (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Basic Info
  name TEXT NOT NULL,
  species TEXT NOT NULL,          -- D&D 2024 uses "species" instead of "race"
  background TEXT NOT NULL,
  character_class TEXT NOT NULL,
  subclass TEXT,
  level INTEGER NOT NULL DEFAULT 1 CHECK (level BETWEEN 1 AND 20),
  experience_points INTEGER DEFAULT 0,
  
  -- Core Stats
  strength INTEGER NOT NULL DEFAULT 10 CHECK (strength BETWEEN 1 AND 30),
  dexterity INTEGER NOT NULL DEFAULT 10 CHECK (dexterity BETWEEN 1 AND 30),
  constitution INTEGER NOT NULL DEFAULT 10 CHECK (constitution BETWEEN 1 AND 30),
  intelligence INTEGER NOT NULL DEFAULT 10 CHECK (intelligence BETWEEN 1 AND 30),
  wisdom INTEGER NOT NULL DEFAULT 10 CHECK (wisdom BETWEEN 1 AND 30),
  charisma INTEGER NOT NULL DEFAULT 10 CHECK (charisma BETWEEN 1 AND 30),
  
  -- Combat Stats
  hit_points_max INTEGER NOT NULL DEFAULT 8,
  hit_points_current INTEGER NOT NULL DEFAULT 8,
  hit_points_temp INTEGER DEFAULT 0,
  armor_class INTEGER NOT NULL DEFAULT 10,
  initiative_bonus INTEGER DEFAULT 0,
  speed INTEGER DEFAULT 30,
  
  -- Death Saves
  death_save_successes INTEGER DEFAULT 0 CHECK (death_save_successes BETWEEN 0 AND 3),
  death_save_failures INTEGER DEFAULT 0 CHECK (death_save_failures BETWEEN 0 AND 3),
  
  -- Inspiration & Proficiency
  inspiration BOOLEAN DEFAULT FALSE,
  proficiency_bonus INTEGER GENERATED ALWAYS AS (
    CASE
      WHEN level BETWEEN 1 AND 4 THEN 2
      WHEN level BETWEEN 5 AND 8 THEN 3
      WHEN level BETWEEN 9 AND 12 THEN 4
      WHEN level BETWEEN 13 AND 16 THEN 5
      ELSE 6
    END
  ) STORED,
  
  -- Saving Throws Proficiencies (stored as array of stat names)
  saving_throw_proficiencies TEXT[] DEFAULT '{}',
  
  -- Skills (stored as JSONB: {skill_name: "proficient"|"expert"|"none"})
  skill_proficiencies JSONB DEFAULT '{}',
  
  -- Equipment & Inventory
  equipment JSONB DEFAULT '[]',
  currency JSONB DEFAULT '{"cp": 0, "sp": 0, "ep": 0, "gp": 0, "pp": 0}',
  
  -- Spellcasting
  spellcasting_ability TEXT,
  spell_save_dc INTEGER,
  spell_attack_bonus INTEGER,
  spells_known JSONB DEFAULT '[]',
  spell_slots JSONB DEFAULT '{}',
  cantrips_known JSONB DEFAULT '[]',
  
  -- Features & Traits
  features JSONB DEFAULT '[]',
  traits JSONB DEFAULT '[]',
  feats JSONB DEFAULT '[]',
  
  -- Attacks & Actions
  attacks JSONB DEFAULT '[]',
  
  -- Background / Roleplay
  alignment TEXT,
  personality_traits TEXT,
  ideals TEXT,
  bonds TEXT,
  flaws TEXT,
  backstory TEXT,
  notes TEXT,
  
  -- Appearance
  age TEXT,
  height TEXT,
  weight TEXT,
  eyes TEXT,
  skin TEXT,
  hair TEXT,
  appearance_notes TEXT,
  portrait_url TEXT,
  
  -- Sharing
  is_public BOOLEAN DEFAULT FALSE,
  share_token TEXT UNIQUE DEFAULT uuid_generate_v4()::TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CHARACTER COMPANIONS / WILD SHAPE FORMS (for Druids, etc.)
-- ============================================================
CREATE TABLE character_companions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'familiar', 'beast_companion', 'wild_shape', etc.
  creature_type TEXT,
  stats JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- DICE ROLL HISTORY
-- ============================================================
CREATE TABLE dice_rolls (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  roll_type TEXT NOT NULL, -- 'attack', 'skill', 'saving_throw', 'damage', 'initiative', 'ability'
  dice_notation TEXT NOT NULL, -- e.g., '1d20+5', '2d6+3'
  rolls JSONB NOT NULL, -- array of individual die results
  modifier INTEGER DEFAULT 0,
  total INTEGER NOT NULL,
  label TEXT, -- e.g., 'Stealth Check', 'Longsword Attack'
  advantage_type TEXT CHECK (advantage_type IN ('normal', 'advantage', 'disadvantage')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_characters_user_id ON characters(user_id);
CREATE INDEX idx_characters_share_token ON characters(share_token);
CREATE INDEX idx_characters_is_public ON characters(is_public);
CREATE INDEX idx_dice_rolls_character_id ON dice_rolls(character_id);
CREATE INDEX idx_dice_rolls_user_id ON dice_rolls(user_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_companions ENABLE ROW LEVEL SECURITY;
ALTER TABLE dice_rolls ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (TRUE);

-- Characters policies
CREATE POLICY "Users can CRUD own characters" ON characters FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public characters viewable by all" ON characters FOR SELECT USING (is_public = TRUE);

-- Companions policies
CREATE POLICY "Users can CRUD own companions" ON character_companions FOR ALL
  USING (character_id IN (SELECT id FROM characters WHERE user_id = auth.uid()));

-- Dice rolls policies
CREATE POLICY "Users can CRUD own rolls" ON dice_rolls FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_characters_updated_at BEFORE UPDATE ON characters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
