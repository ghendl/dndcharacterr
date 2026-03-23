import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Forge of Fates',
  description: 'D&D 2024 character builder'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="stone-bg min-h-screen text-[var(--color-text)]">
        <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Link href="/" className="font-display text-xl tracking-wide text-[var(--color-gold)]">
              Forge of Fates
            </Link>
            <nav className="flex items-center gap-4 text-sm text-[var(--color-text-muted)]">
              <Link href="/characters">Characters</Link>
              <Link href="/characters/new">New Character</Link>
              <Link href="/auth/login">Login</Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
