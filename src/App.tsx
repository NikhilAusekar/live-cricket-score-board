// src/App.tsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './router/Router';
import { AuthProvider } from './contexts/AuthContext';

function App(){
  return (
    <Router>
      <AuthProvider>
          <AppRouter />
      </AuthProvider>
    </Router>
  );
}

export default App;
