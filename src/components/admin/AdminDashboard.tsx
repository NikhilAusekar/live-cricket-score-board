// src/components/admin/AdminDashboard.tsx
import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import AdminSidebar from './AdminSidebar';
import { Outlet } from 'react-router-dom'; // To render child routes

function AdminDashboard() {
  return (
    <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 66px)',padding:'0px' }} className="p-0"> {/* Adjust height for header/footer */}
      <AdminSidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" paragraph>
          Welcome to the tournament administration panel. Use the sidebar to manage matches, teams, and players.
        </Typography>
        <Grid container spacing={3}>
          {/* This is where nested routes will render, e.g., MatchList, TeamManagement */}
          <Outlet />
        </Grid>
      </Box>
    </Box>
  );
}

export default AdminDashboard;