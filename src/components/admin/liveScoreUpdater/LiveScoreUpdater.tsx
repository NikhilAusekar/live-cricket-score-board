import React, { useState, useEffect } from 'react';
import { useSignalR } from '../../../contexts/SignalRContext';
import { useMatchStore } from '../../../store/UseMatchStore';
import type { Match } from '../../../types/match';
import matchService from '../../../services/matchService';
import LoadingSpinner from '../../core/LoadingSpinner';
import ErrorDisplay from '../../common/ErrorDisplay';
import { ScoreDisplay } from './ScoreDisplay';
import { CurrentBowlerUpdater } from './CurrentBowlerUpdater';
import { BallActionButtons } from './BallActionButtons';
import { CurrentBatsmenUpdater } from './CurrentBatsmenUpdater';

interface LiveScoreUpdaterProps {}

export const LiveScoreUpdater: React.FC<LiveScoreUpdaterProps> = () => {
  const { connection } = useSignalR();
  const { currentMatchScore, updateMatchScore } = useMatchStore();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [matchDetails, setMatchDetails] = useState<Match | null>(null);

  useEffect(() => {
    const fetchInitialMatchData = async () => {
      try {
        setLoading(true);
        const match = await matchService.getMatches();
        setMatchDetails(match);
        updateMatchScore(match); // Initialize Zustand state with fetched match
        setError(null);
      } catch (err) {
        console.error('Failed to fetch initial match data:', err);
        setError('Failed to load match data.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialMatchData();
  }, [updateMatchScore]);

useEffect(() => {
  if (!connection) return;

  const messageHandler = (updatedMatch: Match) => {
    console.log('Received message:', updatedMatch);
    updateMatchScore(updatedMatch);
  };

  connection.on('ReceiveMessage', messageHandler);

  return () => {
    connection.off('ReceiveMessage', messageHandler);
  };
}, [connection, updateMatchScore]);

const sendUpdatedMatchToServer = async (updatedMatch: Match) => {
  if (!connection || connection.state !== 'Connected') {
    setError('SignalR connection is not established.');
    return;
  }
  try {
    await connection.invoke('SendMessage', updatedMatch);  // use SendMessage here
    console.log('Sent updated match to server:', updatedMatch);
  } catch (err) {
    console.error('Failed to send updated match:', err);
    setError('Failed to send updates to server.');
  }
};

  // Callbacks passed down to children to update partial data
  const onUpdateBowler = (newBowler: any) => {
    if (!currentMatchScore) return;
    const updatedMatch = {
      ...currentMatchScore,
      matchScore: {
        ...currentMatchScore.matchScore,
        currentBowler: newBowler,
      },
    };
    updateMatchScore(updatedMatch as any);
    sendUpdatedMatchToServer(updatedMatch as any);
  };

  const onUpdateBatsmen = (newBatsmen: any) => {
    if (!currentMatchScore) return;
    const updatedMatch = {
      ...currentMatchScore,
      matchScore: {
        ...currentMatchScore.matchScore,
        currentBatsmen: newBatsmen,
      },
    };
    updateMatchScore(updatedMatch as any);
    sendUpdatedMatchToServer(updatedMatch as any);
  };

  const onBallAction = (actionType: string, value?: number) => {
    if (!currentMatchScore) return;

    // You may want to update the matchScore locally here depending on action
    // For now, let's assume your matchScore has a method to update based on action
    // Or you process the action and generate a new match object

    // Placeholder: Just log for now
    console.log('Ball action:', actionType, value);

    // Ideally, update the match object accordingly here, e.g.
    // const updatedMatch = applyBallAction(currentMatchScore, actionType, value);
    // updateMatchScore(updatedMatch);
    // sendUpdatedMatchToServer(updatedMatch);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorDisplay
        message={error}
        title={''}
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!currentMatchScore || !matchDetails) {
    return (
      <ErrorDisplay
        message="No live match data available. Please set up a match."
        title={''}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Live Score Update: {matchDetails.team1Name} vs {matchDetails.team2Name}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Score Display Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Current Score</h2>
          <ScoreDisplay score={currentMatchScore as any} onUpdateScore={() => {}} />
          <CurrentBowlerUpdater
            bowler={currentMatchScore.matchScore?.currentBowler as any}
            updateCurrentBowlwer={onUpdateBowler}
          />
        </div>

        {/* Action Buttons Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Ball Actions</h2>
          <BallActionButtons onAction={onBallAction} />
        </div>

        {/* Batsmen Update Section */}
        <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Current Batsmen</h2>
          <CurrentBatsmenUpdater
            matchScore={currentMatchScore?.matchScore?.currentBatsmen}
            onUpdateBatsman={onUpdateBatsmen}
            onReplaceBatsman={onUpdateBatsmen}
          />
        </div>
      </div>
    </div>
  );
};
