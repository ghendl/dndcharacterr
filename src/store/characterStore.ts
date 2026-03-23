import { create } from 'zustand';
import type { Character } from '@/types/dnd';

interface CharacterStore {
  characters: Character[];
  currentCharacter: Character | null;
  setCharacters: (chars: Character[]) => void;
  setCurrentCharacter: (char: Character | null) => void;
  updateCurrentCharacter: (fields: Partial<Character>) => void;
}

export const useCharacterStore = create<CharacterStore>((set) => ({
  characters: [],
  currentCharacter: null,
  setCharacters: (characters) => set({ characters }),
  setCurrentCharacter: (currentCharacter) => set({ currentCharacter }),
  updateCurrentCharacter: (fields) =>
    set((state) => ({
      currentCharacter: state.currentCharacter ? { ...state.currentCharacter, ...fields } : null
    }))
}));
