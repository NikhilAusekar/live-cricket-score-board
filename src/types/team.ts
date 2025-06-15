// src/types/team.ts
export interface Team {
  id: string;
  name: string;
  captainId?: string; 
  captainName?: string; 
}

export interface TeamOptions{
  Label:string;
  Value:string;
}

export interface PlayerOptions{
  Label:string;
  Value:string;
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