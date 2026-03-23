import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Character } from '@/types/dnd';

export function useCharacter(id: string) {
  const supabase = createClient();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .eq('id', id)
      .single();
    if (error) setError(error.message);
    else setCharacter(data);
    setLoading(false);
  }, [id, supabase]);

  useEffect(() => { load(); }, [load]);

  const update = useCallback(async (fields: Partial<Character>) => {
    if (!character) return;
    setSaving(true);
    const optimistic = { ...character, ...fields };
    setCharacter(optimistic);
    const { error } = await supabase
      .from('characters')
      .update(fields)
      .eq('id', character.id);
    if (error) {
      setError(error.message);
      setCharacter(character); // rollback
    }
    setSaving(false);
  }, [character, supabase]);

  const deleteCharacter = useCallback(async () => {
    if (!character) return false;
    const { error } = await supabase
      .from('characters')
      .delete()
      .eq('id', character.id);
    return !error;
  }, [character, supabase]);

  return { character, loading, saving, error, update, deleteCharacter, reload: load };
}
