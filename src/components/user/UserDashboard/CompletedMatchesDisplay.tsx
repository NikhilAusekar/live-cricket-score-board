import React from 'react';
import { MatchCard } from './MatchCard';
import type { Match } from '../../../types/match';

interface CompletedMatchesDisplayProps {
  matches: Match[];
}

export const CompletedMatchesDisplay: React.FC<CompletedMatchesDisplayProps> = ({ matches }) => {
  if (matches?.length === 0) {
    return <p className="text-gray-600 text-lg">No completed matches available.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {matches?.map((match) => (
        // For completed matches, you'll need to fetch their final scores.
        // This could be part of the 'match' object itself or fetched on demand.
        // For this example, I'm assuming 'Match' object might include 'finalScore'
        // or you'd fetch it with another service call if needed.
        <MatchCard 
          key={match?.id} 
          match={match} 
          isLive={false} 
          // You might pass match.finalScore if available in Match type
          // score={match.finalScore} 
        />
      ))}
    </div>
  );
};