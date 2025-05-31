// src/components/core/Header.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import { useAuth } from '../../contexts/AuthContext'; // Import your AuthContext

function Header() {
  const { user, logout } = useAuth(); // Get user info and logout function from AuthContext
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#212121',boxShadow:'none' }}> {/* Darker header */}
      <Toolbar>
        <SportsCricketIcon sx={{ mr: 1, color: '#FFD700' }} /> {/* Cricket icon */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Company Cricket Live
          </Link>
        </Typography>
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}> {/* Hide on small screens */}
          <Button color="inherit" component={Link} to="/live">Live Scores</Button>
          <Button color="inherit" component={Link} to="/standings">Standings</Button>
          {user ? (
            <>
              <Button color="inherit" component={Link} to="/admin">Admin Dashboard</Button>
              <Button color="inherit" onClick={handleLogout}>Logout ({user.username})</Button>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/login">Login</Button>
          )}
        </Box>
        {/* TODO: Add a responsive menu for small screens (Hamburger icon) */}
      </Toolbar>
    </AppBar>
  );
}

export default Header;