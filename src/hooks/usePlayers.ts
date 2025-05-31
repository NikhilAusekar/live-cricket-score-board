// src/hooks/usePlayers.ts
import { useState, useEffect, useCallback } from 'react';
import { type Player } from '../types/palyer';
import playerService from '../services/playerService';

interface UsePlayersResult {
  players: Player[];
  loading: boolean;
  error: string | null;
  fetchPlayers: (teamId?: string) => Promise<void>;
  addPlayer: (player: Player) => void;
  updatePlayerInList: (player: Player) => void;
  removePlayer: (id: string) => void;
}

const usePlayers = (): UsePlayersResult => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlayers = useCallback(async (teamId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await playerService.getPlayers(teamId);
      setPlayers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch players.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addPlayer = useCallback((newPlayer: Player) => {
    setPlayers((prev) => [...prev, newPlayer]);
  }, []);

  const updatePlayerInList = useCallback((updatedPlayer: Player) => {
    setPlayers((prev) =>
      prev.map((player) => (player.id === updatedPlayer.id ? updatedPlayer : player))
    );
  }, []);

  const removePlayer = useCallback((id: string) => {
    setPlayers((prev) => prev.filter((player) => player.id !== id));
  }, []);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  return { players, loading, error, fetchPlayers, addPlayer, updatePlayerInList, removePlayer };
};

export default usePlayers;