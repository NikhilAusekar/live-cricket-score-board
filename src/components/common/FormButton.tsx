// src/components/common/FormButton.tsx
import React from 'react';
import { Button,type ButtonProps, CircularProgress } from '@mui/material';

interface FormButtonProps extends ButtonProps {
  loading?: boolean;
  children: React.ReactNode;
}

const FormButton: React.FC<FormButtonProps> = ({
  loading = false,
  children,
  disabled,
  ...props
}) => {
  return (
    <Button
      variant="contained"
      color="primary"
      type="submit"
      fullWidth
      sx={{ mt: 3, mb: 2 }}
      disabled={disabled || loading} // Disable if explicitly disabled or loading
      {...props}
    >
      {loading ? <CircularProgress size={24} color="inherit" /> : children}
    </Button>
  );
};

export default FormButton;