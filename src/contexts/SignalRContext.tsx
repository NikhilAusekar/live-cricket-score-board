// src/contexts/SignalRContext.tsx
import React, { useState, useEffect, createContext, useContext, type ReactNode } from 'react';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { useMatchStore } from '../store/UseMatchStore';

// Define the context shape
interface SignalRContextType {
  connection: HubConnection | null;
  isConnected: boolean;
}

// Create the context with a default value of null
const SignalRContext = createContext<SignalRContextType | null>(null);

// Props for the provider
interface SignalRProviderProps {
  children: ReactNode;
}

export const SignalRProvider: React.FC<SignalRProviderProps> = ({ children }) => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const updateLiveScore = useMatchStore((state: any) => state.updateLiveScore);
  const addCommentary = useMatchStore((state: any) => state.addCommentary);

  useEffect(() => {
    const hubUrl = "https://smeconnectsignalr-cwb4a8ergjefbjfk.canadacentral-01.azurewebsites.net/scorehub"; //"https://localhost:5234/scorehub";

    if (!hubUrl) {
      console.error("SignalR Hub URL is not provided.");
      return;
    }

    const newConnection = new HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: retryContext => {
          if (retryContext.elapsedMilliseconds < 60000) {
            return Math.random() * 10000;
          }
          return null;
        }
      })
      .configureLogging(LogLevel.Information)
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (!connection) return;

    const startConnection = async () => {
      try {
        await connection.start();
        console.log('SignalR Connected!');
        setIsConnected(true);

        connection.on('ReceiveLiveScoreUpdate', (scoreData: any) => {
          console.log('Received live score update:', scoreData);
          updateLiveScore(scoreData);
        });

        connection.on('ReceiveBallUpdate', (ballData: any) => {
          console.log('Received ball update:', ballData);
          addCommentary(ballData);
          updateLiveScore({
            lastSixBalls: ballData.lastSixBalls,
            currentStriker: ballData.currentStriker,
            currentBowler: ballData.currentBowler,
          });
        });

        connection.onclose(error => {
          console.warn('SignalR Connection Closed:', error);
          setIsConnected(false);
        });

        connection.onreconnecting(() => {
          console.log('SignalR Reconnecting...');
          setIsConnected(false);
        });

        connection.onreconnected(connectionId => {
          console.log('SignalR Reconnected with ID:', connectionId);
          setIsConnected(true);
        });

      } catch (error) {
        console.error('SignalR Connection Failed:', error);
        setIsConnected(false);
        setTimeout(startConnection, 5000);
      }
    };

    startConnection();

    return () => {
      if (connection.state !== 'Disconnected') {
        connection.stop();
        console.log('SignalR Connection Stopped.');
      }
    };
  }, [connection, updateLiveScore, addCommentary]);

  return (
    <SignalRContext.Provider value={{ connection, isConnected }}>
      {children}
    </SignalRContext.Provider>
  );
};

export const useSignalR = (): SignalRContextType => {
  const context = useContext(SignalRContext);
  if (!context) {
    throw new Error('useSignalR must be used within a SignalRProvider');
  }
  return context;
};
