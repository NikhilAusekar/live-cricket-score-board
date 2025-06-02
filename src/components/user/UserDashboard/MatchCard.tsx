import React from 'react';
import type { Match } from '../../../types/match';

interface MatchCardProps {
  match: Match;
  isLive?: boolean;
  isUpcoming?: boolean;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, isLive, isUpcoming }) => {

  const batsManOnStrike = match.matchScore?.currentBatsmen.filter((batsman)=> batsman.isStriker === true)[0]
  const batsManNonStrike = match.matchScore?.currentBatsmen.filter((batsman)=> batsman.isStriker === false)[0]

  return (
    <div className={`bg-white rounded-xl shadow-md p-6 border-l-8 
      ${isLive ? 'border-red-600' : isUpcoming ? 'border-blue-500' : 'border-gray-300'}
      hover:shadow-lg transition-shadow duration-300
    `}>
      <h3 className="text-2xl font-bold text-gray-800 mb-2">
        {match.team1Name} vs {match.team2Name}
      </h3>

      <p className="text-gray-600 mb-1">
        <span className="font-semibold">Venue:</span> {match.venue}
      </p>
      <p className="text-gray-600 mb-3">
        <span className="font-semibold">Date:</span> {new Date(match.date).toLocaleDateString()}
      </p>

      {isLive && match && (
        <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
          <div className="flex justify-between items-center mb-2">
            <div className="text-3xl font-bold text-gray-800">
              {match.matchScore?.totalRuns}/{match.matchScore?.wickets}
            </div>
            <div className="text-sm text-gray-500">
              Overs: {match?.matchScore?.overs }
            </div>
          </div>

          {match.target && (
            <p className="text-sm text-gray-600">Target: {match.target}</p>
          )}
          {match.matchScore?.requiredRuns &&  match.matchScore?.requiredRuns > 0 && match.matchScore?.requiredBalls > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              Need <span className="font-semibold">{match.matchScore?.requiredRuns}</span> runs from{' '}
              <span className="font-semibold">{match.matchScore?.requiredBalls}</span> balls
            </p>
          )}

          <div className="mt-4">
            <h4 className="text-md font-semibold text-gray-700 mb-1">Batting</h4>
            <div className="text-sm text-gray-800">
              <span className="font-semibold">{batsManOnStrike && batsManOnStrike.name}</span>*
              &nbsp;({batsManOnStrike && batsManOnStrike.runs} runs, {batsManOnStrike && batsManOnStrike.balls} balls)
            </div>
            <div className="text-sm text-gray-800">
              <span>{batsManNonStrike && batsManNonStrike.name}</span>
              &nbsp;({batsManNonStrike && batsManNonStrike.runs} runs, {batsManNonStrike && batsManNonStrike.balls} balls)
            </div>
          </div>

          <div className="mt-3">
            <h4 className="text-md font-semibold text-gray-700 mb-1">Bowling</h4>
            <p className="text-sm text-gray-800">
              {match.matchScore?.currentBowler.name} - {match.matchScore?.currentBowler.overs} overs,
              {match.matchScore?.currentBowler.runs} runs, {match.matchScore?.currentBowler.wickets} wickets
            </p>
          </div>

          {/* {match.lastSixBalls.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-600 mb-1">Last 6 Balls</h4>
              <div className="flex gap-1 flex-wrap">
                {match.lastSixBalls.map((ball, idx) => (
                  <span
                    key={idx}
                    className={`px-2 py-1 rounded text-xs font-medium
                      ${ball.type === 'four' ? 'bg-green-200 text-green-800' :
                        ball.type === 'six' ? 'bg-yellow-200 text-yellow-800' :
                        ball.type === 'wicket' ? 'bg-red-200 text-red-700' :
                        'bg-gray-200 text-gray-700'}
                    `}
                  >
                    {ball.runs}
                  </span>
                ))}
              </div>
            </div>
          )} */}

          {match?.matchScore?.commentary.length && match?.matchScore?.commentary.length> 0 && (
            <div className="mt-3 text-sm text-gray-600 italic">
              <p>🗣 {match?.matchScore?.commentary[match?.matchScore?.commentary.length - 1].text}</p>
            </div>
          )}

          <div className="mt-3">
            <span className="inline-block bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
              LIVE
            </span>
          </div>
        </div>
      )}

      {!isLive && !isUpcoming && match.status === 'Completed' && (
        <div className="mt-4 border-t pt-4">
          <h4 className="text-md font-semibold text-gray-800">Match Completed</h4>
          <p className="text-sm text-gray-600">{match.resultDetails || 'Result not available'}</p>
        </div>
      )}

      {isUpcoming && (
        <div className="mt-4 border-t pt-4">
          <p className="text-md text-gray-700 font-semibold">Match will start soon!</p>
          <p className="text-gray-500 text-sm mt-1">
            Starts on {new Date(match.date).toLocaleDateString()} at{' '}
            {new Date(match.date).toLocaleTimeString()}
          </p>
        </div>
      )}

      <div className="mt-6 text-right">
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200">
          View Details
        </button>
      </div>
    </div>
  );
};
