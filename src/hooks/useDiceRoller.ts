import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface RollResult {
  id: string;
  dice: string;
  results: number[];
  modifier: number;
  total: number;
  label?: string;
  advantageType: 'normal' | 'advantage' | 'disadvantage';
  isCrit?: boolean;
  isFumble?: boolean;
  timestamp: Date;
}

export function useDiceRoller(characterId?: string) {
  const supabase = createClient();
  const [history, setHistory] = useState<RollResult[]>([]);
  const [isRolling, setIsRolling] = useState(false);

  const rollDie = (sides: number) => Math.ceil(Math.random() * sides);

  const roll = useCallback(async (
    sides: number,
    count = 1,
    modifier = 0,
    label?: string,
    advantageType: 'normal' | 'advantage' | 'disadvantage' = 'normal'
  ): Promise<RollResult> => {
    setIsRolling(true);
    await new Promise(r => setTimeout(r, 350));

    let results: number[];
    let diceLabel: string;

    if (sides === 20 && advantageType !== 'normal') {
      const r1 = rollDie(20);
      const r2 = rollDie(20);
      const chosen = advantageType === 'advantage' ? Math.max(r1, r2) : Math.min(r1, r2);
      results = [chosen];
      diceLabel = advantageType === 'advantage' ? '2d20kh1' : '2d20kl1';
    } else {
      results = Array.from({ length: count }, () => rollDie(sides));
      diceLabel = `${count}d${sides}`;
    }

    const sum = results.reduce((a, b) => a + b, 0);
    const total = sum + modifier;
    const isCrit = count === 1 && sides === 20 && results[0] === 20;
    const isFumble = count === 1 && sides === 20 && results[0] === 1;

    const result: RollResult = {
      id: Math.random().toString(36).slice(2),
      dice: diceLabel,
      results,
      modifier,
      total,
      label,
      advantageType,
      isCrit,
      isFumble,
      timestamp: new Date(),
    };

    setHistory(h => [result, ...h].slice(0, 50));
    setIsRolling(false);

    // Persist
    if (characterId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const notation = `${diceLabel}${modifier !== 0 ? (modifier > 0 ? `+${modifier}` : modifier) : ''}`;
        await supabase.from('dice_rolls').insert({
          character_id: characterId,
          user_id: user.id,
          roll_type: 'ability',
          dice_notation: notation,
          rolls: results,
          modifier,
          total,
          label: label ?? null,
          advantage_type: advantageType,
        });
      }
    }

    return result;
  }, [characterId, supabase]);

  const clearHistory = () => setHistory([]);

  return { roll, history, isRolling, clearHistory };
}
