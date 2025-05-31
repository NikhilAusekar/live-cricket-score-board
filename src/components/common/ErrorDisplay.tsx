// src/components/core/ErrorDisplay.jsx
import React from 'react';
import { Alert, AlertTitle, Box, Button, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface IErrorDisplayProps{
    title:string;
    message:string;
    onRetry:()=>void;
}

const ErrorDisplay : React.FC<IErrorDisplayProps> = ({ title = "An error occurred", message = "Something went wrong. Please try again later.", onRetry })=> {
  return (
    <Box sx={{ p: 2 }}>
      <Alert severity="error" icon={<ErrorOutlineIcon fontSize="inherit" />}>
        <AlertTitle>{title}</AlertTitle>
        <Typography variant="body2">{message}</Typography>
        {onRetry && (
          <Button
            variant="outlined"
            color="error"
            onClick={onRetry}
            sx={{ mt: 1 }}
          >
            Retry
          </Button>
        )}
      </Alert>
    </Box>
  );
}

export default ErrorDisplay;