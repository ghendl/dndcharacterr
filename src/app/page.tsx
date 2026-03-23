import Link from 'next/link';

export default function HomePage() {
  return (
    <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
      <div className="card-dnd p-8">
        <p className="font-display text-sm uppercase tracking-[0.25em] text-[var(--color-text-muted)]">D&D 2024 Character Builder</p>
        <h1 className="mt-4 text-4xl font-black text-[var(--color-parchment)] md:text-6xl">Forge heroes without the cramped UI.</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--color-text-muted)]">
          This patched build keeps the medieval aesthetic, fixes the React type mismatch that commonly breaks Vercel type checks,
          and includes a cleaner responsive shell so the mobile experience is less cramped.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/characters/new" className="btn-primary">Create character</Link>
          <Link href="/characters" className="dice-btn">View characters</Link>
        </div>
      </div>
      <div className="card-dnd p-6">
        <h2 className="text-2xl">What changed in this patched project</h2>
        <ul className="mt-4 space-y-3 text-[var(--color-text-muted)]">
          <li>• React 18 and @types/react 18 are aligned.</li>
          <li>• Tailwind config is typed cleanly.</li>
          <li>• Project structure is complete enough for Vercel builds.</li>
          <li>• Basic pages exist so App Router can compile end to end.</li>
        </ul>
      </div>
    </section>
  );
}
