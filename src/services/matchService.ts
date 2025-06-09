// src/services/matchService.ts
import axios from 'axios';
import { type Match, type CreateMatchPayload, type UpdateMatchPayload } from '../types/match';
import { matches, type ApiResponse } from '../types/common';
import { type LiveScoreUpdateDto } from '../types/match'; // For SignalR DTOs if sending via REST

const API_BASE_URL = 'http://localhost:5000/api';

const matchService = {
  getMatches: async (status?: string): Promise<Match> => {
    // const params = status ? { status } : {};
    // const response = await axios.get<ApiResponse<Match[]>>(`${API_BASE_URL}/matches`, { params });
    // return response.data.data;
    const match = localStorage.getItem('match-store');
    if (match) {
      const parsedMatch = JSON.parse(match);
      return parsedMatch;
    } else {
      return matches as any;
    }
  },

  createMatch: async (payload: CreateMatchPayload): Promise<Match> => {
    const response = await axios.post<ApiResponse<Match>>(`${API_BASE_URL}/matches`, payload);
    return response.data.data;
  },

  updateMatch: async (payload: UpdateMatchPayload): Promise<Match> => {
    const response = await axios.put<ApiResponse<Match>>(`${API_BASE_URL}/matches/${payload.id}`, payload);
    return response.data.data;
  },

  deleteMatch: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/matches/${id}`);
  },

  // REST API endpoints for live score updates (if SignalR is not the only source for admin)
  // For admin, you'd typically send updates via SignalR, but a REST fallback might exist.
  // For example, to initially set the score or update complex states.
  updateLiveScoreViaRest: async (matchId: string, updateData: Partial<LiveScoreUpdateDto>): Promise<Match> => {
    const response = await axios.put<ApiResponse<Match>>(`${API_BASE_URL}/matches/${matchId}/live-update`, updateData);
    return response.data.data;
  },
};

export default matchService;