import React, { useEffect, useState } from 'react';
import type { Bowler } from '../../../types/match';

interface BowlerInfoProps {
  bowler: Bowler;
  updateCurrentBowlwer: (newBowler: Bowler) => void;
}

export const CurrentBowlerUpdater: React.FC<BowlerInfoProps> = ({
  bowler,
  updateCurrentBowlwer,
}) => {
  const [updatedBowler, setUpdatedBowler] = useState<Bowler>({ ...bowler });

  useEffect(() => {
    setUpdatedBowler({ ...bowler });
  }, [bowler]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedBowler((prev) => ({
      ...prev,
      [name]: name === 'runs' || name === 'wickets' || name === 'overs' ? Number(value) : value,
    }));
  };

  if (!bowler) {
    return <p className="text-gray-600">No bowler currently active.</p>;
  }

  return (
    <div className="border-t pt-4 mt-6">
      <h3 className="text-xl font-semibold mb-3">Current Bowler:</h3>
      <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
        <input
          type="text"
          name="name"
          value={updatedBowler.name}
          onChange={handleChange}
          className="font-medium text-lg bg-white border px-2 py-1 rounded"
        />
        <div className="text-right space-y-1">
          <div className="text-xl font-bold flex items-center gap-2">
            <input
              type="number"
              name="runs"
              value={updatedBowler.runs}
              onChange={handleChange}
              className="w-16 bg-white border px-1 py-0.5 rounded text-right"
            />
            /
            <input
              type="number"
              name="wickets"
              value={updatedBowler.wickets}
              onChange={handleChange}
              className="w-12 bg-white border px-1 py-0.5 rounded text-right"
            />
          </div>
          <div className="text-sm text-gray-600">
            (
            <input
              type="number"
              name="overs"
              value={updatedBowler.overs}
              onChange={handleChange}
              className="w-12 bg-white border px-1 py-0.5 rounded text-right"
              step="0.1"
            />
            {' '}Overs)
          </div>
        </div>
      </div>
      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => updateCurrentBowlwer(updatedBowler)}
      >
        Update Bowler
      </button>
    </div>
  );
};
