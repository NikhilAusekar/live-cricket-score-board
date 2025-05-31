import React from 'react';
import { MatchCard } from './MatchCard';
import type { Match } from '../../../types/match';


interface UpcomingMatchesDisplayProps {
  matches: Match[];
}

export const UpcomingMatchesDisplay: React.FC<UpcomingMatchesDisplayProps> = ({ matches }) => {
  if (matches.length === 0) {
    return <p className="text-gray-600 text-lg">No upcoming matches scheduled.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {matches.map((match) => (
        <MatchCard 
          key={match.id} 
          match={match} 
          isLive={false} 
          isUpcoming={true} 
        />
      ))}
    </div>
  );
};