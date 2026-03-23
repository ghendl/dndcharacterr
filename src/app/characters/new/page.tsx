'use client';

export const dynamic = 'force-dynamic';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { BACKGROUND_FEATURES, CLASS_SAVING_THROWS, CLASS_SPELLCASTING_ABILITY, SUBCLASSES, type Background, type CharacterClass, type ProficiencyLevel, type SkillName, type Species } from '@/types/dnd';

const speciesList: Species[] = ['Aasimar', 'Dragonborn', 'Dwarf', 'Elf', 'Gnome', 'Goliath', 'Halfling', 'Human', 'Orc', 'Tiefling'];
const classList: CharacterClass[] = ['Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk', 'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard'];
const backgroundList: Background[] = ['Acolyte', 'Artisan', 'Charlatan', 'Criminal', 'Entertainer', 'Farmer', 'Guard', 'Guide', 'Hermit', 'Merchant', 'Noble', 'Sage', 'Sailor', 'Scribe', 'Soldier', 'Wayfarer'];
const standardScores = [15, 14, 13, 12, 10, 8];

function emptySkills(): Record<SkillName, ProficiencyLevel> {
  return {
    acrobatics: 'none', animal_handling: 'none', arcana: 'none', athletics: 'none',
    deception: 'none', history: 'none', insight: 'none', intimidation: 'none',
    investigation: 'none', medicine: 'none', nature: 'none', perception: 'none',
    performance: 'none', persuasion: 'none', religion: 'none', sleight_of_hand: 'none',
    stealth: 'none', survival: 'none'
  };
}

export default function NewCharacterPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<Species>('Human');
  const [characterClass, setCharacterClass] = useState<CharacterClass>('Fighter');
  const [background, setBackground] = useState<Background>('Guard');

  const abilityScores = useMemo(
    () => ({
      strength: standardScores[0],
      dexterity: standardScores[1],
      constitution: standardScores[2],
      intelligence: standardScores[3],
      wisdom: standardScores[4],
      charisma: standardScores[5]
    }),
    []
  );

  async function createCharacter() {
    setSaving(true);
    const supabase = createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      setSaving(false);
      router.push('/auth/login');
      return;
    }

    const { data, error } = await supabase
      .from('characters')
      .insert({
        user_id: user.id,
        name: name || 'Unnamed Hero',
        species,
        background,
        character_class: characterClass,
        subclass: SUBCLASSES[characterClass]?.[0] ?? null,
        level: 1,
        experience_points: 0,
        ...abilityScores,
        hit_points_max: 10,
        hit_points_current: 10,
        hit_points_temp: 0,
        armor_class: 10,
        initiative_bonus: 0,
        speed: 30,
        death_save_successes: 0,
        death_save_failures: 0,
        inspiration: false,
        proficiency_bonus: 2,
        saving_throw_proficiencies: CLASS_SAVING_THROWS[characterClass],
        skill_proficiencies: emptySkills(),
        equipment: [],
        currency: { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 },
        spellcasting_ability: CLASS_SPELLCASTING_ABILITY[characterClass] ?? null,
        spell_save_dc: null,
        spell_attack_bonus: null,
        spells_known: [],
        spell_slots: {},
        cantrips_known: [],
        features: [],
        traits: [],
        feats: BACKGROUND_FEATURES[background] ? [{ id: crypto.randomUUID(), name: BACKGROUND_FEATURES[background]!.feat, source: 'background', description: 'Granted by background.' }] : [],
        attacks: [],
        alignment: 'True Neutral',
        personality_traits: null,
        ideals: null,
        bonds: null,
        flaws: null,
        backstory: null,
        notes: null,
        age: null,
        height: null,
        weight: null,
        eyes: null,
        skin: null,
        hair: null,
        appearance_notes: null,
        portrait_url: null,
        is_public: false,
        share_token: crypto.randomUUID()
      })
      .select('id')
      .single();

    setSaving(false);
    if (error || !data) {
      alert(error?.message ?? 'Could not create character.');
      return;
    }

    router.push(`/characters/${data.id}`);
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="card-dnd p-6">
        <h1 className="text-3xl">Create character</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm text-[var(--color-text-muted)]">Name</label>
            <input className="input-dnd" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seraphina, Thorgar, Elian..." />
          </div>
          <div>
            <label className="mb-2 block text-sm text-[var(--color-text-muted)]">Species</label>
            <select className="input-dnd" value={species} onChange={(e) => setSpecies(e.target.value as Species)}>
              {speciesList.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm text-[var(--color-text-muted)]">Class</label>
            <select className="input-dnd" value={characterClass} onChange={(e) => setCharacterClass(e.target.value as CharacterClass)}>
              {classList.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm text-[var(--color-text-muted)]">Background</label>
            <select className="input-dnd" value={background} onChange={(e) => setBackground(e.target.value as Background)}>
              {backgroundList.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
        </div>
        <button className="btn-primary mt-6" onClick={() => void createCharacter()} type="button" disabled={saving}>
          {saving ? 'Creating...' : 'Create character'}
        </button>
      </div>
      <div className="card-dnd p-6">
        <h2 className="text-2xl">Preview</h2>
        <p className="mt-3 text-[var(--color-text-muted)]">{species} {characterClass}</p>
        <p className="mt-1 text-[var(--color-text-muted)]">Background: {background}</p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Object.entries(abilityScores).map(([label, value]) => (
            <div className="stat-box p-3" key={label}>
              <div className="text-xs uppercase tracking-widest text-[var(--color-text-muted)]">{label.slice(0, 3)}</div>
              <div className="mt-2 text-2xl">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
