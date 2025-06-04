
//export type MatchStatus = 'Upcoming' | 'Live' | 'Completed';

import type { Batsman } from "./palyer";

//export type TossDecision = 'Bat' | 'Bowl';
export type WicketType = 'Bowled' | 'Caught' | 'Run Out' | 'LBW' | 'Stumped' | 'Hit Wicket' | 'Retired Hurt' | 'Obstructing the field' | 'Handled the ball' | 'Timed out';
export type BallEventType = 'Dot' | 'Single' | 'Two' | 'Three' | 'Four' | 'Six' | 'Wicket' | 'Wide' | 'No Ball' | 'Leg Byes' | 'Byes';

export const matchStatus = [
  'Upcoming',
  'Ongoing',
  'Completed',
  'Undefined'
] as const;

export const demoScore = {
      matchId: 'match001',
      team1: 'Team A',
      team2: 'Team B',
      team1Score: '0/0',
      team1Overs: '0.0',
      totalRuns: 80,
      wickets: 3,
      overs: 9.3,
      innings: 2,
      target: null,
      requiredRuns: 110,
      requiredBalls: 18,
      currentStriker: { name: 'Nikhil', runs: 35, balls: 40 },
      currentNonStriker: { name: 'Uday', runs: 45, balls: 30 },
      currentBowler: { name: 'Schin', overs: '2.0', runs: 0, wickets: 3 },
      currentBatsmen: [{
                      id: '23423',
                      name: 'Uday',
                      runs: 34,
                      balls: 23,
                      fours: 3,
                      sixes: 1,
                      isStriker: true,
                    },{
                      id: '23463',
                      name: 'Sachin',
                      runs: 34,
                      balls: 23,
                      fours: 3,
                      sixes: 1,
                      isStriker: true,
                    }],
      currentPartnership: 1,
      matchStatus: 'Ongoing',
      commentary: [],
    };

export type MatchStatus = typeof matchStatus[number];

export const tossDecision = [
  'Bat',
  'Bowl',
] as const;

export type TossDecision = typeof tossDecision[number];

export interface SelectOption {
  value: string;
  label: string;
}

export interface Player {
  name: string;
  runs: number;
  balls: number;
  strikeRate:number;
  isStriker:boolean;
}

export interface Bowler {
  name: string;
  overs: string; // e.g., "4.2"
  runs: number;
  wickets: number;
}

export const bowler: Bowler = {
  name: "",
  overs: "",
  runs: 0,
  wickets: 0
};


export interface BallEvent {
  runs: number;
  type: 'dot' | 'single' | 'double' | 'triple' | 'four' | 'six' | 'wicket' | 'wide' | 'no-ball' | 'bye' | 'leg-bye';
}

export interface CommentaryEvent {
  type: string; // ISO format preferred
  text: string;
}

// export interface LiveMatchScore {
//   matchId: string;
//   team1: string;
//   team2: string;
//   team1Score: string;
//   team1Overs: string;
//   totalRuns: number;
//   wickets: number;
//   overs: number;
//   innings: 1 | 2;
//   target: number | null;
//   requiredRuns: number;
//   requiredBalls: number;
//   currentStriker: Player;
//   currentNonStriker: Player;
//   currentBowler: Bowler;
//   currentBatsmen: Batsman[];
//   currentPartnership: number;
//   lastWicket?: FallOfWicket;
//   // lastSixBalls: BallEvent[];
//   matchStatus: 'Upcoming' | 'Ongoing' | 'Completed';
//   commentary: CommentaryEvent[];
//   // Additional optional properties
//   extras?: number;
//   fallOfWickets?: FallOfWicket[];
// }


export interface PlayerScore {
  playerId: string;
  playerName: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number; // calculated
  isOut: boolean;
  dismissalType?: WicketType;
  bowlerId?: string;
  bowlerName?: string;
  fielderId?: string;
  fielderName?: string;
}

export interface BowlerStats {
  playerId: string;
  playerName: string;
  overs: number; // e.g., 5.3
  maidens: number;
  runsGiven: number;
  wicketsTaken: number;
  economy: number; // calculated
}

