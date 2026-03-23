// ============================================================
// D&D 2024 Character Types
// ============================================================

export type Species =
  | 'Aasimar' | 'Dragonborn' | 'Dwarf' | 'Elf' | 'Gnome'
  | 'Goliath' | 'Halfling' | 'Human' | 'Orc' | 'Tiefling';

export type CharacterClass =
  | 'Barbarian' | 'Bard' | 'Cleric' | 'Druid' | 'Fighter'
  | 'Monk' | 'Paladin' | 'Ranger' | 'Rogue' | 'Sorcerer'
  | 'Warlock' | 'Wizard';

export type Background =
  | 'Acolyte' | 'Artisan' | 'Charlatan' | 'Criminal' | 'Entertainer'
  | 'Farmer' | 'Guard' | 'Guide' | 'Hermit' | 'Merchant'
  | 'Noble' | 'Sage' | 'Sailor' | 'Scribe' | 'Soldier'
  | 'Wayfarer';

export type Alignment =
  | 'Lawful Good' | 'Neutral Good' | 'Chaotic Good'
  | 'Lawful Neutral' | 'True Neutral' | 'Chaotic Neutral'
  | 'Lawful Evil' | 'Neutral Evil' | 'Chaotic Evil';

export type AbilityScore = 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma';

export type SkillName =
  | 'acrobatics' | 'animal_handling' | 'arcana' | 'athletics'
  | 'deception' | 'history' | 'insight' | 'intimidation'
  | 'investigation' | 'medicine' | 'nature' | 'perception'
  | 'performance' | 'persuasion' | 'religion' | 'sleight_of_hand'
  | 'stealth' | 'survival';

export type ProficiencyLevel = 'none' | 'proficient' | 'expert';
export type AdvantageType = 'normal' | 'advantage' | 'disadvantage';

export interface Currency {
  cp: number; // Copper
  sp: number; // Silver
  ep: number; // Electrum
  gp: number; // Gold
  pp: number; // Platinum
}

export interface SpellSlots {
  [level: number]: { total: number; used: number };
}

export interface Spell {
  id: string;
  name: string;
  level: number; // 0 = cantrip
  school: string;
  prepared?: boolean;
}

export interface Attack {
  id: string;
  name: string;
  attack_bonus: number;
  damage_dice: string;
  damage_type: string;
  range: string;
  properties: string[];
  notes?: string;
}

export interface Feature {
  id: string;
  name: string;
  source: string; // 'class', 'species', 'background', 'feat'
  description: string;
  level?: number;
}

export interface EquipmentItem {
  id: string;
  name: string;
  quantity: number;
  weight?: number;
  notes?: string;
  equipped?: boolean;
}

export interface Character {
  id: string;
  user_id: string;

  // Basic Info
  name: string;
  species: Species;
  background: Background;
  character_class: CharacterClass;
  subclass?: string;
  level: number;
  experience_points: number;

  // Ability Scores
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;

  // Combat
  hit_points_max: number;
  hit_points_current: number;
  hit_points_temp: number;
  armor_class: number;
  initiative_bonus: number;
  speed: number;
  death_save_successes: number;
  death_save_failures: number;
  inspiration: boolean;
  proficiency_bonus: number;

  // Proficiencies
  saving_throw_proficiencies: AbilityScore[];
  skill_proficiencies: Record<SkillName, ProficiencyLevel>;

  // Equipment
  equipment: EquipmentItem[];
  currency: Currency;

  // Spellcasting
  spellcasting_ability?: AbilityScore;
  spell_save_dc?: number;
  spell_attack_bonus?: number;
  spells_known: Spell[];
  spell_slots: SpellSlots;
  cantrips_known: Spell[];

  // Features
  features: Feature[];
  traits: Feature[];
  feats: Feature[];
  attacks: Attack[];

  // Roleplay
  alignment?: Alignment;
  personality_traits?: string;
  ideals?: string;
  bonds?: string;
  flaws?: string;
  backstory?: string;
  notes?: string;

  // Appearance
  age?: string;
  height?: string;
  weight?: string;
  eyes?: string;
  skin?: string;
  hair?: string;
  appearance_notes?: string;
  portrait_url?: string;

  // Sharing
  is_public: boolean;
  share_token: string;

  created_at: string;
  updated_at: string;
}

export type CharacterFormData = Omit<Character, 'id' | 'user_id' | 'proficiency_bonus' | 'share_token' | 'created_at' | 'updated_at'>;

