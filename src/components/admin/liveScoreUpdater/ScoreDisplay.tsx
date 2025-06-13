import React, { useEffect, useState } from 'react';
import type { Match } from '../../../types/match';
import { matches } from '../../../types/common';


interface ScoreDisplayProps {
  score: Match;
  updateMatchTeam: (newScore: Match) => void;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, updateMatchTeam }) => {
  const [editableScore, setEditableScore] = useState<Match>({ ...score });

  useEffect(() => {
    setEditableScore({ ...score });
  }, [score]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e?.preventDefault();
    const { name, value } = e.target as any;

    // Handle nested matchScore updates
  const matchScoreKeys: (keyof NonNullable<Match['matchScore']>)[] = [
    'totalRuns',
    'wickets',
    'overs',
    'currentPartnership',
    'requiredRuns',
    'requiredBalls',
  ];

  if (matchScoreKeys.includes(name)) {
    const key = name as keyof NonNullable<Match['matchScore']>;
    setEditableScore((prev:any) => ({
      ...prev,
      matchScore: {
        ...prev.matchScore,
        [key]: value,
      },
    }));
  } else {
    const key = name as keyof Match;
    setEditableScore((prev) => ({
      ...prev,
      [key]: key === "battingTeamName"? value: Number(value),
    }));
  }
};

const isExist = (value:any)=>{
    if(value)
      return true
    return false
}

const toggleBattingTeam = () => {
   const currentBattingTeamName =
    editableScore.team1Name === editableScore.battingTeamName
      ? editableScore.team2Name
      : editableScore.team1Name;

  const updateScore = {
    ...editableScore,
    battingTeamName: currentBattingTeamName,
    target: matchScore?.totalRuns ,
    matchScore: {...matchScore,inning:2}
  };

  const totalRuns = updateScore.matchScore?.totalRuns

  const newMatch = matches;
  newMatch.battingTeamName = currentBattingTeamName
  newMatch.matchScore.innings = 2;
  newMatch.target = totalRuns

  updateMatchTeam(newMatch as any);
};

const handleOversChange = (e) => {
      console.log(e)
  const value = parseFloat(e.target.value);
    const transformed = Math.ceil(value);
    console.log(transformed,value)
    handleChange({ target: { name: 'overs', value: transformed.toString()} });
  
};


  const { matchScore,battingTeamName } = editableScore;

  return (
    <div className="text-center mb-6 space-y-3">
      <div className='text-4xl font-extrabold text-gray-800'>
        Batting:
        <input
          type="text"
          name="battingTeamName"
          value={battingTeamName}
          onChange={handleChange}
          className="w-34 text-center bg-white border rounded px-2 py-1"
        />
      </div>
      <div className="text-4xl font-extrabold text-gray-800">
        <input
          type="number"
          name="totalRuns"
          value={matchScore?.totalRuns || 0}
          onChange={handleChange}
          className="w-34 text-center bg-white border rounded px-2 py-1"
        />
        <span className='px-2'>/</span>
        <input
          type="number"
          name="wickets"
          value={matchScore?.wickets || 0}
          onChange={handleChange}
          className="w-34 text-center bg-white border rounded px-2 py-1"
        />
      </div>
      <div className="text-4xl text-center justify-center font-semibold text-gray-600 flex items-center">
        <span>Overs:</span>
        <span className="ml-4 text-4xl text-gray-800">
          {matchScore?.overs?.toFixed(1) ?? "0.0"}
        </span>
      </div>



      {/* {matchScore?.currentPartnership !== undefined && (
        <div className="text-xl text-gray-500">
          Partnership:
          <input
            type="number"
            name="currentPartnership"
            value={matchScore?.currentPartnership || 0}
            onChange={handleChange}
            className="ml-2 w-20 text-center bg-white border rounded px-2 py-1"
          />
          runs
        </div>
      )} */}

    {isExist(editableScore?.target)    && (
      <div className="text-xl text-gray-700">
        Target:
        <input
          type="number"
          name="target"
          value={editableScore.target || 0}
          onChange={handleChange}
          className="ml-2 w-24 text-center bg-white border rounded px-2 py-1"
        />
      </div>
      )}

      {matchScore?.requiredRuns !== undefined && matchScore?.requiredBalls !== undefined && isExist(editableScore?.target)  && (
        <div className="text-lg text-gray-700">
          Need
          <input
            type="number"
            name="requiredRuns"
            value={matchScore?.requiredRuns || 0}
            onChange={handleChange}
            className="mx-2 w-20 text-center bg-white border rounded px-2 py-1"
          />
          runs from
          <input
            type="number"
            name="requiredBalls"
            value={matchScore?.requiredBalls || 0}
            onChange={handleChange}
            className="mx-2 w-20 text-center bg-white border rounded px-2 py-1"
          />
          balls
        </div>
      )}

      <div className="flex space-x-4 mt-6">
        <button
          onClick={() => updateMatchTeam(editableScore)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Update Score
        </button>
        <button
          onClick={() => toggleBattingTeam()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Change Iinning
        </button>
      </div>
    </div>
  );
};
