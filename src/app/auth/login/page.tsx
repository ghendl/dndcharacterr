'use client';

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setMessage(error ? error.message : 'Logged in. You can now open /characters.');
  }

  return (
    <div className="mx-auto max-w-md card-dnd p-6">
      <h1 className="text-3xl">Login</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <input className="input-dnd" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" />
        <input className="input-dnd" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
        <button className="btn-primary" type="submit">Sign in</button>
      </form>
      {message ? <p className="mt-4 text-sm text-[var(--color-text-muted)]">{message}</p> : null}
      <p className="mt-4 text-sm text-[var(--color-text-muted)]">
        Need an account? <Link href="/auth/register" className="text-[var(--color-gold)]">Register</Link>
      </p>
    </div>
  );
}
