// src/components/core/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { Box, Container, CssBaseline } from '@mui/material'; // Using MUI components for basic layout

function Layout({ showHeader = true, showFooter = true }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />

      {showHeader && (
        <Box sx={{ position: 'fixed', top: 0, width: '100%', zIndex: (theme) => theme.zIndex.appBar }}>
          <Header />
        </Box>
      )}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: '#f0f2f5',
          paddingTop: '64px', // Adjust based on Header height
        }}
      >
        <Outlet />
      </Box>

      {showFooter && <Footer />}
    </Box>

  );
}

export default Layout;