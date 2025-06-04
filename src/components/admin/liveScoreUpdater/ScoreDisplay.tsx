import React, { useEffect, useState } from 'react';
import type { Match } from '../../../types/match';


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
      [key]: Number(value),
    }));
  }
};

const toggleBattingTeam = () => {
   const currentBattingTeamName =
    editableScore.team1Name === editableScore.battingTeamName
      ? editableScore.team2Name
      : editableScore.team1Name;

      console.log(currentBattingTeamName);

  const updateScore = {
    ...editableScore,
    battingTeamName: currentBattingTeamName,
  };

  console.log(currentBattingTeamName);
  updateMatchTeam(updateScore);

};

  const { matchScore } = editableScore;

  return (
    <div className="text-center mb-6 space-y-3">
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
      <div className="text-2xl font-semibold text-gray-600">
        Overs:
        <input
          type="number"
          name="overs"
          step="0.1"
          value={matchScore?.overs || 0}
          onChange={handleChange}
          className="ml-2 w-20 text-center bg-white border rounded px-2 py-1"
        />
      </div>

      {matchScore?.currentPartnership !== undefined && (
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
      )}

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

      {matchScore?.requiredRuns !== undefined && matchScore?.requiredBalls !== undefined && (
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
