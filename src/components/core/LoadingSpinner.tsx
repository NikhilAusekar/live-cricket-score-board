// src/components/core/LoadingSpinner.jsx
import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

function LoadingSpinner({ message = "Loading data..." }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px', // Or adjust as needed for context
        p: 2,
      }}
    >
      <CircularProgress sx={{ color: '#FFD700' }} /> {/* Golden color spinner */}
      <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
        {message}
      </Typography>
    </Box>
  );
}

export default LoadingSpinner;