import React, { useState, useEffect } from 'react';
import type { Batsman } from '../../../types/palyer';

interface CurrentBatsmenUpdaterProps {
  batmans?: Batsman[];
  onUpdateBatsman: (batsman:Batsman[]) => void;
  onReplaceBatsman: (outBatsmanId: string, newBatsmanName: string) => void;
}

export const CurrentBatsmenUpdater: React.FC<CurrentBatsmenUpdaterProps> = ({
  batmans = [],
  onUpdateBatsman,
  onReplaceBatsman,
}) => {
  const [editableBatsmen, setEditableBatsmen] = useState<Batsman[]>([]);
  const [outBatsmanId, setOutBatsmanId] = useState<string | null>(null);
  const [newBatsmanName, setNewBatsmanName] = useState('');

  useEffect(() => {
    setEditableBatsmen([...batmans]);
  }, [batmans]);

  const handleChange = (id: string, field: keyof Batsman, value: string) => {
    const updated = editableBatsmen.map((batsman) =>
      batsman.id === id
        ? { ...batsman, [field]: field === 'runs' || field === 'balls' ? Number(value) : value }
        : batsman
    );
    setEditableBatsmen(updated);
  };

  const applyEdits = () => {

      onUpdateBatsman(editableBatsmen);
      console.log(editableBatsmen);

  };

  const toggleStrike = () => {
    const updated = editableBatsmen.map((batsman) => ({
      ...batsman,
      isStriker: !batsman.isStriker,
    }));
    setEditableBatsmen(updated);

    onUpdateBatsman(updated);
  };

  const handleReplaceBatsman = () => {
    if (outBatsmanId && newBatsmanName.trim()) {
      onReplaceBatsman(outBatsmanId, newBatsmanName.trim());
      setNewBatsmanName('');
      setOutBatsmanId(null);
    }
  };

  if (!batmans || batmans.length === 0) {
    return <p className="text-gray-600">No batsmen currently at the crease.</p>;
  }

  return (
    <div className="space-y-4">
      {editableBatsmen.map((batsman) => (
        <div key={batsman.id} className="flex items-center justify-between p-3 border rounded-md">
          <div>
            <span className="font-semibold text-lg">{batsman.name}</span>
            <span className="ml-2 text-sm text-gray-500">
              {batsman.isStriker ? '(Striker)' : '(Non-Striker)'}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="number"
              value={batsman.runs}
              onChange={(e) => handleChange(batsman.id, 'runs', e.target.value)}
              className="w-16 text-center border rounded px-2 py-1"
            />
            <span className="text-gray-600">/</span>
            <input
              type="number"
              value={batsman.balls}
              onChange={(e) => handleChange(batsman.id, 'balls', e.target.value)}
              className="w-16 text-center border rounded px-2 py-1"
            />
            <button
              onClick={() => setOutBatsmanId(batsman.id)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Replace
            </button>
          </div>
        </div>
      ))}

      {outBatsmanId && (
        <div className="mt-4 space-y-2">
          <input
            type="text"
            value={newBatsmanName}
            onChange={(e) => setNewBatsmanName(e.target.value)}
            placeholder="Enter new batsman name"
            className="w-full px-3 py-2 border rounded-md"
          />
          <button
            onClick={handleReplaceBatsman}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Confirm Replacement
          </button>
        </div>
      )}

      <div className="flex space-x-4 mt-6">
        <button
          onClick={toggleStrike}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Toggle Strike
        </button>
        <button
          onClick={applyEdits}
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};
