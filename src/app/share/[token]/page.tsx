import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function SharedCharacterPage({ params }: { params: { token: string } }) {
  const supabase = await createClient();
  const { data: character } = await supabase.from('characters').select('name, species, character_class, level, is_public').eq('share_token', params.token).single();

  if (!character || !character.is_public) {
    notFound();
  }

  return (
    <div className="card-dnd p-6">
      <h1 className="text-3xl">{character.name}</h1>
      <p className="mt-2 text-[var(--color-text-muted)]">{character.species} {character.character_class} • Level {character.level}</p>
    </div>
  );
}
