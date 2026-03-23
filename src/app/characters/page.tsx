import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function CharactersPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="card-dnd p-6">
        <h1 className="text-3xl">Characters</h1>
        <p className="mt-4 text-[var(--color-text-muted)]">Please log in first.</p>
      </div>
    );
  }

  const { data: characters, error } = await supabase
    .from('characters')
    .select('id, name, species, character_class, level, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl">Your characters</h1>
          <p className="text-[var(--color-text-muted)]">A compact responsive list for Vercel-safe builds.</p>
        </div>
        <Link href="/characters/new" className="btn-primary">New character</Link>
      </div>
      {error ? <div className="card-dnd p-4 text-red-300">{error.message}</div> : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {(characters ?? []).map((character) => (
          <Link key={character.id} href={`/characters/${character.id}`} className="card-dnd p-5 transition hover:-translate-y-0.5">
            <h2 className="text-2xl text-[var(--color-parchment)]">{character.name}</h2>
            <p className="mt-2 text-[var(--color-text-muted)]">{character.species} {character.character_class} • Level {character.level}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
