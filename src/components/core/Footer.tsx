// src/components/core/Footer.jsx
import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <Box sx={{ bgcolor: '#e0e0e0', p: 3, mt: 'auto' }}> {/* Light grey background, pushes to bottom */}
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          {'Copyright © '}
          <Link color="inherit" to="https://pravaltech.com/">
            Your Company Tournament
          </Link>{' '}
          {new Date().getFullYear()}
          {'.'}
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;