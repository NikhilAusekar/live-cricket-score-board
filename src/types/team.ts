// src/types/team.ts
export interface Team {
  id: string;
  name: string;
  captainId?: string; // Optional: ID of the captain player
  captainName?: string; // Optional: Name of the captain player (if populated from player data)
  // Add any other team properties like logoUrl, etc.
}

export interface CreateTeamPayload {
  name: string;
  captainId?: string;
}

export interface UpdateTeamPayload {
  id: string;
  name?: string;
  captainId?: string;
}