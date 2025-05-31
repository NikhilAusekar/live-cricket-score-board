// src/hooks/useMatches.ts
import { useState, useEffect, useCallback } from 'react';
import matchService from '../services/matchService';
import { useAuth } from '../contexts/AuthContext';
import type { Match, MatchStatus } from '../types/match';

interface UseMatchesResult {
  match: Match | null;
  loading: boolean;
  error: string | null;
  fetchMatch: (status?: MatchStatus) => Promise<void>;
  setMatch: (match: Match) => void;
  updateMatch: (updatedMatch: Match) => void;
  clearMatch: () => void;
}

const useMatches = (): UseMatchesResult => {
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth(); // Use this if you need an auth token

  const fetchMatch = useCallback(async (status?: MatchStatus) => {
    setLoading(true);
    setError(null);
    try {
      const data = await matchService.getMatches(status); // Adjust service to return a single match
      setMatch(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch match.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateMatch = useCallback((updatedMatch: Match) => {
    setMatch(updatedMatch);
  }, []);

  const clearMatch = useCallback(() => {
    setMatch(null);
  }, []);

  useEffect(() => {
    fetchMatch();
  }, [fetchMatch]);

  return {
    match,
    loading,
    error,
    fetchMatch,
    setMatch,
    updateMatch,
    clearMatch,
  };
};

export default useMatches;
