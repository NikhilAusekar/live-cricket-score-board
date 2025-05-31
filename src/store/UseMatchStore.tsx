// src/store/useMatchStore.ts
import { create } from 'zustand';
import type { Match } from '../types/match';
import { matches } from '../types/common';

interface MatchStoreState {
  // Admin
  currentMatchScore: Match | null;
  setMatchScore: (score: Match) => void;
  updateMatchScore: (score: Match) => void;

  // Public/User
  liveMatchScore: Match | null;
  setLiveMatchScore: (score: Match) => void;
  updateLiveMatchScore: (updatedScore: Match) => void;
}

export const useMatchStore = create<MatchStoreState>((set) => ({
  // Admin
  currentMatchScore : matches as Match,

  setMatchScore: (score) => set({ currentMatchScore: score }),

  updateMatchScore: (updatedScore) =>
    set(() => ({ currentMatchScore: updatedScore })),

  // Public/User (Single Match Only)
  liveMatchScore: null,

  setLiveMatchScore: (score) => set({ liveMatchScore: score }),

  updateLiveMatchScore: (updatedScore) =>
    set((state) => {
      if (!state.liveMatchScore) {
        return { liveMatchScore: updatedScore };
      }
      return {
        liveMatchScore: {
          ...state.liveMatchScore,
          ...updatedScore,
        },
      };
    }),
}));
