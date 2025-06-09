import React, { useState, useEffect, useRef } from 'react';
import { useMatchStore } from '../../../store/UseMatchStore';
import type { Match } from '../../../types/match';
import matchService from '../../../services/matchService';
import LoadingSpinner from '../../core/LoadingSpinner';
import ErrorDisplay from '../../common/ErrorDisplay';
import { ScoreDisplay } from './ScoreDisplay';
import { CurrentBowlerUpdater } from './CurrentBowlerUpdater';
import { BallActionButtons } from './BallActionButtons';
import { CurrentBatsmenUpdater } from './CurrentBatsmenUpdater';
import { ballActionRuns } from '../../common/Constatns';

interface LiveScoreUpdaterProps {}

export const LiveScoreUpdater: React.FC<LiveScoreUpdaterProps> = () => {

  const { currentMatchScore, updateMatchScore } = useMatchStore();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [matchDetails, setMatchDetails] = useState<Match | null>(null);
  const previousMatchRef = useRef<Match | null>(null);


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

  const sendUpdatedMatchToServer=(matchData:any)=>{
    // write here logic to call the api
  }

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

const setTeamName =(value:string,team:string)=>{

  const updatedMatch = {
      ...currentMatchScore,
        [team]: value,
      }

    updateMatchScore(updatedMatch as any);
    sendUpdatedMatchToServer(updatedMatch as any);
}

const updateMatchTeam = (newMatch: any) => {
    updateMatchScore(newMatch as any);
    sendUpdatedMatchToServer(newMatch as any);
  };

const getBowlerOver = (overs: string) => {
  const runs = overs?.toString().split(".");
  const bowlerBalls = parseInt(runs[1] || "0", 10);

  // Convert bowler overs to total balls
  const bowlerTotalBalls =  bowlerBalls + 1;

  // Get current match overs (e.g., "5.2")
  const matchOversStr = currentMatchScore?.matchScore?.overs || "0.0";
  const matchRuns = matchOversStr?.toString().split(".");
  const matchOvers = parseInt(matchRuns[0] || "0", 10);
  const matchBalls = parseInt(matchRuns[1] || "0", 10);

  // Convert match overs to total balls
  const matchTotalBalls = matchOvers * 6 + matchBalls;

  // Add bowler balls to match balls
  const updatedTotalBalls = matchTotalBalls + bowlerTotalBalls;

  // Convert back to "X.Y" format
  const updatedOvers = Math.floor(updatedTotalBalls / 6);
  const updatedBalls = updatedTotalBalls % 6;

  const updatedOversStr = `${updatedOvers}.${updatedBalls}`;
  return updatedOversStr;
};


const updateMatchForBallAction = (
  actionType: string,
  runValue: number = 0
) => {
  if (!currentMatchScore) return;

   previousMatchRef.current = JSON.parse(JSON.stringify(currentMatchScore));

  const matchScore = { ...currentMatchScore.matchScore };
  const bowler = { ...matchScore.currentBowler };
  const batsmen = matchScore.currentBatsmen;
  const striker = batsmen?.find(b => b.isStriker);
  const nonStriker = batsmen?.find(b => b.isStriker == false);

  const isExtra = actionType === "wide" || actionType === "noball" || actionType === "runwicket";
  type BallActionType = keyof typeof ballActionRuns;
  const extraRuns =  ballActionRuns[actionType as BallActionType] || 0;
  console.log(extraRuns);
  const legalDelivery = !isExtra;

  // 1. Update overs
  if (legalDelivery) {
    const updatedOvers = getBowlerOver(bowler?.overs as any);
    console.log("updated overs", updatedOvers);
    matchScore.overs = parseInt(updatedOvers);
    bowler.overs = updatedOvers;
  }

  // 2. Update runs
  const totalRuns = matchScore.totalRuns != null  ? matchScore.totalRuns + (runValue || 0) + extraRuns : 0;
  matchScore.totalRuns = totalRuns;
  matchScore.requiredRuns = (matchScore.requiredRuns || 0) - (runValue || 0);

  // 3. Update required balls
  const currentOvers = matchScore.overs?.toString().split(".");
  const ballsBowled = (parseInt(currentOvers?.[0] || "0") || 0) * 6 + (parseInt(currentOvers?.[1] || "0") || 0);
  const totalBalls = currentMatchScore.oversPerInnings * 6;
  matchScore.requiredBalls = totalBalls - ballsBowled;

  // 4. Update batsman stats
  if (striker && legalDelivery) {
    striker.runs += runValue || 0;
    striker.balls += 1;
    striker.strikeRate = parseFloat(((striker.runs / striker.balls) * 100).toFixed(2));
    if (runValue === 4) striker.fours += 1;
    if (runValue === 6) striker.sixes += 1;

    // Rotate strike on odd runs
    if ((runValue || 0) % 2 === 1) {
      striker.isStriker = false;
     if(nonStriker) nonStriker.isStriker = true;
    }

    const matchTotalOvers = matchScore?.overs ? matchScore?.overs : 0 ;

    if(matchTotalOvers % 1 === 0 && String(matchTotalOvers).includes('.0')){
      striker.isStriker = !striker.isStriker;
      if(nonStriker) nonStriker.isStriker = !nonStriker.isStriker;
    }
  }

  // 5. Update current partnership
  if(matchScore.currentPartnership != null)  matchScore.currentPartnership += (runValue || 0) + extraRuns;

  // 6. Update wickets (if any)
  if (actionType === "wicket" || actionType ==="runwicket") {
    matchScore.wickets != null? matchScore.wickets += 1 : 0;
   
    // You could also push a new `fallOfWickets` entry here
  }

  // 7. Update extras
  if (isExtra && matchScore.extras != null) {
    matchScore.extras += extraRuns;
  }

  // 8. Final object construction
  const updatedMatch = {
    ...currentMatchScore,
    matchScore: {
      ...matchScore,
      currentBatsmen: [striker!, nonStriker!],
      currentBowler: bowler,
    },
  };

  updateMatchScore(updatedMatch as any);
  sendUpdatedMatchToServer(updatedMatch as any);
};


const onBallAction = (actionType: string, value?: number) => {
  console.log('Ball action:', actionType, value);

   if (actionType === "undo") {
    if (previousMatchRef.current) {
      updateMatchScore(previousMatchRef.current as any);
      sendUpdatedMatchToServer(previousMatchRef.current as any);
      console.log("Undo successful, restored previous state.");
    } else {
      console.log("No previous state to undo.");
    }
    return;
  }

  if (actionType === "runs") {
    updateMatchForBallAction("runs", value);
  } else if (actionType === "wide") {
    updateMatchForBallAction("wide");
  } else if (actionType === "noball") {
    updateMatchForBallAction("noball");
  } else if (actionType === "wicket") {
    updateMatchForBallAction("wicket");
  }else if (actionType === "runwicket") {
    updateMatchForBallAction("runwicket");
  } else if (actionType === "undo") {
    // Implement undo logic as needed
  }
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
      <h3 className="text-3xl font-bold mb-4 text-center">
      Live Score Update:{" "}
      <input
        value={currentMatchScore.team1Name}
        onChange={(e) => setTeamName(e.target.value,"team1Name")}
        className="bg-transparent border-b border-gray-300 focus:outline-none text-center w-32"
      />{" "}
      vs{" "}
      <input
        value={currentMatchScore.team2Name}
        onChange={(e) => setTeamName(e.target.value,"team2Name")}
        className="bg-transparent border-b border-gray-300 focus:outline-none text-center w-32"
      />
    </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Score Display Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Current Score</h2>
          <ScoreDisplay score={currentMatchScore as any} updateMatchTeam={updateMatchTeam} />
          <CurrentBowlerUpdater
            bowler={currentMatchScore.matchScore?.currentBowler as any}
            updateCurrentBowlwer={onUpdateBowler}
          />
        </div>

        {/* Action Buttons Section */}
        <div className='d-flex grid gap-6'>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Ball Actions</h2>
          <BallActionButtons onAction={onBallAction} />
        </div>

        {/* Batsmen Update Section */}
        <div className="bg-white p-6 rounded-lg shadow-md ">
          <h2 className="text-2xl font-semibold mb-4">Current Batsmen</h2>
          <CurrentBatsmenUpdater
            batmans={currentMatchScore?.matchScore?.currentBatsmen}
            onUpdateBatsman={onUpdateBatsmen}
            onReplaceBatsman={onUpdateBatsmen}
          />
        </div>
        </div>

      </div>
    </div>
  );
};
