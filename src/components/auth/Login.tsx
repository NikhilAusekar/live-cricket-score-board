// src/components/auth/Login.tsx
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Avatar, Box, Typography, Container, Alert } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import FormInput from '../common/FormInput';
import FormButton from '../common/FormButton';
import { useAuth } from '../../contexts/AuthContext';
import  { useNavigate } from 'react-router';


const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

function Login() {
  const [loginError, setLoginError] = useState('');
  const {login} = useAuth();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const adminUsers = [
    { username: 'nikhil.a@pravaltech.com', password: 'nikhil.a73@7378' }
  ];

  const onSubmit = (data: LoginFormInputs) => {

      navigate('/admin');// not going to route
      console.log("Navigate")

    const userFound = adminUsers.find(
      (item) => item.username === data.username && item.password === data.password
    );

    if (userFound) {
      setLoginError('');
      login(userFound.username,userFound.password);
  

      console.log('Login successful', userFound);
    } else {
      setLoginError('Invalid username or password');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'white',
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Admin Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
          <Controller
              name="username"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <FormInput
                  label="Username"
                  error={!!errors.username}
                  helperText={errors.username?.message}
                  {...field}
                />
              )}
            />

              <Controller
                name="password"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <FormInput
                    label="Password"
                    type="password"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    {...field}
                  />
                )}
              />

          {loginError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {loginError}
            </Alert>
          )}
          <FormButton>
            Sign In
          </FormButton>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;
