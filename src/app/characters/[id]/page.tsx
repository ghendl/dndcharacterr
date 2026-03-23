import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DiceRoller } from '@/components/dice/DiceRoller';
import { formatModifier, getAbilityModifier } from '@/types/dnd';

export default async function CharacterDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: character, error } = await supabase.from('characters').select('*').eq('id', params.id).single();

  if (error || !character) {
    notFound();
  }

  const abilities = [
    ['STR', character.strength],
    ['DEX', character.dexterity],
    ['CON', character.constitution],
    ['INT', character.intelligence],
    ['WIS', character.wisdom],
    ['CHA', character.charisma]
  ] as const;

  return (
    <section className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card-dnd p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-text-muted)]">Level {character.level}</p>
          <h1 className="mt-2 text-4xl text-[var(--color-parchment)]">{character.name}</h1>
          <p className="mt-2 text-[var(--color-text-muted)]">{character.species} {character.character_class}</p>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            {abilities.map(([label, score]) => (
              <div className="stat-box p-3" key={label}>
                <div className="text-xs uppercase tracking-widest text-[var(--color-text-muted)]">{label}</div>
                <div className="mt-1 text-3xl">{score}</div>
                <div className="text-sm text-[var(--color-text-muted)]">{formatModifier(getAbilityModifier(score))}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="card-dnd p-6">
          <h2 className="text-2xl">Combat</h2>
          <div className="mt-4 space-y-3 text-[var(--color-text-muted)]">
            <div>HP: {character.hit_points_current}/{character.hit_points_max}</div>
            <div>AC: {character.armor_class}</div>
            <div>Speed: {character.speed} ft</div>
            <div>Proficiency: +{character.proficiency_bonus}</div>
          </div>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <DiceRoller characterId={character.id} />
        <div className="card-dnd p-6">
          <h2 className="text-2xl">Notes</h2>
          <p className="mt-4 whitespace-pre-wrap text-[var(--color-text-muted)]">{character.notes ?? 'No notes yet.'}</p>
        </div>
      </div>
    </section>
  );
}
