// src/services/teamService.ts
import axios from 'axios';
import type { CreateTeamPayload, Team, UpdateTeamPayload } from '../types/team';
import type { ApiResponse } from '../types/common';


const API_BASE_URL =  'http://localhost:5000/api';

const teamService = {
  getTeams: async (): Promise<Team[]> => {
    const response = await axios.get<ApiResponse<Team[]>>(`${API_BASE_URL}/teams`);
    return response.data.data; // Assuming API returns { data: T[], success: boolean }
  },

  getTeamById: async (id: string): Promise<Team> => {
    const response = await axios.get<ApiResponse<Team>>(`${API_BASE_URL}/teams/${id}`);
    return response.data.data;
  },

  createTeam: async (payload: CreateTeamPayload): Promise<Team> => {
    const response = await axios.post<ApiResponse<Team>>(`${API_BASE_URL}/teams`, payload);
    return response.data.data;
  },

  updateTeam: async (payload: UpdateTeamPayload): Promise<Team> => {
    const response = await axios.put<ApiResponse<Team>>(`${API_BASE_URL}/teams/${payload.id}`, payload);
    return response.data.data;
  },

  deleteTeam: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/teams/${id}`);
  },
};

export default teamService;