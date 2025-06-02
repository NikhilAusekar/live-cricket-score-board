import React, { useEffect } from 'react';
import { MatchCard } from './MatchCard';
import { type Match } from '../../../types/match';
import { useMatchStore } from '../../../store/UseMatchStore';
import { useSignalR } from '../../../contexts/SignalRContext';
import { matches } from '../../../types/common';

interface LiveMatchesDisplayProps {
  initialLiveMatches: Match; // Matches initially fetched (e.g., from an API call)
}

export const LiveMatchesDisplay: React.FC<LiveMatchesDisplayProps> = ({ initialLiveMatches }) => {
  const { connection } = useSignalR();
  const { liveMatchScore, setLiveMatchScore, updateLiveMatchScore } = useMatchStore();

  // Initialize live match scores from the prop, but keep them in sync via SignalR
  useEffect(() => {
    // When initial live matches are fetched, set their placeholder scores or initial scores
    // if the Match object itself contains initial score data.
    // Otherwise, rely purely on SignalR for the initial scores.
    
    setLiveMatchScore(matches);
    console.log(liveMatchScore);
  }, [initialLiveMatches, setLiveMatchScore]);


  useEffect(() => {
    if (connection) {
      const handleReceiveScoreUpdate = (updatedScore: Match) => {
        console.log("User Dashboard: Received live score update via SignalR:", updatedScore);
        updateLiveMatchScore(updatedScore); // Update the specific match's score in the store
      };

      connection.on("ReceiveMessage", handleReceiveScoreUpdate);

      // Join a generic group for all public score updates, or iterate through initialLiveMatches
      // to join specific match groups if your SignalR hub is designed that way.
      // For simplicity, let's assume "ReceiveMessage" broadcasts to all connected users.
      // If you have specific "match groups" (e.g., "MatchUpdateGroup_matchId"), you'd invoke:
      // initialLiveMatches.forEach(match => connection.invoke("JoinMatchUpdateGroup", match.id));

      return () => {
        connection.off("ReceiveMessage", handleReceiveScoreUpdate);
        // initialLiveMatches.forEach(match => connection.invoke("LeaveMatchUpdateGroup", match.id));
      };
    }
  }, [connection, updateLiveMatchScore, liveMatchScore]); // Re-run if connection or initial matches change

  if (!liveMatchScore ) {
    return <p className="text-gray-600 text-lg">No live matches currently.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MatchCard
            match={liveMatchScore}
            isLive={true}
          />
    </div>
  );
};