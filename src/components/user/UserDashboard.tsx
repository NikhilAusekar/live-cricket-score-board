import React, { useState, useEffect } from 'react';
import matchService from '../../services/matchService';
import type { Match } from '../../types/match';
import LoadingSpinner from '../core/LoadingSpinner';
import ErrorDisplay from '../common/ErrorDisplay';
import { LiveMatchesDisplay } from './UserDashboard/LiveMatchesDisplay';
import { CompletedMatchesDisplay } from './UserDashboard/CompletedMatchesDisplay';
import { UpcomingMatchesDisplay } from './UserDashboard/UpcomingMatchesDisplay';
// import { CompletedMatchesDisplay } from './UserDashboard/CompletedMatchesDisplay';
// import { UpcomingMatchesDisplay } from './UserDashboard/UpcomingMatchesDisplay';


interface UserDashboardProps {}

export const UserDashboard: React.FC<UserDashboardProps> = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [liveMatches, setLiveMatches] = useState<Match>();
  // const [completedMatches, setCompletedMatches] = useState<Match>([]);
  // const [upcomingMatches, setUpcomingMatches] = useState<Match>([]);

  useEffect(() => {
    const fetchAllMatches = async () => {
      try {
        setLoading(true);
        // Assuming your matchService can filter or retrieve matches by status
        const allMatches = await matchService.getMatches(); // Or a specific endpoint for user view
        
        setLiveMatches(allMatches);

        // setCompletedMatches(allMatches.filter(match => match.status === 'Completed'));
        // setUpcomingMatches(allMatches.filter(match => match.status === 'Upcoming'));
        
        setError(null);
      } catch (err) {
        console.error("Failed to fetch matches for user dashboard:", err);
        setError("Failed to load match data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllMatches();

    // Optionally, set up a polling or SignalR listener for live matches if needed
    // For now, LiveMatchesDisplay will rely on useMatchStore which might get updates from SignalR
    // if the public score updates are also broadcast.
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay message={error} title={''} onRetry={function (): void {
        throw new Error('Function not implemented.');
    } } />;
  }

  return (
    <div className="container mx-auto p-4">
      {/* <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Cricket Scoreboards</h1> */}

      {/* Live Matches Section */}
      <section className="mb-10">
        <h2 className="text-3xl font-semibold mb-6 text-blue-700 border-b-2 pb-2">Live Matches</h2>
        <LiveMatchesDisplay initialLiveMatches={liveMatches as Match} />
      </section>


      {/* <section className="mb-10">
        <h2 className="text-3xl font-semibold mb-6 text-green-700 border-b-2 pb-2">Completed Matches</h2>
        <CompletedMatchesDisplay matches={null} />
      </section>

      <section className="mb-10">
        <h2 className="text-3xl font-semibold mb-6 text-purple-700 border-b-2 pb-2">Upcoming Matches</h2>
        <UpcomingMatchesDisplay matches={null} />
      </section> */}
    </div>
  );
};