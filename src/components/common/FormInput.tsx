import React, { type ReactNode } from 'react';
import { TextField, type TextFieldProps } from '@mui/material';

const FormInput: React.FC<TextFieldProps> = (props) => {
  return <TextField fullWidth margin="normal" {...props} />;
};

export default FormInput;
