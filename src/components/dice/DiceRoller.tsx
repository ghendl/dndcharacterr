'use client';

import { useDiceRoller } from '@/hooks/useDiceRoller';

export function DiceRoller({ characterId }: { characterId?: string }) {
  const { roll, history, isRolling, clearHistory } = useDiceRoller(characterId);

  return (
    <div className="card-dnd p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xl">Dice Roller</h3>
        <button className="dice-btn" onClick={clearHistory} type="button">Clear</button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {[4, 6, 8, 10, 12, 20, 100].map((sides) => (
          <button
            key={sides}
            className="dice-btn"
            disabled={isRolling}
            onClick={() => void roll(sides, 1, 0, `d${sides}`)}
            type="button"
          >
            d{sides}
          </button>
        ))}
      </div>
      <div className="mt-4 space-y-2 text-sm text-[var(--color-text-muted)]">
        {history.length === 0 ? <p>No rolls yet.</p> : null}
        {history.map((item) => (
          <div key={item.id} className="rounded border border-[var(--color-border)] p-2">
            <strong className="text-[var(--color-parchment)]">{item.dice}</strong> → {item.total} [{item.results.join(', ')}]
          </div>
        ))}
      </div>
    </div>
  );
}
