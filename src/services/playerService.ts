// src/services/playerService.ts
import axios from 'axios';
import {type Player,type CreatePlayerPayload,type UpdatePlayerPayload } from '../types/palyer';
import {type ApiResponse } from '../types/common';

const API_BASE_URL =  'http://localhost:5000/api';

const playerService = {
  getPlayers: async (teamId?: string): Promise<Player[]> => {
    const params = teamId ? { teamId } : {};
    const response = await axios.get<ApiResponse<Player[]>>(`${API_BASE_URL}/players`, { params });
    return response.data.data;
  },

  getPlayerById: async (id: string): Promise<Player> => {
    const response = await axios.get<ApiResponse<Player>>(`${API_BASE_URL}/players/${id}`);
    return response.data.data;
  },

  createPlayer: async (payload: CreatePlayerPayload): Promise<Player> => {
    const response = await axios.post<ApiResponse<Player>>(`${API_BASE_URL}/players`, payload);
    return response.data.data;
  },

  updatePlayer: async (payload: UpdatePlayerPayload): Promise<Player> => {
    const response = await axios.put<ApiResponse<Player>>(`${API_BASE_URL}/players/${payload.id}`, payload);
    return response.data.data;
  },

  deletePlayer: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/players/${id}`);
  },
};

export default playerService;