export interface BallEvent {
  ballNumber: number; // within the over
  overNumber: number; // total over number
  runsScored: number; // runs from this ball, including extras
  eventType: BallEventType; // 'Dot', 'Single', 'Four', 'Wicket', 'Wide', etc.
  isWicket: boolean;
  wicketDetails?: {
    batsmanOutId: string;
    batsmanOutName: string;
    wicketType: WicketType;
    bowlerId?: string;
    fielderId?: string;
  };
  extrasType?: 'Wide' | 'No Ball' | 'Leg Byes' | 'Byes';
  extraRuns?: number; // additional runs from wide/no ball
  commentary: string; // Ball-by-ball commentary
}

export interface FallOfWicket {
  wicketNumber: number;
  score: number;
  over: number;
  batsmanOutId: string;
  batsmanOutName: string;
  bowlerId?: string;
  bowlerName?: string;
  fielderId?: string;
  fielderName?: string;
  wicketType: WicketType;
}

export interface Innings {
  inningsNumber: 1 | 2;
  battingTeamId: string;
  battingTeamName: string;
  bowlingTeamId: string;
  bowlingTeamName: string;
  totalRuns: number;
  wicketsLost: number;
  oversBowled: number; // e.g., 10.0 or 9.5
  playersScore: PlayerScore[]; // Detailed scores of batsmen in this innings
  bowlerStats: BowlerStats[]; // Detailed stats of bowlers in this innings
  fallOfWickets: FallOfWicket[];
  extras: {
    wides: number;
    noBalls: number;
    byes: number;
    legByes: number;
    penalties: number;
  };
  isCompleted: boolean;
}

export interface Match {
  id: string;
  name: string; // e.g., "Semi-Final 1"
  date: string; 
  venue: string;
  team1Id: string;
  team1Name: string;
  team2Id: string;
  team2Name: string;
  battingTeamName:string;
  oversPerInnings: number;
  status: MatchStatus;
  tossWinnerId?: string;
  tossWinnerName?: string;
  tossDecision?: TossDecision;
  manOfTheMatchPlayerId?: string;
  manOfTheMatchName?: string;
  currentInnings?: Innings;
  target?: number;
  winningTeamId?: string;
  winningTeamName?: string;
  resultDetails?: string;
  matchScore?: LiveMatchScore;
}

export interface LiveMatchScore {
  totalRuns: number;
  wickets: number;
  overs: number;
  innings: 1 | 2;
  requiredRuns: number;
  requiredBalls: number;
  currentBatsmen:Batsman[];
  currentBowler: Bowler;
  currentPartnership: number;
  lastWicket?: FallOfWicket;
  matchStatus: 'Upcoming' | 'Ongoing' | 'Completed'; 
  commentary: CommentaryEvent[];
  extras?: number;
  fallOfWickets?: FallOfWicket[];
}

// Payloads for creating/updating matches
export interface CreateMatchPayload {
  name: string;
  date: string;
  venue: string;
  team1Id: string;
  team2Id: string;
  oversPerInnings: number;
  status: MatchStatus;
  tossWinnerId?: string;
  tossDecision?: TossDecision;
}

export interface UpdateMatchPayload {
  id: string;
  name?: string;
  date?: string;
  venue?: string;
  team1Id?: string;
  team2Id?: string;
  oversPerInnings?: number;
  status?: MatchStatus;
  tossWinnerId?: string;
  tossDecision?: TossDecision;
  manOfTheMatchId?: string;
  winningTeamId?: string;
  resultDetails?: string;
}

// SignalR DTOs (Data Transfer Objects)
export interface LiveScoreUpdateDto {
  matchId: string;
  currentInnings: Innings;
  target?: number;
  matchStatus: MatchStatus;
  winningTeamId?: string;
  resultDetails?: string;
}

export interface BallUpdateDto {
  matchId: string;
  currentOver: number;
  currentBall: number;
  runsThisBall: number;
  ballEventType: BallEventType;
  isWicket: boolean;
  wicketDetails?: {
    batsmanOutId: string;
    wicketType: WicketType;
    bowlerId?: string;
    fielderId?: string;
  };
  extrasType?: 'Wide' | 'No Ball' | 'Leg Byes' | 'Byes';
  extraRuns?: number;
  commentary: string;
  // Send current batsmen and bowler simplified
  strikerId: string;
  nonStrikerId: string;
  bowlerId: string;
  // And basic score
  currentScore: string; // "120/3"
  currentOvers: string; // "15.2"
  lastSixBalls: BallEventType[]; // For visualizer
}