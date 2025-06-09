import type { Innings, Match } from "./match";

// src/types/common.ts
export type ApiResponse<T> = {
  data: T;
  message?: string;
  success: boolean;
};

export type PaginatedResponse<T> = {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
};

const inningsExample: Innings = {
  inningsNumber: 1,
  battingTeamId: 'team1',
  battingTeamName: 'Team A',
  bowlingTeamId: 'team2',
  bowlingTeamName: 'Team B',
  totalRuns: 152,
  wicketsLost: 5,
  oversBowled: 20.0,
  playersScore: [
    {
      playerId: 'player123',
      playerName: 'John Doe',
      runs: 45,
      balls: 38,
      fours: 4,
      sixes: 2,
      isOut: true,
      strikeRate: 34,
    },
  ],
  bowlerStats: [
    {
      playerId: "234",
      playerName: 'Mitchell Starc',
      overs: 4,
      maidens: 0,
      runsGiven: 30,
      wicketsTaken: 2,
      economy: 7.5,
    },
    // Add more BowlerStats entries as needed
  ],
  fallOfWickets: [
    {
      wicketNumber: 1,
      score: 42,
      over: 6.3,
      batsmanOutId: 'player123',
      batsmanOutName: 'John Doe',
      bowlerId: 'bowler456',
      bowlerName: 'Mitchell Starc',
      fielderId: 'fielder789',
      fielderName: 'Steve Smith',
      wicketType: 'Caught',
    },

  ],
  extras: {
    wides: 2,
    noBalls: 1,
    byes: 0,
    legByes: 3,
    penalties: 0,
  },
  isCompleted: true,
};


export const matches: Match = {
  id: 'match-001',
  name: 'Semi-Final 1',
  date: '2025-06-10T15:00:00Z',
  venue: 'Hyderabad',
  team1Id: 'team-001',
  team1Name: 'RCB',
  team2Id: 'team-002',
  team2Name: 'PBKS',
  oversPerInnings: 12,
  status: 'Ongoing',
  tossWinnerId: 'team-001',
  tossWinnerName: 'Team A',
  battingTeamName:'RCB',
  tossDecision: 'Bat',
  currentInnings: inningsExample,
  target: 0,
  matchScore: {
    totalRuns: 0,
    wickets: 0,
    overs: 0.0,
    innings: 1,
    requiredRuns: 0,
    requiredBalls: 0,
    currentBatsmen: [
      {
        id: 'player101',
        name: 'Nikhil',
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        strikeRate: parseFloat(((65 / 42) * 100).toFixed(2)),
        isStriker: true,
      },
      {
        id: 'player102',
        name: 'Uday',
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        strikeRate: parseFloat(((65 / 42) * 100).toFixed(2)),
        isStriker: false,
      },
    ],
    currentBowler: {
      name: 'Sachin',
      overs: "0.0",
      runs: 0,
      wickets: 0,
    },
    currentPartnership: 0,
    lastWicket: {
      wicketNumber: 1,
      score: 42,
      over: 6.3,
      batsmanOutId: 'player123',
      batsmanOutName: 'Vikas',
      bowlerId: 'bowler456',
      bowlerName: 'Nikhil',
      fielderId: 'fielder789',
      fielderName: 'Uday',
      wicketType: 'Caught',
    },
    matchStatus: 'Ongoing',
    commentary: [
      {
        text: 'Player A1 hits a boundary!',
        type: 'FOUR'
      }
    ],
    extras: 0,
    fallOfWickets: [
      {
        wicketNumber: 1,
        score: 42,
        over: 6.3,
        batsmanOutId: 'player123',
        batsmanOutName: 'John Doe',
        bowlerId: 'bowler456',
        bowlerName: 'Mitchell Starc',
        fielderId: 'fielder789',
        fielderName: 'Steve Smith',
        wicketType: 'Caught',
      }
    ]
  }
}