export interface DiceRoll {
  id: string;
  character_id?: string;
  user_id: string;
  roll_type: 'attack' | 'skill' | 'saving_throw' | 'damage' | 'initiative' | 'ability';
  dice_notation: string;
  rolls: number[];
  modifier: number;
  total: number;
  label?: string;
  advantage_type: AdvantageType;
  created_at: string;
}

export interface Profile {
  id: string;
  username?: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

// ============================================================
// D&D 2024 Game Data
// ============================================================

export const ABILITY_SCORES: AbilityScore[] = [
  'strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'
];

export const SKILLS: Record<SkillName, AbilityScore> = {
  acrobatics: 'dexterity',
  animal_handling: 'wisdom',
  arcana: 'intelligence',
  athletics: 'strength',
  deception: 'charisma',
  history: 'intelligence',
  insight: 'wisdom',
  intimidation: 'charisma',
  investigation: 'intelligence',
  medicine: 'wisdom',
  nature: 'intelligence',
  perception: 'wisdom',
  performance: 'charisma',
  persuasion: 'charisma',
  religion: 'intelligence',
  sleight_of_hand: 'dexterity',
  stealth: 'dexterity',
  survival: 'wisdom',
};

export const CLASS_HIT_DICE: Record<CharacterClass, number> = {
  Barbarian: 12,
  Fighter: 10,
  Paladin: 10,
  Ranger: 10,
  Bard: 8,
  Cleric: 8,
  Druid: 8,
  Monk: 8,
  Rogue: 8,
  Warlock: 8,
  Sorcerer: 6,
  Wizard: 6,
};

export const CLASS_SAVING_THROWS: Record<CharacterClass, AbilityScore[]> = {
  Barbarian: ['strength', 'constitution'],
  Bard: ['dexterity', 'charisma'],
  Cleric: ['wisdom', 'charisma'],
  Druid: ['intelligence', 'wisdom'],
  Fighter: ['strength', 'constitution'],
  Monk: ['strength', 'dexterity'],
  Paladin: ['wisdom', 'charisma'],
  Ranger: ['strength', 'dexterity'],
  Rogue: ['dexterity', 'intelligence'],
  Sorcerer: ['constitution', 'charisma'],
  Warlock: ['wisdom', 'charisma'],
  Wizard: ['intelligence', 'wisdom'],
};

export const CLASS_SPELLCASTING_ABILITY: Partial<Record<CharacterClass, AbilityScore>> = {
  Bard: 'charisma',
  Cleric: 'wisdom',
  Druid: 'wisdom',
  Paladin: 'charisma',
  Ranger: 'wisdom',
  Sorcerer: 'charisma',
  Warlock: 'charisma',
  Wizard: 'intelligence',
};

export const SUBCLASSES: Partial<Record<CharacterClass, string[]>> = {
  Barbarian: ['Path of the Berserker', 'Path of the Wild Heart', 'Path of the World Tree', 'Path of the Zealot'],
  Bard: ['College of Dance', 'College of Glamour', 'College of Lore', 'College of Valor'],
  Cleric: ['Life Domain', 'Light Domain', 'Trickery Domain', 'War Domain', 'Arcana Domain'],
  Druid: ['Circle of the Land', 'Circle of the Moon', 'Circle of the Sea', 'Circle of the Stars'],
  Fighter: ['Battle Master', 'Champion', 'Eldritch Knight', 'Psi Warrior'],
  Monk: ['Warrior of the Elements', 'Warrior of the Open Hand', 'Warrior of Shadow'],
  Paladin: ['Oath of Devotion', 'Oath of Glory', 'Oath of the Ancients', 'Oath of Vengeance'],
  Ranger: ['Beast Master', 'Fey Wanderer', 'Gloom Stalker', 'Hunter'],
  Rogue: ['Arcane Trickster', 'Assassin', 'Soulknife', 'Thief'],
  Sorcerer: ['Aberrant Sorcery', 'Clockwork Sorcery', 'Draconic Sorcery', 'Wild Magic Sorcery'],
  Warlock: ['Archfey Patron', 'Celestial Patron', 'Fiend Patron', 'Great Old One Patron'],
  Wizard: ['Abjurer', 'Diviner', 'Evoker', 'Illusionist'],
};

export const SPECIES_TRAITS: Partial<Record<Species, string[]>> = {
  Human: ['Resourceful (Heroic Inspiration)', 'Skillful (+1 skill proficiency)', 'Versatile (Origin Feat)'],
  Elf: ['Darkvision 60ft', 'Elven Lineage', 'Fey Ancestry', 'Keen Senses', 'Trance'],
  Dwarf: ['Darkvision 120ft', 'Dwarven Resilience', 'Dwarven Toughness', 'Stonecunning'],
  Halfling: ['Brave', 'Halfling Nimbleness', 'Luck', 'Naturally Stealthy'],
  Gnome: ['Darkvision 60ft', 'Gnomish Cunning', 'Gnomish Lineage'],
  Tiefling: ['Darkvision 60ft', 'Fiendish Legacy', 'Otherworldly Presence'],
  Dragonborn: ['Draconic Ancestry', 'Breath Weapon', 'Damage Resistance'],
  Aasimar: ['Celestial Revelation', 'Darkvision 60ft', 'Healing Hands', 'Light Bearer'],
  Orc: ['Adrenaline Rush', 'Darkvision 120ft', 'Powerful Build', 'Relentless Endurance'],
  Goliath: ['Giant Ancestry', 'Large Form', 'Powerful Build'],
};

export const BACKGROUND_FEATURES: Partial<Record<Background, { ability_scores: AbilityScore[], skill_proficiencies: SkillName[], feat: string }>> = {
  Acolyte: { ability_scores: ['intelligence', 'wisdom', 'charisma'], skill_proficiencies: ['insight', 'religion'], feat: 'Magic Initiate (Cleric)' },
  Artisan: { ability_scores: ['strength', 'dexterity', 'intelligence'], skill_proficiencies: ['investigation', 'persuasion'], feat: 'Crafter' },
  Charlatan: { ability_scores: ['dexterity', 'constitution', 'charisma'], skill_proficiencies: ['deception', 'sleight_of_hand'], feat: 'Skilled' },
  Criminal: { ability_scores: ['dexterity', 'constitution', 'intelligence'], skill_proficiencies: ['deception', 'stealth'], feat: 'Alert' },
  Entertainer: { ability_scores: ['strength', 'dexterity', 'charisma'], skill_proficiencies: ['acrobatics', 'performance'], feat: 'Musician' },
  Farmer: { ability_scores: ['strength', 'constitution', 'wisdom'], skill_proficiencies: ['animal_handling', 'nature'], feat: 'Tough' },
  Guard: { ability_scores: ['strength', 'intelligence', 'wisdom'], skill_proficiencies: ['athletics', 'perception'], feat: 'Alert' },
  Hermit: { ability_scores: ['constitution', 'wisdom', 'charisma'], skill_proficiencies: ['medicine', 'religion'], feat: 'Magic Initiate (Druid)' },
  Noble: { ability_scores: ['strength', 'intelligence', 'charisma'], skill_proficiencies: ['history', 'persuasion'], feat: 'Skilled' },
  Sage: { ability_scores: ['constitution', 'intelligence', 'wisdom'], skill_proficiencies: ['arcana', 'history'], feat: 'Magic Initiate (Wizard)' },
  Sailor: { ability_scores: ['strength', 'dexterity', 'wisdom'], skill_proficiencies: ['athletics', 'perception'], feat: 'Tavern Brawler' },
  Soldier: { ability_scores: ['strength', 'dexterity', 'constitution'], skill_proficiencies: ['athletics', 'intimidation'], feat: 'Savage Attacker' },
  Wayfarer: { ability_scores: ['dexterity', 'wisdom', 'charisma'], skill_proficiencies: ['insight', 'stealth'], feat: 'Lucky' },
  Guide: { ability_scores: ['dexterity', 'constitution', 'wisdom'], skill_proficiencies: ['stealth', 'survival'], feat: 'Magic Initiate (Druid)' },
  Merchant: { ability_scores: ['constitution', 'intelligence', 'charisma'], skill_proficiencies: ['animal_handling', 'persuasion'], feat: 'Lucky' },
  Scribe: { ability_scores: ['dexterity', 'intelligence', 'wisdom'], skill_proficiencies: ['investigation', 'perception'], feat: 'Skilled' },
};

// Helper functions
export function getAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function getProficiencyBonus(level: number): number {
  return Math.ceil(level / 4) + 1;
}

export function formatModifier(mod: number): string {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}
