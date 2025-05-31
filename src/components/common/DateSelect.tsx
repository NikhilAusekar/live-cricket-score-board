// src/components/common/DataSelect.tsx
import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { type UseFormRegister, type FieldValues } from 'react-hook-form';
import {type SelectOption } from "../../types/match"; // Import your SelectOption interface

interface DataSelectProps {
  name: string;
  label: string;
  options: SelectOption[];
  error?: boolean;
  helperText?: string;
  register?: UseFormRegister<FieldValues>; // For integration with React Hook Form
  value?: string; // For controlled component usage if not using RHF
  onChange?: (event: { target: { name: string; value: string } }) => void; // For controlled component usage
  fullWidth?: boolean;
  // Add other Select props as needed
}

const DataSelect: React.FC<DataSelectProps> = ({
  name,
  label,
  options,
  error = false,
  helperText = '',
  register,
  value,
  onChange,
  fullWidth = true,
  ...rest
}) => {
  const selectProps = register ? register(name) : { name, value, onChange };

  return (
    <FormControl fullWidth={fullWidth} margin="normal" error={error}>
      <InputLabel id={`${name}-label`}>{label}</InputLabel>
      <Select
        labelId={`${name}-label`}
        id={name}
        label={label}
        {...selectProps}
        {...rest}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default DataSelect;