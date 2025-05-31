// src/App.tsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './router/Router';
import { AuthProvider } from './contexts/AuthContext';
import { SignalRProvider } from './contexts/SignalRContext';

function App(){
  return (
    <Router>
      <AuthProvider>
        <SignalRProvider>
          <AppRouter />
        </SignalRProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
