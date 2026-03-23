'use client';

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({ email, password });
    setMessage(error ? error.message : 'Check your email to confirm your account.');
  }

  return (
    <div className="mx-auto max-w-md card-dnd p-6">
      <h1 className="text-3xl">Register</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <input className="input-dnd" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" />
        <input className="input-dnd" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
        <button className="btn-primary" type="submit">Create account</button>
      </form>
      {message ? <p className="mt-4 text-sm text-[var(--color-text-muted)]">{message}</p> : null}
      <p className="mt-4 text-sm text-[var(--color-text-muted)]">
        Already have an account? <Link href="/auth/login" className="text-[var(--color-gold)]">Login</Link>
      </p>
    </div>
  );
}
