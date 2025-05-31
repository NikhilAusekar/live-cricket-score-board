// src/types/player.ts
//export type PlayerRole = 'Batsman' | 'Bowler' | 'All-rounder' | 'Wicketkeeper';

export const PlayerRoles = ['Batsman', 'Bowler', 'AllRounder', 'WicketKeeper'] as const;
export type PlayerRole = typeof PlayerRoles[number];

export interface Player {
  id: string;
  name: string;
  teamId: string; // ID of the team the player belongs to
  teamName?: string; // Optional: Name of the team (if populated from team data)
  role: PlayerRole;
  // Add any other player properties like battingStyle, bowlingStyle, imageUrl, etc.
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