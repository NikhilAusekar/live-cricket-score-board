// src/components/admin/AdminSidebar.tsx
import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Divider, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';

interface SidebarItem {
  text: string;
  icon: React.ReactElement;
  path: string;
}

const sidebarItems: SidebarItem[] = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
  { text: 'Matches', icon: <SportsCricketIcon />, path: '/admin/matches' },
  { text: 'Teams', icon: <GroupIcon />, path: '/admin/teams' },
  { text: 'Players', icon: <PersonIcon />, path: '/admin/players' },
  {text: 'Live Score Updator', icon: <PersonIcon />, path: '/admin/matches/score'}
  // { text: 'Tournament Settings', icon: <SettingsIcon />, path: '/admin/settings' }, // Example
];

function AdminSidebar() {
  const location = useLocation();

  return (
    <Box
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
        },
        bgcolor: 'background.paper',
        borderRight: 1,
        borderColor: 'divider',
        p: 2,
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, mt: 1, textAlign: 'center' }}>
        Admin Panel
      </Typography>
      <Divider />
      <List>
        {sidebarItems.map((item) => (
            // getting error in ListItem
          <ListItem key={item.text} disablePadding>
            <ListItemButton
                component={Link}
                to={item.path}
                selected={
                location.pathname === item.path ||
                (location.pathname === '/admin' && item.path === '/admin')
                }
            >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
            </ListItemButton>
            </ListItem>
        ))}
      </List>
      <Divider sx={{ mt: 'auto' }} />
      {/* You can add more admin links here */}
    </Box>
  );
}

export default AdminSidebar;