// src/hooks/useTeams.ts
import { useState, useEffect, useCallback } from 'react';
import {type Team } from '../types/team';
import teamService from '../services/teamService';

interface UseTeamsResult {
  teams: Team[];
  loading: boolean;
  error: string | null;
  fetchTeams: () => Promise<void>;
  addTeam: (team: Team) => void;
  updateTeamInList: (team: Team) => void;
  removeTeam: (id: string) => void;
}

const useTeams = (): UseTeamsResult => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeams = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await teamService.getTeams();
      setTeams(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch teams.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTeam = useCallback((newTeam: Team) => {
    setTeams((prev) => [...prev, newTeam]);
  }, []);

  const updateTeamInList = useCallback((updatedTeam: Team) => {
    setTeams((prev) =>
      prev.map((team) => (team.id === updatedTeam.id ? updatedTeam : team))
    );
  }, []);

  const removeTeam = useCallback((id: string) => {
    setTeams((prev) => prev.filter((team) => team.id !== id));
  }, []);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  return { teams, loading, error, fetchTeams, addTeam, updateTeamInList, removeTeam };
};

export default useTeams;