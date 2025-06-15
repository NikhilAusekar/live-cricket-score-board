// src/types/player.ts
//export type PlayerRole = 'Batsman' | 'Bowler' | 'All-rounder' | 'Wicketkeeper';

export const PlayerRoles = ['Batsman', 'Bowler', 'AllRounder', 'WicketKeeper'] as const;
export type PlayerRole = typeof PlayerRoles[number];

export interface Player {
  id: string;
  name: string;
  teamId: string; 
  teamName?: string; 
  role: PlayerRole;
  
}

export interface CreatePlayerPayload {
  name: string;
  teamId: string;
  role: PlayerRole;
}

export interface UpdatePlayerPayload {
  id: string;
  name: string;
  teamId: string;
  role?: PlayerRole;
}

export interface Batsman {
  id: string;
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate:number;
  isStriker: boolean;
  // Add more stats like strikeRate
}