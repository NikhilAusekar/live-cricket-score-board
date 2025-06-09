// src/router/Router.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/core/Layout';
import AdminDashboard from '../components/admin/AdminDashboard'; 
import ProtectedRoute from '../components/auth/ProtectedRoutes';
import Login from '../components/auth/Login';
import MatchSetupForm from '../components/admin/MatchSetupForm';
import TeamManagement from '../components/admin/teamManagement/TeamManagement';
import PlayerManagement from '../components/admin/playerManagement/PlayerManagement';
import { LiveScoreUpdater } from '../components/admin/liveScoreUpdater/LiveScoreUpdater';


function AppRouter() {
  return (
    <Routes>
      {/* Public Routes - Accessible to everyone */}
      <Route path="/" element={<Layout showFooter={true} showHeader={true} />}>
        {/*<Route path="/match/:matchId" element={<MatchScorecard />} /> 
        <Route path="/standings" element={<TournamentStandings />} />  */}
        <Route path="/login" element={<Login />} />  
      </Route>

      {/* Admin Protected Routes - Only accessible after login */}
      <Route path="/admin" element={<ProtectedRoute><Layout showHeader={true} showFooter={false} /></ProtectedRoute>}>
         <Route index element={<AdminDashboard />} />
        <Route path="/admin/matches" element={<MatchSetupForm />} /> 
        <Route path="/admin/teams" element={<TeamManagement />} />
        <Route path="/admin/players" element={<PlayerManagement />} />  
        <Route path="/admin/matches/score" element={<LiveScoreUpdater />} /> 
      </Route>

      <Route path="*" element={<div>404: Page Not Found</div>} />
    </Routes>
  );
}

export default AppRouter;